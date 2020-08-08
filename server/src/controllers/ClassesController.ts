import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

const ClassesController = {
  create: async (req: Request, res: Response) => {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

    const trx = await db.transaction();

    try {
      const insertedUserIds = await trx('users').insert({ name, avatar, whatsapp, bio });
      const user_id = insertedUserIds[0];

      const insertedClassesIds = await trx('classes').insert({ subject, cost, user_id });
      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx('class_schedule').insert(classSchedule);

      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Unexpected error while creating new class.',
      });
    }
  },

  index: async (req: Request, res: Response) => {
    const filters = req.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    const timeInMinutes = time.length ? convertHourToMinutes(time) : 0;

    const query = db('classes as c')
      .whereExists(query =>
        query
          .select('*')
          .from('class_schedule as cs')
          .whereRaw('"cs"."class_id" = "c"."id"')
          .modify(query => {
            if (week_day.length) query.whereRaw('week_day = ?', week_day);
            if (time.length) query.whereRaw('"from" <= ?', timeInMinutes).whereRaw('"to" > ?', timeInMinutes);
          })
      )
      .select(['c.*', 'u.*'])
      .join('users as u', { 'c.user_id': 'u.id' });
    if (subject.length) query.where({ subject });
    const classes = await query;

    return res.json(classes);
  },
};

export default ClassesController;

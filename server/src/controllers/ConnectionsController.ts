import { Request, Response } from 'express';

import db from '../database/connection';

const ConnectionsController = {
  create: async (req: Request, res: Response) => {
    const { user_id } = req.body;

    await db('connections').insert({ user_id });

    return res.status(201).send();
  },

  index: async (req: Request, res: Response) =>
    db('connections')
      .count('* as total')
      .then(([row]) => res.json(row)),
};

export default ConnectionsController;

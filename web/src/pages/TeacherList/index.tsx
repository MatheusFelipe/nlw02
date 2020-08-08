import React, { useState } from 'react';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select';

import { subjects, weekDays } from '../../constants/select-options';

import api from '../../services/api';

import './styles.css';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  const searchTeachers = (e: React.FormEvent) => {
    e.preventDefault();
    api.get('classes', { params: { subject, week_day, time } }).then(resp => setTeachers(resp.data));
  };

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis.">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select
            label="Matéria"
            name="subject"
            options={subjects}
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
          <Select
            label="Dia da semana"
            name="week_day"
            options={weekDays}
            value={week_day}
            onChange={e => setWeekDay(e.target.value)}
          />
          <Input label="Hora" name="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
          <button type="submit">Buscar</button>
        </form>
      </PageHeader>
      <main>
        {teachers.map((teacherItem: Teacher) => (
          <TeacherItem key={teacherItem.id} teacher={teacherItem} />
        ))}
      </main>
    </div>
  );
};

export default TeacherList;

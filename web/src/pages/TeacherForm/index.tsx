import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

import { subjects, weekDays } from '../../constants/select-options';

import api from '../../services/api';

import warning from '../../assets/images/icons/warning.svg';
import './styles.css';

const TeacherForm = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');
  const [scheduleItems, setScheduleItems] = useState([{ week_day: 0, from: '', to: '' }]);

  const history = useHistory();

  const addNewScheduleItem = () => {
    setScheduleItems([...scheduleItems, { week_day: 0, from: '', to: '' }]);
  };

  const setScheduleItemValue = (idx: number, field: string, value: string) => {
    setScheduleItems(
      scheduleItems.map((scheduleItem, i) => (idx === i ? { ...scheduleItem, [field]: value } : scheduleItem))
    );
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post('classes', {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost: Number(cost),
        schedule: scheduleItems.map(({ week_day, from, to }) => ({ week_day: Number(week_day), from, to })),
      })
      .then(() => {
        alert('Cadastro realizado com sucesso');
        history.push('/');
      })
      .catch(() => {
        alert('Erro ao realizar cadastro');
      });
  };

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title="Que incrível que você quer dar aulas."
        description="O primeiro passo é preencher esse formulário de inscrição"
      />
      <main>
        <form onSubmit={handleCreateClass}>
          <fieldset>
            <legend>Seus dados</legend>
            <Input label="Nome completo" name="name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Avatar" name="avatar" value={avatar} onChange={e => setAvatar(e.target.value)} />
            <Input label="WhatsApp" name="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            <Textarea label="Biografia" name="bio" value={bio} onChange={e => setBio(e.target.value)} />
          </fieldset>
          <fieldset>
            <legend>Sobre a aula</legend>
            <Select
              label="Matéria"
              name="subject"
              options={subjects}
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <Input
              label="Custo da sua hora por aula"
              name="cost"
              value={cost}
              onChange={e => setCost(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>
              Horários disponíveis
              <button type="button" onClick={addNewScheduleItem}>
                + Novo horário
              </button>
            </legend>
            {scheduleItems.map((scheduleItem, index) => (
              <div key={scheduleItem.week_day} className="schedule-item">
                <Select
                  label="Dia da semana"
                  name="week_day"
                  options={weekDays}
                  value={scheduleItem.week_day}
                  onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                />
                <Input
                  label="Das"
                  name="from"
                  type="time"
                  value={scheduleItem.from}
                  onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                />
                <Input
                  label="Até"
                  name="to"
                  type="time"
                  value={scheduleItem.to}
                  onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                />
              </div>
            ))}
          </fieldset>
          <footer>
            <p>
              <img src={warning} alt="Aviso importante" />
              Importante! <br />
              Preencha todos os dados
            </p>
            <button type="submit">Salvar cadastro</button>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default TeacherForm;

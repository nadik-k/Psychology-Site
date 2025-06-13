import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './Statictics.css'; // Стилі окремим файлом

// mockStats.js
const stats = {
  users: {
    total: 1500,
    activeToday: 240,
  },
  consultations: {
    total: 1200,
    scheduled: 80,
    cancelled: 20,
    completed: 1100,
  },
  anonymous: {
    requests: 300,
    successful: 180,
    avgResponseTime: '5 хв',
  },
  diary: {
    entries: 900,
    avgPerUser: 4.2,
  },
  tests: {
    taken: 670,
  },
  trends: [
    { name: 'Пн', consultations: 20 },
    { name: 'Вт', consultations: 30 },
    { name: 'Ср', consultations: 50 },
    { name: 'Чт', consultations: 25 },
    { name: 'Пт', consultations: 45 },
    { name: 'Сб', consultations: 60 },
    { name: 'Нд', consultations: 35 },
  ],
};


function Statistics() {
  return (
    <div className="statistics-container">
      <h2>📊 Загальна статистика</h2>

      <div className="stats-grid">
        <StatCard title="Зареєстрованих користувачів" value={stats.users.total} />
        <StatCard title="Активних сьогодні" value={stats.users.activeToday} />
        <StatCard title="Проведених консультацій" value={stats.consultations.completed} />
        <StatCard title="Запланованих" value={stats.consultations.scheduled} />
        <StatCard title="Відхилено" value={stats.consultations.cancelled} />
        <StatCard title="Анонімні запити" value={stats.anonymous.requests} />
        <StatCard title="Щоденникові записи" value={stats.diary.entries} />
        <StatCard title="Пройдено тестів" value={stats.tests.taken} />
      </div>

      <div className="chart-container">
        <h3>Динаміка консультацій за тиждень</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consultations" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default Statistics;
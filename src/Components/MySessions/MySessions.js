import React, { useState, useEffect, useMemo } from 'react';
import './MySessions.css';

const statusLabels = {
    all: 'Усі',
    upcoming: 'Майбутні',
    completed: 'Завершені',
    canceled: 'Скасовані',
    paid: 'Оплачено',
};

function MySessions() {
    const [sessions, setSessions] = useState([]);
    const [filter, setFilter] = useState('all');

    const userId = useMemo(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch {
            return null;
        }
    }, []);

    console.log(userId)

    useEffect(() => {
        if (!userId) return;

        const fetchSessions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions?userId=${userId}`);

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Сервер повернув помилку:', response.status, text);
                    throw new Error(`Помилка запиту: ${response.status}`);
                }

                const data = await response.json();
                setSessions(data);
            } catch (err) {
                console.error('❌ Помилка при завантаженні сесій:', err);
            }
        };

        fetchSessions();
    }, [userId]);


    const filteredSessions = useMemo(() => {
        if (filter === 'all') return sessions;

        return sessions.filter((session) => {
            if (session.status === filter) return true;

            if (
                session.status === 'paid' &&
                ['upcoming', 'completed', 'canceled'].includes(filter) &&
                session.psychologistStatus === filter
            ) {
                return true;
            }

            // Якщо хочемо бачити всі, що залишилися як 'paid'
            if (filter === 'paid' && session.status === 'paid' && !session.psychologistStatus) {
                return true;
            }

            return false;
        });
    }, [sessions, filter]);



    return (
        <div className="container">
            <h1>Мої сесії</h1>

            <div className="filters">
                {Object.keys(statusLabels).map((key) => (
                    <button
                        key={key}
                        className={`filter-btn ${filter === key ? 'active' : ''}`}
                        onClick={() => setFilter(key)}
                    >
                        {statusLabels[key]}
                    </button>
                ))}
            </div>

            <div className="sessions-list">
                {filteredSessions.map((session) => (
                    <div key={session._id} className={`session-card ${session.status}`}>
                        <div className="session-info">
                            <h2>Онлайн консультація</h2>
                            <p><strong>Психолог:</strong> {session.psychologId?.name || '—'}</p>
                            <p>
                                <strong>Дата:</strong>{' '}
                                {new Date(session.datetime).toLocaleString('uk-UA', {
                                    dateStyle: 'long',
                                    timeStyle: 'short',
                                })}
                            </p>
                            <p>
                                <strong>Формат:</strong> {session.format}
                            </p>
                            <p>
                                <strong>Тривалість:</strong> 1 година
                            </p>
                        </div>
                        <div className="session-actions">
                            <span className={`status ${session.status}`}>
                                {statusLabels[session.status] || session.status}
                            </span>
                            <span className={`status ${session.status}`}>
                                {statusLabels[session.psychologistStatus] || session.psychologistStatus}
                            </span>
                            {session.psychologistStatus === 'upcoming' && (
                                <>
                                    <button className="action-btn">Перейти в {session.format}</button>
                                    <button className="action-btn cancel">Скасувати</button>
                                </>
                            )}
                            {session.psychologistStatus === 'completed' && (
                                <>
                                    <button className="action-btn">Переглянути запис</button>
                                    <button className="action-btn">Оцінити</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {filteredSessions.length === 0 && (
                    <p className="empty">Сесій не знайдено для цього фільтру.</p>
                )}
            </div>
        </div>
    );
};

export default MySessions;

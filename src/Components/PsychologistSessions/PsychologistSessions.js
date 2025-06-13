import React, { useState } from 'react';
import './PsychologistSessions.css';

const sessionsMock = [
    {
        id: 1,
        client: 'Ірина Коваль',
        date: '2025-06-14T10:00',
        duration: '1 год',
        format: 'Zoom',
        status: 'upcoming',
        note: '',
    },
    {
        id: 2,
        client: 'Олег Мельник',
        date: '2025-06-04T14:30',
        duration: '1 год',
        format: 'Skype',
        status: 'completed',
        note: 'Обговорили техніки релаксації.',
    },
    {
        id: 3,
        client: 'Наталія Рибак',
        date: '2025-05-30T12:00',
        duration: '45 хв',
        format: 'Google Meet',
        status: 'canceled',
        note: '',
    },
];

const statusLabels = {
    all: 'Усі',
    upcoming: 'Майбутні',
    completed: 'Завершені',
    canceled: 'Скасовані',
};

const PsychologistSessions = () => {
    const [sessions, setSessions] = useState(sessionsMock);
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [filter, setFilter] = useState('all');

    const handleAddNote = (id) => {
        setSessions((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, note: newNote } : s
            )
        );
        setActiveNoteId(null);
        setNewNote('');
    };

    const filteredSessions =
        filter === 'all'
            ? sessions
            : sessions.filter((session) => session.status === filter);

    return (
        <div className="psychologist-container">
            <h1>Сесії з клієнтами</h1>

            {/* Фільтр */}
            <div className="session-filter">
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

            {/* Список сесій */}
            <div className="psychologist-session-list">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div key={session.id} className={`psy-session-card ${session.status}`}>
                            <div className="psy-info">
                                <h2>{session.client}</h2>
                                <p><strong>Дата:</strong> {new Date(session.date).toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                <p><strong>Формат:</strong> {session.format}</p>
                                <p><strong>Тривалість:</strong> {session.duration}</p>
                                <span className={`psy-status ${session.status}`}>
                                    {statusLabels[session.status]}
                                </span>
                            </div>

                            {session.status === 'completed' && (
                                <div className="psy-notes">
                                    {session.note ? (
                                        <div className="note-block">
                                            <strong>Нотатка:</strong>
                                            <p>{session.note}</p>
                                        </div>
                                    ) : activeNoteId === session.id ? (
                                        <div className="note-form">
                                            <textarea
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                placeholder="Введіть нотатку після сесії..."
                                            ></textarea>
                                            <button onClick={() => handleAddNote(session.id)}>Зберегти нотатку</button>
                                        </div>
                                    ) : (
                                        <button className="add-note-btn" onClick={() => setActiveNoteId(session.id)}>
                                            Додати нотатку
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-sessions">Немає сесій за обраним фільтром.</p>
                )}
            </div>
        </div>
    );
};

export default PsychologistSessions;

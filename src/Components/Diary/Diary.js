import React, { useState } from 'react';
import { format } from 'date-fns';
import { Smile, Meh, Frown } from 'lucide-react';
import './Diary.css';

const moodOptions = [
  { label: 'Добре', icon: <Smile className="icon happy" />, value: 'happy' },
  { label: 'Нейтрально', icon: <Meh className="icon neutral" />, value: 'neutral' },
  { label: 'Погано', icon: <Frown className="icon sad" />, value: 'sad' }
];

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  const handleAddEntry = () => {
    if (!mood || !note.trim()) return;
    const newEntry = {
      id: Date.now(),
      date: format(new Date(), 'dd.MM.yyyy HH:mm'),
      mood,
      note
    };
    setEntries([newEntry, ...entries]);
    setMood('');
    setNote('');
  };

  return (
    <div className="diary-container">
      <h1 className="diary-title">📓 Мій щоденник</h1>

      <div className="diary-entry-form">
        <label className="diary-label">Обери настрій:</label>
        <div className="mood-buttons">
          {moodOptions.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`mood-button ${mood === m.value ? 'selected' : ''}`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          className="note-textarea"
          placeholder="Що ти відчуваєш сьогодні?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={handleAddEntry} className="save-button">
          Зберегти запис
        </button>
      </div>

      <div className="entry-list-section">
        <h2 className="entry-list-title">🕒 Історія записів</h2>
        {entries.length === 0 ? (
          <p className="no-entries-text">Поки що немає записів.</p>
        ) : (
          <ul className="entry-list">
            {entries.map((entry) => (
              <li key={entry.id} className="entry-card">
                <div className="entry-meta">
                  <span className="entry-date">{entry.date}</span>
                  <span className="entry-mood">
                    {entry.mood === 'happy' && '😊 Добре'}
                    {entry.mood === 'neutral' && '😐 Нейтрально'}
                    {entry.mood === 'sad' && '😞 Погано'}
                  </span>
                </div>
                <p className="entry-text">{entry.note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Diary;
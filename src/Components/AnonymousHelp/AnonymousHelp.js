import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AnonymousHelp.css';

const AnonymousHelp = () => {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            let sessionId = sessionStorage.getItem('anon_session_id');
            if (!sessionId) {
                sessionId = 'anon_' + Math.random().toString(36).substring(2, 15);
                sessionStorage.setItem('anon_session_id', sessionId);
            }

            await axios.post('http://localhost:5000/api/anonymous', { text: message, sessionId });

            setSuccess(true);
            setTimeout(() => {
                navigate(`/anonymous-chat/${sessionId}`);
            }, 500);
        } catch (err) {
            alert('Помилка надсилання. Спробуйте ще раз.');
        }
    };

    return (
        <div className="anonymous-container">
            <h2>Анонімна психологічна підтримка</h2>
            <form className="anonymous-form" onSubmit={handleSubmit}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    placeholder="Опишіть вашу ситуацію..."
                />
                <button type="submit">Надіслати</button>
            </form>
            {success && <p className="success-message">Повідомлення надіслано анонімно ✅</p>}
        </div>
    );
};

export default AnonymousHelp;

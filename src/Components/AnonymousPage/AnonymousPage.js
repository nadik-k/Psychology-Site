import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AnonymousPage.css';

const AnonymousPage = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const psychologistId = localStorage.getItem('userId');


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const [freeRes, takenRes] = await Promise.all([
                    fetch("http://localhost:5000/api/anonymous/req"),
                    fetch(`http://localhost:5000/api/anonymous/taken/${psychologistId}`)
                ]);

                const free = await freeRes.json();
                const taken = await takenRes.json();

                // Уникаємо дублювання sessionId
                const sessionIds = new Set();
                const allUnique = [];

                [...taken, ...free].forEach(msg => {
                    if (!sessionIds.has(msg.sessionId)) {
                        sessionIds.add(msg.sessionId);
                        allUnique.push(msg);
                    }
                });

                setMessages(allUnique);
            } catch (err) {
                console.error("Помилка завантаження звернень:", err);
            }
        };

        fetchMessages();
    }, [psychologistId]);

    const handleClick = (sessionId) => {
        fetch(`http://localhost:5000/api/anonymous/take/${sessionId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: psychologistId }), // або токен розшифрований
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 409) {
                        alert("Цей запит уже зайнятий іншим психологом.");
                    }
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data?.success) {
                    navigate(`/anonymous-chat/${sessionId}`);
                }
            })
            .catch(err => console.error("Помилка взяття в роботу:", err));
    };


    return (
        <div className="anonymous-page">
            <h2>📨 Анонімні звернення</h2>
            {messages.length === 0 ? (
                <p className="message-list">Немає звернень</p>
            ) : (
                <ul className="message-list">
                    {messages.map(msg => (
                        <li key={msg._id} onClick={() => handleClick(msg.sessionId)}>
                            <div className="message-card">
                                <p>{msg.text ? msg.text.slice(0, 100) + '...' : 'Без тексту'}</p>
                                <small>{new Date(msg.createdAt).toLocaleString()}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnonymousPage;
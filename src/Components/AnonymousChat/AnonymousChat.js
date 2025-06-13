import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './AnonymousChat.css';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const parseJwt = (authToken) => {
    try {
        return JSON.parse(atob(authToken.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const AnonymousChat = () => {
    const { sessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const chatEndRef = useRef(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const user = token ? parseJwt(token) : null;
    const isPsycholog = user?.role === 'psycholog';

    useEffect(() => {
        if (!sessionId) return;

        socket.emit('anon_join', sessionId);

        fetch(`http://localhost:5000/api/anonymous/messages/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
                // Якщо всі повідомлення позначені як закриті — сесія завершена
                if (data.length && data.every(msg => msg.isClosed)) {
                    setIsClosed(true);
                }
            })
            .catch(err => console.error('Fetch error', err));

        socket.on('anon_receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off('anon_receive_message');
        };
    }, [sessionId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [messages]);

    useEffect(() => {
        const checkIfSessionClosed = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/anonymous/status/${sessionId}`);
                if (!res.ok) {
                    throw new Error('Помилка запиту');
                }

                const data = await res.json();
                if (data.isClosed) {
                    alert('Сесію завершено. Вас буде переадресовано на головну сторінку.');
                    navigate('/')
                }
            } catch (error) {
                console.error('Помилка при перевірці статусу сесії:', error);
            }
        };

        const interval = setInterval(checkIfSessionClosed, 3000); // перевірка кожні 3 секунди
        return () => clearInterval(interval); // очищення таймера при розмонтуванні
    }, [sessionId]);

    const handleSend = () => {
        if (text.trim()) {
            const message = {
                sessionId,
                text,
                token
            };
            socket.emit('anon_send_message', message);
            setText('');
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleEndChat = async () => {
        if (!window.confirm('Ви впевнені, що хочете завершити цей чат?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/anonymous/close/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            setMessages([]);
            setIsClosed(true);
        } catch (error) {
            console.error(error);
            alert('Помилка при завершенні сесії');
        }
    };


    return (
        <div className="anon-chat-container">
            <div className="anon-chat-header">Анонімна підтримка
                {token && isPsycholog && (
                    <button className="end-chat-btn" onClick={handleEndChat}>
                        Завершити сесію
                    </button>
                )}
            </div>
            <div className="anon-chat-info">
                <p>
                    Якщо ви випадково вийшли з чату — просто поверніться за цим посиланням.
                    <br />
                    Ваш сеанс зберігається протягом обмеженого часу.
                </p>
            </div>
            <div className="anon-chat-body">
                {messages.map((msg, index) => (
                    <div key={msg._id || index} className={`chat-bubble ${msg.sender === 'psycholog' ? 'psycholog' : 'anonymous'}`}>
                        <p>
                            {msg.sender === 'psycholog' ? 'Психолог: ' : 'Анонім: '}
                            {msg.text}
                        </p>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>
            <div className="anon-chat-footer">
                <input
                    type="text"
                    value={text}
                    placeholder="Напишіть повідомлення..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSend}>Надіслати</button>
            </div>
        </div>
    );
};

export default AnonymousChat;
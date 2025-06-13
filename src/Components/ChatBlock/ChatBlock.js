import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './ChatBlock.css';
import Picker from '@emoji-mart/react'
import emojiData from '@emoji-mart/data'



// Подключение к WebSocket серверу
const socket = io('http://localhost:5000'); // убедись, что порт совпадает

function ChatBlock() {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [myId, setMyId] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const id = localStorage.getItem('userId');
                setMyId(id);

                // Отримати поточного користувача
                const myDataRes = await axios.get(`http://localhost:5000/api/users/${id}`);
                const myData = myDataRes.data;
                const myRole = myData.role;

                // Завантажити всіх користувачів
                const res = await axios.get('http://localhost:5000/api/users');
                const otherUsers = res.data.filter(user => user._id !== id);

                // Фільтрація за роллю: якщо клієнт — показати психологів, і навпаки
                const filteredUsers = otherUsers.filter(user =>
                    myRole === 'client' ? user.role === 'psycholog' : user.role === 'client'
                );

                setUsers(filteredUsers);
            } catch (err) {
                console.error('Помилка завантаження користувачів:', err);
            }
        };

        socket.on('receive_message', (data) => {
            setMessages(prev => [...prev, data]);

            // Якщо активний чат з відправником — одразу відмічаємо як прочитане
            if (activeUser && activeUser._id === data.senderId) {
                socket.emit('read_messages', {
                    readerId: myId,
                    senderId: data.senderId
                });
            }
        });

        socket.on('messages_read', ({ readerId, senderId }) => {
            // Позначаємо повідомлення як прочитані, якщо ми — відправник
            setMessages(prev =>
                prev.map(msg =>
                    msg.senderId === myId &&
                        msg.receiverId === readerId &&
                        senderId === myId
                        ? { ...msg, read: true }
                        : msg
                )
            );
        });

        fetchUsers();
        return () => {
            socket.off('receive_message');
            socket.off('messages_read');
        };
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            if (activeUser) {
                socket.emit('read_messages', {
                    readerId: myId,
                    senderId: activeUser._id,
                });
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [activeUser, myId]);


    const handleUserClick = async (user) => {
        if (!myId || !user?._id) {
            console.error('Невірні ID для отримання повідомлень');
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/api/messages/${myId}/${user._id}`);
            setMessages(res.data);
            setActiveUser(user);
            socket.emit('read_messages', {
                readerId: myId,
                senderId: user._id,
            });
        } catch (err) {
            console.error('Помилка при завантаженні повідомлень:', err);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !activeUser) return;
        const msgData = {
            senderId: myId,
            receiverId: activeUser._id,
            message: newMessage,
            timestamp: new Date()
        };

        try {
            socket.emit('send_message', msgData);
        } catch (err) {
            console.error('Не вдалося надіслати повідомлення:', err);
        }
    };


    return (
        <div className="chat-container">
            <div className="client-list">
                <h2>Клієнти</h2>
                <ul>
                    {users.map(user => (
                        <li
                            key={user._id}
                            className={activeUser?._id === user._id ? 'active' : ''}
                            onClick={() => handleUserClick(user)}
                        >
                            {user.firstName} {user.lastName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-box">
                <div className="chat-header">
                    {activeUser ? `Чат з ${activeUser.firstName} ${activeUser.lastName}` : 'Оберіть психолога'}
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderId === myId ? 'sent' : 'received'}`}>
                            <div className="message-content">
                                {msg.message}
                                <div className="meta">
                                    <span className="timestamp">
                                        {new Date(msg.timestamp).toLocaleString('uk-UA', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit'
                                        })}
                                    </span>
                                    {msg.senderId === myId && (
                                        <span className={`status ${msg.read ? 'read' : 'unread'}`}>
                                            {msg.read ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {activeUser && (
                    <div className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введіть повідомлення..."
                        />
                        <p className='emoji-button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</p>
                        {showEmojiPicker && (
                            <div className="emoji-picker">
                                <Picker
                                    data={emojiData}
                                    onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji.native)}
                                />
                            </div>
                        )}
                        <button className='send-button' onClick={handleSendMessage}>Відправити</button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ChatBlock;
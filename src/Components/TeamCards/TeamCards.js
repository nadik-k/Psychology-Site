import React, { useState, useMemo } from "react";
import './TeamCards.css'

function TeamCards({ data }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('');
    const [error, setError] = useState('');

    const bookedSlots = [];

    const [userRole, userId] = useMemo(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return [null, null];

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return [payload.role, payload.id];
        } catch (error) {
            console.error('❌ Не вдалося розпарсити токен:', error);
            return [null, null];
        }
    }, []);

    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        for (let d = 0; d < 7; d++) {
            const baseDate = new Date(now);
            baseDate.setDate(now.getDate() + d);
            baseDate.setHours(10, 0, 0, 0);

            const endDate = new Date(baseDate);
            endDate.setHours(18, 0, 0, 0);

            let current = new Date(baseDate);

            while (current < endDate) {
                const dateStr = current.toISOString().slice(0, 10);
                const timeStr = current.toTimeString().slice(0, 5);
                const slot = `${dateStr}T${timeStr}`;

                if (!bookedSlots.includes(slot)) {
                    slots.push(slot);
                }
                current = new Date(current.getTime() + 90 * 60 * 1000);
            }
        }
        return slots;
    };

    const availableSlots = useMemo(() => generateTimeSlots(), []);

    const groupedSlots = useMemo(() => {
        const map = {};
        availableSlots.forEach(slot => {
            const [date, time] = slot.split('T');
            if (!map[date]) map[date] = [];
            map[date].push(time);
        });
        return map;
    }, [availableSlots]);

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) {
            setError("⛔ Будь ласка, оберіть дату та час.");
            return;
        }
        if (!selectedFormat) {
            setError("📡 Будь ласка, оберіть формат консультації.");
            return;
        }

        const fullSlot = `${selectedDate}T${selectedTime}`;
        const isTaken = bookedSlots.includes(fullSlot);

        if (isTaken) {
            setError("❌ Цей час вже зайнятий. Виберіть інший.");
            return;
        }

        // 1. Проводимо оплату
        const description = `Оплата за консультацію з психологом: ${data.name}, дата: ${selectedDate} - ${selectedTime}, формат: ${selectedFormat}`;
        const response = await fetch('http://localhost:5000/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: data.price,
                description: description
            })
        });

        const result = await response.json();

        // 2. Створюємо форму LiqPay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.liqpay.ua/api/3/checkout';
        form.target = '_blank';

        const inputData = document.createElement('input');
        inputData.type = 'hidden';
        inputData.name = 'data';
        inputData.value = result.data;

        const inputSign = document.createElement('input');
        inputSign.type = 'hidden';
        inputSign.name = 'signature';
        inputSign.value = result.signature;

        form.appendChild(inputData);
        form.appendChild(inputSign);
        document.body.appendChild(form);
        form.submit();

        // 3. Виводимо підтвердження
        alert(`✅ Ви записались на ${selectedDate} о ${selectedTime} через ${selectedFormat}`);
        setError('');
        setShowModal(false);
        setSelectedDate('');
        setSelectedTime('');
        setSelectedFormat('');
    };

    const handleBookingClick = () => {
        try {
            if (userRole !== 'client') {
                window.location.href = '/register';
                return;
            }

            setShowModal(true);
        } catch (error) {
            console.error("Invalid token format", error);
            window.location.href = '/register';
        }
    };



    return (
        <div className="team-card">
            <img src={`http://localhost:5000${data.photo}`} alt={data.name} />
            <div className="team-info">
                <h3>{data.name}</h3>
                <p>{data.experience} років досвіду</p>
                <span className='badge online'>ОНЛАЙН</span>
                <ul>
                    {data.topics.slice(0, 3).map((topic, index) => (
                        <li key={index}>✓ {topic}</li>
                    ))}
                    <li>+ інші запити</li>
                </ul>
                <div className="card-footer">
                    <button
                        onClick={handleBookingClick}
                        disabled={userRole === 'psycholog'}
                        style={{
                            cursor: userRole === 'psycholog' ? 'not-allowed' : 'pointer',
                            backgroundColor: userRole === 'psycholog' ? 'black' : '#00796b',
                            opacity: userRole === 'psycholog' ? 0.6 : 1,
                        }}
                    >
                        📅 Записатись
                    </button>
                    <span>{data.price} грн / сесія</span>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Оберіть дату та час</h3>

                        <label>Дата:</label>
                        <select value={selectedDate} onChange={e => {
                            setSelectedDate(e.target.value);
                            setSelectedTime('');
                            setError('');
                        }}>
                            <option value="">-- оберіть дату --</option>
                            {Object.keys(groupedSlots).map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>

                        {selectedDate && (
                            <>
                                <label>Час:</label>
                                <select value={selectedTime} onChange={e => {
                                    setSelectedTime(e.target.value);
                                    setError('');
                                }}>
                                    <option value="">-- оберіть час --</option>
                                    {groupedSlots[selectedDate]?.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        <label>Формат консультації:</label>
                        <select value={selectedFormat} onChange={e => {
                            setSelectedFormat(e.target.value);
                            setError('');
                        }}>
                            <option value="">-- оберіть формат --</option>
                            <option value="Skype">Skype</option>
                            <option value="Zoom">Zoom</option>
                            <option value="Google Meet">Google Meet</option>
                        </select>

                        {error && <p className="error">{error}</p>}

                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>💳 Оплатити</button>
                            <button onClick={() => setShowModal(false)}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamCards;

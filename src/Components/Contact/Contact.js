import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('Повідомлення надіслано ✅');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setStatus('Помилка відправлення ❌');
        }
    };
    return (
        <section className="contact-section">
            <div className="contact-container">
                <h1>Зв’яжіться з нами</h1>
                <p className="contact-subtitle">Маєте запитання або хочете отримати консультацію? Ми завжди на зв’язку!</p>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Контактна інформація</h2>
                        <p><strong>📍 Адреса:</strong> Київ, вул. Підтримки 15</p>
                        <p><strong>📞 Телефон:</strong> +380 99 123 4567</p>
                        <p><strong>✉️ Email:</strong> dihajvilno@psyhelp.ua</p>
                        <p><strong>🕐 Графік:</strong> Пн-Пт 9:00 — 18:00</p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Напишіть нам</h2>
                        <input type="text" name="name" placeholder="Ваше ім’я" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <textarea name="message" placeholder="Ваше повідомлення" value={formData.message} onChange={handleChange} required></textarea>
                        <button type="submit">Надіслати повідомлення</button>
                        {status && <p className="form-status">{status}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;
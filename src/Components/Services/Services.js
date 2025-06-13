import React from 'react';
import './Services.css';
import Record from '../Record_Block/Record_Block';

const services = [
    {
        title: 'Індивідуальні консультації',
        description: 'Особиста робота з психологом для глибшого розуміння себе, подолання тривожності, депресії, травм.',
        icon: '🧠'
    },
    {
        title: 'Сімейна терапія',
        description: 'Розв’язання конфліктів у парі, покращення комунікації та зміцнення відносин.',
        icon: '👨‍👩‍👧'
    },
    {
        title: 'Підтримка підлітків',
        description: 'Психологічна допомога для підлітків у період змін, пошуку ідентичності, проблем у навчанні чи стосунках.',
        icon: '🧒'
    },
    {
        title: 'Онлайн-консультації',
        description: 'Зручні сесії через відео, аудіо або чат з будь-якої точки світу.',
        icon: '💻'
    },
    {
        title: 'Кризове консультування',
        description: 'Швидка допомога у стані емоційної кризи або після травматичних подій.',
        icon: '🚨'
    },
    {
        title: 'Групові заняття',
        description: 'Психологічні тренінги, майстер-класи та терапевтичні групи для розвитку емоційного інтелекту та підтримки.',
        icon: '👥'
    },
    {
        title: 'Коучинг та розвиток кар’єри',
        description: 'Підтримка у визначенні професійного шляху, подоланні вигорання та досягненні цілей.',
        icon: '🚀'
    },
    {
        title: 'Психоедукація та лекції',
        description: 'Освітні заходи, присвячені ментальному здоров’ю, стратегіям самодопомоги, стрес-менеджменту.',
        icon: '📚'
    }
];

function Services() {
    return (
        <section className="services-section">
            <div className="services-container">
                <h1>Наші Послуги</h1>
                <p className="intro">Ми надаємо широкий спектр психологічних послуг для підтримки вашого психічного здоров’я. Знайдіть той формат, який найкраще підходить саме вам.</p>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
                <Record />
            </div>
        </section>
    );
}

export default Services;
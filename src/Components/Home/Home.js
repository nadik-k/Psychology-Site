import React, { useEffect, useState } from 'react';
import picture from '../Home/girl.png';
import faq from '../Home/faq.png';
import "./Home.css";
import TeamCards from '../TeamCards/TeamCards';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <h3 onClick={() => setIsOpen(!isOpen)}>{question}</h3>
            {isOpen && <p>{answer}</p>}
        </div>
    );
};

const SliderWithValue = ({ label, name, value, onChange }) => {
    return (
        <div className="slider-wrapper">
            <label>
                {label}
                <input type="range" min="0" max="5" value={value} name={name} onChange={onChange} />
                <div className="slider-value" style={{ left: `${(value / 5) * 100}%` }}>{value}</div>
            </label>
        </div>
    );
};

const helpTopics = [
    { title: 'Тривога', description: 'Наші спеціалісти володіють широким арсеналом сучасних науково-доказових інструментів...', color: 'pink' },
    { title: 'Депресія', description: 'Психологи центру допоможуть вам покращити настрій, відновити сили...', color: 'grey' },
    { title: 'Втрата та горювання', description: 'Ми будемо поруч, станемо опорою у важкі часи...', color: 'violet' },
    { title: 'Страхи та фобії', description: 'Страх — природно, але нав’язливі фобії можна подолати разом з нами...', color: 'blue' },
    { title: 'Розлади харчової поведінки', description: 'Ми допоможемо вам впоратися з порушеннями харчової поведінки...', color: 'green' },
    { title: 'Самооцінка', description: 'Низька самооцінка може бути причиною багатьох проблем — ми допоможемо вам змінити ставлення до себе...', color: 'yellow' },
    { title: 'Труднощі в стосунках', description: 'Психолог допоможе розібратися у ваших стосунках, виявити причини конфліктів...', color: 'orange' },
    { title: 'Робота з дітьми та підлітками', description: 'Ми надаємо підтримку дітям, підліткам і їхнім батькам...', color: 'aqua' },
];

const questions = [
    { name: 'q1', label: 'Наскільки часто ви відчували тривогу?' },
    { name: 'q2', label: 'Наскільки часто ви відчували втому чи виснаження?' },
    { name: 'q3', label: 'Чи відчували ви самотність?' }
];

function Home() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/cards")
            .then(res => setCards(res.data))
            .catch(err => console.error("Помилка:", err));
    }, []);

    const [score, setScore] = useState(null);
    const [answers, setAnswers] = useState(() => {
        const initial = {};
        questions.forEach(q => {
            initial[q.name] = 0;
        });
        return initial;
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    const calculate = () => {
        const total = Object.values(answers).reduce((a, b) => a + b, 0);
        setScore(total);
    };

    const getRecommendation = (score) => {
        if (score <= 4) {
            return "🟢Ваш емоційний стан виглядає стабільним. Продовжуйте піклуватися про себе.";
        } else if (score <= 8) {
            return "🟡Можливо, ви відчуваєте деякий емоційний дискомфорт. Подумайте про розмову з близькими або коротку консультацію.";
        } else if (score <= 12) {
            return "🟠Варто звернути увагу на свій стан. Ми рекомендуємо записатися на пробну консультацію з психологом.";
        } else {
            return "🔴Ваш стан потребує підтримки. Будь ласка, зверніться до фахівця якнайшвидше. Ви не самі.";
        }
    };

    const faqData = [
        {
            question: 'Чи можу я обрати спеціаліста самостійно?',
            answer: 'Так, у нас є можливість ознайомитися з профілями спеціалістів та обрати того, хто вам підходить.'
        },
        {
            question: 'Які є формати консультацій?',
            answer: 'Доступні формати: відео, аудіо або текстовий чат. Ви можете обрати найзручніший варіант.'
        },
        {
            question: 'Чи є безкоштовні консультації?',
            answer: 'Так, ми пропонуємо безкоштовні сесії для ветеранів, переселенців та молоді до 21 року.'
        },
        {
            question: 'Які методи використовують психологи?',
            answer: 'Усі спеціалісти працюють на основі когнітивно-поведінкової терапії, ACT, EMDR та інших сучасних методів.'
        }
    ];

    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <h1>Дихай вільно</h1>
                    <p>Ласкаво просимо до "Дихай вільно" — платформи психологічної підтримки, де ви завжди можете знайти розуміння, допомогу та натхнення.</p>
                    <hr />
                    <p>Наш сервіс створений для тих, хто шукає відповіді, спокій або просто потребує теплих слів підтримки.</p>
                    <a href="#" className="consult-button">Почати консультацію</a>
                    <a className="consult-button" onClick={() => navigate('/anonymous')}>Анонімна підтримка</a>
                </div>
                <div className="hero-image">
                    <img src={picture} alt="Психологічна підтримка" className='home_picture' />
                </div>
            </section>

            <section className="help-section">
                <div className="help-container">
                    <div className="section-header">
                        <p className="subtitle">З чим ми допомагаємо</p>
                        <h2>Напрямки консультування</h2>
                    </div>
                    <div className="cards">
                        {helpTopics.map((topic, index) => (
                            <div key={index} className={`card ${topic.color}`}>
                                <h3>{topic.title}</h3>
                                <p>{topic.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="team-section">
                <div className="team-container">
                    <h2>Наша команда</h2>
                    <p className="team-description">
                        Ми зібрали команду фахівців з відповідною освітою, досвідом та етичним підходом до роботи.
                        Усі наші спеціалісти працюють за науково-доказовими методами та підтримують ЛГБТКІ+ клієнтів.
                    </p>
                    <div className="team-cards">
                        {cards.map(card => (
                            <TeamCards key={card._id} data={card} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="emotion-section">
                <div className="emotion-container">
                    <h2>Калькулятор емоційного стану</h2>
                    <p>Оцініть свій стан за останній тиждень:</p>
                    {questions.map((q) => (
                        <SliderWithValue
                            key={q.name}
                            label={q.label}
                            name={q.name}
                            value={answers[q.name]}
                            onChange={handleChange}
                        />
                    ))}
                    <button onClick={calculate}>Розрахувати</button>
                    {score !== null && (
                        <div className="score">
                            <p>Ваш результат: {score} / 15</p>
                            <p>{getRecommendation(score)}</p>
                        </div>
                    )}
                </div>
            </section>


            <section className="faq-section">
                <div className="faq-container">
                    <h2>Відповіді на питання</h2>
                    <div className="faq-content">
                        <div className="faq-picture">
                            <img src={faq} alt="Психологічна підтримка" className="faq_picture" />
                        </div>
                        <div className="faq-text">
                            {faqData.map((item, index) => (
                                <FAQItem key={index} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default Home;
import React, { useState, useEffect } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts';
import { useLocation } from 'react-router-dom';
import './TestResults.css';
import TeamCards from '../TeamCards/TeamCards';
import axios from "axios";

const TestResults = () => {
    const location = useLocation();
    const results = location.state;
    const [cards, setCards] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/cards")
            .then(res => setCards(res.data))
            .catch(err => console.error("Помилка:", err));
    }, []);
    if (!results || typeof results !== "object" || !results.stress) {
        return (
            <div className="no-data">
                <h2>Дані відсутні</h2>
                <p>Схоже, ви перейшли на цю сторінку напряму. Будь ласка, пройдіть тест.</p>
            </div>
        );
    }

    const {
        stress = 0,
        anxiety = 0,
        confidence = 0,
        stability = 0,
        energy = 0
    } = results;

    const data = [
        { subject: 'Стрес', A: stress },
        { subject: 'Тривожність', A: anxiety },
        { subject: 'Впевненість', A: confidence },
        { subject: 'Стабільність', A: stability },
        { subject: 'Енергія', A: energy },
    ];



    const getStatusText = () => {
        if (stress > 70 || anxiety > 70) {
            return "Ваші результати свідчать про високий рівень напруги або тривожності. Рекомендується звернутися до психолога для детальнішої консультації.";
        } else if (confidence < 40 || stability < 40) {
            return "Можливо, ви переживаєте нестабільність або сумніви у собі. Це нормальна частина життя, але підтримка фахівця може бути корисною.";
        } else {
            return "Ваш емоційний стан загалом стабільний. Продовжуйте дбати про себе та за потреби звертайтесь до спеціалістів.";
        }
    };

    return (
        <div className="test-results-container">
            <h2 className="test-title">Результати тесту</h2>
            <div className="chart-wrapper">
                <div className="chart-container">
                    <RadarChart className='diagram' outerRadius={180} width={600} height={450} data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Tooltip />
                        <Radar name="Стан" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                    <h3>Опис вашого стану</h3>
                    <p>{getStatusText()}</p>
                </div>

                <section className="team-section">
                    <div className="team-container">
                        <h2>Наші спеціалісти</h2>
                        <div className="team-cards">
                            {cards.map(card => (
                                <TeamCards key={card._id} data={card} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TestResults;
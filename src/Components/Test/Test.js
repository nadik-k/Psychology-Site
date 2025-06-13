import React, { useState } from "react";
import "./Test.css";
import { useNavigate } from "react-router-dom";

const questions = [
    "Як часто ви відчуваєте тривогу без причини?",
    "Чи маєте проблеми зі сном?",
    "Чи відчуваєте втому навіть після відпочинку?",
    "Чи маєте труднощі з концентрацією уваги?",
    "Чи часто відчуваєте роздратованість?",
    "Чи є у вас труднощі у спілкуванні з близькими?",
    "Чи відчуваєте себе самотнім?",
    "Чи маєте труднощі з прийняттям рішень?",
    "Чи часто сумуєте без видимих причин?",
    "Чи бувають у вас напади паніки?",
    "Чи маєте труднощі з апетитом (занадто великий або відсутній)?",
    "Чи відчуваєте, що втрачаєте інтерес до справ, які раніше подобались?"
];

const options = [
    "Ніколи",
    "Рідко",
    "Час від часу",
    "Часто",
    "Постійно"
];

const scoreMap = {
    "Ніколи": 0,
    "Рідко": 1,
    "Час від часу": 2,
    "Часто": 3,
    "Постійно": 4
};

function Test() {
    const [answers, setAnswers] = useState(Array(questions.length).fill(""));
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Відповіді:", answers);
        alert("Дякуємо! Ваші відповіді збережено.");
    };

    const calculateResults = (answers) => {
        const scores = answers.map(ans => scoreMap[ans] ?? 0);

        return {
            stress: Math.round((scores[0] + scores[1] + scores[4] + scores[9]) * 6.25),     // макс 64 → 100-бальна шкала
            anxiety: Math.round((scores[0] + scores[3] + scores[7] + scores[9]) * 6.25),
            confidence: 100 - Math.round((scores[3] + scores[6] + scores[11]) * 8.33),
            stability: 100 - Math.round((scores[2] + scores[4] + scores[10]) * 8.33),
            energy: 100 - Math.round((scores[2] + scores[10]) * 12.5),
        };
    };


    const handleFinishTest = () => {
        const result = calculateResults(answers);
        navigate("/result", { state: result });
    };

    return (
        <div className="test-container">
            <h1 className="test-title">Психологічний тест</h1>
            <form onSubmit={handleSubmit} className="test-form">
                {questions.map((q, i) => (
                    <div key={i} className="question-block">
                        <p className="question-text">{i + 1}. {q}</p>
                        <select
                            value={answers[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            required
                        >
                            <option value="">Оберіть відповідь</option>
                            {options.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="submit" className="submit-button" onClick={handleFinishTest}>Завершити тест</button>
            </form>
        </div>
    );
}

export default Test;

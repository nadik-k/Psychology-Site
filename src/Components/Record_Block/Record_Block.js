import React from "react";
import { useNavigate } from "react-router-dom";
import './Record_Block.css';

function Record_Block({ data }) {
    const navigate = useNavigate();

    return (
        <div className="cta-block">
            <h2>Саме час записатися до психолога</h2>
            <p>Пройдіть коротке опитування або оберіть спеціаліста із запропонованих.</p>
            <button className="cta-button" onClick={() => navigate('/test')}>Пройти опитування</button>
            <button className="cta-button">Обрати спеціаліста</button>
        </div>
    );
}

export default Record_Block;

import React, { useEffect, useState } from 'react';
import './Events.css';
import Record from '../Record_Block/Record_Block';

function Events() {
    const [events, setEvents] = useState([]);
    const today = new Date();

    useEffect(() => {
        fetch('http://localhost:5000/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error('Помилка завантаження:', err));
    }, []);

    const upcoming = events.filter(e => new Date(e.date) >= today);
    const past = events.filter(e => new Date(e.date) < today);

    const renderEvents = (list) => (
        <div className="event-cards-alt">
            {list.map((event, idx) => (
                <div key={idx} className="event-spotlight">
                    <div className="event-img" style={{ backgroundImage: `url(${event.image})` }} />
                    <div className="event-info">
                        <span className="event-date-alt">{new Date(event.date).toLocaleDateString('uk-UA')}</span>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        {new Date(event.date) >= today ? <a
                            href={new Date(event.date) >= today ? event.registrationLink : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="alt-button">
                            Зареєструватися </a>
                            : null}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="events-section-alt">
            <div className="events-wrapper">
                <header className="events-header">
                    <h1>Відчуй спільноту — приєднуйся до наших подій</h1>
                    <p>Живі зустрічі, терапевтичні практики, емоційне відновлення. Ми створюємо простір, де можна бути собою.</p>
                </header>

                {upcoming.length > 0 && (
                    <section>
                        <h2 className="event-subtitle">Актуальні події</h2>
                        {renderEvents(upcoming)}
                    </section>
                )}

                {past.length > 0 && (
                    <section className="past-events">
                        <h2 className="event-subtitle">Минулі події</h2>
                        {renderEvents(past)}
                    </section>
                )}
            </div>
            <Record />
        </section>
    );
}

export default Events;

import React, { useState } from 'react';
import './TopicsSelector.css';

const TopicsSelector = ({ topics, onSelectionChange }) => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        setSelectedTopics((prev) => {
            const updated = checked ? [...prev, value] : prev.filter((t) => t !== value);
            if (onSelectionChange) {
                onSelectionChange(updated);
            }
            return updated;
        });
    };

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return (
        <div className="topics-selector">
            <button
                onClick={toggleVisibility}
                className="toggle-btn"
                aria-expanded={isVisible}
                aria-controls="topics-checkbox-list"
            >
                {isVisible ? 'Сховати теми ▲' : 'Показати теми ▼'}
            </button>

            {isVisible && (
                <div
                    id="topics-checkbox-list"
                    className="checkbox-list"
                >
                    {topics.map((topic) => (
                        <label key={topic} className="checkbox-item">
                            {topic}
                            <input
                                type="checkbox"
                                value={topic}
                                checked={selectedTopics.includes(topic)}
                                onChange={handleCheckboxChange}
                            />
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopicsSelector;
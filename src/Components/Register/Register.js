import React, { useState } from 'react';
import picture from './picture.png';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../Register/undefind.png';
import './Register.css';
import axios from 'axios';
import TopicsSelector from '../TopicsSelector/TopicsSelector';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthdate: '',
        email: '',
        password: '',
        role: 'client',
        photo: "/uploads/undefind.png",
        experience: '',
        price: '',
        topics: []
    });

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const topics = ["Тривога", "Депресія", "Втрата", "Стосунки", "Панічні атаки", "Травма",
        "Сімейна терапія", "Емоційна нестабільність", "Гнів і агресія", "Прокрастинація", "Психологічне насильство",
        "Самотність", "Підтримка в кризових ситуаціях", "ПТСР", "Інше"];

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = (password) => password.length >= 6;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTopicChange = (updatedTopics) => {
        setSelectedTopics(updatedTopics);
        setFormData(prev => ({ ...prev, topics: updatedTopics }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        console.log(formData)

        if (!isValidEmail(formData.email)) {
            setErrorMessage("Невірний формат email");
            return;
        }

        if (!isValidPassword(formData.password)) {
            setErrorMessage("Пароль повинен містити щонайменше 6 символів");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/register", formData);
            localStorage.setItem("authToken", response.data.token);
            alert("Реєстрація успішна");
            navigate("/login");
        } catch (err) {
            if (err.response?.status === 409) {
                setErrorMessage("Користувач з таким email вже існує");
            } else if (err.response?.data?.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage("Помилка при реєстрації. Спробуйте пізніше");
            }
        }
    };

    return (
        <div className="reg-container with-image">
            <div className="image-side">
                <img src={picture} alt="Психологічна підтримка" />
            </div>
            <div className="form-box">
                <h2>Реєстрація</h2>
                <form className="input-columns" onSubmit={handleSubmit}>
                    <input name="firstName" type="text" placeholder="Ім’я" required value={formData.firstName} onChange={handleChange} />
                    <input name="lastName" type="text" placeholder="Прізвище" required value={formData.lastName} onChange={handleChange} />

                    <div className="radio-group">
                        <label className="custom-radio">
                            <input type="radio" name="gender" value="female" required onChange={handleChange} />
                            <span className="radio-mark"></span> Жінка
                        </label>
                        <label className="custom-radio">
                            <input type="radio" name="gender" value="male" required onChange={handleChange} />
                            <span className="radio-mark"></span> Чоловік
                        </label>
                    </div>

                    <input name="birthdate" type="date" required value={formData.birthdate} onChange={handleChange} />
                    <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                    <input name="password" type="password" placeholder="Пароль" required value={formData.password} onChange={handleChange} />

                    <div className="radio-group">
                        <label className="custom-radio">
                            <input type="radio" name="role" value="client" required onChange={handleChange} />
                            <span className="radio-mark"></span> Я клієнт
                        </label>
                        <label className="custom-radio">
                            <input type="radio" name="role" value="psycholog" required onChange={handleChange} />
                            <span className="radio-mark"></span> Я психолог
                        </label>
                    </div>

                    {formData.role === 'psycholog' && (
                        <div className="psycholog-fields">
                            <input
                                type="text"
                                name="experience"
                                placeholder="Досвід (роки)"
                                onChange={handleChange}
                                required
                            />

                            <label>Оберіть теми, з якими ви працюєте:</label>
                            <TopicsSelector
                                topics={topics}
                                onSelectionChange={handleTopicChange}
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Ціна за сесію (грн)"
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    )}

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit">Зареєструватися</button>
                </form>

                <p className="switch-link">
                    Вже маєте акаунт? <Link to="/login">Увійти</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;

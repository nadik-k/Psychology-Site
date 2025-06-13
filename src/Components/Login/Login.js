import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import picture from './picture.png';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                formData,
                { withCredentials: true }
            );

            const token = response.data?.token;
            if (typeof token === "string") {
                // Розпарсити JWT (тільки payload, не перевіряється підпис)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload?.id;

                if (typeof userId === "string") {
                    localStorage.setItem("userId", userId); // ✅ зберегти ID користувача
                    login(token);
                    navigate("/");
                } else {
                    alert("Помилка: ID користувача не знайдено в токені.");
                }
            } else {
                alert("Сервер не повернув токен.");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Помилка входу");
            console.error("Login error:", err);
        }
    };


    return (
        <div className="login-container with-image">
            <div className="image-side">
                <img src={picture} alt="Психологічна підтримка" />
            </div>
            <div className="form-box">
                <h2>Вхід</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Увійти</button>
                </form>
                <p className="switch-link">
                    Немає акаунту? <Link to="/register">Зареєструватися</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
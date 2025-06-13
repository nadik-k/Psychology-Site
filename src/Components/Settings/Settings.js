import React, { useState, useEffect } from 'react';
import './Settings.css';
import defaultAvatar from '../Home/psychology1.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const [role, setRole] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const payload = parseJwt(token);
            setRole(payload?.role || '');

            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.data;
                setFirstName(user.firstName || '');
                setLastName(user.lastName || '');
                setEmail(user.email || '');
                setCurrentEmail(user.email || '');
                setBirthdate(user.birthdate?.split('T')[0] || '');
                setPhone(user.phone || '');
                setOrganization(user.organization || '');
                setAvatar(user.photo || null);
            } catch (error) {
                console.error('Помилка отримання даних:', error);
            }
        };

        fetchUserData();
    }, []);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !birthdate) {
            alert('Будь ласка, заповніть усі обов’язкові поля.');
            return;
        }

        if (role === 'psychologist' && (!organization || !phone)) {
            alert('Потрібні організація та телефон для психолога.');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Користувач не авторизований');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('birthdate', birthdate);
            if (email !== currentEmail) formData.append('email', email);
            if (password) formData.append('password', password);
            if (selectedFile) formData.append('photo', selectedFile);
            if (role === 'psychologist') {
                formData.append('organization', organization);
                formData.append('phone', phone);
            }

            const response = await axios.put('http://localhost:5000/api/users/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.token) {
                localStorage.setItem('authToken', response.data.token);
            }

            alert('Профіль оновлено!');
            navigate('/');
            window.location.reload(); // 🔁 перезавантаження сторінки
        } catch (error) {
            console.error('Помилка оновлення:', error);
            alert('Не вдалося оновити профіль.');
        }
    };

    return (
        <div className="profile-settings-wrapper">
            <div className="profile-settings-container">
                <div className="profile-photo-section">
                    <img
                        src={avatar?.startsWith('blob:') ? avatar : avatar ? `http://localhost:5000${avatar}` : defaultAvatar}
                        alt="profile"
                        className="profile-photo"
                    /><br />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ім’я</label>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Прізвище</label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Дата народження</label>
                        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Електронна пошта</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Підтвердження пароля</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>

                    {role === 'psychologist' && (
                        <>
                            <div className="form-group">
                                <label>Організація</label>
                                <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Телефон</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="save-button">Зберегти</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;

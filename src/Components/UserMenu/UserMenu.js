import React, { useState, useRef, useEffect, useContext } from "react";
import "./UserMenu.css";
import defaultAvatar from '../Home/psychology1.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const UserMenu = ({ onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const toggleMenu = () => setOpen(!open);

    useEffect(() => {
        console.log(user)
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="user-menu" ref={menuRef}>
            <img
                src={user?.photo ? `http://localhost:5000${user.photo}` : defaultAvatar}
                alt="User avatar"
                className="avatar"
                onClick={toggleMenu}
            />
            {open && (
                <ul className="dropdown">
                    {user?.role === 'client' ? (
                        <>
                            <li onClick={() => navigate("/chats")}>💬 Чати</li>
                            <li onClick={() => navigate("/diary")}>📔 Щоденник</li>
                            <li onClick={() => navigate("/meetings")}>📅 Мої сесії</li>
                        </>
                    ) : user?.role === 'psycholog' ? (
                        <>
                            <li onClick={() => navigate("/chats")}>💬 Чати</li>
                            <li onClick={() => navigate("/calendar")}>📅 Календар сесій</li>
                            <li onClick={() => navigate("/anon_req")}>📊 Анон. запити</li>
                        </>
                    ) : null}
                    <li onClick={() => navigate("/settings")}>⚙️ Налаштування</li>
                    <li onClick={() => {
                        onLogout();
                        navigate('/');
                    }}>🚪 Вийти</li>
                </ul>
            )}
        </div>
    );
};

export default UserMenu;
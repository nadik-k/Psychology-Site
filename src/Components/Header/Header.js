import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../Header/Logo.png';
import Icon from '../Header/Menu.png';
import { AuthContext } from '../AuthContext';
import UserMenu from '../UserMenu/UserMenu';

function Header() {
    const [isOpen, setOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const currentPath = location.pathname;

    const navLinks = [
        { to: '/', label: 'Головна' },
        { to: '/services', label: 'Послуги' },
        { to: '/events', label: 'Події' },
        { to: '/blog', label: 'Блог' },
        { to: '/contacts', label: 'Контакти' }
    ];

    return (
        <header className="header new-style">
            <div className="header_container">
                <Link to="/">
                    <img src={logo} alt="Logo" className="header_logo" />
                </Link>
                <nav className={`header_nav ${isOpen ? 'active' : ''}`}>
                    <ul className="header_nav-list">
                        {navLinks.map((link) => (
                            <li className="header_nav-item" key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`nav-link${currentPath === link.to ? ' active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="header_buttons">
                    {user ? (
                        <UserMenu user={user} onLogout={logout} />
                    ) : (
                        <Link to="/login" className="header_cta-button">Увійти</Link>
                    )}
                    <button className="header_menu-button" onClick={() => setOpen(!isOpen)}>
                        <img src={Icon} className="header_menu-icon" alt="menu icon" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
import React from 'react';
import './Footer.css';
import icon_f from '../Footer/icons/facebook_icon.png';
import icon_i from '../Footer/icons/instagram_icon.png';
import icon_t from '../Footer/icons/telegram_icon.png';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h3>Дихай вільно</h3>
                    <p>Платформа психологічної підтримки для тих, хто шукає розуміння, спокій і натхнення.</p>
                </div>

                <div className="footer-links">
                    <h4>Навігація</h4>
                    <ul>
                        <li><a href="#home">Головна</a></li>
                        <li><a href="#services">Послуги</a></li>
                        <li><a href="#team">Фахівці</a></li>
                        <li><a href="#contacts">Контакти</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Контакти</h4>
                    <p>Email: support@dykhay.com</p>
                    <p>Телефон: +380 96 000 00 00</p>
                    <div className="social-icons">
                        <a href="https://uk-ua.facebook.com/"><img src={icon_f} alt="Facebook" /></a>
                        <a href="https://www.instagram.com/"><img src={icon_i} alt="Instagram" /></a>
                        <a href="https://t.me/mshappygirl"><img src={icon_t} alt="Telegram" /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 Дихай вільно. Усі права захищено.</p>
            </div>
        </footer>
    );
}

export default Footer;
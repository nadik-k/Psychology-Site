import React, { useState, useEffect } from 'react';
import './Blog.css';
import Record from '../Record_Block/Record_Block';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/posts');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error('Помилка завантаження:', err.message);
            }
        };

        fetchPosts();
    }, []);


    return (
        <section className="blog-section">
            <div className="blog-container">
                <h1>Блог</h1>
                <p className="blog-intro">Корисні матеріали, натхнення та практичні поради для щоденної турботи про себе.</p>
                {activePost === null ? (
                    <div className="blog-grid">
                        {posts.map((post, index) => (
                            <div key={index} className="blog-card">
                                {post.image && <img src={post.image} alt={post.title} />}
                                <div className="blog-content">
                                    <span className="blog-date">{new Date(post.date).toLocaleDateString('uk-UA')}</span>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <button className="blog-button" onClick={() => setActivePost(post)}>Читати далі</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="full-post">
                        {activePost.image && <img src={activePost.image} alt={activePost.title} className="full-post-image" />}
                        <div className="full-post-content">
                            <h2>{activePost.title}</h2>
                            <span className="blog-date">{new Date(activePost.date).toLocaleDateString('uk-UA')}</span>
                            <p>{activePost.fullText}</p>
                            <button className="blog-button" onClick={() => setActivePost(null)}>Назад до блогу</button>
                        </div>
                    </div>
                )}
            </div>
            <Record />
        </section>
    );
}

export default Blog;

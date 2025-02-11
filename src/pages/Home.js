import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

function Home() {
    return (
        <div className="home-container">
            <Navbar />
            <div className="home-content">
                <h2>Welcome to The Gaming Lab</h2>
                <p>
                    Dive into the ultimate gaming network experience! 🎮 Connect with fellow gamers, 
                    share your passion, and explore the hottest games. Discover your next adventure 
                    with curated game catalogs and discussions fueled by the gaming community.  
                </p>
            </div>
        </div>
    );
}

export default Home;

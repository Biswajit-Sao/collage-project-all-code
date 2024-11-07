import React from 'react';
import './Banner.css';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="banner">
      <div className="banner-content">
        <h1>Book Appointment With Trusted Doctors</h1>
        <p className="banner-description">
          Experience quality healthcare with our network of trusted doctors. Your health is our priority.
        </p>
        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0); }}
          className="banner-button"
        >
          Create Account
        </button>
      </div>
      <div className="banner-image">
        <img src={assets.tham} alt="Doctor consultation" />
      </div>
    </section>
  );
};

export default Banner;

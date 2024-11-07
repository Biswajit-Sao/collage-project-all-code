import React, { useContext, useState } from 'react';
import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FcBusinessman } from "react-icons/fc";
import { FaChevronDown, FaBars } from "react-icons/fa";
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate('/')}>logo</div>
            <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                <FaBars />
            </div>
            <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <NavLink className="link" to="/"><li>Home</li></NavLink>
                <NavLink className="link" to="/doctors"><li>All Doctors</li></NavLink>
                <NavLink className="link" to="/about"><li>About</li></NavLink>
                <NavLink className="link" to="/contact"><li>Contact</li></NavLink>
            </ul>
            {token ? (
                <div className="user-menu">
                    <FcBusinessman onClick={() => setShowMenu(!showMenu)} className="icon" />
                    <FaChevronDown onClick={() => setShowMenu(!showMenu)} className="icon" />
                    {showMenu && (
                        <div className="dropdown-menu">
                            <p onClick={() => navigate("/my-profile")}>My Profile</p>
                            <p onClick={() => navigate("/my-appointments")}>My Appointments</p>
                            <p onClick={handleLogout}>Logout</p>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={() => navigate('/login')} className="navbar-button">Create Account</button>
            )}
        </nav>
    );
};

export default Navbar;

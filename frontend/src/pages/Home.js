import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', color: 'white' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>MediBook Pro</h1>
                <div>
                    <Link to="/login" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Login</Link>
                    <Link to="/register" style={{ background: 'white', color: '#667eea', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>Register</Link>
                </div>
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Book Doctor Appointments Online
                </h1>
                <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px' }}>
                    Find the best doctors, book appointments instantly, and manage your healthcare journey with ease.
                </p>
                <div>
                    <Link to="/register" style={{ background: 'white', color: '#667eea', padding: '15px 40px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', marginRight: '20px' }}>
                        Get Started
                    </Link>
                    <Link to="/login" style={{ border: '2px solid white', color: 'white', padding: '15px 40px', borderRadius: '30px', fontSize: '18px', textDecoration: 'none' }}>
                        Login
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '50px', marginTop: '80px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: 'bold' }}>500+</h2>
                        <p>Doctors</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: 'bold' }}>10,000+</h2>
                        <p>Patients</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: 'bold' }}>25,000+</h2>
                        <p>Appointments</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
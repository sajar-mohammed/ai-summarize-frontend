import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Shield, Zap, ArrowLeft, Sparkles, LayoutDashboard, CreditCard
} from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

const Profile = () => {
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            fetchStatus();
        }
    }, [currentUser]);

    const fetchStatus = async () => {
        try {
            const resp = await axios.post(`${API_BASE}/user/status`, {
                userId: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName
            });
            setUserStatus(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="profile-wrapper-v7">
            {/* Top Navigation */}
            <div className="profile-top-bar">
                <button onClick={() => navigate('/app')} className="back-workspace-btn">
                    <LayoutDashboard size={18} />
                    <span>Back to Workspace</span>
                </button>
                <div className="brand-logo">
                    <Sparkles size={18} className="sparkle-icon" />
                    <span>Summarizer Pro</span>
                </div>
            </div>

            <main className="profile-main-v7">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="profile-center-card"
                >
                    {/* Header with Name/Email */}
                    <div className="profile-header-v7">
                        <div className="avatar-outer">
                            <img src={currentUser.photoURL} alt="Avatar" className="avatar-img" />
                        </div>
                        <div className="user-info-v7">
                            <h1>{currentUser.displayName}</h1>
                            <div className="email-row">
                                <Mail size={14} />
                                <span>{currentUser.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Essential Stats Section */}
                    <div className="stats-section-v7">
                        <div className="stat-card-v7">
                            <div className="stat-icon-box blue">
                                <CreditCard size={20} />
                            </div>
                            <div className="stat-details">
                                <span className="stat-label">Credits Remaining</span>
                                <span className="stat-value">{userStatus?.credits || 0} Credits</span>
                            </div>
                        </div>

                        <div className="stat-card-v7">
                            <div className="stat-icon-box purple">
                                <Shield size={20} />
                            </div>
                            <div className="stat-details">
                                <span className="stat-label">Current Plan</span>
                                <span className="stat-value">{userStatus?.plan === 'free' ? 'Starter Plan' : 'Pro Plan'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="profile-cta-v7">
                        <button
                            onClick={() => navigate('/plans')}
                            className="upgrade-btn-v7"
                        >
                            <Zap size={18} />
                            <span>{userStatus?.plan === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'}</span>
                        </button>
                    </div>

                    <div className="profile-footer-v7">
                        <p>Secured by Google Authentication</p>
                    </div>
                </motion.div>
            </main>

            <style>{`
                .profile-wrapper-v7 {
                    min-height: 100vh;
                    background: #09090b;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                }

                .profile-top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 5%;
                }

                .back-workspace-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #e4e4e7;
                    padding: 0.6rem 1.2rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .back-workspace-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateX(-4px);
                }

                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-weight: 700;
                    color: #818cf8;
                }

                .profile-main-v7 {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .profile-center-card {
                    width: 100%;
                    max-width: 500px;
                    background: #18181b;
                    border: 1px solid #27272a;
                    border-radius: 32px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .profile-header-v7 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .avatar-outer {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    padding: 4px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    margin-bottom: 1.5rem;
                }

                .avatar-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 4px solid #18181b;
                    object-fit: cover;
                }

                .user-info-v7 h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.4rem;
                }

                .email-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #71717a;
                    font-size: 0.95rem;
                }

                .stats-section-v7 {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }

                .stat-card-v7 {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 1.25rem;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .stat-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon-box.blue {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                }

                .stat-icon-box.purple {
                    background: rgba(139, 92, 246, 0.1);
                    color: #8b5cf6;
                }

                .stat-details {
                    display: flex;
                    flex-direction: column;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #71717a;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                .stat-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                }

                .upgrade-btn-v7 {
                    width: 100%;
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                    color: white;
                    border: none;
                    padding: 1.1rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .upgrade-btn-v7:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px -5px rgba(99, 102, 241, 0.4);
                    opacity: 0.95;
                }

                .profile-footer-v7 {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.8rem;
                    color: #3f3f46;
                }

                @media (max-width: 480px) {
                    .profile-center-card {
                        padding: 2rem 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;

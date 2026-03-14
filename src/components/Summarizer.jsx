import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, History, Sparkles, CheckCircle2, Clock, Zap, FileText, ArrowRight, LogOut, User } from 'lucide-react';
import { auth, logOut } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/userService';
import { summaryService } from '../api/summaryService';

const Summarizer = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [credits, setCredits] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            if (user) {
                fetchUserStatus(user);
            }
        });
        return unsubscribe;
    }, []);

    const fetchUserStatus = async (user) => {
        try {
            const data = await userService.getStatus({
                userId: user.uid,
                email: user.email,
                displayName: user.displayName
            });
            setCredits(data.credits);
        } catch (err) {
            console.error('Failed to fetch user status', err);
        }
    };


    useEffect(() => {
        if (currentUser) {
            fetchHistory();
        }
    }, [currentUser]);

    const fetchHistory = async () => {
        if (!currentUser?.uid) return;
        try {
            const data = await summaryService.getHistory(currentUser.uid);
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };


    const handleSummarize = async () => {
        if (!content.trim() || !currentUser?.uid) {
            console.error('Summarize blocked: Content or User ID missing', { contentLen: content.length, uid: currentUser?.uid });
            return;
        }
        console.log('Generating summary for User:', currentUser.uid);
        setLoading(true);
        setResult(null);
        try {
            const data = await summaryService.generateSummary({
                content: content,
                title: content.substring(0, 30) + '...',
                userId: currentUser.uid
            });
            console.log('Backend response received:', data);
            setResult(data);
            setCredits(prev => prev - 1); // Decrement locally
            fetchHistory();

            setTimeout(() => {
                document.getElementById('result-target')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            // Error is handled globally in apiClient, but we can still alert here if needed
            // or use the error message from the thrown error
            const errMsg = err.response?.data?.error || err.message;
            alert(`Error: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };



    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setContent(event.target.result);
            reader.readAsText(file);
        }
    };

    const handleLogout = async () => {
        await logOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen">
            <div className="bg-glow">
                <div className="glow-blob blob-1"></div>
                <div className="glow-blob blob-2"></div>
                <div className="glow-blob blob-3"></div>
            </div>

            <nav className="app-nav">
                <div className="logo-small"><Sparkles size={18} /> Summarizer Pro</div>
                <div className="nav-center-actions">
                    <button className="nav-btn-text" onClick={() => navigate('/plans')}>
                        <Zap size={14} />
                        Upgrade Plan
                    </button>
                </div>
                <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <div className={`credit-badge ${credits === 0 ? 'empty' : ''}`} onClick={(e) => { e.stopPropagation(); navigate('/plans'); }}>
                        <Zap size={14} />
                        <span>{credits} Credits Left</span>
                    </div>
                    {currentUser?.photoURL && <img src={currentUser.photoURL} alt="Profile" className="profile-pic" />}
                    <span className="user-name">{currentUser?.displayName || 'User'}</span>
                    <button className="logout-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <div className="container" style={{ paddingTop: '2rem' }}>
                <section className="hero-mini">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-content">
                        <div className="badge">Workspace Active</div>
                        <h1>What are we <br />distilling today?</h1>
                    </motion.div>
                </section>

                <main>
                    <motion.div id="input-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} color="var(--primary)" />
                                <h2 style={{ fontSize: '1.25rem' }}>Input Content</h2>
                            </div>
                            <label className="file-upload-label">
                                <Upload size={16} />
                                <span>Upload File</span>
                                <input type="file" accept=".txt,.md" onChange={handleFileUpload} />
                            </label>
                        </div>

                        <div className="input-group">
                            <textarea
                                placeholder={credits > 0 ? "Paste your content here or upload a file..." : "You have run out of daily credits."}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={credits <= 0}
                            />
                            {credits <= 0 && (
                                <div className="quota-overlay" onClick={() => navigate('/plans')}>
                                    <div className="quota-msg">
                                        <Zap size={32} className="mb-4" style={{ color: '#fbbf24' }} />
                                        <h3>Daily Limit Reached</h3>
                                        <p>Your current plan has a 20-summary daily limit.</p>
                                        <button className="premium-view-btn">
                                            View Unlimited Plans <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className={`button-primary ${credits <= 0 ? 'disabled-credits' : ''}`}
                            onClick={handleSummarize}
                            disabled={loading || !content.trim() || credits <= 0}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading ? <div className="loader" /> : <Sparkles size={18} />}
                            {loading ? 'Processing...' : credits > 0 ? 'Generate AI Summary' : 'Daily Limit Reached'}
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {result && (
                            <motion.div id="result-target" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="result-section">
                                <div className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                                        <CheckCircle2 size={24} />
                                        <h2 style={{ fontSize: '1.5rem' }}>Summary Result</h2>
                                    </div>
                                    <div className="summary-content">
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{result.summary}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="history-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <History size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.8rem' }}>Recent Summaries</h2>
                        </div>

                        <div className="history-grid">
                            {history.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No history yet. Start summarizing!</p>
                            ) : (
                                history.slice(0, 6).map((item, index) => (
                                    <motion.div
                                        key={item._id || item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="history-item"
                                        onClick={() => {
                                            setResult(item);
                                            setContent(item.content);
                                            document.getElementById('input-card')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            <Clock size={12} />
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.summary}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>

            <style>{`
                .app-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 5%;
                    background: rgba(3, 7, 18, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .logo-small {
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #818cf8;
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .credit-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 0.4rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .credit-badge.empty {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.2);
                }
                .button-primary.disabled-credits {
                    background: #374151;
                    color: #9ca3af;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .user-profile:hover {
                    opacity: 0.8;
                }
                .quota-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(3, 7, 18, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.75rem;
                    z-index: 10;
                    cursor: pointer;
                    border: 1px dashed var(--primary);
                    transition: background 0.2s;
                }
                .quota-overlay:hover {
                    background: rgba(3, 7, 18, 0.9);
                }
                .quota-msg {
                    text-align: center;
                    padding: 2rem;
                }
                .quota-msg h3 {
                    color: white;
                    margin-bottom: 0.5rem;
                }
                .quota-msg p {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .nav-center-actions {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                }
                .nav-btn-text {
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    color: #818cf8;
                    padding: 0.5rem 1.25rem;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nav-btn-text:hover {
                    background: rgba(99, 102, 241, 0.2);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                .premium-view-btn {
                    background: #fff;
                    color: #000;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 1.5rem auto 0;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.2);
                }
                .premium-view-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px -5px rgba(255, 255, 255, 0.3);
                    opacity: 0.9;
                }
                .profile-pic {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid var(--primary);
                }
                .user-name {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .logout-btn {
                    background: transparent;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: background 0.2s;
                }
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                .hero-mini {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .hero-mini h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(to right, #fff, var(--primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default Summarizer;

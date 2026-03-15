import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, History, Sparkles, CheckCircle2, Clock, Zap, FileText, ArrowRight, LogOut, User, Link as LinkIcon, Download, Trash2 } from 'lucide-react';
import { jsPDF } from "jspdf";
import { auth, logOut } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/userService';
import { summaryService } from '../api/summaryService';

const Summarizer = () => {
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [inputType, setInputType] = useState('text'); // 'text' or 'url'
    const [tone, setTone] = useState('concise');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [credits, setCredits] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState(null); // { title, message, onConfirm }
    const navigate = useNavigate();

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

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
        const isInputEmpty = inputType === 'text' ? !content.trim() : !url.trim();
        if (isInputEmpty || !currentUser?.uid) {
            console.error('Summarize blocked: Input or User ID missing', { 
                type: inputType, 
                contentLen: content.length, 
                urlLen: url.length, 
                uid: currentUser?.uid 
            });
            return;
        }
        console.log('Generating summary for User:', currentUser.uid);
        setLoading(true);
        setResult(null);
        try {
            const data = await summaryService.generateSummary({
                content: inputType === 'text' ? content : '',
                url: inputType === 'url' ? url : '',
                tone: tone,
                title: inputType === 'url' ? '' : (content.substring(0, 30) + '...'),
                userId: currentUser.uid
            });
            console.log('Backend response received:', data);
            setResult(data);
            addToast('Summary generated successfully!');
            setCredits(prev => prev - 1); // Decrement locally
            fetchHistory();

            setTimeout(() => {
                document.getElementById('result-target')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message;
            addToast(`Error: ${errMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };



    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputType('text');
            const reader = new FileReader();
            reader.onload = (event) => setContent(event.target.result);
            reader.readAsText(file);
        }
    };

    const handleDownloadPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        
        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241); // Primary color
        doc.text("AI Summary Result", 20, 20);
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Source: ${result.title}`, 20, 35);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date(result.timestamp).toLocaleString()}`, 20, 45);
        
        // Add Summary Content
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        const splitText = doc.splitTextToSize(result.summary, 170);
        doc.text(splitText, 20, 60);
        
        doc.save(`${result.title.substring(0, 20)}.pdf`);
        addToast('PDF exported successfully!');
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setModal({
            title: 'Delete Summary',
            message: 'Are you sure you want to permanently delete this summary from your history?',
            onConfirm: async () => {
                try {
                    await summaryService.deleteSummary(id);
                    addToast('Summary deleted successfully');
                    fetchHistory();
                    if (result?._id === id || result?.id === id) {
                        setResult(null);
                    }
                } catch (err) {
                    addToast('Failed to delete summary', 'error');
                }
                setModal(null);
            }
        });
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
                        <span>{credits === null ? 'Loading...' : `${credits} Credits Left`}</span>
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
                            <div className="input-type-toggle">
                                <button className={`toggle-btn ${inputType === 'text' ? 'active' : ''}`} onClick={() => setInputType('text')}>
                                    <FileText size={16} /> Text
                                </button>
                                <button className={`toggle-btn ${inputType === 'url' ? 'active' : ''}`} onClick={() => setInputType('url')}>
                                    <LinkIcon size={16} /> URL
                                </button>
                            </div>
                            {inputType === 'text' && (
                                <label className="file-upload-label">
                                    <Upload size={16} />
                                    <span>Upload File</span>
                                    <input type="file" accept=".txt,.md" onChange={handleFileUpload} />
                                </label>
                            )}
                        </div>

                        <div className="input-group">
                            {inputType === 'text' ? (
                                <textarea
                                    placeholder={credits > 0 ? "Paste your content here or upload a file..." : "You have run out of daily credits."}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={credits <= 0}
                                />
                            ) : (
                                <div className="url-input-wrapper">
                                    <input 
                                        type="url"
                                        placeholder="https://example.com/article"
                                        className="url-input-field"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={credits <= 0}
                                    />
                                </div>
                            )}
                            
                            <div className="tone-selector">
                                <span>Output Style:</span>
                                {['short', 'detailed', 'professional', 'bullet'].map((t) => (
                                    <button 
                                        key={t}
                                        className={`tone-btn ${tone === t ? 'active' : ''}`}
                                        onClick={() => setTone(t)}
                                    >
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
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
                            className={`button-primary ${credits <= 0 && credits !== null ? 'disabled-credits' : ''}`}
                            onClick={handleSummarize}
                            disabled={loading || (inputType === 'text' ? !content.trim() : !url.trim()) || (credits <= 0 && credits !== null)}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading ? <div className="loader" /> : <Sparkles size={18} />}
                            {loading ? 'Processing...' : (credits > 0 || credits === null) ? 'Generate AI Summary' : 'Daily Limit Reached'}
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {result && (
                            <motion.div id="result-target" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="result-section">
                                <div className="card">
                                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                                            <CheckCircle2 size={24} />
                                            <h2 style={{ fontSize: '1.5rem' }}>Summary Result</h2>
                                        </div>
                                        <button className="download-btn" onClick={handleDownloadPDF}>
                                            <Download size={18} /> Export PDF
                                        </button>
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                <Clock size={12} />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                            <button className="delete-btn" onClick={(e) => handleDelete(e, item._id || item.id)}>
                                                <Trash2 size={14} />
                                            </button>
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

            {/* Premium Toast System */}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            className={`toast ${toast.type}`}
                        >
                            {toast.type === 'error' ? <Zap size={16} /> : <CheckCircle2 size={16} />}
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Premium Modal System */}
            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay" onClick={() => setModal(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="modal-card"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>{modal.title}</h3>
                            <p>{modal.message}</p>
                            <div className="modal-actions">
                                <button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
                                <button className="modal-btn-confirm" onClick={modal.onConfirm}>Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                .input-type-toggle {
                    display: flex;
                    background: rgba(255,255,255,0.05);
                    padding: 0.25rem;
                    border-radius: 0.75rem;
                    gap: 0.25rem;
                }
                .toggle-btn {
                    padding: 0.5rem 1.25rem;
                    border-radius: 0.5rem;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .toggle-btn.active {
                    background: var(--primary);
                    color: white;
                }
                .url-input-wrapper {
                    margin-bottom: 1.5rem;
                }
                .url-input-field {
                    width: 100%;
                    padding: 1.25rem;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid var(--glass-border);
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 1rem;
                }
                .url-input-field:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .tone-selector {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }
                .tone-selector span {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .tone-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                .tone-btn.active {
                    background: var(--accent);
                    border-color: var(--accent);
                }
                .download-btn {
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    color: #818cf8;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .download-btn:hover {
                    background: rgba(99, 102, 241, 0.2);
                    transform: translateY(-1px);
                }
                .delete-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    transition: all 0.2s;
                    opacity: 0;
                }
                .history-item:hover .delete-btn {
                    opacity: 1;
                }
                .delete-btn:hover {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }

                /* Toast Styles */
                .toast-container {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    z-index: 1000;
                }
                .toast {
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    background: #1e293b;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .toast.success { border-left: 4px solid #10b981; }
                .toast.error { border-left: 4px solid #ef4444; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 1rem;
                }
                .modal-card {
                    background: #0f172a;
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 2.5rem;
                    border-radius: 20px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }
                .modal-card h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: white;
                }
                .modal-card p {
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .modal-actions {
                    display: flex;
                    gap: 1rem;
                }
                .modal-actions button {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modal-btn-cancel {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                }
                .modal-btn-confirm {
                    background: #ef4444;
                    border: none;
                    color: white;
                }
                .modal-btn-confirm:hover { transform: translateY(-2px); filter: brightness(1.2); }
                .modal-btn-cancel:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default Summarizer;

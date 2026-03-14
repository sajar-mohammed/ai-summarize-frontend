import React from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, ArrowRight, BarChart3, Globe } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/app');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Check your Firebase config!");
        }
    };

    return (
        <div className="landing-container">
            {/* Nav */}
            <nav className="landing-nav">
                <div className="logo">
                    <Sparkles className="logo-icon" /> AI Summarizer Pro
                </div>
                <button className="button-primary-sm" onClick={handleLogin}>Log In</button>
            </nav>

            {/* Hero */}
            <header className="landing-hero">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="badge">New: Gemini 2.0 Flash Integration</div>
                    <h1>Unlock Instant Insights <br /> from Your Documents</h1>
                    <p>The world's most elegant summarization tool. Turn hours of reading into minutes of understanding with professional-grade AI.</p>

                    <div className="hero-actions">
                        <button className="button-hero" onClick={handleLogin}>
                            Get Started Free <ArrowRight size={20} />
                        </button>
                        <div className="social-proof">
                            Join 1,000+ early adopters
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="landing-glow"></div>
            </header>

            {/* Features */}
            <section className="features-grid">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="feature-card"
                >
                    <div className="feature-icon-box"><Zap /></div>
                    <h3>Blazing Fast</h3>
                    <p>Powered by Gemini Flash for near-instant results even on long documents.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="feature-card"
                >
                    <div className="feature-icon-box"><Globe /></div>
                    <h3>Multi-Format</h3>
                    <p>Upload text files, markdown, and soon PDF support for standard workflows.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="feature-card"
                >
                    <div className="feature-icon-box"><Shield /></div>
                    <h3>Private & Secure</h3>
                    <p>Your data is stored in your private cloud history. We never sell your data.</p>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="landing-cta">
                <h2>Ready to save time?</h2>
                <button className="button-primary" onClick={handleLogin}>
                    Start Summarizing for Free
                </button>
            </section>

            <footer className="landing-footer">
                &copy; 2026 AI Summarizer Pro. Powered by Google Gemini.
            </footer>

            <style>{`
                .landing-container {
                    background: #030712;
                    color: white;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                .landing-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem 5%;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: linear-gradient(to right, #6366f1, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .logo-icon { color: #8b5cf6; }

                .button-primary-sm {
                    background: rgba(99, 102, 241, 0.1);
                    color: #818cf8;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    padding: 0.5rem 1.25rem;
                    border-radius: 0.6rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .button-primary-sm:hover {
                    background: rgba(99, 102, 241, 0.2);
                    color: white;
                    border-color: rgba(99, 102, 241, 0.5);
                }

                .landing-hero {
                    padding: 8rem 5% 6rem;
                    text-align: center;
                    position: relative;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .badge {
                    display: inline-block;
                    padding: 0.5rem 1.25rem;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 9999px;
                    color: #818cf8;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 2rem;
                }
                .landing-hero h1 {
                    font-size: 4.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    letter-spacing: -0.05em;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.7));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .landing-hero p {
                    font-size: 1.25rem;
                    color: #9ca3af;
                    margin-bottom: 3rem;
                    line-height: 1.6;
                }
                .hero-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                .button-hero {
                    background: #6366f1;
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    font-size: 1.125rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                }
                .button-hero:hover { transform: translateY(-2px); background: #4f46e5; }
                
                .social-proof { color: #6b7280; font-size: 0.875rem; }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 4rem 5%;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .feature-card {
                    background: rgba(17, 24, 39, 0.5);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    transition: border-color 0.3s;
                }
                .feature-card:hover { border-color: rgba(99, 102, 241, 0.3); }
                .feature-icon-box {
                    width: 3rem;
                    height: 3rem;
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    color: #818cf8;
                }
                .feature-card h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
                .feature-card p { color: #9ca3af; line-height: 1.6; }

                .landing-cta {
                    padding: 8rem 5%;
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .landing-cta h2 { font-size: 2.5rem; margin-bottom: 2rem; font-weight: 700; }

                .landing-footer {
                    padding: 3rem 5%;
                    text-align: center;
                    color: #4b5563;
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .landing-hero h1 { font-size: 3rem; }
                    .landing-hero { padding: 4rem 5% 3rem; }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

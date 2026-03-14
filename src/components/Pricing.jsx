import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free',
            price: '$0,00',
            subtext: 'Great for trying out Summarizer and for tiny tasks',
            features: [
                'Account Aggregation',
                'Basic Summaries',
                'History Tracking',
                'Basic Security'
            ],
            cta: 'Start for Free',
            current: true,
        },
        {
            name: 'Professional',
            price: '$98,00',
            subtext: 'Best for growing startups and high-volume users',
            features: [
                'Everything in Free',
                'Unlimited Summaries',
                'PDF Support',
                'Customizable Dashboards',
                'Enhanced Security'
            ],
            cta: 'Sign Up with Professional',
            highlight: true,
            badge: 'Most Popular'
        },
        {
            name: 'Enterprise',
            price: '$160,00',
            subtext: 'Best for large companies and teams requiring high security',
            features: [
                'Everything in Pro',
                'Priority Support',
                'Advanced Security',
                'Custom AI Training',
                'API Integration'
            ],
            cta: 'Sign Up with Enterprise',
        }
    ];

    return (
        <div className="pricing-page-v2">
            <div className="bg-glow">
                <div className="glow-blob blob-1"></div>
                <div className="glow-blob blob-2"></div>
                <div className="glow-blob blob-3"></div>
            </div>

            <nav className="pricing-nav">
                <div className="nav-left">
                    <button onClick={() => navigate('/app')} className="back-btn-pill">
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                        <span>Back to Workspace</span>
                    </button>
                    <div className="logo-small"><Sparkles size={18} /> Summarizer Pro</div>
                </div>
            </nav>

            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', paddingTop: '4rem' }}>
                <header className="pricing-header">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="badge"
                        style={{ marginBottom: '1.5rem' }}
                    >
                        Pricing Plans
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Choose your power level
                    </motion.h1>
                    <p>Start summarizing and distilling your information more efficiently</p>
                </header>

                <div className="pricing-grid">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`pricing-card-v2 ${plan.highlight ? 'highlight' : ''}`}
                        >
                            {plan.badge && (
                                <div className="popular-badge">{plan.badge}</div>
                            )}

                            <div className="plan-info">
                                <span className="plan-name">{plan.name}</span>
                                <div className="plan-price">
                                    <span className="amount">{plan.price}</span>
                                    <span className="period">/month</span>
                                </div>
                                <p className="plan-subtext">{plan.subtext}</p>
                            </div>

                            <button className={`plan-cta-v2 ${plan.highlight ? 'cta-gradient' : ''}`}>
                                {plan.cta}
                            </button>

                            <div className="features-divider">
                                <span>FEATURES</span>
                            </div>

                            <ul className="features-list">
                                {plan.features.map(feature => (
                                    <li key={feature}>
                                        <div className="check-bullet">
                                            <Check size={12} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                .pricing-page-v2 {
                    min-height: 100vh;
                    background: #030712;
                    color: #fff;
                    padding-bottom: 80px;
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Inter', sans-serif;
                }
                .pricing-nav {
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
                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .back-btn-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.4rem 1rem;
                    border-radius: 9999px;
                    color: #9ca3af;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-btn-pill:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    transform: translateX(-3px);
                }
                .logo-small {
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #818cf8;
                }
                .pricing-header {
                    text-align: center;
                    margin-bottom: 60px;
                }
                .pricing-header h1 {
                    font-size: 3.5rem;
                    font-weight: 800;
                    margin-bottom: 15px;
                    background: linear-gradient(to right, #fff, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .pricing-header p {
                    color: #9ca3af;
                    font-size: 1.1rem;
                }
                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .pricing-card-v2 {
                    background: rgba(17, 24, 39, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    backdrop-filter: blur(12px);
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .pricing-card-v2:hover {
                    transform: translateY(-5px);
                    border-color: rgba(99, 102, 241, 0.3);
                }
                .pricing-card-v2.highlight {
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    box-shadow: 0 0 40px rgba(99, 102, 241, 0.1);
                }
                .popular-badge {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    color: #818cf8;
                    font-weight: 600;
                }
                .plan-info {
                    margin-bottom: 30px;
                }
                .plan-name {
                    color: #9ca3af;
                    font-size: 1.1rem;
                    display: block;
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                .plan-price {
                    margin-bottom: 20px;
                    display: flex;
                    align-items: baseline;
                }
                .plan-price .amount {
                    font-size: 3rem;
                    font-weight: 800;
                }
                .plan-price .period {
                    color: #6b7280;
                    font-size: 1rem;
                }
                .plan-subtext {
                    color: #9ca3af;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .plan-cta-v2 {
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    margin-bottom: 40px;
                }
                .plan-cta-v2:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.02);
                }
                .cta-gradient {
                    background: linear-gradient(to right, #6366f1, #a855f7) !important;
                    border: none !important;
                    color: #fff !important;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                }
                .cta-gradient:hover {
                    opacity: 0.9;
                }
                .features-divider {
                    display: flex;
                    align-items: center;
                    margin-bottom: 30px;
                    position: relative;
                }
                .features-divider::before, .features-divider::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.05);
                }
                .features-divider span {
                    padding: 0 15px;
                    font-size: 0.7rem;
                    letter-spacing: 2px;
                    color: #4b5563;
                    font-weight: 700;
                }
                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .features-list li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #d1d5db;
                }
                .check-bullet {
                    color: #fff;
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    );
};



export default Pricing;

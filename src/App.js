import React, { useState, useEffect } from 'react';
import { Play, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';

const AxigonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('company');
  const [activeTab, setActiveTab] = useState('consulting');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [scrollToOfferings, setScrollToOfferings] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', company: '', useCase: '' });
  const [legalMessages, setLegalMessages] = useState([]);
  const [legalInput, setLegalInput] = useState('');
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalConversations, setLegalConversations] = useState([]);
  const [legalConversationId, setLegalConversationId] = useState(null);
  const [signupStep, setSignupStep] = useState('form'); // 'form' | 'account-type'
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [personalToastIndex, setPersonalToastIndex] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', phone: '', dateOfBirth: '', city: '', occupation: '', annualIncome: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setIsLoggedIn(true);
        }
        // Note: no auto-redirect here — user stays on current page on reload
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollToOfferings && currentPage === 'company') {
      const timer = setTimeout(() => {
        const el = document.getElementById('offerings-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setScrollToOfferings(false);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [scrollToOfferings, currentPage]);

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230A2540"/><text x="50" y="75" font-family="Arial" font-size="70" font-weight="bold" fill="%23635BFF" text-anchor="middle">A</text></svg>';
    document.head.appendChild(link);
    document.title = 'Axigon AI - Enterprise AI Solutions';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      setIsLoggedIn(true);
      setLoginData({ email: '', password: '' });
      setCurrentPage(data.user.accountType === 'personal' ? 'personal-dashboard' : 'dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!signupData.name || !signupData.email || !signupData.company || !signupData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Show account type step before submitting
    setSignupStep('account-type');
  };

  const handleSignupSubmit = async () => {
    if (!selectedAccountType) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...signupData, accountType: selectedAccountType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSignupData({ name: '', email: '', company: '', password: '' });
      setSignupStep('form');
      setSelectedAccountType(null);
      setCurrentPage('login');

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      setSignupStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('company');
  };

  const handleCompanyNav = () => {
    if (currentPage === 'company') {
      const el = document.getElementById('offerings-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setCurrentPage('company');
      setScrollToOfferings(true);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      setUser(prev => ({ ...prev, name: data.user.name }));
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    console.log('Demo request submitted:', demoForm);
    setDemoForm({ name: '', email: '', phone: '', company: '', useCase: '' });
    setShowDemoModal(false);
  };

  const fetchLegalConversations = async () => {
    try {
      const res = await fetch('/api/legal/conversations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLegalConversations(data.conversations || []);
      }
    } catch {}
  };

  useEffect(() => {
    if (currentPage === 'legal-gpt') fetchLegalConversations();
  }, [currentPage]);

  const handleLegalSend = async (e) => {
    e.preventDefault();
    const msg = legalInput.trim();
    if (!msg || legalLoading) return;

    setLegalMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLegalInput('');
    setLegalLoading(true);

    try {
      const res = await fetch('/api/legal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: msg, conversationId: legalConversationId }),
      });
      const data = await res.json();
      const reply = data.response || data.error || 'No response received.';
      if (data.conversationId) setLegalConversationId(data.conversationId);
      setLegalMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      fetchLegalConversations();
    } catch {
      setLegalMessages(prev => [...prev, { role: 'assistant', text: 'Error reaching the server. Please try again.' }]);
    } finally {
      setLegalLoading(false);
    }
  };

  const solutions = {
    consulting: { title: 'Strategy for AI', desc: 'Deploy AI that delivers measurable business outcomes', points: ['Identify high-impact use cases', 'Build implementation roadmaps', 'Navigate organizational change'] },
    audit: { title: 'System Audit', desc: 'Verify security, compliance, and performance', points: ['Risk assessment', 'Compliance validation', 'Performance optimization'] },
    implementation: { title: 'Implementation Services', desc: 'Deploy specialized AI agents', points: ['Seamless integration', 'Zero-downtime deployment', 'Knowledge transfer'] },
    managed: { title: 'Managed AI', desc: 'Continuous optimization', points: ['24/7 monitoring', 'Model refinement', 'Technical support'] }
  };

  const team = [
    { name: 'Shalini', role: 'Chief Executive Officer' }
  ];

  const agents = [
    { name: 'Legal GPT', domain: 'Legal Analysis', desc: 'AI legal assistant for Indian businesses — contracts, GST, compliance, and more', page: 'legal-gpt' },
    { name: 'ContractAI', domain: 'Contract Review', desc: 'Extract obligations, risks, and key terms from complex legal documents' },
    { name: 'FinanceGPT', domain: 'Financial Forecasting', desc: 'Generate revenue projections and scenario analysis from historical data' },
    { name: 'ComplianceWatch', domain: 'Regulatory Compliance', desc: 'Monitor regulatory changes and flag compliance gaps' },
    { name: 'DataGuard', domain: 'Data Quality', desc: 'Detect anomalies, validate schemas, and ensure data integrity' },
    { name: 'CustomerInsight', domain: 'Customer Intelligence', desc: 'Analyze customer behavior patterns and predict churn' },
  ];

  const partners = ['RippleSoft', 'TradeSoft', 'PeopleTech'];

  // ─── Shared style helpers ────────────────────────────────────────────────────
  const btnPrimary = {
    background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '9px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 24px rgba(139,92,246,0.35)',
  };
  const btnPrimaryHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.6)';
  };
  const btnPrimaryLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.35)';
  };

  const btnGhost = {
    background: 'rgba(255,255,255,0.05)',
    color: '#F1F5F9',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '9px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
  const btnGhostHover = (e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const btnGhostLeave = (e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const darkCard = {
    backgroundColor: '#0F1A2E',
    border: '1px solid #1E2D45',
    borderRadius: '14px',
    transition: 'all 0.22s ease',
  };
  const darkCardHover = (e) => {
    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)';
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.2)';
  };
  const darkCardLeave = (e) => {
    e.currentTarget.style.borderColor = '#1E2D45';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const lightCard = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'all 0.22s ease',
  };
  const lightCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
  };
  const lightCardLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
    e.currentTarget.style.borderColor = '#E2E8F0';
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #1E2D45',
    backgroundColor: '#131E30',
    color: '#F1F5F9',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const gradientText = {
    background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const sectionLabel = (color = '#8B5CF6') => ({
    color,
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  });

  const Checkmark = () => (
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#06080F' }}>

      {/* ── NAV ── */}
      <nav className="fixed w-full z-50" style={{
        backgroundColor: scrolled ? 'rgba(6,8,15,0.88)' : 'rgba(6,8,15,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #1E2D45' : '1px solid transparent',
        transition: 'all 0.35s ease',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => { setCurrentPage('company'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
            Axigon<span style={gradientText}>AI</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLoggedIn ? (
              <>
                {user?.accountType === 'personal' && currentPage !== 'dashboard' && (
                  <button onClick={() => setCurrentPage('dashboard')}
                    style={{ ...btnGhost, padding: '9px 18px', fontSize: '14px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>
                    Switch to Business →
                  </button>
                )}
                <span style={{ color: '#94A3B8', fontSize: '14px', marginRight: '4px' }}>Hi, {user.name}!</span>
                <button
                  onClick={() => {
                    setProfileData({ name: user.name || '', phone: user.phone || '', dateOfBirth: user.dateOfBirth || '', city: user.city || '', occupation: user.occupation || '', annualIncome: user.annualIncome || '' });
                    setProfileError('');
                    setProfileSuccess(false);
                    setCurrentPage('profile');
                  }}
                  style={{ ...btnGhost, padding: '9px 18px', fontSize: '14px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>
                  Profile
                </button>
                <button onClick={handleLogout} style={{ ...btnPrimary, padding: '9px 20px', fontSize: '14px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowDemoModal(true)} style={{ ...btnPrimary, padding: '9px 20px', fontSize: '14px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>
                  Request Demo
                </button>
                <button style={{ ...btnGhost, padding: '9px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>
                  <Play size={13} /> Watch Video
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          COMPANY PAGE
      ════════════════════════════════════════════ */}
      {currentPage === 'company' && (
        <>
          {/* Hero */}
          <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#06080F' }}>
            {/* Purple glow */}
            <div style={{ position: 'absolute', width: '900px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.16) 0%, transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            {/* Cyan glow bottom-right */}
            <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)', bottom: '5%', right: '5%', pointerEvents: 'none' }} />
            {/* Grid texture */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '900px', margin: '0 auto' }}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.28)', padding: '6px 16px', borderRadius: '999px', marginBottom: '36px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6' }} />
                <span style={{ color: '#A78BFA', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Enterprise AI Platform</span>
              </div>

              <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '24px', background: 'linear-gradient(to bottom, #FFFFFF 20%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Specialized AI agents<br />built for real-world impact
              </h1>
              <p style={{ fontSize: '19px', color: '#94A3B8', maxWidth: '560px', margin: '0 auto 44px', lineHeight: 1.7 }}>
                Masters of one domain, not generalist AI. Purpose-built agents that solve specific enterprise challenges.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleCompanyNav} style={{ ...btnPrimary, padding: '14px 32px', fontSize: '15px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>
                  Company
                </button>
                <button onClick={() => setCurrentPage('marketplace')} style={{ ...btnGhost, padding: '14px 32px', fontSize: '15px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>
                  Marketplace
                </button>
              </div>
            </div>
          </section>

          {/* Trusted by */}
          <div style={{ backgroundColor: '#080C16', borderTop: '1px solid #1E2D45', borderBottom: '1px solid #1E2D45', padding: '36px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <p style={{ textAlign: 'center', marginBottom: '24px', ...sectionLabel('#4B6279') }}>Trusted by Enterprise Leaders</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}>
                {partners.map((p, i) => (
                  <span key={i} style={{ color: '#2D3F55', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em', transition: 'color 0.2s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#2D3F55'}
                  >{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Why Axigon */}
          <section style={{ backgroundColor: '#F8FAFC', padding: '96px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p style={sectionLabel('#8B5CF6')}>The Axigon Difference</p>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Why Axigon AI</h2>
              </div>
              <div className="max-w-4xl mx-auto" style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #1E2D45', boxShadow: '0 40px 80px rgba(0,0,0,0.22)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#0C1221' }}>
                  {/* Left — generic AI */}
                  <div style={{ padding: '48px', borderRight: '1px solid #1E2D45' }}>
                    <p style={{ ...sectionLabel('#4B6279'), marginBottom: '24px' }}>General-Purpose AI</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {['Generic LLM', 'One-size-fits-all', 'Probabilistic answers', 'Chat responses'].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1E2D45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: '8px', height: '2px', backgroundColor: '#4B6279', borderRadius: '1px' }} />
                          </div>
                          <span style={{ color: '#4B6279', fontWeight: 500, fontSize: '15px' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right — Axigon */}
                  <div style={{ padding: '48px', position: 'relative', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.04) 100%)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)' }} />
                    <div style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#8B5CF6', color: 'white', fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: '4px' }}>AXIGON</div>
                    <p style={{ ...sectionLabel('#A78BFA'), marginBottom: '24px', marginTop: '8px' }}>Axigon Specialized Agents</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {['Domain-trained agents', 'Purpose-built', 'Deterministic workflows', 'Actionable outputs'].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Checkmark />
                          <span style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '15px' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', lineHeight: 1.65 }}>
                  We don't build AI that knows a little about everything.<br />
                  <span style={{ color: '#8B5CF6' }}>We build AI that masters one thing—and delivers results.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Who It's Built For */}
          <section style={{ backgroundColor: '#06080F', padding: '96px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p style={sectionLabel('#22D3EE')}>Target Verticals</p>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: '16px' }}>Who It's Built For</h2>
                <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                  Specialized agents designed for your team's exact workflow
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-5">
                {[
                  { title: 'Engineering Teams', icon: '⚙️', pain: 'Engineering teams lose productivity switching between tools and models for coding, debugging, and architectural decisions.', solution: 'Axigon automatically routes tasks to specialized engineering agents, delivering optimal results without context switching.' },
                  { title: 'Enterprise IT & Cloud', icon: '☁️', pain: 'IT and cloud teams struggle with fragmented insights across security, cost optimization, and infrastructure reliability.', solution: 'Axigon uses intent-aware agents to unify cloud, security, and reliability intelligence into a single decision layer.' },
                  { title: 'Finance & Risk', icon: '📊', pain: 'Finance teams rely on delayed reports and manual analysis to assess risk and opportunity.', solution: 'Axigon deploys finance-focused agents that continuously analyze data, stress-test assumptions, and produce decision-ready insights.' },
                  { title: 'Operations & Strategy', icon: '🎯', pain: 'Strategic decisions slow down due to conflicting inputs and incomplete analysis.', solution: 'Axigon synthesizes multiple expert agents into one clear, confidence-driven recommendation.' }
                ].map((card, i) => (
                  <div key={i} style={{ ...darkCard, padding: '28px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={darkCardHover} onMouseLeave={darkCardLeave}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)', opacity: 0.7 }} />
                    <div style={{ fontSize: '28px', marginBottom: '16px' }}>{card.icon}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', marginBottom: '12px' }}>{card.title}</h3>
                    <p style={{ fontSize: '13px', color: '#F87171', lineHeight: 1.65, marginBottom: '14px' }}>
                      <span style={{ fontWeight: 700 }}>Challenge: </span>{card.pain}
                    </p>
                    <button
                      onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                      style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA', background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#C4B5FD'}
                      onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
                    >Solution {expandedCard === i ? '▲' : '▼'}</button>
                    {expandedCard === i && (
                      <p style={{ marginTop: '12px', fontSize: '13px', color: '#94A3B8', lineHeight: 1.65, borderTop: '1px solid #1E2D45', paddingTop: '12px' }}>{card.solution}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Offerings */}
          <section id="offerings-section" style={{ backgroundColor: '#080C16', padding: '96px 0', borderTop: '1px solid #1E2D45' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p style={sectionLabel('#22D3EE')}>What We Build</p>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Our Offerings</h2>
              </div>
              <div className="max-w-5xl mx-auto" style={{ ...darkCard, padding: '48px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative' }}>
                {/* Intent-Aware Router */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)', borderRadius: '6px', padding: '5px 14px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Invisible Aggregator</span>
                  </div>
                  <h4 style={{ fontSize: '28px', fontWeight: 800, ...gradientText, marginBottom: '12px' }}>Intent-Aware AI Router</h4>
                  <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                    User never chooses a model. The system detects intent and silently routes the task.
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-3 mb-10">
                  {[
                    { task: 'Legal reasoning', model: 'Claude' },
                    { task: 'Code refactor', model: 'GPT-4' },
                    { task: 'Market research', model: 'Perplexity' },
                    { task: 'Math proof', model: 'Gemini' },
                    { task: 'Creative copy', model: 'Mixtral' }
                  ].map((item, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '16px 10px', borderRadius: '10px', backgroundColor: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.07)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'; }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '10px', color: '#94A3B8', fontSize: '13px' }}>{item.task}</div>
                      <div style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px', display: 'inline-block', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', fontWeight: 700 }}>{item.model}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '36px' }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', marginBottom: '16px' }}>Why this wins</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {['Zero friction', 'Feels like one super-intelligent AI', 'Models become replaceable commodities'].map((point, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Checkmark />
                        <span style={{ color: '#CBD5E1', fontSize: '15px' }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,211,238,0.05))', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>This is how future AI UX will look.</p>
                </div>

                <div style={{ borderTop: '1px solid #1E2D45', marginTop: '40px', paddingTop: '40px', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '28px', fontWeight: 800, ...gradientText, marginBottom: '12px' }}>Custom AIs</h4>
                  <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}>
                    Tailored AI agents built specifically for your organization's unique workflows, data, and business requirements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Enterprise Solutions */}
          <section style={{ backgroundColor: '#06080F', padding: '96px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p style={sectionLabel('#8B5CF6')}>Services</p>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Enterprise Solutions</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
                {Object.keys(solutions).map(k => (
                  <button key={k} onClick={() => setActiveTab(k)}
                    style={{
                      padding: '10px 22px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
                      ...(activeTab === k
                        ? { background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', border: '1px solid transparent', boxShadow: '0 0 20px rgba(139,92,246,0.35)' }
                        : { backgroundColor: '#0F1A2E', color: '#94A3B8', border: '1px solid #1E2D45' })
                    }}
                    onMouseEnter={e => { if (activeTab !== k) { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#F1F5F9'; } }}
                    onMouseLeave={e => { if (activeTab !== k) { e.currentTarget.style.borderColor = '#1E2D45'; e.currentTarget.style.color = '#94A3B8'; } }}
                  >{solutions[k].title.split(' ')[0]}</button>
                ))}
              </div>
              <div className="max-w-4xl mx-auto" style={{ ...darkCard, padding: '48px', boxShadow: '0 32px 64px rgba(0,0,0,0.35)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)' }} />
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#F1F5F9', marginBottom: '12px', letterSpacing: '-0.01em' }}>{solutions[activeTab].title}</h3>
                <p style={{ fontSize: '17px', color: '#94A3B8', marginBottom: '32px', lineHeight: 1.65 }}>{solutions[activeTab].desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {solutions[activeTab].points.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
                      </div>
                      <span style={{ color: '#CBD5E1', fontSize: '16px' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section style={{ background: 'linear-gradient(135deg, #0C1221 0%, #0F1A2E 100%)', padding: '80px 0', borderTop: '1px solid #1E2D45', borderBottom: '1px solid #1E2D45' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-6">
                {[{ n: '100+', t: 'LLMs Across Ecosystems' }, { n: '20+', t: 'Specialized Domains' }, { n: '99.9%', t: 'System Uptime' }, { n: '10×', t: 'Faster Insights' }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '36px 16px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1E2D45', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  >
                    <div style={{ fontSize: '52px', fontWeight: 800, background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.n}</div>
                    <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leadership */}
          <section style={{ backgroundColor: '#F8FAFC', padding: '96px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p style={sectionLabel('#8B5CF6')}>The Team</p>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Leadership</h2>
              </div>
              <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ overflow: 'hidden', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${currentSlide * 100}%)` }}>
                    {team.map((m, i) => (
                      <div key={i} style={{ width: '100%', flexShrink: 0 }}>
                        <div style={{ ...lightCard, padding: '48px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                          <div style={{ width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 24px', background: 'linear-gradient(135deg, #0F172A 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: 'white' }}>
                            {m.name[0]}
                          </div>
                          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>{m.name}</h3>
                          <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '15px' }}>{m.role}</p>
                          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', background: 'none', border: '1px solid rgba(139,92,246,0.3)', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          ><Linkedin size={15} /> LinkedIn</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setCurrentSlide(p => p === 0 ? team.length - 1 : p - 1)}
                  style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                ><ChevronLeft size={20} color="#374151" /></button>
                <button onClick={() => setCurrentSlide(p => p === team.length - 1 ? 0 : p + 1)}
                  style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                ><ChevronRight size={20} color="#374151" /></button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ position: 'relative', background: 'radial-gradient(ellipse at 50% 0%, #1a0a3e 0%, #06080F 60%)', padding: '120px 0', borderTop: '1px solid #1E2D45', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
              <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, color: '#F1F5F9', marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-0.025em' }}>
                Stop relying on general AI<br />for specialized problems.
              </h2>
              <p style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '48px', lineHeight: 1.7 }}>
                Deploy AI agents that understand your domain and deliver results.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{ ...btnPrimary, padding: '15px 40px', fontSize: '16px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>
                  Request Demo
                </button>
                <button onClick={() => setCurrentPage('marketplace')} style={{ ...btnGhost, padding: '15px 40px', fontSize: '16px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>
                  Explore Marketplace
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════
          DASHBOARD
      ════════════════════════════════════════════ */}
      {currentPage === 'dashboard' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', paddingTop: '80px' }}>
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div style={{ marginBottom: '48px' }}>
              <p style={sectionLabel('#8B5CF6')}>Dashboard</p>
              <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', margin: 0 }}>Your AI Agents</h1>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {agents.map((a, i) => {
                const colors = ['#8B5CF6', '#22D3EE', '#F59E0B', '#10B981', '#F43F5E', '#6366F1'];
                const c = colors[i % colors.length];
                return (
                  <div key={i} style={{ ...darkCard, padding: '28px', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${c}60`; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${c}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1E2D45'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: c }} />
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: `${c}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: `1px solid ${c}30` }}>
                      <span style={{ color: c, fontSize: '14px', fontWeight: 800 }}>AI</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', marginBottom: '6px' }}>{a.name}</h3>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{a.domain}</div>
                    <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.65, marginBottom: '20px' }}>{a.desc}</p>
                    <button
                      onClick={() => a.page ? setCurrentPage(a.page) : null}
                      style={{ fontSize: '13px', fontWeight: 600, color: c, background: 'none', border: 'none', padding: 0, cursor: a.page ? 'pointer' : 'default', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >{a.page ? 'Launch Agent →' : 'Coming Soon'}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          PERSONAL DASHBOARD
      ════════════════════════════════════════════ */}
      {currentPage === 'personal-dashboard' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', paddingTop: '80px' }}>
          <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={sectionLabel('#22D3EE')}>Personal Dashboard</p>
                <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', margin: 0 }}>Your Personal AI</h1>
              </div>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{ ...btnGhost, padding: '10px 20px', fontSize: '14px' }}
                onMouseEnter={btnGhostHover}
                onMouseLeave={btnGhostLeave}
              >Switch to Business →</button>
            </div>

            {/* Agent tiles */}
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { name: 'Life Finance', color: '#10B981', desc: 'Understand your money, plan your future' },
                { name: 'Career Co-Pilot', color: '#8B5CF6', desc: 'Close skill gaps, negotiate better, grow faster' },
                { name: 'Decision Intelligence', color: '#22D3EE', desc: "Model life's big decisions with real numbers" },
                { name: 'Health & Habits', color: '#F43F5E', desc: 'Connect your habits to your life outcomes' },
              ].map((a, i) => (
                <div key={i} style={{ ...darkCard, padding: '28px', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${a.color}60`; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${a.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1E2D45'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: a.color }} />
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: `1px solid ${a.color}30` }}>
                    <span style={{ color: a.color, fontSize: '14px', fontWeight: 800 }}>AI</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', marginBottom: '12px' }}>{a.name}</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.65, marginBottom: '20px' }}>{a.desc}</p>
                  {personalToastIndex === i ? (
                    <span style={{ fontSize: '13px', color: '#A78BFA', fontStyle: 'italic' }}>Coming soon — we're building this for you</span>
                  ) : (
                    <button
                      onClick={() => { setPersonalToastIndex(i); setTimeout(() => setPersonalToastIndex(null), 3000); }}
                      style={{ fontSize: '13px', fontWeight: 600, color: a.color, background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >Launch Agent →</button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          LEGAL GPT
      ════════════════════════════════════════════ */}
      {currentPage === 'legal-gpt' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', paddingTop: '64px', display: 'flex' }}>

          {/* ── Sidebar ── */}
          <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#080C16', borderRight: '1px solid #1E2D45', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}>

            {/* Sidebar header */}
            <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #1E2D45' }}>
              <button onClick={() => setCurrentPage('dashboard')}
                style={{ background: 'none', border: 'none', color: '#4B6279', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                onMouseLeave={e => e.currentTarget.style.color = '#4B6279'}
              >← Dashboard</button>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#F1F5F9' }}>Legal </span>
                <span style={{ fontSize: '16px', fontWeight: 800, background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GPT</span>
              </div>
              <button
                onClick={() => { setLegalMessages([]); setLegalConversationId(null); setLegalInput(''); }}
                style={{ width: '100%', marginTop: '12px', padding: '9px', borderRadius: '8px', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >+ New Chat</button>
            </div>

            {/* Conversation list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {legalConversations.length === 0 && (
                <p style={{ color: '#2D3F55', fontSize: '12px', textAlign: 'center', marginTop: '24px', padding: '0 8px' }}>No conversations yet</p>
              )}
              {legalConversations.map(conv => {
                const isActive = legalConversationId === conv._id;
                const date = new Date(conv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <button key={conv._id}
                    onClick={async () => {
                      setLegalConversationId(conv._id);
                      try {
                        const res = await fetch(`/api/legal/messages?conversationId=${conv._id}`, { credentials: 'include' });
                        const data = await res.json();
                        setLegalMessages((data.messages || []).map(m => ({ role: m.role, text: m.content })));
                      } catch {}
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', backgroundColor: isActive ? 'rgba(139,92,246,0.15)' : 'transparent', cursor: 'pointer', transition: 'background-color 0.15s', marginBottom: '2px', outline: isActive ? '1px solid rgba(139,92,246,0.35)' : 'none' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 500, color: isActive ? '#C4B5FD' : '#94A3B8', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.title.length > 35 ? conv.title.slice(0, 35) + '…' : conv.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#2D3F55' }}>{date}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Chat area ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {legalMessages.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '80px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>⚖️</div>
                  <p style={{ color: '#4B6279', fontSize: '15px', marginBottom: '8px' }}>Ask anything about Indian business law</p>
                  <p style={{ color: '#2D3F55', fontSize: '13px' }}>GST, contracts, compliance, labour law, IP, and more</p>
                </div>
              )}
              {legalMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '72%', padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: msg.role === 'user' ? '#8B5CF6' : '#0F1A2E',
                    border: msg.role === 'user' ? 'none' : '1px solid #1E2D45',
                    color: '#F1F5F9', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                  }}>{msg.text}</div>
                </div>
              ))}
              {legalLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 18px', borderRadius: '16px 16px 16px 4px', backgroundColor: '#0F1A2E', border: '1px solid #1E2D45', color: '#4B6279', fontSize: '14px' }}>Thinking...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '20px 40px', borderTop: '1px solid #1E2D45', backgroundColor: '#06080F' }}>
              <form onSubmit={handleLegalSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Ask a legal question..."
                  value={legalInput}
                  onChange={e => setLegalInput(e.target.value)}
                  disabled={legalLoading}
                  style={{ flex: 1, padding: '13px 16px', borderRadius: '10px', border: '1px solid #1E2D45', backgroundColor: '#0F1A2E', color: '#F1F5F9', fontSize: '14px', outline: 'none', fontFamily: 'inherit', opacity: legalLoading ? 0.6 : 1, transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                />
                <button type="submit" disabled={legalLoading || !legalInput.trim()}
                  style={{ padding: '13px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', border: 'none', fontWeight: 700, fontSize: '14px', cursor: legalLoading || !legalInput.trim() ? 'not-allowed' : 'pointer', opacity: legalLoading || !legalInput.trim() ? 0.5 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                >Send</button>
              </form>
            </div>
          </div>

        </section>
      )}

      {/* ════════════════════════════════════════════
          LOGOUT SUCCESS
      ════════════════════════════════════════════ */}
      {currentPage === 'logout-success' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 0 32px rgba(139,92,246,0.45)' }}>
              <svg width="32" height="28" viewBox="0 0 32 28" fill="none"><path d="M2 14L11 23L30 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', marginBottom: '12px', letterSpacing: '-0.02em' }}>Successfully Logged Out</h1>
            <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '40px' }}>Thank you for using Axigon AI</p>
            <button onClick={() => setCurrentPage('company')} style={{ ...btnPrimary, padding: '14px 36px', fontSize: '15px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>
              Return to Home
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          MARKETPLACE
      ════════════════════════════════════════════ */}
      {currentPage === 'marketplace' && (
        <>
          {/* Marketplace hero */}
          <section style={{ position: 'relative', paddingTop: '140px', paddingBottom: '80px', backgroundColor: '#06080F', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: '800px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, transparent 70%)', top: '-180px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.22)', padding: '6px 16px', borderRadius: '999px', marginBottom: '32px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22D3EE', boxShadow: '0 0 8px #22D3EE' }} />
                <span style={{ color: '#22D3EE', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Platform</span>
              </div>
              <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, color: '#F1F5F9', marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-0.025em' }}>AI Agents Marketplace</h1>
              <p style={{ fontSize: '19px', color: '#94A3B8', maxWidth: '580px', margin: '0 auto 12px', lineHeight: 1.65 }}>Purpose-built AI agents, each specialized for a single domain</p>
              <p style={{ fontSize: '14px', color: '#4B6279', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.65 }}>These are not generic chatbots. Each agent is outcome-driven and optimized for precision.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setCurrentPage('login')} style={{ ...btnPrimary, padding: '12px 28px', fontSize: '15px' }} onMouseEnter={btnPrimaryHover} onMouseLeave={btnPrimaryLeave}>Login</button>
                <button onClick={() => setCurrentPage('signup')} style={{ ...btnGhost, padding: '12px 28px', fontSize: '15px' }} onMouseEnter={btnGhostHover} onMouseLeave={btnGhostLeave}>Sign Up</button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section style={{ backgroundColor: '#080C16', padding: '80px 0', borderTop: '1px solid #1E2D45' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', color: '#F1F5F9', marginBottom: '12px', letterSpacing: '-0.01em' }}>Why Specialized Agents?</h2>
              <p style={{ fontSize: '16px', color: '#94A3B8', textAlign: 'center', maxWidth: '520px', margin: '0 auto 48px', lineHeight: 1.65 }}>Generalist AI models attempt to do everything. Our agents master one domain.</p>
              <div className="grid md:grid-cols-4 gap-5">
                {[{ n: '100+', t: 'LLMs Across Ecosystems' }, { n: '20+', t: 'Specialized Domains' }, { n: '99.9%', t: 'System Uptime' }, { n: '10×', t: 'Faster Insights' }].map((s, i) => (
                  <div key={i} style={{ ...darkCard, padding: '32px', textAlign: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2D45'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '40px', fontWeight: 800, background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>{s.n}</div>
                    <div style={{ fontSize: '14px', color: '#94A3B8' }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Platform comparison */}
          <section style={{ backgroundColor: '#F8FAFC', padding: '80px 0' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p style={sectionLabel('#8B5CF6')}>Industry Overview</p>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.01em' }}>Top AI Agents / Platforms (2025–2026)</h2>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Most-used and influential AI tools based on popularity and market share</p>
              </div>
              <div className="max-w-5xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { rank: '🥇', name: 'ChatGPT', org: 'OpenAI', share: 65, desc: 'Largest AI platform with hundreds of millions of users' },
                  { rank: '🥈', name: 'Google Gemini', org: 'Google', share: 21, desc: 'Powers ~21% of AI search interactions globally' },
                  { rank: '🥉', name: 'Microsoft Copilot', org: 'Microsoft', share: 8, desc: 'Widely adopted in enterprise workflows' },
                  { rank: '🏅', name: 'Anthropic Claude', org: 'Anthropic', share: 3, desc: 'Known for strong reasoning and creative assistance' },
                  { rank: '⭐', name: 'Perplexity AI', org: 'Perplexity', share: 2, desc: 'Research and knowledge-focused agent' },
                  { rank: '🔥', name: 'DeepSeek', org: 'DeepSeek', share: 1, desc: 'Open-source and cost-effective offerings' }
                ].map((platform, i) => (
                  <div key={i} style={{ ...lightCard, padding: '24px' }} onMouseEnter={lightCardHover} onMouseLeave={lightCardLeave}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '26px' }}>{platform.rank}</span>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>{platform.name}</h3>
                          <p style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: 600, margin: 0 }}>{platform.org}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{platform.share}%</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Market Share</div>
                      </div>
                    </div>
                    <div style={{ height: '5px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ height: '5px', borderRadius: '999px', width: `${platform.share}%`, background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)' }} />
                    </div>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.55 }}>{platform.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '40px', padding: '22px 28px', borderRadius: '12px', backgroundColor: 'white', borderLeft: '4px solid #8B5CF6', maxWidth: '860px', margin: '40px auto 0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '6px', fontSize: '15px', margin: '0 0 6px' }}>📌 Usage Share Snapshot</h4>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  ChatGPT leads with ~64–65% of AI-platform traffic, Gemini ~21%, other platforms (Grok, Perplexity, Claude, Copilot) together make up the remaining ~10–14%
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════
          LOGIN
      ════════════════════════════════════════════ */}
      {currentPage === 'login' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <button onClick={() => setCurrentPage('company')} style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', display: 'inline-block' }}>
                Axigon<span style={gradientText}>AI</span>
              </button>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.01em' }}>Welcome Back</h2>
              <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>Log in to your Axigon AI account</p>
            </div>
            <div style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E2D45', borderRadius: '18px', padding: '36px', boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
              {error && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#FCA5A5', fontSize: '14px' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                  <input type="email" placeholder="you@company.com" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} disabled={loading}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                  <input type="password" placeholder="Enter password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} disabled={loading}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: '#8B5CF6' }} />
                    Remember me
                  </label>
                  <button type="button" style={{ color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Forgot password?</button>
                </div>
                <button type="submit" disabled={loading}
                  style={{ ...btnPrimary, padding: '13px', fontSize: '15px', width: '100%', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (!loading) btnPrimaryHover(e); }}
                  onMouseLeave={e => { if (!loading) btnPrimaryLeave(e); }}
                >{loading ? 'Logging in...' : 'Log In'}</button>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#94A3B8', margin: 0 }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setCurrentPage('signup')} style={{ color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Sign up</button>
                </p>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          SIGNUP
      ════════════════════════════════════════════ */}
      {currentPage === 'signup' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
          <div style={{ width: '100%', maxWidth: signupStep === 'account-type' ? '560px' : '420px', transition: 'max-width 0.2s' }}>

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <button onClick={() => { setCurrentPage('company'); setSignupStep('form'); setSelectedAccountType(null); }}
                style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', display: 'inline-block' }}>
                Axigon<span style={gradientText}>AI</span>
              </button>
              {signupStep === 'form' ? (
                <>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.01em' }}>Create Account</h2>
                  <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>Get started with Axigon AI</p>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.01em' }}>What brings you to Axigon?</h2>
                  <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>Choose the experience that fits your needs</p>
                </>
              )}
            </div>

            <div style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E2D45', borderRadius: '18px', padding: '36px', boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
              {error && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#FCA5A5', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              {/* ── Step 1: Form ── */}
              {signupStep === 'form' && (
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Full Name', type: 'text', placeholder: 'John Doe', field: 'name' },
                    { label: 'Company Email', type: 'email', placeholder: 'you@company.com', field: 'email' },
                    { label: 'Company Name', type: 'text', placeholder: 'Your Company', field: 'company' },
                    { label: 'Password', type: 'password', placeholder: 'Min 6 characters', field: 'password' },
                  ].map(({ label, type, placeholder, field }) => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={signupData[field]} onChange={e => setSignupData({ ...signupData, [field]: e.target.value })} disabled={loading}
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                        onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                      />
                    </div>
                  ))}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', lineHeight: 1.5 }}>
                    <input type="checkbox" required style={{ marginTop: '2px', accentColor: '#8B5CF6', flexShrink: 0 }} />
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                  </label>
                  <button type="submit" disabled={loading}
                    style={{ ...btnPrimary, padding: '13px', fontSize: '15px', width: '100%', marginTop: '4px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={e => { if (!loading) btnPrimaryHover(e); }}
                    onMouseLeave={e => { if (!loading) btnPrimaryLeave(e); }}
                  >{loading ? 'Creating Account...' : 'Continue'}</button>
                  <p style={{ textAlign: 'center', fontSize: '14px', color: '#94A3B8', margin: 0 }}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setCurrentPage('login')} style={{ color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Log in</button>
                  </p>
                </form>
              )}

              {/* ── Step 2: Account type ── */}
              {signupStep === 'account-type' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {[
                      { value: 'personal', emoji: '🙋', title: 'Personal', desc: 'Manage my life,\nfinances & career' },
                      { value: 'business', emoji: '🏢', title: 'Business', desc: 'Run my business,\ncompliance & ops' },
                    ].map(opt => {
                      const isSelected = selectedAccountType === opt.value;
                      return (
                        <button key={opt.value} type="button"
                          onClick={() => setSelectedAccountType(opt.value)}
                          style={{
                            padding: '24px 20px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
                            backgroundColor: isSelected ? 'rgba(139,92,246,0.12)' : '#131E30',
                            border: isSelected ? '2px solid #8B5CF6' : '2px solid #1E2D45',
                            transition: 'all 0.18s ease', outline: 'none',
                            boxShadow: isSelected ? '0 0 0 3px rgba(139,92,246,0.2)' : 'none',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#1E2D45'; }}
                        >
                          <div style={{ fontSize: '32px', marginBottom: '12px' }}>{opt.emoji}</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: isSelected ? '#C4B5FD' : '#F1F5F9', marginBottom: '8px' }}>{opt.title}</div>
                          <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, whiteSpace: 'pre-line' }}>{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleSignupSubmit}
                    disabled={!selectedAccountType || loading}
                    style={{ ...btnPrimary, padding: '13px', fontSize: '15px', width: '100%', opacity: (!selectedAccountType || loading) ? 0.45 : 1, cursor: (!selectedAccountType || loading) ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={e => { if (selectedAccountType && !loading) btnPrimaryHover(e); }}
                    onMouseLeave={e => { if (selectedAccountType && !loading) btnPrimaryLeave(e); }}
                  >{loading ? 'Creating Account...' : 'Continue'}</button>

                  <button type="button"
                    onClick={() => { setSignupStep('form'); setSelectedAccountType(null); }}
                    style={{ background: 'none', border: 'none', color: '#4B6279', fontSize: '13px', cursor: 'pointer', textAlign: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4B6279'}
                  >← Back</button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          PROFILE
      ════════════════════════════════════════════ */}
      {currentPage === 'profile' && (
        <section style={{ minHeight: '100vh', backgroundColor: '#06080F', paddingTop: '80px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

            {/* Back link */}
            <button
              onClick={() => setCurrentPage(user?.accountType === 'personal' ? 'personal-dashboard' : 'dashboard')}
              style={{ background: 'none', border: 'none', color: '#4B6279', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
              onMouseLeave={e => e.currentTarget.style.color = '#4B6279'}
            >← Back to Dashboard</button>

            {/* Heading */}
            <div style={{ marginBottom: '36px' }}>
              <p style={sectionLabel('#8B5CF6')}>Account</p>
              <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', margin: 0 }}>Your Profile</h1>
            </div>

            {/* Form card */}
            <div style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E2D45', borderRadius: '16px', padding: '36px' }}>
              <form onSubmit={handleProfileSave}>

                {/* Row: Full Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                    placeholder="Your full name"
                  />
                </div>

                {/* Row: Email (read-only) */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    style={{ ...inputStyle, color: '#4B6279', cursor: 'default', backgroundColor: '#0A1120' }}
                  />
                </div>

                {/* Row: Phone + Date of Birth */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                      onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={e => setProfileData(p => ({ ...p, dateOfBirth: e.target.value }))}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                      onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                    />
                  </div>
                </div>

                {/* Row: City + Occupation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={e => setProfileData(p => ({ ...p, city: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                      onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Occupation</label>
                    <input
                      type="text"
                      value={profileData.occupation}
                      onChange={e => setProfileData(p => ({ ...p, occupation: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                      onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                {/* Row: Annual Income + Account Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Annual Income (approx.)</label>
                    <input
                      type="text"
                      value={profileData.annualIncome}
                      onChange={e => setProfileData(p => ({ ...p, annualIncome: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                      onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                      placeholder="e.g. 12,00,000"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.03em' }}>Account Type</label>
                    <input
                      type="text"
                      value={user?.accountType === 'personal' ? 'Personal' : 'Business'}
                      readOnly
                      style={{ ...inputStyle, color: '#4B6279', cursor: 'default', backgroundColor: '#0A1120' }}
                    />
                  </div>
                </div>

                {/* Error / success feedback */}
                {profileError && (
                  <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E', fontSize: '14px' }}>
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '14px' }}>
                    Profile saved successfully.
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    style={{ ...btnPrimary, padding: '12px 28px', fontSize: '15px', opacity: profileSaving ? 0.7 : 1 }}
                    onMouseEnter={profileSaving ? undefined : btnPrimaryHover}
                    onMouseLeave={profileSaving ? undefined : btnPrimaryLeave}
                  >{profileSaving ? 'Saving...' : 'Save Changes'}</button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(user?.accountType === 'personal' ? 'personal-dashboard' : 'dashboard')}
                    style={{ ...btnGhost, padding: '12px 24px', fontSize: '15px' }}
                    onMouseEnter={btnGhostHover}
                    onMouseLeave={btnGhostLeave}
                  >Cancel</button>
                </div>

              </form>
            </div>

          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#080C16', padding: '64px 0 40px', borderTop: '1px solid #1E2D45' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {[
              { h: 'Company', l: ['About', 'Careers', 'Press'] },
              { h: 'Solutions', l: ['AI Agents', 'Consulting'] },
              { h: 'Resources', l: ['Blog', 'Case Studies'] },
              { h: 'Legal', l: ['Privacy', 'Terms'] }
            ].map((c, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#F1F5F9', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.h}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {c.l.map((link, j) => (
                    <li key={j}>
                      <button type="button"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B6279', fontSize: '14px', transition: 'color 0.2s', fontFamily: 'inherit' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#4B6279'}
                      >{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '32px', borderTop: '1px solid #1E2D45', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <button onClick={() => setCurrentPage('company')} style={{ fontSize: '20px', fontWeight: 800, color: '#F1F5F9', background: 'none', border: 'none', cursor: 'pointer' }}>
              Axigon<span style={gradientText}>AI</span>
            </button>
            <p style={{ fontSize: '13px', color: '#4B6279', margin: 0 }}>© 2026 Axigon AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════
          REQUEST DEMO MODAL
      ════════════════════════════════════════════ */}
      {showDemoModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowDemoModal(false); }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E2D45', borderRadius: '18px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)', borderRadius: '18px 18px 0 0' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Request a Demo</h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>Tell us about your use case and we'll be in touch.</p>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #1E2D45', borderRadius: '8px', color: '#94A3B8', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginLeft: '16px', fontSize: '16px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2D45'; e.currentTarget.style.color = '#94A3B8'; }}
              >✕</button>
            </div>

            <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Full Name', type: 'text', placeholder: 'Jane Doe', field: 'name' },
                { label: 'Email', type: 'email', placeholder: 'you@company.com', field: 'email' },
                { label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000', field: 'phone' },
                { label: 'Company Name', type: 'text', placeholder: 'Acme Corp', field: 'company' },
              ].map(({ label, type, placeholder, field }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={demoForm[field]}
                    onChange={e => setDemoForm({ ...demoForm, [field]: e.target.value })}
                    required={field !== 'phone'}
                    style={{ ...inputStyle }}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Use Case
                </label>
                <textarea
                  placeholder="Briefly describe your use case..."
                  value={demoForm.useCase}
                  onChange={e => setDemoForm({ ...demoForm, useCase: e.target.value.slice(0, 200) })}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '96px', lineHeight: 1.6 }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                />
                <p style={{ textAlign: 'right', fontSize: '12px', color: demoForm.useCase.length >= 190 ? '#F87171' : '#4B6279', marginTop: '4px', margin: '4px 0 0' }}>
                  {demoForm.useCase.length}/200
                </p>
              </div>

              <button
                type="submit"
                style={{ ...btnPrimary, padding: '13px', fontSize: '15px', width: '100%', marginTop: '4px' }}
                onMouseEnter={btnPrimaryHover}
                onMouseLeave={btnPrimaryLeave}
              >Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AxigonWebsite;

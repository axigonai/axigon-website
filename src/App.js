import React, { useState, useEffect } from 'react';
import { Play, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';

const AxigonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('company');
  const [pageHistory, setPageHistory] = useState(['company']); // NEW: Track page history
  const [activeTab, setActiveTab] = useState('consulting');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NEW: Loading state

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('axigon_token');
    const savedUser = localStorage.getItem('axigon_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230A2540"/><text x="50" y="75" font-family="Arial" font-size="70" font-weight="bold" fill="%23635BFF" text-anchor="middle">A</text></svg>';
    document.head.appendChild(link);
    document.title = 'Axigon AI - Enterprise AI Solutions';
  }, []);

  // FIXED: Navigation with history tracking
  const navigateTo = (page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // FIXED: Go back to previous page
  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
      window.scrollTo(0, 0);
    } else {
      navigateTo('company');
    }
  };

  // FIXED: Real backend signup with API integration
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!signupData.name || !signupData.email || !signupData.company || !signupData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Call real backend API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and user data
      localStorage.setItem('axigon_token', data.token);
      localStorage.setItem('axigon_user', JSON.stringify(data.user));

      // Update state
      setUser(data.user);
      setIsLoggedIn(true);
      
      // Clear form
      setSignupData({ name: '', email: '', company: '', password: '' });
      
      // Navigate to dashboard
      navigateTo('dashboard');

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Real backend login with API integration
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Call real backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('axigon_token', data.token);
      localStorage.setItem('axigon_user', JSON.stringify(data.user));

      // Update state
      setUser(data.user);
      setIsLoggedIn(true);
      
      // Clear form
      setLoginData({ email: '', password: '' });
      
      // Navigate to dashboard
      navigateTo('dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('axigon_token');
    localStorage.removeItem('axigon_user');
    
    // Reset state
    setUser(null);
    setIsLoggedIn(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', company: '', password: '' });
    
    // Navigate to logout success
    navigateTo('logout-success');
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
    { name: 'ContractAI', domain: 'Legal Analysis', desc: 'Extract obligations, risks, and key terms from complex legal documents' },
    { name: 'FinanceGPT', domain: 'Financial Forecasting', desc: 'Generate revenue projections and scenario analysis from historical data' },
    { name: 'ComplianceWatch', domain: 'Regulatory Compliance', desc: 'Monitor regulatory changes and flag compliance gaps' },
    { name: 'DataGuard', domain: 'Data Quality', desc: 'Detect anomalies, validate schemas, and ensure data integrity' },
    { name: 'CustomerInsight', domain: 'Customer Intelligence', desc: 'Analyze customer behavior patterns and predict churn' },
    { name: 'SupplyChainAI', domain: 'Supply Chain', desc: 'Optimize inventory levels and predict disruptions' }
  ];

  const partners = ['RippleSoft', 'TradeSoft', 'People TECH'];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav className="fixed w-full z-50 transition" style={{ backgroundColor: scrolled ? '#0A2540' : '#071A2E' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigateTo('company')} className="text-2xl font-bold text-white">
            Axigon<span style={{ color: '#635BFF' }}>AI</span>
          </button>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-white text-sm">Hi, {user.name}!</span>
                <button onClick={handleLogout} className="px-6 py-2.5 rounded text-sm text-white" style={{ backgroundColor: '#635BFF' }}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigateTo('login')} className="px-6 py-2.5 rounded text-sm text-white" style={{ backgroundColor: '#635BFF' }}>Login</button>
                <button onClick={() => navigateTo('signup')} className="px-6 py-2.5 rounded text-sm border-2 border-white text-white">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {currentPage === 'company' && (
        <>
          <section className="relative min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #071A2E 0%, #0A2540 50%, #0B2D5B 100%)' }}>
            <div className="relative z-10 text-center px-6 max-w-5xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Specialized AI agents built<br />for real-world impact</h1>
              <p className="text-xl mb-10 text-gray-300">Masters of one domain, not generalist AI. Purpose-built agents that solve specific enterprise challenges.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => navigateTo('company')} className="px-8 py-4 rounded font-semibold bg-white text-slate-900">Company</button>
                <button onClick={() => navigateTo('marketplace')} className="border-2 px-8 py-4 rounded font-semibold border-white text-white">Marketplace</button>
              </div>
            </div>
          </section>

          <section className="py-16" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-sm uppercase mb-10 text-gray-500">Trusted by Enterprise Leaders</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                {partners.map((p, i) => <div key={i} className="text-center opacity-30"><div className="text-xl font-bold text-gray-700">{p}</div></div>)}
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0B1220' }}>Why Axigon AI</h2>
              <div className="max-w-5xl mx-auto p-8 rounded-lg border-2" style={{ backgroundColor: '#0A2540', borderColor: '#635BFF' }}>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-bold mb-6" style={{ color: '#999' }}>General-Purpose AI</h3>
                    <div className="space-y-4">
                      {['Generic LLM', 'One-size-fits-all', 'Probabilistic answers', 'Chat responses'].map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                          <span className="text-gray-300">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-6" style={{ color: '#635BFF' }}>Axigon Specialized Agents</h3>
                    <div className="space-y-4">
                      {['Domain expert', 'Purpose-built', 'Deterministic results', 'Structured outputs'].map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                          <span className="text-white">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0B1220' }}>Our Solutions</h2>
              <p className="text-center mb-12 text-gray-600">Comprehensive AI services tailored to your needs</p>
              <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {Object.keys(solutions).map(key => (
                  <button key={key} onClick={() => setActiveTab(key)} className="px-6 py-3 rounded-lg font-semibold transition" style={{ backgroundColor: activeTab === key ? '#635BFF' : 'white', color: activeTab === key ? 'white' : '#0B1220' }}>{solutions[key].title}</button>
                ))}
              </div>
              <div className="max-w-3xl mx-auto p-8 rounded-lg bg-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#0B1220' }}>{solutions[activeTab].title}</h3>
                <p className="mb-6 text-gray-600">{solutions[activeTab].desc}</p>
                <ul className="space-y-3">
                  {solutions[activeTab].points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#635BFF' }}></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0B1220' }}>Leadership Team</h2>
              <p className="text-center mb-12 text-gray-600">Experienced leaders driving innovation</p>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {team.map((member, i) => (
                  <div key={i} className="text-center p-6 rounded-lg" style={{ backgroundColor: '#F7FAFF' }}>
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: '#635BFF' }}>{member.name[0]}</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#0B1220' }}>{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                    <button className="mt-4 p-2 rounded-full" style={{ backgroundColor: '#635BFF' }}><Linkedin className="text-white" size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'marketplace' && (
        <section className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="max-w-7xl mx-auto px-6">
            {/* FIXED: Back button */}
            <button 
              onClick={goBack} 
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <h1 className="text-5xl font-bold text-center mb-4" style={{ color: '#0B1220' }}>AI Agent Marketplace</h1>
            <p className="text-center text-xl mb-16 text-gray-600">Deploy specialized agents across your enterprise</p>
            
            {!isLoggedIn && (
              <div className="max-w-2xl mx-auto mb-12 p-6 rounded-lg border-2 text-center" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
                <p className="text-gray-800 mb-4">
                  <strong>Sign up to access our AI agents</strong> and start transforming your business operations.
                </p>
                <button 
                  onClick={() => navigateTo('signup')} 
                  className="px-8 py-3 rounded-lg font-semibold text-white transition hover:opacity-90" 
                  style={{ backgroundColor: '#635BFF' }}
                >
                  Create Free Account
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent, i) => (
                <div key={i} className="p-6 rounded-lg bg-white shadow-lg border-2 transition-all hover:shadow-xl" style={{ borderColor: expandedCard === i ? '#635BFF' : '#E2E8F0' }}>
                  <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#635BFF' }}>{agent.name[0]}</div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B1220' }}>{agent.name}</h3>
                  <p className="text-sm mb-4 font-semibold" style={{ color: '#635BFF' }}>{agent.domain}</p>
                  <p className="text-gray-600 mb-6">{agent.desc}</p>
                  <button 
                    onClick={() => setExpandedCard(expandedCard === i ? null : i)} 
                    className="w-full py-3 rounded-lg font-semibold text-white transition" 
                    style={{ backgroundColor: '#635BFF' }}
                  >
                    {expandedCard === i ? 'Hide Details' : 'Learn More'}
                  </button>
                  {expandedCard === i && (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
                      <h4 className="font-bold mb-3" style={{ color: '#0B1220' }}>Key Features:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Advanced ML algorithms</li>
                        <li>• Real-time processing</li>
                        <li>• Enterprise security</li>
                        <li>• 24/7 support included</li>
                      </ul>
                      <button className="w-full mt-6 py-3 rounded-lg font-semibold border-2 transition" style={{ borderColor: '#635BFF', color: '#635BFF' }}>
                        Request Demo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentPage === 'dashboard' && (
        <section className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="max-w-7xl mx-auto px-6">
            {/* FIXED: Back button */}
            <button 
              onClick={goBack} 
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <h1 className="text-4xl font-bold mb-2" style={{ color: '#0B1220' }}>Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mb-12">Here's your dashboard overview</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-lg bg-white shadow">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1220' }}>Active Agents</h3>
                <p className="text-4xl font-bold" style={{ color: '#635BFF' }}>0</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1220' }}>API Calls</h3>
                <p className="text-4xl font-bold" style={{ color: '#635BFF' }}>0</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1220' }}>Credits</h3>
                <p className="text-4xl font-bold" style={{ color: '#635BFF' }}>100</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1220' }}>Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Name</label>
                  <p className="text-gray-700">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Email</label>
                  <p className="text-gray-700">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company</label>
                  <p className="text-gray-700">{user?.company}</p>
                </div>
              </div>
              <button 
                onClick={() => navigateTo('marketplace')} 
                className="mt-8 px-8 py-3 rounded-lg font-semibold text-white" 
                style={{ backgroundColor: '#635BFF' }}
              >
                Browse AI Agents
              </button>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'logout-success' && (
        <section className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl" style={{ backgroundColor: '#10b981' }}>✓</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0B1220' }}>Logged Out Successfully</h2>
            <p className="text-gray-600 mb-8">Thank you for using Axigon AI. Come back soon!</p>
            <button onClick={() => navigateTo('company')} className="px-8 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>
              Back to Home
            </button>
          </div>
        </section>
      )}

      {currentPage === 'login' && (
        <section className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="w-full max-w-md px-6">
            {/* FIXED: Back button */}
            <button 
              onClick={goBack} 
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <div className="rounded-lg p-8 shadow-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#0B1220' }}>Welcome Back</h2>
              <p className="text-center mb-8" style={{ color: '#475569' }}>Log in to your Axigon AI account</p>
              
              {error && (
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Email</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    value={loginData.email} 
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={loginData.password} 
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2" style={{ color: '#475569' }}>
                    <input type="checkbox" className="rounded" />
                    Remember me
                  </label>
                  <a href="#" style={{ color: '#635BFF' }}>Forgot password?</a>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 rounded font-semibold text-white transition-all hover:opacity-90" 
                  style={{ backgroundColor: '#635BFF', opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>
                  Don't have an account? <button type="button" onClick={() => navigateTo('signup')} className="font-semibold" style={{ color: '#635BFF' }}>Sign up</button>
                </p>
              </form>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'signup' && (
        <section className="min-h-screen flex items-center justify-center pt-20 pb-10" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="w-full max-w-md px-6">
            {/* FIXED: Back button */}
            <button 
              onClick={goBack} 
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <div className="rounded-lg p-8 shadow-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#0B1220' }}>Create Account</h2>
              <p className="text-center mb-8" style={{ color: '#475569' }}>Get started with Axigon AI</p>
              
              {error && (
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={signupData.name} 
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Email</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    value={signupData.email} 
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Your Company" 
                    value={signupData.company} 
                    onChange={(e) => setSignupData({...signupData, company: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label>
                  <input 
                    type="password" 
                    placeholder="Create password (min 6 characters)" 
                    value={signupData.password} 
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})} 
                    className="w-full px-4 py-3 rounded border outline-none focus:border-indigo-500" 
                    style={{ borderColor: '#E2E8F0' }}
                    disabled={loading}
                  />
                </div>
                <label className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span>I agree to the Terms and Privacy Policy</span>
                </label>
                <button 
                  type="submit" 
                  className="w-full py-3 rounded font-semibold text-white transition-all hover:opacity-90" 
                  style={{ backgroundColor: '#635BFF', opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>
                  Already have an account? <button type="button" onClick={() => navigateTo('login')} className="font-semibold" style={{ color: '#635BFF' }}>Log in</button>
                </p>
              </form>
            </div>
          </div>
        </section>
      )}

      <footer className="py-16 text-white" style={{ backgroundColor: '#071A2E' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {[{ h: 'Company', l: ['About', 'Careers', 'Press'] }, { h: 'Solutions', l: ['AI Agents', 'Consulting'] }, { h: 'Resources', l: ['Blog', 'Case Studies'] }, { h: 'Legal', l: ['Privacy', 'Terms'] }].map((c, i) => (
              <div key={i}><h4 className="text-lg font-bold mb-6">{c.h}</h4><ul className="space-y-3" style={{ color: '#CBD5E1' }}>{c.l.map((link, j) => <li key={j}><a href="#">{link}</a></li>)}</ul></div>
            ))}
          </div>
          <div className="pt-8 flex items-center justify-between" style={{ borderTop: '1px solid #1E293B' }}>
            <button onClick={() => navigateTo('company')} className="text-2xl font-bold">Axigon<span style={{ color: '#635BFF' }}>AI</span></button>
            <p className="text-sm" style={{ color: '#CBD5E1' }}>© 2026 Axigon AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AxigonWebsite;
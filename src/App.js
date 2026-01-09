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

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }
    const userData = { name: loginData.email.split('@')[0], email: loginData.email };
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('marketplace');
    alert('Login successful! Welcome to Axigon AI');
  };

  const handleSignup = (e) => {
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
    const userData = { name: signupData.name, email: signupData.email, company: signupData.company };
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('marketplace');
    alert('Account created successfully! Welcome to Axigon AI');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('company');
    alert('Logged out successfully');
  };

  const solutions = {
    consulting: { title: 'AI Strategy Consulting', desc: 'Deploy AI that delivers measurable business outcomes', points: ['Identify high-impact use cases', 'Build implementation roadmaps', 'Navigate organizational change'] },
    audit: { title: 'AI System Audit', desc: 'Verify security, compliance, and performance', points: ['Risk assessment', 'Compliance validation', 'Performance optimization'] },
    implementation: { title: 'Implementation Services', desc: 'Deploy specialized AI agents', points: ['Seamless integration', 'Zero-downtime deployment', 'Knowledge transfer'] },
    managed: { title: 'Managed AI', desc: 'Continuous optimization', points: ['24/7 monitoring', 'Model refinement', 'Technical support'] }
  };

  const team = [
    { name: 'Shalini', role: 'Chief Executive Officer' },
    { name: 'Sid', role: 'Chief Technology Officer' },
    { name: 'Rachel Kim', role: 'VP of Enterprise Solutions' },
    { name: 'James Anderson', role: 'Head of AI Research' }
  ];

  const agents = [
    { name: 'ContractAI', domain: 'Legal Analysis', desc: 'Extract obligations, risks, and key terms from complex legal documents' },
    { name: 'FinanceGPT', domain: 'Financial Forecasting', desc: 'Generate revenue projections and scenario analysis from historical data' },
    { name: 'ComplianceWatch', domain: 'Regulatory Compliance', desc: 'Monitor regulatory changes and flag compliance gaps' },
    { name: 'DataGuard', domain: 'Data Quality', desc: 'Detect anomalies, validate schemas, and ensure data integrity' },
    { name: 'CustomerInsight', domain: 'Customer Intelligence', desc: 'Analyze customer behavior patterns and predict churn' },
    { name: 'SupplyChainAI', domain: 'Supply Chain', desc: 'Optimize inventory levels and predict disruptions' }
  ];

  const partners = ['MICROSOFT', 'AMAZON', 'GOOGLE CLOUD', 'IBM', 'ORACLE', 'SAP'];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav className="fixed w-full z-50 transition" style={{ backgroundColor: scrolled ? '#0A2540' : '#071A2E' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold text-white">
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
                <button className="px-6 py-2.5 rounded text-sm text-white" style={{ backgroundColor: '#635BFF' }}>Request Demo</button>
                <button className="px-6 py-2.5 rounded text-sm border-2 border-white text-white flex items-center gap-2">
                  <Play size={16} /> Watch Video
                </button>
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
                <button onClick={() => setCurrentPage('company')} className="px-8 py-4 rounded font-semibold bg-white text-slate-900">Company</button>
                <button onClick={() => setCurrentPage('marketplace')} className="border-2 px-8 py-4 rounded font-semibold border-white text-white">Marketplace</button>
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
                        <div key={i} className="flex gap-3"><div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#666' }}></div><div className="font-semibold" style={{ color: '#999' }}>{t}</div></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="absolute -top-4 -right-4 px-3 py-1 text-xs font-bold" style={{ backgroundColor: '#635BFF', color: 'white' }}>AXIGON APPROACH</div>
                    <h3 className="text-xl font-bold mb-6 text-white">Axigon Specialized Agents</h3>
                    <div className="space-y-4">
                      {['Domain-trained agents', 'Purpose-built', 'Deterministic workflows', 'Actionable outputs'].map((t, i) => (
                        <div key={i} className="flex gap-3"><div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#635BFF' }}></div><div className="font-semibold text-white">{t}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <p className="text-xl font-bold" style={{ color: '#0B1220' }}>We don't build AI that knows a little about everything.<br />We build AI that masters one thing—and delivers results.</p>
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0B1220' }}>Who It's Built For</h2>
              <p className="text-center text-lg mb-16 max-w-3xl mx-auto" style={{ color: '#475569' }}>
                <strong>Built for AI Precision.</strong> Specialized agents designed for your team's exact workflow
              </p>
              
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Engineering Teams', 
                    pain: 'Engineering teams lose productivity switching between tools and models for coding, debugging, and architectural decisions.',
                    solution: 'Axigon automatically routes tasks to specialized engineering agents, delivering optimal results without context switching.'
                  },
                  { 
                    title: 'Enterprise IT & Cloud', 
                    pain: 'IT and cloud teams struggle with fragmented insights across security, cost optimization, and infrastructure reliability.',
                    solution: 'Axigon uses intent-aware agents to unify cloud, security, and reliability intelligence into a single decision layer.'
                  },
                  { 
                    title: 'Finance & Risk', 
                    pain: 'Finance teams rely on delayed reports and manual analysis to assess risk and opportunity.',
                    solution: 'Axigon deploys finance-focused agents that continuously analyze data, stress-test assumptions, and produce decision-ready insights.'
                  },
                  { 
                    title: 'Operations & Strategy', 
                    pain: 'Strategic decisions slow down due to conflicting inputs and incomplete analysis.',
                    solution: 'Axigon synthesizes multiple expert agents into one clear, confidence-driven recommendation.'
                  }
                ].map((card, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#0B1220' }}>{card.title}</h3>
                    <p className="mb-3 text-sm" style={{ color: '#DC2626' }}>
                      <strong>Pain:</strong> {card.pain}
                    </p>
                    <div>
                      <button 
                        onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                        className="text-sm font-semibold"
                        style={{ color: '#635BFF' }}
                      >
                        Solution: {expandedCard === i ? 'Hide' : 'Read more...'}
                      </button>
                      {expandedCard === i && (
                        <p className="mt-3 text-sm" style={{ color: '#0B1220' }}>
                          {card.solution}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0B1220' }}>Our Offerings</h2>
              <div className="max-w-5xl mx-auto p-10 rounded-lg" style={{ backgroundColor: '#0A2540' }}>
                <div className="mb-10">
                  <h4 className="text-2xl font-bold mb-4 text-center" style={{ color: '#635BFF' }}>Intent-Aware AI Router</h4>
                  <p className="text-center mb-2" style={{ color: '#94A3B8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    (Invisible Aggregator)
                  </p>
                  <p className="text-lg mb-8 text-center max-w-3xl mx-auto" style={{ color: '#CBD5E1' }}>
                    User never chooses a model. The system detects intent and silently routes the task.
                  </p>

                  <div className="grid md:grid-cols-5 gap-4 mb-8">
                    {[
                      { task: 'Legal reasoning', model: 'Claude' },
                      { task: 'Code refactor', model: 'GPT-4' },
                      { task: 'Market research', model: 'Perplexity' },
                      { task: 'Math proof', model: 'Gemini' },
                      { task: 'Creative copy', model: 'Mixtral' }
                    ].map((item, i) => (
                      <div key={i} className="text-center p-4 rounded" style={{ backgroundColor: 'rgba(99, 91, 255, 0.1)' }}>
                        <div className="font-semibold mb-2 text-white text-sm">{item.task}</div>
                        <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: '#635BFF', color: 'white' }}>
                          {item.model}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xl font-bold mb-4 text-white">Why this wins</h4>
                    <div className="space-y-3">
                      {[
                        'Zero friction',
                        'Feels like one super-intelligent AI',
                        'Models become replaceable commodities'
                      ].map((point, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#635BFF' }}></div>
                          <span style={{ color: '#CBD5E1' }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center p-6 rounded" style={{ backgroundColor: 'rgba(99, 91, 255, 0.15)' }}>
                    <p className="text-xl font-bold text-white leading-relaxed">
                      This is how future AI UX will look.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-8" style={{ borderColor: '#1E293B' }}>
                  <h4 className="text-2xl font-bold mb-4 text-center" style={{ color: '#635BFF' }}>Custom AIs</h4>
                  <p className="text-lg text-center" style={{ color: '#CBD5E1' }}>
                    Tailored AI agents built specifically for your organization's unique workflows, data, and business requirements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0B1220' }}>Enterprise Solutions</h2>
              <div className="flex gap-3 justify-center mb-10">
                {Object.keys(solutions).map(k => (
                  <button key={k} onClick={() => setActiveTab(k)} className="px-6 py-3 rounded font-semibold" style={{ backgroundColor: activeTab === k ? '#0A2540' : '#EEF3FA', color: activeTab === k ? 'white' : '#0B1220' }}>
                    {solutions[k].title.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="rounded-lg p-10 max-w-4xl mx-auto" style={{ backgroundColor: '#0A2540' }}>
                <h3 className="text-3xl font-bold mb-3 text-white">{solutions[activeTab].title}</h3>
                <p className="text-lg mb-8" style={{ color: '#CBD5E1' }}>{solutions[activeTab].desc}</p>
                <div className="space-y-4">
                  {solutions[activeTab].points.map((p, i) => (
                    <div key={i} className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#635BFF' }}></div><span style={{ color: '#CBD5E1' }}>{p}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#0A2540' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-10">
                {[{ n: '100+', t: 'LLMs Across Ecosystems' }, { n: '20+', t: 'Specialized Domains' }, { n: '99.9%', t: 'System Uptime' }, { n: '10×', t: 'Faster Insights' }].map((s, i) => (
                  <div key={i} className="text-center"><div className="text-5xl font-bold mb-3" style={{ color: '#635BFF' }}>{s.n}</div><div style={{ color: '#CBD5E1' }}>{s.t}</div></div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0B1220' }}>Leadership</h2>
              <div className="relative max-w-md mx-auto">
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {team.map((m, i) => (
                      <div key={i} className="w-full flex-shrink-0">
                        <div className="rounded-lg p-10 text-center border bg-white" style={{ borderColor: '#E2E8F0' }}>
                          <div className="w-32 h-32 rounded-full mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0A2540 0%, #635BFF 100%)' }}></div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B1220' }}>{m.name}</h3>
                          <p className="mb-6" style={{ color: '#475569' }}>{m.role}</p>
                          <a href="#" className="inline-flex items-center gap-2" style={{ color: '#635BFF' }}><Linkedin size={20} /> LinkedIn</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setCurrentSlide(p => p === 0 ? team.length - 1 : p - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full p-2 bg-white"><ChevronLeft size={24} /></button>
                <button onClick={() => setCurrentSlide(p => p === team.length - 1 ? 0 : p + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full p-2 bg-white"><ChevronRight size={24} /></button>
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'marketplace' && (
        <>
          <section className="relative pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #071A2E 0%, #0A2540 50%, #0B2D5B 100%)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 91, 255, 0.08) 0%, transparent 70%)' }}></div>
            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">AI Agents Marketplace</h1>
              <p className="text-xl max-w-3xl mx-auto mb-4" style={{ color: '#CBD5E1' }}>Purpose-built AI agents, each specialized for a single domain</p>
              <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#94A3B8' }}>These are not generic chatbots. Each agent is outcome-driven and optimized for precision.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setCurrentPage('login')} className="px-8 py-3 rounded font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>Login</button>
                <button onClick={() => setCurrentPage('signup')} className="px-8 py-3 rounded font-semibold border-2 border-white text-white">Sign Up</button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {agents.map((a, i) => (
                  <div key={i} className="rounded-lg p-5 border aspect-square flex flex-col bg-white" style={{ borderColor: '#E2E8F0' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#FFF4E0' }}>
                      <div style={{ color: '#C58B2A', fontSize: '20px' }}>AI</div>
                    </div>
                    <h3 className="text-base font-bold mb-1" style={{ color: '#0B1220' }}>{a.name}</h3>
                    <div className="text-xs font-semibold mb-3 uppercase" style={{ color: '#635BFF' }}>{a.domain}</div>
                    <p className="leading-snug mb-3 flex-grow text-xs" style={{ color: '#475569' }}>{a.desc}</p>
                    <button className="text-xs font-semibold mt-auto" style={{ color: '#635BFF' }}>View Agent</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#0B1220' }}>Why Specialized Agents?</h2>
              <p className="text-lg text-center max-w-4xl mx-auto mb-16" style={{ color: '#475569' }}>Generalist AI models attempt to do everything. Our agents master one domain.</p>
              <div className="grid md:grid-cols-4 gap-8">
                {[{ n: '100+', t: 'LLMs Across Ecosystems' }, { n: '20+', t: 'Specialized Domains' }, { n: '99.9%', t: 'System Uptime' }, { n: '10×', t: 'Faster Insights' }].map((s, i) => (
                  <div key={i} className="p-8 rounded-lg border text-center bg-white" style={{ borderColor: '#E2E8F0' }}>
                    <div className="text-4xl font-bold mb-3" style={{ color: '#635BFF' }}>{s.n}</div>
                    <div className="text-sm" style={{ color: '#475569' }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'login' && (
        <section className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="w-full max-w-md px-6">
            <div className="rounded-lg p-8 shadow-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#0B1220' }}>Welcome Back</h2>
              <p className="text-center mb-8" style={{ color: '#475569' }}>Log in to your Axigon AI account</p>
              {error && <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fee', color: '#c33' }}>{error}</div>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Email</label>
                  <input type="email" placeholder="you@company.com" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label>
                  <input type="password" placeholder="Enter password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2" style={{ color: '#475569' }}><input type="checkbox" />Remember me</label>
                  <a href="#" style={{ color: '#635BFF' }}>Forgot password?</a>
                </div>
                <button type="submit" className="w-full py-3 rounded font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>Log In</button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>Don't have an account? <button type="button" onClick={() => setCurrentPage('signup')} className="font-semibold" style={{ color: '#635BFF' }}>Sign up</button></p>
              </form>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'signup' && (
        <section className="min-h-screen flex items-center justify-center pt-20 pb-10" style={{ backgroundColor: '#F7FAFF' }}>
          <div className="w-full max-w-md px-6">
            <div className="rounded-lg p-8 shadow-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#0B1220' }}>Create Account</h2>
              <p className="text-center mb-8" style={{ color: '#475569' }}>Get started with Axigon AI</p>
              {error && <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fee', color: '#c33' }}>{error}</div>}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={signupData.name} onChange={(e) => setSignupData({...signupData, name: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Email</label>
                  <input type="email" placeholder="you@company.com" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Name</label>
                  <input type="text" placeholder="Your Company" value={signupData.company} onChange={(e) => setSignupData({...signupData, company: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label>
                  <input type="password" placeholder="Create password" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <label className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                  <input type="checkbox" className="mt-1" required />
                  <span>I agree to the Terms and Privacy Policy</span>
                </label>
                <button type="submit" className="w-full py-3 rounded font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>Create Account</button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>Already have an account? <button type="button" onClick={() => setCurrentPage('login')} className="font-semibold" style={{ color: '#635BFF' }}>Log in</button></p>
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
            <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold">Axigon<span style={{ color: '#635BFF' }}>AI</span></button>
            <p className="text-sm" style={{ color: '#CBD5E1' }}>© 2026 Axigon AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AxigonWebsite;
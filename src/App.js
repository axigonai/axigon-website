import React, { useState, useEffect } from 'react';
import { Play, Linkedin, ChevronLeft, ChevronRight, ArrowRight, Shield, Zap, Target } from 'lucide-react';

const AxigonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('company');
  const [activeTab, setActiveTab] = useState('consulting');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const solutions = {
    consulting: { title: 'AI Strategy Consulting', description: 'Deploy AI that delivers measurable business outcomes', points: ['Identify high-impact use cases aligned with strategic priorities', 'Build implementation roadmaps with clear ROI metrics', 'Navigate organizational change with proven frameworks'] },
    audit: { title: 'AI System Audit', description: 'Verify security, compliance, and performance at scale', points: ['Comprehensive risk assessment across AI infrastructure', 'Compliance validation against industry regulations', 'Performance optimization recommendations with quantified impact'] },
    implementation: { title: 'Implementation Services', description: 'Deploy specialized AI agents into production environments', points: ['Seamless integration with existing enterprise systems', 'Zero-downtime deployment with rollback capabilities', 'Knowledge transfer and operational readiness training'] },
    managed: { title: 'Managed AI', description: 'Continuous optimization and enterprise-grade reliability', points: ['24/7 monitoring with sub-minute incident response', 'Proactive model refinement based on production metrics', 'Dedicated technical account management'] }
  };

  const agents = [
    { name: 'ContractAI', domain: 'Legal Analysis', description: 'Extract obligations, risks, and key terms from complex legal documents with 99.2% accuracy', icon: Shield },
    { name: 'FinanceGPT', domain: 'Financial Forecasting', description: 'Generate revenue projections and scenario analysis from historical data', icon: Zap },
    { name: 'ComplianceWatch', domain: 'Regulatory Compliance', description: 'Monitor regulatory changes and flag compliance gaps across jurisdictions', icon: Target },
    { name: 'DataGuard', domain: 'Data Quality', description: 'Detect anomalies, validate schemas, and ensure data integrity across pipelines', icon: Shield },
    { name: 'CustomerInsight', domain: 'Customer Intelligence', description: 'Analyze customer behavior patterns and predict churn with recommendations', icon: Target },
    { name: 'SupplyChainAI', domain: 'Supply Chain', description: 'Optimize inventory levels and predict disruptions using logistics data', icon: Zap }
  ];

  const team = [
    { name: 'Shalini', role: 'Chief Executive Officer' },
    { name: 'Sid', role: 'Chief Technology Officer' },
    { name: 'Rachel Kim', role: 'VP of Enterprise Solutions' },
    { name: 'James Anderson', role: 'Head of AI Research' }
  ];

  const partners = ['MICROSOFT', 'AMAZON', 'GOOGLE CLOUD', 'IBM', 'ORACLE', 'SAP'];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', backgroundColor: '#fff' }}>
      <nav className="fixed w-full z-50 transition-all duration-300" style={{ backgroundColor: scrolled ? '#0A2540' : '#071A2E', boxShadow: scrolled ? '0 4px 6px rgba(0,0,0,0.1)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold text-white hover:opacity-80 transition">
            Axigon<span style={{ color: '#635BFF' }}>AI</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded font-semibold text-sm text-white transition" style={{ backgroundColor: '#635BFF' }}>Request Demo</button>
            <button className="px-6 py-2.5 rounded font-semibold text-sm border-2 border-white text-white hover:bg-white hover:text-slate-900 transition flex items-center gap-2">
              <Play size={16} /> Watch Video
            </button>
          </div>
        </div>
      </nav>

      {currentPage === 'company' && (
        <>
          <section className="relative min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #071A2E 0%, #0A2540 50%, #0B2D5B 100%)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 91, 255, 0.08) 0%, transparent 70%)' }}></div>
            <div className="relative z-10 text-center px-6 max-w-5xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Specialized AI agents built<br />for real-world impact
              </h1>
              <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-300">
                Masters of one domain, not generalist AI. Purpose-built agents that solve specific enterprise challenges with measurable precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCurrentPage('company')} className="px-8 py-4 rounded font-semibold transition bg-white text-slate-900 hover:bg-gray-100">Company</button>
                <button onClick={() => setCurrentPage('marketplace')} className="border-2 px-8 py-4 rounded font-semibold transition border-white text-white hover:bg-white hover:text-slate-900">Marketplace</button>
              </div>
            </div>
          </section>

          <section className="py-16" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-sm uppercase tracking-wider mb-10 font-medium text-gray-500">Trusted by Enterprise Leaders</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
                {partners.map((p, i) => <div key={i} className="text-center opacity-30 hover:opacity-50 transition"><div className="text-xl font-bold text-gray-700">{p}</div></div>)}
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#0B1220' }}>Enterprise Solutions</h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>Comprehensive services to assess, deploy, and optimize AI at scale</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {Object.keys(solutions).map(k => (
                  <button key={k} onClick={() => setActiveTab(k)} className="px-6 py-3 rounded font-semibold transition" style={{ backgroundColor: activeTab === k ? '#0A2540' : '#EEF3FA', color: activeTab === k ? 'white' : '#0B1220' }}>
                    {k === 'consulting' ? 'Strategy Consulting' : k === 'audit' ? 'System Audit' : k === 'implementation' ? 'Implementation' : 'Managed AI'}
                  </button>
                ))}
              </div>
              <div className="rounded-lg p-10 md:p-14 max-w-4xl mx-auto" style={{ backgroundColor: '#0A2540' }}>
                <h3 className="text-3xl font-bold mb-3 text-white">{solutions[activeTab].title}</h3>
                <p className="text-lg mb-8" style={{ color: '#CBD5E1' }}>{solutions[activeTab].description}</p>
                <div className="space-y-4">
                  {solutions[activeTab].points.map((p, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#635BFF' }}></div>
                      <span className="leading-relaxed" style={{ color: '#CBD5E1' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#0A2540' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {[{ n: '100+', t: 'LLMs, Across Open & Proprietary Ecosystems' }, { n: '20+', t: 'Domains Where Specialized AI Outperforms General Models' }, { n: '99.9%', t: 'Designed System Uptime (SLA-ready architecture)' }, { n: '10×', t: 'Faster Task-Specific Insights vs General LLMs' }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-5xl font-bold mb-3" style={{ color: '#635BFF' }}>{s.n}</div>
                    <div className="text-base leading-relaxed" style={{ color: '#CBD5E1' }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#0B1220' }}>Leadership</h2>
                <p className="text-lg" style={{ color: '#475569' }}>Built by experts who understand enterprise AI</p>
              </div>
              <div className="relative max-w-md mx-auto">
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {team.map((m, i) => (
                      <div key={i} className="w-full flex-shrink-0">
                        <div className="rounded-lg shadow-sm p-10 text-center border bg-white" style={{ borderColor: '#E2E8F0' }}>
                          <div className="w-32 h-32 rounded-full mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0A2540 0%, #635BFF 100%)' }}></div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B1220' }}>{m.name}</h3>
                          <p className="mb-6" style={{ color: '#475569' }}>{m.role}</p>
                          <a href="#" className="inline-flex items-center gap-2 font-medium" style={{ color: '#635BFF' }}><Linkedin size={20} /> LinkedIn</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setCurrentSlide(p => (p === 0 ? team.length - 1 : p - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full p-2 shadow-md bg-white"><ChevronLeft size={24} style={{ color: '#0B1220' }} /></button>
                <button onClick={() => setCurrentSlide(p => (p === team.length - 1 ? 0 : p + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full p-2 shadow-md bg-white"><ChevronRight size={24} style={{ color: '#0B1220' }} /></button>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCurrentPage('login')} className="px-8 py-3 rounded font-semibold transition text-white" style={{ backgroundColor: '#635BFF' }}>Login</button>
                <button onClick={() => setCurrentPage('signup')} className="px-8 py-3 rounded font-semibold transition border-2 border-white text-white hover:bg-white hover:text-slate-900">Sign Up</button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {agents.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="rounded-lg p-5 transition border hover:shadow-lg aspect-square flex flex-col bg-white" style={{ borderColor: '#E2E8F0' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#FFF4E0' }}><Icon size={20} style={{ color: '#C58B2A' }} /></div>
                      <h3 className="text-base font-bold mb-1" style={{ color: '#0B1220' }}>{a.name}</h3>
                      <div className="text-xs font-semibold mb-3 uppercase" style={{ color: '#635BFF' }}>{a.domain}</div>
                      <p className="leading-snug mb-3 flex-grow text-xs" style={{ color: '#475569' }}>{a.description}</p>
                      <button className="flex items-center gap-1 font-semibold text-xs mt-auto" style={{ color: '#635BFF' }}>View <ArrowRight size={14} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20" style={{ backgroundColor: '#F7FAFF' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#0B1220' }}>Why Specialized Agents?</h2>
                <p className="text-lg max-w-4xl mx-auto mb-8" style={{ color: '#475569' }}>Generalist AI models attempt to do everything. Our agents master one domain. This focus delivers higher accuracy, faster deployment, and measurable ROI.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                {[{ n: '100+', t: 'LLMs, Across Open & Proprietary Ecosystems' }, { n: '20+', t: 'Domains Where Specialized AI Outperforms' }, { n: '99.9%', t: 'System Uptime (SLA-ready)' }, { n: '10×', t: 'Faster vs General LLMs' }].map((s, i) => (
                  <div key={i} className="p-8 rounded-lg shadow-sm border text-center bg-white" style={{ borderColor: '#E2E8F0' }}>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Email</label>
                  <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label>
                  <input type="password" placeholder="Enter your password" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2" style={{ color: '#475569' }}><input type="checkbox" />Remember me</label>
                  <a href="#" style={{ color: '#635BFF' }}>Forgot password?</a>
                </div>
                <button className="w-full py-3 rounded font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>Log In</button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>Don't have an account? <button onClick={() => setCurrentPage('signup')} className="font-semibold" style={{ color: '#635BFF' }}>Sign up</button></p>
              </div>
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
              <div className="space-y-4">
                <div><label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Full Name</label><input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></div>
                <div><label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Email</label><input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></div>
                <div><label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Company Name</label><input type="text" placeholder="Your Company" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></div>
                <div><label className="block text-sm font-semibold mb-2" style={{ color: '#0B1220' }}>Password</label><input type="password" placeholder="Create a password" className="w-full px-4 py-3 rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></div>
                <label className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}><input type="checkbox" className="mt-1" /><span>I agree to the Terms of Service and Privacy Policy</span></label>
                <button className="w-full py-3 rounded font-semibold text-white" style={{ backgroundColor: '#635BFF' }}>Create Account</button>
                <p className="text-center text-sm" style={{ color: '#475569' }}>Already have an account? <button onClick={() => setCurrentPage('login')} className="font-semibold" style={{ color: '#635BFF' }}>Log in</button></p>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="py-16 text-white" style={{ backgroundColor: '#071A2E' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {[{ h: 'Company', l: ['About', 'Careers', 'Press'] }, { h: 'Solutions', l: ['AI Agents', 'Consulting', 'Audit'] }, { h: 'Resources', l: ['Blog', 'Case Studies', 'Documentation'] }, { h: 'Legal', l: ['Privacy Policy', 'Terms', 'Security'] }].map((c, i) => (
              <div key={i}><h4 className="text-lg font-bold mb-6">{c.h}</h4><ul className="space-y-3" style={{ color: '#CBD5E1' }}>{c.l.map((link, j) => <li key={j}><a href="#" className="hover:opacity-80">{link}</a></li>)}</ul></div>
            ))}
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #1E293B' }}>
            <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold hover:opacity-80">Axigon<span style={{ color: '#635BFF' }}>AI</span></button>
            <p className="text-sm" style={{ color: '#CBD5E1' }}>© 2026 Axigon AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AxigonWebsite;
import React, { useState, useEffect, useRef } from 'react';
import { Play, Linkedin, ChevronLeft, ChevronRight, ArrowRight, Shield, Zap, Target } from 'lucide-react';

const AxigonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('company');
  const [activeTab, setActiveTab] = useState('consulting');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = {
    consulting: {
      title: 'AI Strategy Consulting',
      description: 'Deploy AI that delivers measurable business outcomes',
      points: [
        'Identify high-impact use cases aligned with strategic priorities',
        'Build implementation roadmaps with clear ROI metrics',
        'Navigate organizational change with proven frameworks'
      ]
    },
    audit: {
      title: 'AI System Audit',
      description: 'Verify security, compliance, and performance at scale',
      points: [
        'Comprehensive risk assessment across AI infrastructure',
        'Compliance validation against industry regulations',
        'Performance optimization recommendations with quantified impact'
      ]
    },
    implementation: {
      title: 'Implementation Services',
      description: 'Deploy specialized AI agents into production environments',
      points: [
        'Seamless integration with existing enterprise systems',
        'Zero-downtime deployment with rollback capabilities',
        'Knowledge transfer and operational readiness training'
      ]
    },
    managed: {
      title: 'Managed AI',
      description: 'Continuous optimization and enterprise-grade reliability',
      points: [
        '24/7 monitoring with sub-minute incident response',
        'Proactive model refinement based on production metrics',
        'Dedicated technical account management'
      ]
    }
  };

  const agents = [
    { name: 'ContractAI', domain: 'Legal Contract Analysis', description: 'Extract obligations, risks, and key terms from complex legal documents with 99.2% accuracy', icon: Shield },
    { name: 'FinanceGPT', domain: 'Financial Forecasting', description: 'Generate revenue projections and scenario analysis from historical data and market indicators', icon: Zap },
    { name: 'ComplianceWatch', domain: 'Regulatory Compliance', description: 'Monitor regulatory changes and flag compliance gaps across multiple jurisdictions', icon: Target },
    { name: 'DataGuard', domain: 'Data Quality Assurance', description: 'Detect anomalies, validate schemas, and ensure data integrity across pipelines', icon: Shield },
    { name: 'CustomerInsight', domain: 'Customer Intelligence', description: 'Analyze customer behavior patterns and predict churn with actionable recommendations', icon: Target },
    { name: 'SupplyChainAI', domain: 'Supply Chain Optimization', description: 'Optimize inventory levels and predict disruptions using real-time logistics data', icon: Zap }
  ];

  const team = [
    { name: 'Shalini', role: 'Chief Executive Officer', linkedin: '#' },
    { name: 'Sid', role: 'Chief Technology Officer', linkedin: '#' },
    { name: 'Rachel Kim', role: 'VP of Enterprise Solutions', linkedin: '#' },
    { name: 'James Anderson', role: 'Head of AI Research', linkedin: '#' }
  ];

  const partners = ['MICROSOFT', 'AMAZON', 'GOOGLE CLOUD', 'IBM', 'ORACLE', 'SAP'];

  const CompanyPage = () => (
    <>
      <section className="relative min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #071A2E 0%, #0A2540 50%, #0B2D5B 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 91, 255, 0.08) 0%, transparent 70%)' }}></div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Specialized AI agents built<br />for real-world impact
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-300">
            Masters of one domain, not generalist AI. Purpose-built agents that solve specific enterprise challenges with measurable precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setCurrentPage('company')} className="px-8 py-4 rounded font-semibold transition-all bg-white text-slate-900">Company</button>
            <button onClick={() => setCurrentPage('marketplace')} className="border-2 px-8 py-4 rounded font-semibold transition-all border-white text-white hover:bg-white hover:text-slate-900">Marketplace</button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm uppercase tracking-wider mb-10 font-medium text-gray-500">Trusted by Enterprise Leaders</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {partners.map((partner, idx) => (
              <div key={idx} className="text-center opacity-30 hover:opacity-50 transition-opacity duration-300">
                <div className="text-xl font-bold tracking-tight text-gray-700">{partner}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Enterprise Solutions</h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">Comprehensive services to assess, deploy, and optimize AI at scale</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['consulting', 'audit', 'implementation', 'managed'].map((key) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`px-6 py-3 rounded font-semibold transition-all duration-200 ${activeTab === key ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-900'}`}>
                {key === 'consulting' ? 'Strategy Consulting' : key === 'audit' ? 'System Audit' : key === 'implementation' ? 'Implementation' : 'Managed AI'}
              </button>
            ))}
          </div>

          <div className="rounded-lg p-10 md:p-14 max-w-4xl mx-auto bg-slate-900 text-white">
            <h3 className="text-3xl font-bold mb-3">{solutions[activeTab].title}</h3>
            <p className="text-lg mb-8 text-gray-300">{solutions[activeTab].description}</p>
            <div className="space-y-4">
              {solutions[activeTab].points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-indigo-500"></div>
                  <span className="leading-relaxed text-gray-200">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="text-5xl font-bold mb-3 text-indigo-500">100+</div>
              <div className="text-base leading-relaxed text-gray-300">LLMs, Across Open & Proprietary Ecosystems</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3 text-indigo-500">20+</div>
              <div className="text-base leading-relaxed text-gray-300">Domains Where Specialized AI Outperforms General Models</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3 text-indigo-500">99.9%</div>
              <div className="text-base leading-relaxed text-gray-300">Designed System Uptime (SLA-ready architecture)</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3 text-indigo-500">10×</div>
              <div className="text-base leading-relaxed text-gray-300">Faster Task-Specific Insights vs General LLMs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Leadership</h2>
            <p className="text-lg text-gray-600">Built by experts who understand enterprise AI</p>
          </div>
          
          <div className="relative max-w-md mx-auto">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {team.map((member, idx) => (
                  <div key={idx} className="w-full flex-shrink-0">
                    <div className="rounded-lg shadow-sm p-10 text-center border bg-white border-gray-200">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-slate-800 to-indigo-600"></div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-900">{member.name}</h3>
                      <p className="mb-6 text-gray-600">{member.role}</p>
                      <a href={member.linkedin} className="inline-flex items-center gap-2 font-medium transition text-indigo-600">
                        <Linkedin size={20} /> LinkedIn
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? team.length - 1 : prev - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full p-2 shadow-md transition bg-white">
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <button onClick={() => setCurrentSlide((prev) => (prev === team.length - 1 ? 0 : prev + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full p-2 shadow-md transition bg-white">
              <ChevronRight size={24} className="text-slate-900" />
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const MarketplacePage = () => (
    <>
      <section className="relative pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #071A2E 0%, #0A2540 50%, #0B2D5B 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 91, 255, 0.08) 0%, transparent 70%)' }}></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">AI Agents Marketplace</h1>
          <p className="text-xl max-w-3xl mx-auto mb-4 text-gray-300">Purpose-built AI agents, each specialized for a single domain</p>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-400">These are not generic chatbots. Each agent is outcome-driven and optimized for precision.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setCurrentPage('login')} className="px-8 py-3 rounded font-semibold transition-all bg-indigo-600 hover:bg-indigo-700 text-white">Login</button>
            <button onClick={() => setCurrentPage('signup')} className="px-8 py-3 rounded font-semibold transition-all border-2 border-white text-white hover:bg-white hover:text-slate-900">Sign Up</button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <div key={idx} className="rounded-lg p-5 transition-shadow duration-200 border hover:shadow-lg aspect-square flex flex-col bg-white border-gray-200">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-amber-50">
                    <Icon size={20} className="text-amber-600" />
                  </div>
                  <h3 className="text-base font-bold mb-1 text-slate-900">{agent.name}</h3>
                  <div className="text-xs font-semibold mb-3 uppercase tracking-wide text-indigo-600">{agent.domain}</div>
                  <p className="leading-snug mb-3 flex-grow text-xs text-gray-600">{agent.description}</p>
                  <button className="flex items-center gap-1 font-semibold transition text-xs mt-auto text-indigo-600">View <ArrowRight size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Why Specialized Agents?</h2>
            <p className="text-lg leading-relaxed mb-8 max-w-4xl mx-auto text-gray-700">Generalist AI models attempt to do everything. Our agents master one domain. This focus delivers higher accuracy, faster deployment, and measurable ROI in weeks, not quarters.</p>
            <p className="max-w-3xl mx-auto text-gray-600">Each agent is trained on domain-specific data, validated against industry benchmarks, and continuously refined in production environments.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {['100+', '20+', '99.9%', '10×'].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-lg shadow-sm border text-center bg-white border-gray-200">
                <div className="text-4xl font-bold mb-3 text-indigo-600">{stat}</div>
                <div className="text-sm leading-relaxed text-gray-700">
                  {idx === 0 ? 'LLMs, Across Open & Proprietary Ecosystems' : idx === 1 ? 'Domains Where Specialized AI Outperforms General Models' : idx === 2 ? 'Designed System Uptime (SLA-ready architecture)' : 'Faster Task-Specific Insights vs General LLMs'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const LoginPage = () => (
    <section className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="rounded-lg p-8 shadow-lg border bg-white border-gray-200">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Welcome Back</h2>
          <p className="text-center mb-8 text-gray-600">Log in to your Axigon AI account</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Email</label>
              <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-indigo-600">Forgot password?</a>
            </div>
            
            <button className="w-full py-3 rounded font-semibold transition-all bg-indigo-600 hover:bg-indigo-700 text-white">Log In</button>
            
            <p className="text-center text-sm text-gray-600">
              Don't have an account? <button onClick={() => setCurrentPage('signup')} className="font-semibold text-indigo-600">Sign up</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const SignupPage = () => (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="rounded-lg p-8 shadow-lg border bg-white border-gray-200">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Create Account</h2>
          <p className="text-center mb-8 text-gray-600">Get started with Axigon AI</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Company Email</label>
              <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Company Name</label>
              <input type="text" placeholder="Your Company" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Password</label>
              <input type="password" placeholder="Create a password" className="w-full px-4 py-3 rounded border outline-none transition border-gray-300 focus:border-indigo-600" />
            </div>
            
            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="mt-1 rounded" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            
            <button className="w-full py-3 rounded font-semibold transition-all bg-indigo-600 hover:bg-indigo-700 text-white">Create Account</button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account? <button onClick={() => setCurrentPage('login')} className="font-semibold text-indigo-600">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`} style={{ backgroundColor: scrolled ? '#0A2540' : '#071A2E' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition text-white">
            Axigon<span className="text-indigo-500">AI</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded font-semibold transition-all text-sm bg-indigo-600 hover:bg-indigo-700 text-white">Request Demo</button>
            <button className="px-6 py-2.5 rounded font-semibold transition-all flex items-center gap-2 text-sm border-2 border-white text-white hover:bg-white hover:text-slate-900">
              <Play size={16} /> Watch Video
            </button>
          </div>
        </div>
      </nav>

      {currentPage === 'company' ? <CompanyPage /> : currentPage === 'marketplace' ? <MarketplacePage /> : currentPage === 'login' ? <LoginPage /> : <SignupPage />}

      <footer className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-indigo-500 transition">About</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Solutions</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-indigo-500 transition">AI Agents</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Consulting</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Audit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-indigo-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Case Studies</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-indigo-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-800">
            <button onClick={() => setCurrentPage('company')} className="text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition">
              Axigon<span className="text-indigo-500">AI</span>
            </button>
            <p className="text-sm text-gray-400">© 2026 Axigon AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AxigonWebsite;
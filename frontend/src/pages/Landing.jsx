import React from 'react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { UserAvatar, DocumentAdd, CloudUpload, CurrencyDollar, Calculator, Chat, CheckmarkOutline, ArrowRight, DocumentProtected, Building, Security, Login, UserAvatarFilledAlt } from '@carbon/icons-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Header — floats over the hero */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          Fix &amp; Flip Lending
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/login" title="Log In" style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', textDecoration: 'none',
          }}>
            <Login size={20} />
          </Link>
          <Link to="/register" title="Sign Up" style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', textDecoration: 'none',
          }}>
            <UserAvatarFilledAlt size={20} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative' }}>
        <BeforeAfterSlider
          beforeSrc="/before.jpg"
          afterSrc="/after.jpg"
        />
        {/* Overlay text */}
        <div className="hero-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', textAlign: 'center',
          padding: '2rem',
          pointerEvents: 'none',
        }}>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>
            Fast Funding for Fix &amp; Flip Projects
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto 2rem', textShadow: '0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>
            Apply online, track your loan, and close faster. Serving investors in Kansas, Missouri, Texas, and Georgia.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
            <Link to="/register" className="btn" style={{
              backgroundColor: 'white', color: 'var(--primary)', fontWeight: 600,
              padding: '0.875rem 2rem', fontSize: '1.1rem'
            }}>
              Apply Now
            </Link>
            <a href="#how-it-works" className="btn" style={{
              backgroundColor: 'transparent', color: 'white', border: '2px solid white',
              padding: '0.875rem 2rem', fontSize: '1.1rem', textDecoration: 'none'
            }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" style={{
        display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
        padding: '3rem 2rem', backgroundColor: 'white'
      }}>
        {[
          { value: '4 States', label: 'KS, MO, TX, GA' },
          { value: '75% LTV', label: 'Up to 75% loan-to-value' },
          { value: 'Fast Close', label: 'Streamlined approvals' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card" style={{ textAlign: 'center', minWidth: '160px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{stat.value}</div>
            <div style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '5rem 2rem', backgroundColor: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: '3rem', fontSize: '1.05rem' }}>
            From application to funding in four simple steps
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { icon: <UserAvatar size={28} />, title: 'Create an Account', desc: 'Sign up in minutes with your basic info and state of operation.' },
              { icon: <DocumentAdd size={28} />, title: 'Submit Your Deal', desc: 'Enter property details, purchase price, repair budget, and ARV.' },
              { icon: <CloudUpload size={28} />, title: 'Upload Documents', desc: 'Securely upload contracts, estimates, and supporting docs.' },
              { icon: <CurrencyDollar size={28} />, title: 'Get Funded', desc: 'Track your approval status and communicate directly with your loan officer.' },
            ].map((item, i, arr) => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                {/* Timeline column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    backgroundColor: 'var(--primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(30,64,175,0.25)',
                  }}>
                    {item.icon}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: '2px', height: '40px', backgroundColor: 'var(--gray-300)' }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingTop: '0.75rem', paddingBottom: i < arr.length - 1 ? '0' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step {i + 1}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
            Built for Real Estate Investors
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: '3rem', fontSize: '1.05rem' }}>
            Everything you need to manage your fix &amp; flip pipeline
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Calculator size={24} />, title: 'Loan Calculators', desc: 'Estimate your max loan amount, project ROI, ARV, and monthly payments before you apply.' },
              { icon: <DocumentProtected size={24} />, title: 'Document Portal', desc: 'Upload and manage all your deal documents in one secure place.' },
              { icon: <Chat size={24} />, title: 'Direct Messaging', desc: 'Communicate with your loan officer without leaving the portal.' },
              { icon: <CheckmarkOutline size={24} />, title: 'Real-Time Tracking', desc: 'See exactly where your application stands from submission to funding.' },
              { icon: <Building size={24} />, title: 'State Compliance', desc: 'Built-in compliance fields for KS, MO, TX, and GA regulations.' },
              { icon: <Security size={24} />, title: 'Secure & Private', desc: 'Industry-standard encryption, authentication, and role-based access controls.' },
            ].map((feature) => (
              <div key={feature.title} style={{
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--gray-200)',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '0.5rem',
                  backgroundColor: 'rgba(30,64,175,0.08)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--gray-800)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white', textAlign: 'center', padding: '4rem 2rem'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Fund Your Next Deal?</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>
          Create your free account and submit your first application today.
        </p>
        <Link to="/register" className="btn" style={{
          backgroundColor: 'white', color: 'var(--primary)', fontWeight: 600,
          padding: '0.875rem 2rem', fontSize: '1.1rem'
        }}>
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem', textAlign: 'center',
        color: 'var(--gray-500)', fontSize: '0.875rem'
      }}>
        Fix &amp; Flip Lending Portal &mdash; Kansas, Missouri, Texas, Georgia
      </footer>
    </div>
  );
};

export default Landing;

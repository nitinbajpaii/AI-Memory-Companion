import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, ExternalLink, ArrowRight, Globe } from 'lucide-react';

const footerNav = {
  Product: [
    { label: 'Features',     to: '/#features' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Testimonials', to: '/#testimonials' },
    { label: 'Pricing',      to: '#' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact',  to: '/contact' },
    { label: 'Blog',     to: '#' },
    { label: 'Careers',  to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Use',   to: '#' },
    { label: 'Cookie Policy',  to: '#' },
    { label: 'GDPR',           to: '#' },
  ],
};

const socialsRaw = [
  { label: 'Website',  href: '#',                            icon: Globe },
  { label: 'Email',    href: 'mailto:support.aimemorycompanion.com',  icon: Mail },
  { label: 'Docs',     href: '#',                            icon: ExternalLink },
];

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
  <footer className="glass-dark border-t border-white/6 mt-auto">

    {/* ── CTA strip ── */}
    <div className="border-b border-white/6">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-white mb-1">
            Begin your healing journey today.
          </h3>
          <p className="text-sm text-gray-500">Free forever. No credit card required.</p>
        </div>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 shrink-0"
        >
          Get Started Free <ArrowRight size={16} />
        </Link>
      </div>
    </div>

    {/* ── Main grid ── */}
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">

      {/* Brand column */}
      <div className="col-span-2">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 mb-5 w-fit group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <span className="font-black text-sm gradient-text">AI Memory Companion</span>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-7">
          An emotionally intelligent space to honor your loved ones, preserve memories, and find comfort through AI-assisted healing.
        </p>

        {/* Socials */}
        <div className="flex gap-2">
          {socialsRaw.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-xl glass-card border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:border-primary/25 hover:bg-primary/10 transition-all"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>

      {/* Link columns */}
      {Object.entries(footerNav).map(([section, links]) => (
        <div key={section}>
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5">
            {section}
          </h4>
          <ul className="space-y-3">
            {links.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-200 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* ── Bottom bar ── */}
    <div className="border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Heart size={11} className="text-primary fill-primary" />
          <span>© {new Date().getFullYear()} AI Memory Companion. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

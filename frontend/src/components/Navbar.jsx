import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    document.body.classList.remove('overflow-hidden');

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 transition-all duration-300 ${isScrolled ? 'bg-black/85 backdrop-blur-md py-4 border-b border-gray-900/80' : ''}`}>
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex flex-col select-none">
          <div className="font-heading font-black text-2xl tracking-[0.15em] leading-none uppercase">
            SQUID<br />
            H<span className="triangle-a text-[0.8em] -translate-y-[0.1em]"></span>CK
          </div>
          <div className="text-squid-pink text-[10px] font-bold tracking-[0.2em] mt-2">
            &lt;/ HACKATHON &gt;
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-squid-pink">HOME</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-gray-300 hover:text-white transition-colors">ABOUT</a>
          <a href="#schedule" onClick={(e) => handleNavClick(e, 'schedule')} className="text-gray-300 hover:text-white transition-colors">SCHEDULE</a>
          <a href="#challenges" onClick={(e) => handleNavClick(e, 'challenges')} className="text-gray-300 hover:text-white transition-colors">CHALLENGES</a>
          <a href="#prizes" onClick={(e) => handleNavClick(e, 'prizes')} className="text-gray-300 hover:text-white transition-colors">PRIZES</a>
          <a href="#rules" onClick={(e) => handleNavClick(e, 'rules')} className="text-gray-300 hover:text-white transition-colors">RULES</a>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="text-gray-300 hover:text-white transition-colors">FAQ</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-gray-300 hover:text-white transition-colors">CONTACT</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/register" 
            className="hidden sm:flex items-center justify-center gap-2 border border-squid-pink text-squid-pink px-4 py-2 rounded-sm text-[10px] sm:text-xs font-bold tracking-[0.2em] hover:bg-squid-pink/10 transition-colors uppercase bg-black/40 backdrop-blur-sm z-50"
          >
            Enter The Game
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </Link>

          <button onClick={toggleMenu} className="lg:hidden text-gray-300 hover:text-squid-pink transition-colors focus:outline-none z-50 p-2" aria-label="Toggle Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-center items-center gap-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex gap-3 text-squid-pink text-sm opacity-60">
          <span>◯</span>
          <span>△</span>
          <span>◻</span>
        </div>
        <nav className="flex flex-col items-center gap-6 text-sm font-bold tracking-[0.25em] uppercase font-tech">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="mobile-nav-link text-squid-pink">HOME</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">ABOUT</a>
          <a href="#schedule" onClick={(e) => handleNavClick(e, 'schedule')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">SCHEDULE</a>
          <a href="#challenges" onClick={(e) => handleNavClick(e, 'challenges')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">CHALLENGES</a>
          <a href="#prizes" onClick={(e) => handleNavClick(e, 'prizes')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">PRIZES</a>
          <a href="#rules" onClick={(e) => handleNavClick(e, 'rules')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">RULES</a>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">FAQ</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="mobile-nav-link text-gray-300 hover:text-white transition-colors">CONTACT</a>
        </nav>
        <Link 
          to="/register" 
          onClick={() => { setIsOpen(false); document.body.classList.remove('overflow-hidden'); }} 
          className="mobile-nav-link flex items-center justify-center gap-2 border border-squid-pink text-squid-pink px-6 py-3 rounded-sm text-xs font-bold tracking-[0.2em] hover:bg-squid-pink/10 transition-colors uppercase bg-black/40 backdrop-blur-sm mt-4 shadow-[0_0_15px_rgba(249,0,77,0.2)]"
        >
          Enter The Game
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </Link>
      </div>
    </>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import TimelineStage from '../components/TimelineStage.jsx';
import TrackCard from '../components/TrackCard.jsx';
import PrizeCard from '../components/PrizeCard.jsx';
import OrganizerCard from '../components/OrganizerCard.jsx';
import FAQItem from '../components/FAQItem.jsx';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState('00:00:00:00');

  // Countdown timer to August 1, 2026, 12:00 PM (IST)
  useEffect(() => {
    const targetDate = new Date("2026-08-01T12:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00:00");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (num) => String(num).padStart(2, '0');
      setTimeLeft(`${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden">
        {/* Ambient backgrounds */}
        <div className="ambient-bg pointer-events-none"></div>
        <div className="texture-overlay pointer-events-none"></div>

        {/* Blood Splatter Mark */}
        <div className="fixed bottom-0 left-0 w-[60%] md:w-[40%] max-w-[600px] h-[80vh] pointer-events-none z-0 mix-blend-screen opacity-90 flex items-end">
          <img 
            src="/blood_splatter.png" 
            onError={(e) => { e.target.style.display = 'none'; }} 
            alt="Blood Splatter"
            className="w-full h-auto object-contain object-bottom transform -translate-x-12 md:-translate-x-20"
          />
        </div>

        {/* Animated Neon Shapes */}
        <div className="fixed top-[12%] left-1/2 -translate-x-1/2 flex gap-8 md:gap-14 text-squid-pink font-black text-6xl md:text-8xl opacity-30 z-0 pointer-events-none">
          <span className="animate-character-delayed-2 drop-shadow-[0_0_25px_rgba(249,0,77,0.9)]">◯</span>
          <span className="animate-character drop-shadow-[0_0_25px_rgba(249,0,77,0.9)]">△</span>
          <span className="animate-character-delayed-1 drop-shadow-[0_0_25px_rgba(249,0,77,0.9)] scale-125 translate-y-[2px] inline-block">□</span>
</div>

        {/* Animated Guards Group */}
        <div className="fixed bottom-0 left-0 z-0 w-full h-[100svh] pointer-events-none overflow-hidden mix-blend-screen">
          <div className="absolute bottom-[10%] left-[45%] md:left-[35%] -translate-x-1/2 w-[180%] md:w-[130%] lg:w-[110%] max-w-[1400px] flex items-end justify-center z-10">
            {/* Far Left Guard */}
            <div className="absolute bottom-[12%] left-[2%] w-[24%] opacity-60 animate-character-delayed-2 z-10 mix-blend-screen">
              <img src="/squid_guard.png" alt="Squid Guard" className="w-full h-auto object-contain object-bottom scale-110" />
            </div>
            {/* Inner Left Guard */}
            <div className="absolute bottom-[6%] left-[18%] w-[28%] opacity-80 animate-character-delayed-1 z-20 mix-blend-screen">
              <img src="/squid_guard.png" alt="Squid Guard" className="w-full h-auto object-contain object-bottom scale-[1.15]" />
            </div>
            {/* Inner Right Guard */}
            <div className="absolute bottom-[6%] right-[18%] w-[28%] opacity-80 animate-character-delayed-2 z-20 mix-blend-screen">
              <img src="/squid_guard.png" alt="Squid Guard" className="w-full h-auto object-contain object-bottom scale-[1.15]" />
            </div>
            {/* Center Guard */}
            <div className="relative w-[35%] z-30 animate-character mix-blend-screen">
              <img src="/squid_guard.png" alt="Squid Guard" className="w-full h-auto object-contain object-bottom scale-[1.25]" />
            </div>
          </div>

          {/* Giant Guard Foreground */}
          <div className="absolute bottom-[-15%] md:bottom-[-20%] lg:bottom-[-25%] right-[-30%] md:right-[-10%] w-[130%] md:w-[80%] lg:w-[65%] max-w-[1000px] z-20 animate-character mix-blend-screen">
            <img src="/squid_guard.png" alt="Squid Guard Giant" className="w-full h-auto object-contain object-bottom" />
          </div>
        </div>

        {/* Main Grid Content */}
        <main className="relative z-20 flex-grow flex flex-col lg:flex-row w-full px-8 lg:px-16 pt-32 pb-48 h-full min-h-screen">
         
          {/* Left Details */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center pt-10">
          <div className="flex gap-3 text-squid-pink opacity-80 mb-6">
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
  </svg>

  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M12 5L19 19H5L12 5Z" stroke="currentColor" strokeWidth="2"/>
  </svg>

  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="2"/>
  </svg>
</div>
            <div className="text-gray-400 text-xs md:text-sm tracking-[0.3em] font-semibold mb-1">
              ARE YOU READY TO
            </div>
            <div className="text-squid-pink text-2xl md:text-3xl font-black tracking-widest mb-4 uppercase">
              PLAY THE GAME?
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-black leading-[0.9] tracking-[0.05em] uppercase mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              <span class="text-white">SQUID</span><br />
              <span class="text-white flex items-center">
                H<span class="triangle-a text-[0.85em] mx-1 lg:mx-2 -translate-y-[0.05em]"></span>CK
              </span>
            </h1>

            <div className="text-squid-pink text-lg md:text-xl font-bold tracking-[0.2em] mb-6">
              &lt; / HACKATHON 2026 &gt;
            </div>

            <div className="border border-squid-pink text-squid-pink px-4 py-2 text-xs font-semibold tracking-widest flex items-center gap-2 rounded-sm bg-black/40 backdrop-blur-sm w-max -mt-2">
              SCYP CLUB <span className="text-[10px] ml-1">◎</span>
            </div>
          </div>

          <div className="w-full lg:w-[20%]"></div>

          {/* Right Timeline Stepper */}
          <div id="timeline" className="w-full lg:w-[40%] flex flex-col items-end justify-center mt-20 lg:mt-0 relative pr-4 lg:pr-12">
            <div className="text-squid-pink tracking-[0.3em] text-sm font-bold mb-10 border-l-2 border-squid-pink pl-3 py-1">
              | PATH TO ENTER |
            </div>

            <div className="relative flex flex-col gap-10 lg:gap-14 pr-2">
              <div className="timeline-line">
                <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] overflow-hidden">
                  <div className="animate-flow-line-hero"></div>
                </div>
              </div>

              {/* Register */}
              <Link to="/register" className="flex items-center gap-6 justify-end relative z-10 group cursor-pointer">
                <div className="text-gray-400 text-xs md:text-sm tracking-widest font-bold group-hover:text-squid-pink transition-colors animate-timeline-text">
                  REGISTER
                </div>
                <div className="w-10 h-10 rounded-full border border-squid-pink bg-[#0a0003] flex items-center justify-center shrink-0 animate-timeline-circle">
                  <svg className="w-4 h-4 text-squid-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </Link>

              {/* PPT Submission */}
              <div className="flex items-center gap-6 justify-end relative z-10 group">
                <div className="text-gray-400 text-xs md:text-sm tracking-widest font-bold animate-timeline-text timeline-delay-1">
                  PPT SUBMISSION
                </div>
                <div className="w-10 h-10 rounded-full border border-squid-pink bg-[#0a0003] flex items-center justify-center shrink-0 animate-timeline-circle timeline-delay-1">
                  <svg className="w-4 h-4 text-squid-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>

              {/* Shortlisted */}
              <div className="flex items-center gap-6 justify-end relative z-10 group">
                <div className="text-gray-400 text-xs md:text-sm tracking-widest font-bold animate-timeline-text timeline-delay-2">
                  SHORTLISTED
                </div>
                <div className="w-10 h-10 rounded-full border border-squid-pink bg-[#0a0003] flex items-center justify-center shrink-0 animate-timeline-circle timeline-delay-2">
                  <svg className="w-4 h-4 text-squid-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>

              {/* Grand Finale */}
              <div className="flex items-center gap-6 justify-end relative z-10 group">
                <div className="text-gray-400 text-xs md:text-sm tracking-widest font-bold animate-timeline-text timeline-delay-3">
                  GRAND FINALE
                </div>
                <div className="w-10 h-10 rounded-full border border-squid-pink bg-[#0a0003] flex items-center justify-center shrink-0 animate-timeline-circle timeline-delay-3">
                  <svg className="w-4 h-4 text-squid-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 text-[10px] tracking-[0.4em] origin-right whitespace-nowrap hidden lg:block">
              LET THE GAMES BEGIN <span className="text-squid-pink">▷</span>
            </div>
          </div>
        </main>

        {/* Bottom Event Details Bar */}
        <div className="relative lg:absolute bottom-auto lg:bottom-16 left-0 right-0 px-8 lg:px-16 z-30 mt-12 lg:mt-0 pb-16 lg:pb-0">
          <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-800 rounded-sm flex flex-col lg:flex-row shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
              <div className="p-6 flex items-center gap-4">
                <svg className="w-8 h-8 text-squid-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-1">DATE</span>
                  <span className="text-gray-200 text-xs font-semibold tracking-wide leading-snug">1ST - 2ND<br />AUGUST, 2026</span>
                </div>
              </div>
              <div className="p-6 flex items-center gap-4">
                <svg className="w-8 h-8 text-squid-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-1">VENUE</span>
                  <span className="text-gray-200 text-xs font-semibold tracking-wide leading-snug">M BLOCK<br />SAGE UNIVERSITY<br />INDORE</span>
                </div>
              </div>
              <div className="p-6 flex items-center gap-4">
                <svg className="w-8 h-8 text-squid-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-1">TEAM SIZE</span>
                  <span className="text-gray-200 text-xs font-semibold tracking-wide leading-snug">1 - 4<br />MEMBERS</span>
                </div>
              </div>
              <div className="p-6 flex items-center gap-4">
                <svg className="w-8 h-8 text-squid-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-1">THEME</span>
                  <span className="text-gray-200 text-xs font-semibold tracking-wide leading-snug">INNOVATE. SOLVE.<br />SURVIVE.</span>
                </div>
              </div>
            </div>

            {/* Prize Box */}
            <div className="prize-box p-6 lg:px-10 flex items-center justify-center relative group border-t lg:border-t-0 lg:border-l border-gray-800 lg:w-[350px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-r-sm">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="text-6xl">△</span>
                </div>
              </div>
              <div className="absolute left-[5%] lg:left-[-3rem] top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 z-20">
                <img src="/fontMan mask.png" onError={(e) => { e.target.style.display = 'none'; }} alt="Frontman Mask" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
              </div>
              <div className="flex flex-col relative z-10 pl-24 lg:pl-16 w-full text-center lg:text-left">
                <span className="text-white text-[10px] font-bold tracking-[0.15em] mb-1 opacity-90">WIN EPIC PRIZES<br />WORTH</span>
                <span className="text-white text-xl font-black tracking-wide">₹1,10,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Very Bottom Footer Row */}
        <div className="absolute bottom-4 left-0 w-full px-12 flex justify-between items-center text-[10px] text-gray-600 tracking-[0.3em] font-bold z-20">
          <div className="flex gap-2">
            <span>◯</span>
            <span>△</span>
            <span className="text-sm leading-none -translate-y-[2px]">◻</span>
          </div>
          <div className="flex items-center gap-4">
            <span>◯</span>
            <span>SURVIVE. CODE. WIN.</span>
            <span className="text-squid-pink">▷</span>
          </div>
          <div className="w-[50px]"></div>
        </div>
      </section>

      {/* SURVIVAL STATS SECTION */}
      <section id="survival-stats" className="relative py-24 px-8 lg:px-16 bg-transparent border-t-2 border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,0,77,0.06)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-3 text-squid-pink text-sm mb-4">
              <span>◯</span>
              <span>△</span>
              <span>◻</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-black tracking-widest uppercase mb-4">
              THE <span className="text-squid-pink">STAKES</span> ARE HIGH
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed italic">
              "300+ players entered. Only the best innovators survive."
            </p>
            <div className="text-squid-pink text-xs md:text-sm tracking-[0.2em] font-bold uppercase mt-4 animate-pulse">
              Outplay. Outcode. Survive.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-black/50 backdrop-blur-md border border-gray-800 p-8 rounded-sm hover:border-squid-pink hover:shadow-[0_0_25px_rgba(249,0,77,0.15)] transition-all duration-500 text-center relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-9xl text-gray-900/30 group-hover:text-squid-pink/5 font-black transition-colors duration-500 pointer-events-none select-none">
                △
              </div>
              <div className="text-squid-pink text-4xl md:text-5xl font-tech font-black mb-4 drop-shadow-[0_0_10px_rgba(249,0,77,0.4)]">75+</div>
              <div className="text-white font-heading font-black tracking-widest text-lg mb-2">FINALIST TEAMS</div>
              <p className="text-gray-500 text-xs font-semibold tracking-wider">LOCKED IN THE CODING ARENA</p>
            </div>

            <div className="bg-black/50 backdrop-blur-md border border-gray-800 p-8 rounded-sm hover:border-squid-pink hover:shadow-[0_0_25px_rgba(249,0,77,0.15)] transition-all duration-500 text-center relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-9xl text-gray-900/30 group-hover:text-squid-pink/5 font-black transition-colors duration-500 pointer-events-none select-none">
                ◯
              </div>
              <div className="text-squid-pink text-4xl md:text-5xl font-tech font-black mb-4 drop-shadow-[0_0_10px_rgba(249,0,77,0.4)]">300+</div>
              <div className="text-white font-heading font-black tracking-widest text-lg mb-2">PLAYERS</div>
              <p class="text-gray-500 text-xs font-semibold tracking-wider">COMPETING FOR SURVIVAL</p>
            </div>
          </div>

          <div className="border-y border-gray-900 py-8 flex flex-col md:flex-row justify-around items-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-squid-pink text-lg mb-1">◯</span>
              <span className="text-gray-400 font-tech text-xs tracking-widest font-bold">RED LIGHT. GREEN LIGHT. START CODING.</span>
            </div>
            <div className="h-px w-12 bg-gray-900 md:h-8 md:w-px"></div>
            <div className="flex flex-col items-center">
              <span className="text-squid-pink text-lg mb-1">△</span>
              <span className="text-gray-400 font-tech text-xs tracking-widest font-bold">ONLY ONE TEAM WILL SURVIVE.</span>
            </div>
            <div className="h-px w-12 bg-gray-900 md:h-8 md:w-px"></div>
            <div className="flex flex-col items-center">
              <span className="text-squid-pink text-lg mb-1">◻</span>
              <span className="text-gray-400 font-tech text-xs tracking-widest font-bold">OUTPLAY. OUTLAST. OUTCODE.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative py-32 px-8 lg:px-16 bg-transparent border-t-2 border-gray-900 overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[40rem] text-squid-pink opacity-[0.03] pointer-events-none font-bold leading-none select-none">
          ◯
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-8">
              THE <span className="text-squid-pink">GAME</span> EXPLAINED
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 font-medium">
              Squid Hack 2026 is a premier 24-hour hackathon designed to test your technical limits. Organized by the SCYP CLUB, this event brings together the brightest minds to innovate, solve complex real-world problems, and survive the ultimate coding challenge.
            </p>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-medium">
              Will you play it safe, or will you risk it all to build something extraordinary? The clock is ticking, and the massive prize pool awaits the ultimate survivors.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 border-[12px] border-squid-pink rounded-full shadow-[0_0_60px_rgba(249,0,77,0.3)] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <span className="text-gray-500 font-bold tracking-[0.3em] text-xs mb-2">TIME REMAINING</span>
              <span className="text-white font-tech text-4xl font-black tracking-widest text-shadow-glow">
                {timeLeft}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="relative py-32 px-8 lg:px-16 bg-transparent border-t border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(249,0,77,0.06)_0%,transparent_60%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-4">
              THE <span className="text-squid-pink">Game</span> Timeline
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold uppercase">GAME SCHEDULE & TIME LIMITS</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {/* Day 1 Card */}
            <div className="bg-transparent p-4 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-[12rem] font-heading font-black text-gray-900/10 group-hover:text-squid-pink/5 transition-colors duration-500 select-none pointer-events-none">
                01
              </div>

              <div className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-end relative z-10">
                <div>
                  <span className="text-squid-pink font-tech text-xs tracking-[0.3em] font-bold block mb-1">STAGE ONE</span>
                  <h3 className="font-heading text-2xl font-black tracking-widest text-white uppercase">1ST AUGUST</h3>
                </div>
                <span className="text-gray-600 font-tech text-xs tracking-wider">9 EVENTS</span>
              </div>

              <div className="relative pl-2 z-10">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-900/60 overflow-hidden">
                  <div className="animate-flow-line-day1"></div>
                </div>

                <TimelineStage time="08:00 AM" title="REPORTING TIME" description="All players must assemble at the main arena for registration and collect their survival kits." type="circle" />
                <TimelineStage time="09:00 AM" title="OPENING CEREMONY" description="Official rules briefing. Instructions delivered directly by the Frontman." type="triangle" />
                <TimelineStage time="11:00 AM" title="REACHING LABS" description="Players report to their designated coding chambers and set up systems." type="square" />
                <TimelineStage time="12:00 PM" title="CODING START" description="The main timer begins. First survival coding trials commence." type="circle" />
                <TimelineStage time="02:00 PM" title="LUNCH BREAK" description="Chow time. Recharge and coordinate with teammates." type="triangle" />
                <TimelineStage time="04:00 PM" title="MENTORSHIP ROUND 1" description="Inspectors review initial codebases and evaluate survival strategies." type="square" />
                <TimelineStage time="05:00 PM" title="HIGH TEA & NETWORKING" description="Intermission. Exchange intel and discuss technical configurations." type="circle" />
                <TimelineStage time="08:00 PM" title="DINNER" description="Replenish energy levels under the dark night phase." type="triangle" />
                <TimelineStage time="10:00 PM" title="MENTORSHIP ROUND 2" description="Late night inspection. System hardening checkpoint." type="square" isLast={true} />
              </div>
            </div>

            {/* Day 2 Card */}
            <div className="bg-transparent p-4 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-[12rem] font-heading font-black text-gray-900/10 group-hover:text-squid-pink/5 transition-colors duration-500 select-none pointer-events-none">
                02
              </div>

              <div className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-end relative z-10">
                <div>
                  <span className="text-squid-pink font-tech text-xs tracking-[0.3em] font-bold block mb-1">STAGE TWO</span>
                  <h3 className="font-heading text-2xl font-black tracking-widest text-white uppercase">2ND AUGUST</h3>
                </div>
                <span className="text-gray-600 font-tech text-xs tracking-wider">8 EVENTS</span>
              </div>

              <div className="relative pl-2 z-10">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-900/60 overflow-hidden">
                  <div className="animate-flow-line-day2"></div>
                </div>

                <TimelineStage time="01:00 AM" title="MID-NIGHT HIGH TEA" description="Midnight fuel to survive the dark hours of continuous development." type="circle" />
                <TimelineStage time="01:30 AM" title="REFRESHMENT ACTIVITIES" description="Interactive games and challenges to refresh the mind." type="triangle" />
                <TimelineStage time="07:00 AM" title="MENTORSHIP ROUND 3" description="Final checkpoint inspection. Ironing out errors before deadline." type="square" />
                <TimelineStage time="08:00 AM" title="BREAKFAST" description="Morning rations served. Gear up for the final stretch." type="circle" />
                <TimelineStage time="12:00 PM" title="FINAL JUDGMENT" description="Project pitch evaluations. Convince the VIP judges of your solution." type="triangle" />
                <TimelineStage time="01:00 PM" title="LUNCH BREAK" description="Rations. A moment of relief before the final results." type="square" />
                <TimelineStage time="02:00 PM" title="WINNERS ANNOUNCEMENT" description="The final standing survivors are announced. Prizes distributed." type="circle" />
                <TimelineStage time="03:00 PM" title="EVENT END" description="Arena closed. Survivors dismissed." type="triangle" isLast={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGES SECTION */}
      <section id="challenges" className="relative py-32 px-8 lg:px-16 bg-transparent border-t border-gray-900 overflow-hidden">
        {/* Doll Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 mix-blend-screen pointer-events-none py-10">
          <img src="/squid_doll.png" alt="Squid Doll Background" className="w-full h-full object-contain animate-character" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-4">
              THE <span className="text-squid-pink">TRACKS</span>
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold">CHOOSE YOUR PATH</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrackCard shape="◯" title="INNOVATE" description="Break boundaries and create the unforeseen. Pitch ideas that disrupt the status quo and introduce entirely new paradigms." isAlternate={true} />
            <TrackCard shape="△" title="SOLVE" description="Tackle real-world problems with precise logic. Build scalable, high-impact solutions that directly address community pain points." isAlternate={false} />
            <TrackCard shape="◻" title="SURVIVE" description="Deploy robust, unbreakable systems. Endure the technical stress tests and build architecture designed to never fail." isAlternate={true} />
          </div>
        </div>
      </section>

      {/* PRIZES SECTION */}
      <section id="prizes" className="relative py-16 md:py-20 px-8 lg:px-16 bg-transparent border-t border-gray-900 overflow-hidden">
        {/* Piggybank Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none py-6">
          <img src="/squid_piggybank.png" alt="Piggybank Background" className="w-auto h-[75%] max-h-[380px] object-contain animate-character-delayed-1" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-3">
              THE <span className="text-squid-pink">REWARDS</span>
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold">₹1,10,000 TOTAL PRIZE POOL</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-5xl mx-auto">
            {/* Column 1: Runner Up & Special Track */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3 order-2 lg:order-1 justify-between">
              <PrizeCard rank="1ST RUNNER UP" amount="₹25000" shape="△" />
              <PrizeCard rank="SPECIAL TRACK" title="Most Innovative Idea" amount="₹10000" shape="▷" subtitle={true} />
            </div>

            {/* Column 2: Champion & Special Track */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3 order-1 lg:order-2 justify-between">
              <PrizeCard rank="GRAND WINNER" title="CHAMPION" amount="₹50000" shape="◯" isGrand={true} />
              <PrizeCard rank="SPECIAL TRACK" title="Best Social Impact Project" amount="₹5000" subtitle={true} />
            </div>

            {/* Column 3: 2nd Runner Up & Special Track */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3 order-3 justify-between">
              <PrizeCard rank="2ND RUNNER UP" amount="₹15000" shape="◻" />
              <PrizeCard rank="SPECIAL TRACK" title="BEST WOMEN LEAD Team" amount="₹5000" subtitle={true} />
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-transparent border border-squid-pink/30 px-6 py-2.5 rounded-sm shadow-md">
              <span className="text-gray-300 text-[11px] tracking-[0.2em] uppercase font-bold">
                <span className="text-squid-pink">★</span> CERTIFICATE OF PARTICIPATION FOR ALL PARTICIPANTS <span className="text-squid-pink">★</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ORGANIZERS SECTION */}
      <section id="organizers" className="relative py-32 px-8 lg:px-16 bg-transparent border-t border-gray-900">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-4">
              THE <span className="text-squid-pink">FRONTMEN</span>
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold">HEAD ORGANIZERS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <OrganizerCard name="AKASH YADAV" email="akashyaduvanshi3004@gmail.com" tel="+91 72660 69509" imgUrl="/akash.png" isMain={false} />
            <OrganizerCard name="TULSI KESWANI" email="tulsikeswani7171@gmail.com" tel="+91 74159 28633" imgUrl="/tulsi.png" isMain={true} />
            <OrganizerCard name="ANKIT UMATH" email="ankitumath30@gmail.com" tel="+91 95092 85817" imgUrl="/ankit3.png" isMain={false} />
          </div>
        </div>
      </section>

      {/* RULES SECTION */}
      <section id="rules" className="relative py-32 px-8 lg:px-16 bg-transparent border-t border-gray-900">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-4">
              RULES OF THE <span class="text-squid-pink">GAME</span>
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold">RULES & REGULATIONS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">◯</span> The project must be developed during the hackathon period.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">△</span> The idea should be original and not previously submitted in any competition.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">◻</span> Open-source libraries and AI tools are permitted.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">◯</span> Plagiarism or copied projects will result in immediate disqualification.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">△</span> One participant can register with only one team.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase">
                <span className="text-squid-pink font-black text-lg">◻</span> Organizers reserve the right to verify project authenticity.
              </h3>
            </div>
            <div className="border border-gray-800 bg-transparent p-6 hover:border-squid-pink/50 transition-colors rounded-sm md:col-span-2">
              <h3 className="text-gray-300 font-bold tracking-widest text-xs md:text-sm flex items-center gap-4 uppercase md:justify-center">
                <span className="text-squid-pink font-black text-lg">◯</span> All decisions made by the judging panel will be final and binding.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative py-32 px-8 lg:px-16 bg-transparent border-t border-gray-900">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-widest uppercase mb-4">
              FAQ
            </h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs font-bold">FREQUENTLY ASKED QUESTIONS</p>
          </div>

          <div className="space-y-4">
            <FAQItem question="Who can participate?" answer="Any student currently enrolled in a university degree program can participate. You do not need to be a Computer Science major to play the game!" />
            <FAQItem question="What is the allowed team size?" answer="You can participate individually or in a team of up to 4 members. We highly encourage forming diverse teams to combine different skills for survival." />
            <FAQItem question="Is there any registration fee?" answer="Yes, a 100rs team registration fee is required then after the shortlisting by PPT selection team have to fill a form of worth 1500 includes your food and accommodation." />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

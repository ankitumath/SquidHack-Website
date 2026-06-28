import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="relative py-24 px-8 lg:px-16 bg-transparent border-t-[6px] border-squid-pink overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(249,0,77,0.5)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="font-heading font-black text-4xl tracking-[0.15em] uppercase mb-4 text-white drop-shadow-[0_0_10px_rgba(249,0,77,0.3)]">
            SQUID H<span className="triangle-a text-[0.8em] -translate-y-[0.1em]"></span>CK
          </div>

          {/* SCYP Club Logo */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/scyp_logo.png"
              alt="SCYP Club Logo"
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/60 shadow-[0_0_12px_rgba(0,200,255,0.35)]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col items-start">
              <div className="text-cyan-400 text-[10px] tracking-[0.25em] font-black uppercase">
                ORGANIZED BY
              </div>
              <div className="text-white text-sm font-black tracking-[0.15em] uppercase leading-tight">
                SCYP CLUB
              </div>
              <div className="text-gray-500 text-[9px] tracking-[0.15em] font-semibold uppercase">
                Student Council of Yantriki Panchtatva
              </div>
            </div>
          </div>

          <div className="text-squid-pink text-[10px] tracking-[0.2em] font-bold uppercase">
            M BLOCK, SAGE UNIVERSITY, INDORE
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://chat.whatsapp.com/GmarnlAWX5GLZhdOe1aRL0?s=cl&p=a&mlu=2" className="w-14 h-14 rounded-full border border-gray-800 bg-black flex items-center justify-center text-gray-400 hover:text-white hover:border-squid-pink hover:bg-squid-pink/10 transition-all shadow-lg" aria-label="WhatsApp">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.86 11.86 0 0012.04 0C5.4 0 .03 5.37.03 12c0 2.12.55 4.18 1.6 6L0 24l6.17-1.62A11.95 11.95 0 0012.04 24C18.67 24 24 18.63 24 12c0-3.19-1.24-6.19-3.48-8.52zM12.04 21.8a9.78 9.78 0 01-4.98-1.37l-.36-.21-3.66.96.98-3.57-.23-.37A9.78 9.78 0 1121.8 12a9.77 9.77 0 01-9.76 9.8zm5.37-7.34c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-.99 2.43.03 1.43 1.04 2.81 1.19 3.01.15.19 2.04 3.12 4.94 4.37.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34z"/></svg>
          </a>
          <a href="https://www.instagram.com/sage_scyp?igsh=MTNrNTV3eHIzZDliaA==" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-800 bg-black flex items-center justify-center text-gray-400 hover:text-white hover:border-squid-pink hover:bg-squid-pink/10 transition-all shadow-lg" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.402-2.757-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/scyp-student-council-yantriki-panchtatva/about/?viewAsMember=true" className="w-14 h-14 rounded-full border border-gray-800 bg-black flex items-center justify-center text-gray-400 hover:text-white hover:border-squid-pink hover:bg-squid-pink/10 transition-all shadow-lg" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 mt-16 text-center text-gray-600 text-[10px] tracking-[0.4em] font-bold uppercase">
        © 2026 Squid Hack. Let the games begin.
      </div>
    </footer>
  );
};

export default Footer;

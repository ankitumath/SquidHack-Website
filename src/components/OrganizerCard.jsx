import React from 'react';

const OrganizerCard = ({ name, email, tel, imgUrl, isMain }) => {
  return (
    <div className={`flex flex-col items-center bg-transparent border border-gray-800 p-8 hover:border-squid-pink hover:shadow-[0_0_30px_rgba(249,0,77,0.15)] hover:scale-105 transition-all duration-300 group rounded-sm ${isMain ? 'lg:-translate-y-6' : ''}`}>
      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-squid-pink mb-6 transition-colors duration-500 bg-gray-950">
        <img 
          src={imgUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-110" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <h3 className="font-heading font-black tracking-widest text-xl mb-6 text-center uppercase">{name}</h3>
      <div className="flex flex-col items-center gap-3 text-gray-400 text-xs md:text-sm font-medium">
        <a href={`mailto:${email}`} className="hover:text-squid-pink transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {email}
        </a>
        <a href={`tel:${tel.replace(/\s+/g, '')}`} className="hover:text-squid-pink transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {tel}
        </a>
      </div>
    </div>
  );
};

export default OrganizerCard;

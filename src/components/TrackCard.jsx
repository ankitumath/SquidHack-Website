import React from 'react';

const TrackCard = ({ shape, title, description, isAlternate }) => {
  return (
    <div className={`${isAlternate ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'} border border-gray-800 p-8 md:p-12 hover:border-squid-pink hover:shadow-[0_0_30px_rgba(249,0,77,0.2)] transition-all duration-500 group relative overflow-hidden rounded-sm`}>
      <div className="absolute -right-8 -top-8 text-9xl text-gray-900/40 group-hover:text-squid-pink/10 transition-colors duration-500 select-none pointer-events-none font-black font-tech">
        {shape}
      </div>
      <div className="text-squid-pink text-5xl mb-8 relative z-10 font-black font-tech">{shape}</div>
      <h3 className="font-heading text-2xl font-black tracking-widest mb-4 relative z-10 uppercase">{title}</h3>
      <p className="text-gray-400 leading-relaxed relative z-10 text-sm font-medium">{description}</p>
    </div>
  );
};

export default TrackCard;

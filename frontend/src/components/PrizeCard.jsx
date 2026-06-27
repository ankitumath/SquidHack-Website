import React from 'react';

const PrizeCard = ({ rank, title, amount, shape, isGrand, subtitle }) => {
  if (isGrand) {
    return (
      <div className="bg-transparent border-2 border-squid-pink p-8 text-center relative shadow-[0_0_30px_rgba(249,0,77,0.15)] z-10 rounded-sm w-full">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-squid-pink text-white px-6 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase whitespace-nowrap shadow-[0_0_20px_rgba(249,0,77,0.5)]">
          {rank}
        </div>
        <div className="text-squid-pink font-tech text-xs tracking-[0.3em] mb-2 mt-1 font-bold">{title}</div>
        <div className="text-5xl font-black text-white mb-6 drop-shadow-[0_0_15px_rgba(249,0,77,0.4)]">{amount}</div>
        <div className="text-squid-pink text-4xl font-bold font-tech">{shape}</div>
      </div>
    );
  }

  if (subtitle) {
    return (
      <div className="bg-transparent border border-gray-800 p-5 text-center hover:border-squid-pink/50 transition-colors rounded-sm shadow-md w-full">
        <div className="text-gray-500 font-tech text-[9px] tracking-[0.3em] mb-1.5 font-bold">{rank}</div>
        <h3 className="font-heading text-base font-black tracking-wider text-white mb-2 uppercase">{title}</h3>
        <div className="text-2xl font-black text-squid-pink drop-shadow-[0_0_8px_rgba(249,0,77,0.3)]">{amount}</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent border border-gray-800 p-6 text-center relative pb-8 hover:border-gray-600 transition-colors rounded-sm shadow-md w-full">
      <div className="text-gray-500 font-tech text-xs tracking-[0.3em] mb-2 font-bold">{rank}</div>
      {title && <h3 className="font-heading text-sm font-black tracking-wider text-white mb-2 uppercase">{title}</h3>}
      <div className="text-4xl font-black text-white mb-6">{amount}</div>
      <div className="text-squid-pink text-3xl opacity-50 font-tech">{shape}</div>
    </div>
  );
};

export default PrizeCard;

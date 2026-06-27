import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="border border-gray-800 bg-black p-6 md:p-8 hover:border-squid-pink/50 transition-all duration-300 group cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className="text-white font-bold tracking-widest text-sm md:text-base flex items-center justify-between uppercase select-none">
        <span className="flex items-center gap-4">
          <span className="text-squid-pink font-black text-lg transition-transform duration-500 group-hover:rotate-180">◯</span> 
          {question}
        </span>
        <span 
          className="text-squid-pink font-bold font-tech text-sm transition-transform duration-300 shrink-0" 
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          ＋
        </span>
      </h3>
      <div 
        className="grid transition-all duration-300 ease-in-out overflow-hidden"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0, marginTop: isOpen ? '1rem' : '0' }}
      >
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed pl-9 min-h-0 font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FAQItem;

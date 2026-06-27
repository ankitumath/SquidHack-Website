import SquareIcon from './SquareIcon.jsx';
import React from 'react';

const TimelineStage = ({ time, title, description, type, isLast }) => {
  return (
    <div className={`timeline-stage relative pl-8 ${isLast ? 'pb-0' : 'pb-8'} group/item`}>
      {/* Dynamic bullet rendering based on type */}
      {type === 'circle' && (
        <div className="stage-bullet-circle absolute left-[2px] top-1.5 w-3 h-3 rounded-full border-2 border-squid-pink bg-black flex items-center justify-center text-[7px] text-squid-pink font-bold group-hover/item:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(249,0,77,0.5)]"></div>
      )}
      {type === 'triangle' && (
        <div className="stage-bullet-triangle absolute left-[2px] top-[7px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-squid-pink bg-transparent group-hover/item:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_4px_rgba(249,0,77,0.8)]"></div>
      )}
      {type === 'square' && (
        <div className="stage-bullet-square absolute left-[2px] top-1.5 w-3 h-3 border-2 border-squid-pink bg-black group-hover/item:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(249,0,77,0.5)] flex items-center justify-center">
          <SquareIcon className="w-2 h-2 text-squid-pink" />
        </div>
      )}
      
      <div className="text-squid-pink font-tech text-xs tracking-wider font-semibold mb-1">{time}</div>
      <h4 className="stage-title text-white font-heading font-black tracking-widest text-base mb-1 group-hover/item:text-squid-pink transition-colors duration-300 uppercase">{title}</h4>
      <p className="text-gray-400 text-xs font-medium leading-relaxed">{description}</p>
    </div>
  );
};

export default TimelineStage;

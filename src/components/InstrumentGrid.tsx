import React from 'react';
import { Instrument } from '../types/Instrument';
import InstrumentCard from './InstrumentCard';

interface InstrumentGridProps {
  instruments: Instrument[];
  onInstrumentSelect: (instrument: Instrument) => void;
}

const InstrumentGrid: React.FC<InstrumentGridProps> = ({
  instruments,
  onInstrumentSelect
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {instruments.map((instrument, index) => (
        <InstrumentCard
          key={instrument.code}
          instrument={instrument}
          onClick={() => onInstrumentSelect(instrument)}
          animationDelay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default InstrumentGrid;
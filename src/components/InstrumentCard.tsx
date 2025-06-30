import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Music, Play } from 'lucide-react';
import { Instrument } from '../types/Instrument';

interface InstrumentCardProps {
  instrument: Instrument;
  onClick: () => void;
  animationDelay?: number;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({
  instrument,
  onClick,
  animationDelay = 0
}) => {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Get the appropriate text based on current language
  const getInstrumentText = () => {
    if (i18n.language === 'en' && instrument.text_en) {
      return instrument.text_en;
    }
    return instrument.text;
  };

  return (
    <div
      className="animate-fadeInUp btn-hover cursor-pointer group"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/30 transition-all duration-300 h-full">
        <div className="aspect-square mb-4 relative overflow-hidden rounded-2xl bg-white/10">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10">
              <Music size={48} className="text-white/60" />
            </div>
          ) : (
            <img
              src={`/assets/${instrument.picture}`}
              alt={instrument.name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2 font-rounded">
            {instrument.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-3">
            {getInstrumentText().substring(0, 100)}...
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-white/60">
            <Music size={16} />
            <span className="text-sm">
              {instrument.songs.length} {t('instrument.soundSamples')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
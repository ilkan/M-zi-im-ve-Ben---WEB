import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Play, Pause, Volume2, Music, VolumeX } from 'lucide-react';
import { Instrument, Song } from '../types/Instrument';
import AudioPlayer from './AudioPlayer';

interface InstrumentDetailProps {
  instrument: Instrument;
  onBack: () => void;
  audioEnabled: boolean;
}

const InstrumentDetail: React.FC<InstrumentDetailProps> = ({
  instrument,
  onBack,
  audioEnabled
}) => {
  const { t } = useTranslation();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDescriptionPlaying, setIsDescriptionPlaying] = useState(false);
  const descriptionAudioRef = useRef<HTMLAudioElement>(null);

  // Find the description audio (first song with "Seslendirme" in name)
  const descriptionAudio = instrument.songs.find(song => 
    song.name.toLowerCase().includes('seslendirme')
  );

  // Filter out description audio from music samples
  const musicSamples = instrument.songs.filter(song => 
    !song.name.toLowerCase().includes('seslendirme')
  );

  useEffect(() => {
    // Reset states when instrument changes
    setCurrentSong(null);
    setImageLoaded(false);
    setImageError(false);
    setIsDescriptionPlaying(false);
  }, [instrument]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleSongSelect = (song: Song) => {
    if (!audioEnabled) return;
    setCurrentSong(song);
  };

  const handleAudioEnd = () => {
    setCurrentSong(null);
  };

  const handleDescriptionAudioToggle = async () => {
    if (!audioEnabled || !descriptionAudio) return;

    const audio = descriptionAudioRef.current;
    if (!audio) return;

    try {
      if (isDescriptionPlaying) {
        audio.pause();
        setIsDescriptionPlaying(false);
      } else {
        // Stop any currently playing music
        if (currentSong) {
          setCurrentSong(null);
        }
        
        audio.src = `/assets/${descriptionAudio.path}`;
        await audio.play();
        setIsDescriptionPlaying(true);
      }
    } catch (error) {
      console.error('Description audio playback error:', error);
    }
  };

  useEffect(() => {
    const audio = descriptionAudioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsDescriptionPlaying(false);
    };

    const handleError = () => {
      setIsDescriptionPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="btn-hover bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 mb-8 transition-all duration-300"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('navigation.back')}</span>
        </button>

        <div className="bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="p-8 text-center border-b border-white/20">
            <div className="w-48 h-48 mx-auto mb-6 relative overflow-hidden rounded-3xl bg-white/10">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="spinner"></div>
                </div>
              )}
              
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                  <Music size={64} className="text-white/60" />
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
                />
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 font-rounded">
              {instrument.name}
            </h1>
          </div>

          {/* Description with Audio */}
          <div className="p-8 border-b border-white/20">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-white font-rounded">
                {t('instrument.description')}
              </h2>
              
              {descriptionAudio && (
                <button
                  onClick={handleDescriptionAudioToggle}
                  disabled={!audioEnabled}
                  className={`btn-hover p-3 rounded-full transition-all duration-300 ${
                    audioEnabled 
                      ? isDescriptionPlaying
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                  aria-label={isDescriptionPlaying ? t('instrument.stopDescription') : t('instrument.playDescription')}
                >
                  {isDescriptionPlaying ? (
                    <Pause size={24} />
                  ) : audioEnabled ? (
                    <Volume2 size={24} />
                  ) : (
                    <VolumeX size={24} />
                  )}
                </button>
              )}
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed">
              {instrument.text}
            </p>
            
            {isDescriptionPlaying && (
              <div className="mt-4 flex items-center space-x-2 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm">{t('instrument.readingDescription')}</span>
              </div>
            )}
          </div>

          {/* Music Samples */}
          {musicSamples.length > 0 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-rounded flex items-center space-x-2">
                <Music size={28} />
                <span>{t('instrument.musicSamples')}</span>
              </h2>
              
              {!audioEnabled && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6">
                  <p className="text-yellow-100 text-center">
                    {t('instrument.enableAudioMessage')}
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                {musicSamples.map((song) => (
                  <div
                    key={song.id}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-300 ${
                      audioEnabled 
                        ? 'hover:bg-white/20 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    } ${currentSong?.id === song.id ? 'ring-2 ring-white/50' : ''}`}
                    onClick={() => handleSongSelect(song)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {song.name}
                        </h3>
                        {song.player && (
                          <p className="text-white/70 text-sm">
                            {t('instrument.performer')}: {song.player}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {currentSong?.id === song.id ? (
                          <div className="flex items-center space-x-2 text-white">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm">{t('instrument.playing')}</span>
                          </div>
                        ) : (
                          <div className={`p-3 rounded-full transition-all duration-300 ${
                            audioEnabled 
                              ? 'bg-white/20 hover:bg-white/30' 
                              : 'bg-white/10'
                          }`}>
                            <Play size={20} className="text-white ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hidden audio element for description */}
        <audio ref={descriptionAudioRef} preload="metadata" />

        {/* Audio Player */}
        {currentSong && audioEnabled && (
          <div className="fixed bottom-6 left-6 right-6 z-50">
            <AudioPlayer
              song={currentSong}
              onEnd={handleAudioEnd}
              onClose={() => setCurrentSong(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetail;
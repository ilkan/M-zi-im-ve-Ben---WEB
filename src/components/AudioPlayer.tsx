import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Volume2, RotateCcw } from 'lucide-react';
import { Song } from '../types/Instrument';
import { formatDuration } from '../utils/dataLoader';

interface AudioPlayerProps {
  song: Song;
  onEnd: () => void;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ song, onEnd, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      // Auto-play when loaded
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Auto-play failed:', error);
        setIsLoading(false);
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnd();
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Load the audio
    audio.src = `/assets/${song.path}`;
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [song, onEnd]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="audio-player p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <X size={20} className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ses yüklenemedi</p>
              <p className="text-sm text-gray-600">{song.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Kapat"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <div className="audio-player p-4 max-w-md mx-auto animate-scaleIn">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Volume2 size={20} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800 truncate">{song.name}</p>
              {song.player && (
                <p className="text-sm text-gray-600 truncate">{song.player}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-2"
            aria-label="Kapat"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRestart}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
            aria-label="Baştan başlat"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white ml-1" />
            )}
          </button>

          <div className="flex-1 flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-10 text-right">
              {formatDuration(currentTime)}
            </span>
            <div className="flex-1 relative">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={isLoading || !duration}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <span className="text-xs text-gray-500 w-10">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
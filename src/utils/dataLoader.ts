import { Instrument } from '../types/Instrument';

export const loadInstruments = async (): Promise<Instrument[]> => {
  try {
    const response = await fetch('/assets/data/data.json');
    if (!response.ok) {
      throw new Error('Failed to load instruments data');
    }
    const data: Instrument[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading instruments:', error);
    return [];
  }
};

export const preloadAudio = (audioPath: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio);
    });
    
    audio.addEventListener('error', () => {
      reject(new Error(`Failed to load audio: ${audioPath}`));
    });
    
    audio.src = `/assets/${audioPath}`;
  });
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
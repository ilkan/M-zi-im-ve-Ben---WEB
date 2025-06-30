export interface Song {
  id: string;
  name: string;
  player?: string;
  path: string;
  playing: boolean;
  pButton: string;
}

export interface Instrument {
  code: number;
  name: string;
  text: string;
  picture: string;
  backround: string;
  playing?: boolean;
  songs: Song[];
}
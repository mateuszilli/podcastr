import { createContext } from 'react'

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextData = {
  episodes: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  setPlayingState: (playing: boolean) => void;
  togglePlay: () => void;
}

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
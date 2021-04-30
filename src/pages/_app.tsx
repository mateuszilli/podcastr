import '../styles/global.scss'

import { useState } from 'react'

import { Header } from '../components/Header'
import { Player } from '../components/Player'

import { PlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode) {
    setEpisodes([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(playing: boolean) {
    setIsPlaying(playing)
  }

  return (
    <PlayerContext.Provider value={{ episodes, currentEpisodeIndex, play, togglePlay, setPlayingState, isPlaying }}>
      <div className={styles.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContext.Provider>
  )
} 

export default MyApp

import 'rc-slider/assets/index.css'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Slider from 'rc-slider'
import { usePlayerContext } from '../../contexts/PlayerContext'
import { convertDurationToTime } from '../../utils/convertDurationToTime'

import styles from './styles.module.scss'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const { 
    episodes, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    hasPrevious,
    hasNext,
    playPrevious,
    playNext,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState
  } = usePlayerContext()

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function progressListner() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function changeHandle(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function onEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodes[currentEpisodeIndex]

  return (
    <div className={styles.container}>
      <header>
        <img src="/playing.svg" alt="Playing now"/>
        <strong>Playing now</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width="592" height="592" src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Select a podcast to listen</strong>
        </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTime(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={changeHandle}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider}/>
            ) }
          </div>
          <span>{convertDurationToTime(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url} 
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={onEpisodeEnded}
            onLoadedMetadata={progressListner}
            loop={isLooping}
            autoPlay/>
        ) }

        <div className={styles.buttons}>
          <button 
            type="button" 
            className={isShuffling ? styles.active : ''} 
            onClick={toggleShuffle} 
            disabled={!episode || episodes.length === 1}
          >
            <img src="/shuffle.svg" alt="Shuffle"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Play previous"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
          { isPlaying 
            ? <img src="/pause.svg" alt="Pause"/>
            : <img src="/play.svg" alt="Play"/>
          }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Play next"/>
          </button>
          <button 
            type="button" 
            className={isLooping ? styles.active : ''} 
            onClick={toggleLoop} 
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repeat"/>
          </button>
        </div>
      </footer>
    </div>
  )
}
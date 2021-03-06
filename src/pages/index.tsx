import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { format, parseISO } from 'date-fns'
import { api } from '../services/api'
import { convertDurationToTime } from '../utils/convertDurationToTime'
import { usePlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/home.module.scss'

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayerContext()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Last releases</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.duration}</span>
                  <span>{episode.time}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Play episode"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>All episodes</h2>

        <table cellSpacing="0">
          <thead>
            <tr>
              <th style={{ width: 80 }}></th>
              <th>Podcast</th>
              <th>Members</th>
              <th style={{ width: 150 }}>Published at</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image 
                      width={120} 
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.time}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Play episode"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      duration: episode.file.duration,
      publishedAt: format(parseISO(episode.published_at), 'MMM d, yyyy'),
      time: convertDurationToTime(episode.file.duration),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 43200
  }
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  publishedAt: string;
  time: string;
  url: string;
}
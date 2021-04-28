import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns';
import { api } from '../../services/api';
import { convertDurationToTime } from '../../utils/convertDurationToTime';

import styles from '../../styles/episode.module.scss'

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.thumbnail}>

        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg"alt="Return"/>
          </button>
        </Link>

        <Image width="700" height="160" src={episode.thumbnail} objectFit="cover"/>

        <button type="button">
          <img src="/play.svg" alt="Play episode"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.time}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }}/>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    description: data.description,
    duration: data.file.duration,
    publishedAt: format(parseISO(data.published_at), 'MMM d, yyyy'),
    time: convertDurationToTime(data.file.duration),
    url: data.file.url,
  }

  return {
    props: {
      episode
    },
    revalidate: 86400
  }
}

type EpisodeProps = {
  episode: Episode,
}

type Episode = {
  id: string;
  title: string;
  description: string;
  members: string;
  thumbnail: string;
  duration: number;
  publishedAt: string;
  time: string;
  url: string;
}
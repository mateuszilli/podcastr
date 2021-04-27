import format from 'date-fns/format'

import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <header className={styles.container}>
      <img src="/logo.svg" alt="Podcastr"/>

      <p>The best for you to hear, always</p>

      <span>{currentDate}</span>
    </header>
  )
}
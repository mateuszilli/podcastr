export default function Home(props) {
  return (
    <div>
      <span>{JSON.stringify(props.episodes)}</span>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    },
    revalidate: 43200
  }
}
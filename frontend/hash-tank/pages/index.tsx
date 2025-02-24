import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import HomePage from '@/components/HomePage'


export default function Home() {
  return (
    <>
      <Head>
        <title>#Tank</title>
        <meta name="description" content="#Tank" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* <div className={styles.description}> */}
          <p>
          <HomePage/>
          </p>
        {/* </div> */}
      </main>
    </>
  )
}

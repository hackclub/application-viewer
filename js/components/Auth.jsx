import styles from '../../styles/Home.module.css'
import { signIn } from 'next-auth/client'

export const Auth = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Are you who you say you are ....</h1>
        <h2>You're currently logged out.</h2>
        <button onClick={signIn}>Log in.</button>
      </main>
    </div>
  )
}

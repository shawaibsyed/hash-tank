import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from "../styles/sidebar.module.css";
import Header from './Header'
import SideBar from './SideBar'


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [router, currentUser])

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.sidebar}>
          <SideBar />
        </div>
        <div className={styles.render}>{children}</div>
      </div>
    </div>
  );
}

export default ProtectedRoute
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
// import { Store } from 'electron-store'

import { Navigation } from './components/Navigation'
import {
  Home,
  Indications,
  Packages,
  Report,
  Reports,
} from './pages';

import styles from '../src/assets/styles/layout.module.css'
import { useEffect, useState } from 'react';

// const store = new Store()

const App = () => {

  const [userEmail, setUserEmail] = useState('wat')

  // useEffect(() => {
  //   if (store.get('userEmail')) {
  //     setUserEmail(store.get('userEmail'))
  //   }
  // }, [])
  //
  const handleEmail = (email) => {
    setUserEmail(email)
    // store.set('userEmail', email)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles['visual']} />
      <Router>
        <div className={styles.layout}>
          <aside className={styles.navigation}>
            <Navigation />
          </aside>
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home userEmail={userEmail} setUserEmail={handleEmail} />} />
              <Route path="/indications" element={<Indications />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<Report />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;

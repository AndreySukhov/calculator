import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Navigation } from './components/Navigation'
import {
  Home,
  Indications,
  Packages,
  Report,
  Reports,
} from './pages';
import { getStoredReportsLength } from './utils/storedDataHandlers'

import styles from '../src/assets/styles/layout.module.css'
import { useEffect, useState } from 'react';


const App = () => {

  const [userEmail, setUserEmail] = useState('wat')
  const reportsLength = getStoredReportsLength()
  const handleEmail = (email) => {
    setUserEmail(email)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles['visual']} />
      <Router>
        <div className={styles.layout}>
          <aside className={styles.navigation}>
            <Navigation reportsLength={reportsLength} />
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

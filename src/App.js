import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import axios from 'axios';

import { Navigation } from './components/Navigation'
import {
  Home,
  Indications,
  Packages,
  Report,
  Reports,
  Profile,
} from './pages';
import { getStoredReportsLength } from './utils/storedDataHandlers'

import styles from '../src/assets/styles/layout.module.css'
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    if (window.localStorage.getItem('userEmail')) {
      const syncReports = async () => {
        const res = await axios.get(`http://erelzi.fibonacci.digital/api/v1/history?email=${window.localStorage.getItem('userEmail')}`)
        if (res.data.length) {
          res.data.forEach((item) => {
            if (item.reportId) {
              console.log(item, 'item')
              window.localStorage.setItem(`${item.reportId}-report-id`, JSON.stringify(item))
            }
          })
        }
      }

      syncReports()
    }
  }, [])

  const reportsLength = getStoredReportsLength()

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
              <Route path="/" element={<Home />} />
              <Route path="/indications" element={<Indications />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<Report />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;

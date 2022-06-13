import { Link } from 'react-router-dom';
import { Text } from '../../components/base';
import styles from './styles.module.css'
import headerLogo from '../../assets/images/header-logo.svg';
import document from '../../assets/images/reports/document.svg'
import info from '../../assets/images/reports/info.svg'
import { getStoredReports } from '../../utils/storedDataHandlers';
import { useNavigate, useLocation } from 'react-router-dom';


export const Reports = () => {
  const reports = getStoredReports()
  const navigate = useNavigate();
  const { search } = useLocation()
  const handleCreateReportCopy = (id) => {
    const storedData = JSON.parse(localStorage.getItem(`${id}-report-id`))
    if (storedData) {
      const newId = +new Date()
      localStorage.setItem(`${newId}-report-id`, JSON.stringify(storedData))
      navigate(`/reports/${newId}`)
    }
  }

  return (
    <div>
      <Text color="blue" className={styles.heading} size="xxl">
        <img src={headerLogo} alt=""/>
        Упаковки по годам
      </Text>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <Text color="info" size="l" className={styles.title}>
                <img src={document} alt=""/>
                Отчёт
              </Text>
            </th>
            <th>
              <Text color="info" size="l" className={styles.title}>
                <img src={info} alt=""/>
                Статус
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const date = new Date(Number(report.date))
            return (
              <tr key={report.title} className={report.stepLabel === 'Отправление отчёта' ? styles.success : ''}>
                <td onClick={() => {
                  if (search.includes('useReady')) {
                    handleCreateReportCopy(report.date)
                  } else {
                    navigate(`/reports/${report.date}`)
                  }
                }}>
                  <Text size="m">
                    Отчёт от {date.toLocaleString('ru', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }
                  )} ({report.regionLabel})
                  </Text>
                </td>
                <td>
                  <Text size="m">
                    {report.stepLabel}
                  </Text>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
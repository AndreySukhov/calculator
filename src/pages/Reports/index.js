import { Link } from 'react-router-dom';
import { Text } from '../../components/base';
import { data } from './data';
import styles from './styles.module.css'
import headerLogo from '../../assets/images/header-logo.svg';
import document from '../../assets/images/reports/document.svg'
import info from '../../assets/images/reports/info.svg'

export const Reports = () => {
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
          {data.map((report) => {
            return (
              <tr key={report.title}>
                <td>
                  <Link to={`/reports/${report.id}`}>
                    <Text size="m">
                      {report.title}
                    </Text>
                  </Link>
                </td>
                <td>
                  <Text size="m">
                    {report.status}
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
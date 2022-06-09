import { NavLink } from "react-router-dom";
import { Text } from '../base';
import { ROUTES } from '../../constants/routes';
import styles from './styles.module.css'

import graph from '../../assets/images/nav/graph.svg';
import home from '../../assets/images/nav/home.svg';
import pack from '../../assets/images/nav/pack.svg';
import report from '../../assets/images/nav/report.svg';

const ICONS = {
  graph,
  home,
  pack,
  report
}

export const Navigation = () => {
  return (
    <nav className={styles.wrap}>
      <ul className={styles.nav}>
        {ROUTES.map((route) => {
          return (
            <li key={route.url} className={styles['nav-item']}>
              <NavLink to={route.url}>
                <Text color="primary" size="l" className={styles.link}>
                  <img src={ICONS[route.icon]} alt=""/>
                  {route.title}
                </Text>
              </NavLink>
            </li>
          )
        })}
      </ul>
      <Text className={styles.footer}>
        Калькулятор для менеджеров по работе с ключевыми клиентами компании
      </Text>
    </nav>
  )
}


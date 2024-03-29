import { Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { Table } from '../../../../components/base/Table';
import { useMemo, useState } from 'react';
import { ReactModal } from '../../../../components/Modal';
import styles from './styles.module.css';
import { ReactComponent as Calendar} from '../../../../assets/images/calendar.svg';
import { ReactComponent as Pin} from '../../../../assets/images/pin.svg';
import { ReactComponent as Info} from '../../../../assets/images/info.svg';
import { ReactComponent as Rub} from '../../../../assets/images/rub.svg';
import { StatList } from '../../../../components/base/StatList';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import { Confirm } from './Confirm';

import { NOSOLOGY_DICTIONARY } from '../../../../utils/nosologyDictionary'
import {
  getCleanIncreaseVal, getEfficiency,
  getExpenseCurrentBudget, getExpenseCurrentBudgetItem,
  getExpensePercentDiff,
  getExpensePlanBudget, getExpensePlanBudgetItem,
  getIncreaseVal, getSavedPerPatientMoney, getFormattedNumber,
  getPlanPatientByNosologia, getPatientByNosologia
} from '../calculations';
import { regionsData } from '../../../../data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CHART_HEX } from '../../../../utils/chartHex';
import headerLogo from '../../../../assets/images/header-logo.svg';
import { getPatientStatusText } from '../../../../utils/getPatientStatus';
import { declension } from '../../../../utils/declension';
import { tradeEfficiencyData } from '../../../../data/report/TradeNames';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['Текущий', 'Планируемый'];

export const ReportSubmit = ({
  reportData,
  reportId,
  onSubmit,
  regionId,
  tradeIncrease,
  stepLabel,
  reportSendStatus,
  onBackStep
}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { rootNosologia } = reportData
  const reportDate = new Date(Number(reportId))
  const nosologiaShortName = NOSOLOGY_DICTIONARY[rootNosologia].short
  const nosologiaLongName = NOSOLOGY_DICTIONARY[rootNosologia].full
  const patientsNum = reportData.data.reduce((acc, curr) => {
    return Number(acc) + Number(curr.patients)
  }, 0)

  const indicationsTable = reportData.data.map((item, i) => {
    return [i, item.mnn, item.ra.checked ? 'Да' : '-' , item.psa.checked ? 'Да' : '-', item.spa.checked ? 'Да' : '-' ]
  })

  const regionTitle = useMemo(() => {
    const regionData = regionsData.find((region) => {
      return region.id === regionId
    })

    if (!regionData) {
      return 'Федеральный уровень'
    }
    return regionData.label
  }, [regionId])

  const priceAnalysData = reportData.data.map((item, i) => {
    let itemRes = [i, item.label, item.mnn, item.application, item.productionForm, item.itemsInPack, getLocalCurrencyStr(item.pricePerPack)]
    if (regionTitle !== 'Федеральный уровень') {
      itemRes.push(getLocalCurrencyStr(Number(getCleanIncreaseVal(Number(item.pricePerPack), tradeIncrease).toFixed(2))))
    }
    itemRes.push(getLocalCurrencyStr(Number(getIncreaseVal(Number(item.pricePerPack), tradeIncrease).toFixed(2))))
    return itemRes
  })

  const currentBudget = getExpenseCurrentBudget({
    nosologia: rootNosologia,
    healYear: [1],
    data: reportData.data,
    tradeIncrease,
    packagesUnit: reportData.packagesSelect,
    patientsUnit: reportData.patientsSelect,
  });
  const planBudget = getExpensePlanBudget({
    nosologia: rootNosologia,
    healYear: [1],
    data: reportData.data,
    tradeIncrease,
    packagesUnit: reportData.packagesSelect,
    patientsUnit: reportData.patientsSelect,
  });
  const budgetDiff = getExpensePercentDiff(currentBudget, planBudget);


  const dataSets = reportData.data.map((item) => {
    return {
      label: item.label,
      backgroundColor: CHART_HEX[item.label],
      data: [getExpenseCurrentBudgetItem({
        item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
      }), getExpensePlanBudgetItem({
        item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
      })]
    }
  })


  const chartData = {
    labels,
    datasets: dataSets,
  };

  const patientsLabels = reportData.data.map(({label}) => label)

  const efficiencyChartData = {
    labels: tradeEfficiencyData.map((item) => item.label),
    datasets: [
      {
        label: 'Затраты-эффективность',
        backgroundColor: tradeEfficiencyData.map((item) => {

          return CHART_HEX[item.label]
        }),
        data: tradeEfficiencyData.map((item) => {
          return item.cost
        }),
      }
    ],
  }


  const patientsData = {
    labels: patientsLabels,
    datasets: [
      {
        label: 'кол-во пациентов',
        backgroundColor: patientsLabels.map((label) => CHART_HEX[label]),
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getSavedPerPatientMoney({
            item: current,
            nosologia: rootNosologia,
            patientStatus: 'first',
            tradeIncrease,
            diff: currentBudget - planBudget > 0 ? currentBudget - planBudget : 0
          })
        }),
      }
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value) {
            if (value === 0) {
              return value
            }
            return getLocalCurrencyStr(value)
          }
        }
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label
            const current = reportData.data.find((reportItem) => reportItem.label === label)
            if (context.label === 'Планируемый') {
              let patientsNum = 0
              if (rootNosologia === 'ra') {
                patientsNum = current.planPatientsRa
              } else if (rootNosologia === 'psa') {
                patientsNum = current.planPatientsPsa
              } else {
                patientsNum = current.planPatientsPsa
              }

              return ` ${label} ${getLocalCurrencyStr(context.raw)} ${Math.floor(patientsNum)} чел.`
            }

            let patientsNum = 0
            if (rootNosologia === 'ra') {
              patientsNum = current.patientsRa
            } else if (rootNosologia === 'psa') {
              patientsNum = current.patientsPsa
            } else {
              patientsNum = current.patientsSpa
            }

            return ` ${label} ${getLocalCurrencyStr(context.raw)} ${Math.floor(patientsNum)} чел.`
          }
        }
      }
    }
  };

  const patientsOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value) {
            if (value === 0) {
              return value
            }
            return value
          }
        }
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.raw
            if (label < 0) {
              return `0 пациентов`
            }

            return `${getFormattedNumber(label)} ${declension(['пациент', 'пациента', 'пациентов'], label)}`
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <>
      <div id="reportContent">
        <div className={styles['report-header']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Отправка отчёта
          </Text>
          <Text className={`${styles['report-date']} ${styles['text-with-icon']}`} size="l">
            <Calendar /> Отчёт составлен: <strong>
            {reportDate.toLocaleString('ru', {
                year: 'numeric', month: 'long', day: 'numeric'
              }
            )}
          </strong>
          </Text>
        </div>
        <Text className={styles['main-title']} color="blue" size="3xl">
          Отчёт «Фармакоэкономическая модель для оценки лечения {nosologiaLongName} ({nosologiaShortName}) современными ГИБП»
        </Text>
        <div className={styles['report-text']}>
          <Text tag="p" size="l">
            Данный отчет является результатом анализа «Влияние на бюджет» лечения {nosologiaLongName} ({nosologiaShortName}) современными генно-инженерными биологическими препаратами (ГИБП). На основании фармако-экономического моделирования так же представлен анализ «Затраты-эффективность» в лечении ревматоидного артрита ({nosologiaShortName}) с целью выявления преимущественной схемы лечения.
          </Text>
          <Text tag="p" size="l">
            Анализ «Влияние на бюджет» может проводиться как на федеральном (вся страна), так и на региональном уровне.
          </Text>
          <Text tag="p" size="l">
            В анализ были включены {reportData.data.length} международных непатентованных названий (МНН) лекарственных препаратов (ЛП*) в соответствии с действующими инструкциями по медицинскому применению и представлены в таблице «Показания к применению по основным ревматическим заболеваниям»<sup>1,2</sup>.
          </Text>
        </div>
        <div className={styles['report-row']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Показания к применению по основным ревматическим заболеваниям <sup>1</sup>
          </Text>
          <Table
            heading={['№', 'МНН', 'РА', 'ПсА', 'СпА']}
            data={indicationsTable}
          />
        </div>
        <div className={styles['report-text']}>
          <Text tag="p">
            В анализе «Затраты-эффективность в части оценки клинической эффективности ЛП модель основывается на данных мета-анализа <sup>3</sup>.
          </Text>
          <Text tag="p">
            По умолчанию модель рассчитывает затраты на основе зарегистрированных предельных отпускных цен производителей <sup>2</sup> с НДС**** и региональной оптовой надбавкой. Модель позволяет задать как локальную так и тендерную цены.
          </Text>
        </div>
        <div className={styles['report-row']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Уровень исследования
          </Text>
          <Text className={styles['text-with-icon']}>
            <Pin /> {regionTitle}
          </Text>
          <div className={styles['stat-table']}>
            <StatList
              data={[
                {
                  title: `Количество пациентов с ${nosologiaShortName}`,
                  text: Math.round(patientsNum)
                }, {
                  title: 'Доля пациентов, получающих ЛП впервые в 1-ый год',
                  text: '5%'
                }, {
                  title: 'Временной период',
                  text: '1 год'
                }, {
                  title: 'Средний вес пациента',
                  text: '70 кг'
                }
              ]}
            />
          </div>
        </div>
        <div className={styles['report-row']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Ценовой анализ торговых наименований лекарственных препаратов (ЛП) по показанию ревматоидный артрит (РА) <sup>1,2</sup>
          </Text>
          <div className={styles['stat-table']}>
            <StatList
              data={[
                {
                  title: 'НДС',
                  text: '10%'
                }, {
                  title: 'Оптовая надбавка',
                  text: `${tradeIncrease}%`
                }
              ]}
            />
          </div>
        </div>
        <div className={styles['report-row']}>
          <Table
            heading={['№', 'ТН', 'МНН', 'Введение', 'Форма выпуска', 'Кол-во единиц в упаковке',
              'Цена за упаковку (ЖНВЛП)', 'Локальная цена (с опт. надбавкой)', 'Итоговая цена (с НДС)']}
            data={priceAnalysData}
          />
        </div>
        <div className={styles['report-row']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Результаты анализа затрат текущего и планируемого бюджета
          </Text>
          <div className={styles.chart}>
            <Bar options={options} data={chartData} id="chart" />
          </div>
          <div className={styles['stat-table']}>
            <table className={styles.table}>
              <thead>
              <th>Все препараты</th>
              <th>Текущий</th>
              <th>Планируемый</th>
              </thead>
              <tbody>
              {reportData.data.map((item) => {
                if (item[rootNosologia].disabled) {
                  return null
                }

                const currentBudget = Number(getExpenseCurrentBudgetItem({
                  item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
                }));
                const planBudget = Number(getExpensePlanBudgetItem({
                  item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
                }));
                return (
                  <tr key={item.label}>
                    <td>
                      <div className={styles['label-with-hex']}>
                        <div className={styles['hex-mark']} style={{
                          backgroundColor: CHART_HEX[item.label]
                        }} />
                        <Text size="m">
                          {item.label}
                        </Text>
                      </div>
                    </td>
                    <td>
                      {currentBudget > 0 ? (
                        <>
                          <Text size="m" className={styles['cost-chart-text']}>
                            {getLocalCurrencyStr(currentBudget.toFixed(2))}
                          </Text>
                          <Text color="disabled" size="xs">
                            {getFormattedNumber(getPatientByNosologia(item, rootNosologia))} чел
                          </Text>
                        </>
                      ) : <>-</>}
                    </td>
                    <td>
                      {planBudget > 0 ? (
                        <>
                          <Text size="m" className={styles['cost-chart-text']}>
                            {getLocalCurrencyStr(planBudget.toFixed(2))}
                          </Text>
                          <Text color="disabled" size="xs">
                            {getFormattedNumber(getPlanPatientByNosologia(item, rootNosologia))} чел
                          </Text>
                        </>
                      ) : <>-</>}
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <div className={styles['yellow-block']}>
            <div className={styles['yellow-block-icon']}>
              <Info />
            </div>
            <Text size="xxl" className={styles['yellow-block-title']} color="blue">
              Заключение
            </Text>
            <Text size="l-regular" className={styles['yellow-block-text']}>
              Бюджет планируемого распределения предоставляет экономию средств в сравнении с бюджетом текущего распределения в размере
            </Text>
            <Text size="xxl">
              {currentBudget - planBudget > 0 ? getLocalCurrencyStr(currentBudget - planBudget) : 0} или {getFormattedNumber(budgetDiff)}%
            </Text>
          </div>
        </div>
        <div className={styles['report-row']}>
          <Text color="blue" className={styles.heading} size="xxl">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMC41TDAgMjQuNUwyNCAyNC41VjAuNUwwIDAuNVoiIGZpbGw9IiNFOUQyOUMiLz4KPHBhdGggZD0iTTI0IDI0LjVMMCAyNC41TDAgMC41TDI0IDI0LjVaIiBmaWxsPSIjNDQ2MUExIi8+Cjwvc3ZnPgo=" alt=""/>
            Количество новых пациентов в рамках высвободившегося бюджета на планируемый период
          </Text>
          <div className={styles['report-row-s']}>
            <Text className={`${styles['report-date']} ${styles['text-with-icon']}`} size="l">
              <Rub /> Высвобожденный бюджет
            </Text>
          </div>
          <div className={styles.chart}>
            <Text>
              Расчет в количестве пациентов
            </Text>
            <br/>
            <br/>
            <Bar options={patientsOptions} data={patientsData} id="chart-patient" />
          </div>
        </div>
        {rootNosologia === 'ra' && (
          <>
            <div className={styles['report-row']}>
              <Text color="blue" className={styles.heading} size="xxl">
                <img src={headerLogo} alt=""/>
                Значение показателя «Затраты-эффективность»
              </Text>
              <div className={styles.chart}>
                <Bar
                  id="efficiency-patient"
                  options={{
                  indexAxis: 'y',
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return getLocalCurrencyStr(context.raw)
                        }
                      }
                    },
                    legend: {
                      display: false
                    }
                  }
                }} data={efficiencyChartData} />
              </div>
            </div>
            <div className={styles['report-row']}>
              <div className={styles['yellow-block']}>
                <div className={styles['yellow-block-icon']}>
                  <Info />
                </div>
                <Text size="xxl" className={styles['yellow-block-title']} color="blue">
                  Заключение
                </Text>
                <Text size="l-regular" className={styles['yellow-block-text']}>
                  По результатам данного анализа ЛП* этанерцепта Эрелзи® характеризуется как строго-предпочтительный, так как при самой высокой клинической эффективности этанерцепта, препарат характеризуется наименьшим значением показателя «Затраты – эффективность»<sup>3,4</sup>
                </Text>
              </div>
            </div>
          </>
        )}
        <div className={styles['report-footer']}>
          <Text color="info" className={styles['report-row-m']}>
            *ЛП лекарственных препаратов. <br/>
            **ПсА - псориатический артрит. <br/>
            ***СпА - спондилоартрит. <br/>
            ****НДС - налог на добавленную стоимость. <br/>
            *****ЖНВЛП - жизненно необходимые и важнейшие лекарственные препараты.
          </Text>
          <Text color="info" className={styles['report-row-m']}>
            Государственный реестр лекарственных средств, режим доступа: Государственный реестр лекарственных средств (rosminzdrav.ru)дата обращения: 17.05.2022 [State Register of Medicines. [Electronic resource], access mode: www.grls.rosminzdrav.ru date of access: 17.05.2022], инструкции по медицинскому применению препарата Оренсия, Хумира, Далибра, Олумиант, Сипмони, Ремикейд, Фламмегис, Инфликсмаб, Артлегия, Мабтера, Ацеллбия, Реддитукс, Кевзара, Яквинус, Актемра, Эрелзи, Энбрел, Этанерцепт ПСК, Ранвэк, Симзия, Эксэмптия. Государственный реестр лекарственных средств, режим доступа: Государственный реестр предельных отпускных цен (rosminzdrav.ru) дата обращения: 17.05.2022 [State Register of Medicines. [Electronic resource], access mode: www.grls.rosminzdrav.ru date of access: 17.05.2022], предельно отпускные цены на препараты Оренсия, Хумира, Далибра, Олумиант, Сипмони, Ремикейд, Фламмегис, Инфликсмаб, Артлегия, Мабтера, Ацеллбия, Реддитукс, Кевзара, Яквинус, Актемра, Эрелзи, Энбрел, Этанерцепт ПСК, Ранвэк, Симзия, Эксэмптия. Camean‐Castillo M, Gimeno‐Ballester V, Rios‐Sanchez E, Fenix‐Caballero S, Vázquez‐Real M, Alegre‐del Rey E. Network meta‐analysis of tofacitinib versus biologic treatments in moderate‐to‐severe rheumatoid arthritis patients. J Clin Pharm Ther. 2019;44:384–396. Куликов А.Ю., Серпик В.Г., Лила А.М.Фармакоэкономическая оценка стратегии лекарственного обеспечения по переключению ревматологических пациентов, получающих ГИБП, с оригинальных лекарственных препаратов на биосимиляры в условиях системы здравоохранения России. В печати. Предельные размеры оптовых надбавок и предельные размеры розничных надбавок к ценам на жизненно необходимые и важные лекарственные препараты, установленные в субъектах Российской Федерации. https://fas.gov.ru/documents/686923, дата входа 20.05.2022.          </Text>
          <Text className={styles.tc} size="l-regular" color="info">
            Информация представлена для медицинских, фармацевтических работников
          </Text>
          <Text className={styles.tc}>
            RU2206074187
          </Text>
        </div>
      </div>

      <form className={styles.form} onSubmit={(e) => {
        e.preventDefault()
        setShowConfirm(true)
      }}>
        <ActionBar
          nextBtnText="Отправить"
        />
      </form>
      {showConfirm && (
        <ReactModal onClose={() => setShowConfirm(false)}>
          <Confirm
            reportSendStatus={reportSendStatus}
            onSubmit={(email) => {
              const storedData = JSON.parse(window.localStorage.getItem(`${reportId}-report-id`))

              const updatedData = {
                ...storedData,
                data: reportData.data,
                stepLabel,
              }

              if (storedData) {
                window.localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
              }

              onSubmit(email, updatedData, {chartData, patientsData, efficiencyChartData})
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </ReactModal>
      )}
    </>
  )
}
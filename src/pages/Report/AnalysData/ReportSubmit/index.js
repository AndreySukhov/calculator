import { Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { Table } from '../../../../components/base/Table';
import { useMemo, useState } from 'react';
import { ReactModal } from '../../../../components/Modal';
import styles from './styles.module.css';
import headerLogo from '../../../../assets/images/header-logo.svg';
import { ReactComponent as Calendar} from '../../../../assets/images/calendar.svg';
import { ReactComponent as Pin} from '../../../../assets/images/pin.svg';
import { ReactComponent as Info} from '../../../../assets/images/info.svg';
import { ReactComponent as Rub} from '../../../../assets/images/rub.svg';
import { StatList } from '../../../../components/base/StatList';
import { getLocalCurrencyStr } from '../../../../utils/getLocalCurrencyStr';
import { Confirm } from './Confirm';

import { NOSOLOGY_DICTIONARY } from '../../../../utils/nosologyDictionary'
import {
  getCleanIncreaseVal,
  getExpenseCurrentBudget, getExpenseCurrentBudgetItem,
  getExpensePercentDiff,
  getExpensePlanBudget, getExpensePlanBudgetItem,
  getIncreaseVal, getSavedPerPatientMoney
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


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const patientsOptions = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true
};

const labels = ['Текущий', 'Планируемый'];


export const ReportSubmit = ({reportData, reportId, onSubmit, onPrevClick, regionId, tradeIncrease, stepLabel}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { rootNosologia } = reportData
  const reportDate = new Date(Number(reportId))
  const nosologiaShortName = NOSOLOGY_DICTIONARY[rootNosologia].short
  const nosologiaLongName = NOSOLOGY_DICTIONARY[rootNosologia].full

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
  });
  const planBudget = getExpensePlanBudget({
    nosologia: rootNosologia,
    healYear: [1],
    data: reportData.data,
    tradeIncrease,
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


  const patientsData = {
    labels: patientsLabels,
    datasets: [
      {
        label: 'кол-во пациентов',
        data: patientsLabels.map((label) => {
          const current = reportData.data.find((reportItem) => reportItem.label === label)
          return getSavedPerPatientMoney({
            item: current,
            nosologia: rootNosologia,
            patientStatus: 'first',
            tradeIncrease,
          })
        }),
        backgroundColor: '#4461A1',
      }
    ],
  };

  const handleSubmit = () => {
    const storedData = JSON.parse(localStorage.getItem(`${reportId}-report-id`))

    const updatedData = {
      ...storedData,
      stepLabel
    }

    if (storedData) {
      localStorage.setItem(`${reportId}-report-id`, JSON.stringify(updatedData))
    }
    onSubmit()
  }

  return (
    <>
      <div className={styles['report-header']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
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
          <img src={headerLogo} alt=""/>
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
          <img src={headerLogo} alt=""/>
          Уровень исследования
        </Text>
        <Text className={styles['text-with-icon']}>
          <Pin /> {regionTitle}
        </Text>
        <div className={styles['stat-table']}>
          <StatList
            data={[
              {
                title: `Количество пациетов с ${nosologiaShortName}`,
                text: '17 097'
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
          <img src={headerLogo} alt=""/>
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
          <img src={headerLogo} alt=""/>
          Результаты анализа затрат текущего и планируемого бюджета
        </Text>
        <div className={styles.chart}>
          <Bar options={options} data={chartData} />
        </div>
        <div className={styles['report-row-m']}>
          <table className={styles.table}>
            <thead>
            <th>Все препараты</th>
            <th>Текущий</th>
            <th>Планируемый</th>
            </thead>
            <tbody>
            {reportData.data.map((item) => {
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
                    <Text size="m" className={styles['cost-chart-text']}>
                      {getLocalCurrencyStr(Number(getExpenseCurrentBudgetItem({
                        item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
                      }).toFixed(2)))}
                    </Text>
                    <Text color="disabled" size="xs">
                      {Math.round(item.patients)} чел
                    </Text>
                  </td>
                  <td>
                    <Text size="m" className={styles['cost-chart-text']}>
                      {getLocalCurrencyStr(Number(getExpensePlanBudgetItem({
                        item, nosologia: rootNosologia, tradeIncrease, includeFirst: true, includeSecond: false, includeThird: false
                      }).toFixed(2)))}
                    </Text>
                    <Text color="disabled" size="xs">
                      {Math.round(item.planPatients)} чел
                    </Text>
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
            {getLocalCurrencyStr(currentBudget - planBudget)} или {budgetDiff}%
          </Text>
        </div>
      </div>
      <div className={styles['report-row']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
          Количество новых пациентов в рамках высвободившегося бюджета на планируемый период
        </Text>
        <div className={styles['report-row-s']}>
          <Text className={`${styles['report-date']} ${styles['text-with-icon']}`} size="l">
            <Rub /> Высвобожденный бюджет
          </Text>
        </div>
        <div className={styles.chart}>
          <Bar options={patientsData} data={patientsData} />
        </div>
      </div>
      <div className={styles['report-row']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
          Значение показателя «Затраты-эффективность»
        </Text>
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
      <div className={styles['report-footer']}>
        <Text color="info" className={styles['report-row-m']}>
          *ЛП лекарственных препаратов. <br/>
          **ПсА - псориатический артрит. <br/>
          ***СпА - спондилоартрит. <br/>
          ****НДС - налог на добавленную стоимость. <br/>
          *****ЖНВЛП - жизненно необходимые и важнейшие лекарственные препараты.
        </Text>
        <Text color="info" className={styles['report-row-m']}>
          Государственный реестр лекарственных средств, режим доступа: Государственный реестр лекарственных средств (rosminzdrav.ru)дата обращения: 17.05.2022 [State Register of Medicines. [Electronic resource], access mode: www.grls.rosminzdrav.ru date of access: 17.05.2022], инструкции по медицинскому применению препарата Оренсия, Хумира, Далибра, Олумиант, Сипмони, Ремикейд, Фламмегис, Инфликсмаб, Артлегия, Мабтера, Ацеллбия, Реддитукс, Кевзара, Яквинус, Актемра, Эрелзи, Энбрел, Этанерцепт ПСК, Ранвэк, Симзия
          Государственный реестр лекарственных средств, режим доступа: Государственный реестр предельных отпускных цен (rosminzdrav.ru) дата обращения: 17.05.2022 [State Register of Medicines. [Electronic resource], access mode: www.grls.rosminzdrav.ru date of access: 17.05.2022], предельно отпускные цены на препараты Оренсия, Хумира, Далибра, Олумиант, Сипмони, Ремикейд, Фламмегис, Инфликсмаб, Артлегия, Мабтера, Ацеллбия, Реддитукс, Кевзара, Яквинус, Актемра, Эрелзи, Энбрел, Этанерцепт ПСК, Ранвэк, Симзия
          Camean‐Castillo M, Gimeno‐Ballester V, Rios‐Sanchez E, Fenix‐Caballero S, Vázquez‐Real M, Alegre‐del Rey E. Network meta‐analysis of tofacitinib versus biologic treatments in moderate‐to‐severe rheumatoid arthritis patients. J Clin Pharm Ther. 2019;44:384–396.
          Куликов А.Ю., Серпик В.Г., Лила А.М.Фармакоэкономическая оценка стратегии лекарственного обеспечения по переключению ревматологических пациентов, получающих ГИБП, с оригинальных лекарственных препаратов на биосимиляры в условиях системы здравоохранения России.  В печати.
          Предельные размеры оптовых надбавок и предельные размеры розничных надбавок к ценам на жизненно необходимые и важные лекарственные препараты, установленные в субъектах Российской Федерации. https://fas.gov.ru/documents/686923, дата входа 20.05.2022.
        </Text>
        <Text className={styles.tc} size="l-regular" color="info">
          Информация представлена для медицинских, фармацевтических работников
        </Text>
      </div>

      <form className={styles.form} onSubmit={(e) => {
        e.preventDefault()
        setShowConfirm(true)
      }}>
        <ActionBar
          onPrevButtonClick={onPrevClick}
          prevBtnText="Назад"
          nextBtnText="Отправить"
        />
      </form>
      {showConfirm && (
        <ReactModal onClose={() => setShowConfirm(false)}>
          <Confirm
            onSubmit={(email) => {
              onSubmit(email)
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </ReactModal>
      )}
    </>
  )
}
import { Text } from '../../../../components/base';
import { ActionBar } from '../../components/ActionBar';
import { Table } from '../../../../components/base/Table';
import { useState } from 'react';
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

export const ReportSubmit = ({data, onSubmit, onPrevClick}) => {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div className={styles['report-header']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
          Предпросмотр отчёта
        </Text>
        <Text className={`${styles['report-date']} ${styles['text-with-icon']}`} size="l">
          <Calendar /> Отчёт составлен: <strong>12 апреля 2022 г.</strong>
        </Text>
      </div>
      <Text className={styles['main-title']} color="blue" size="3xl">
        Отчёт «Фармакоэкономическая модель для оценки лечения ревматоидного артрита (РА) современными ГИБП»
      </Text>
      <div className={styles['report-text']}>
        <Text tag="p" size="l">
          Данный отчет является результатом анализа «Влияние на бюджет» лечения ревматоидного артрита (РА) современными генно-инженерными биологическими препаратами (ГИБП). На основании фармако-экономического моделирования так же представлен анализ «Затраты-эффективность» в лечении ревматоидного артрита (РА) с целью выявления преимущественной схемы лечения.
        </Text>
        <Text tag="p" size="l">
          Анализ «Влияние на бюджет» может проводиться как на федеральном (вся страна), так и на региональном уровне.
        </Text>
        <Text tag="p" size="l">
          В анализ были включены 19 международных непатентованных названий (МНН) лекарственных препаратов (ЛП*) в соответствии с действующими инструкциями по медицинскому применению и представлены в таблице «Показания к применению по основным ревматическим заболеваниям»<sup>1,2</sup>.
        </Text>
      </div>
      <div className={styles['report-row']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
          Показания к применению по основным ревматическим заболеваниям <sup>1</sup>
        </Text>
        <Table
          heading={['№', 'МНН', 'РА', 'ПсА', 'СпА']}
          data={[[1,"Абатацепт","Да","-","-"],[2,"Адалимумаб","Да","Да","Да"],[3,"Апремиласт","-","Да","-"],[4,"Барицитиниб","Да","-","-"],[5,"Голимумаб","Да","Да","Да"],[6,"Гуселькумаб","-","Да","-"],[7,"Иксекизумаб","-","Да","Да"],[8,"Инфликсимаб","-","Да","Да"],[9,"Нетакимаб","-","Да","Да"],[10,"Олокизумаб","Да","-","-"],[11,"Ритускимаб","Да","-","-"],[12,"Сарилумаб","Да","-","-"],[13,"Секукинумаб","-","Да","Да"],[14,"Тофацитиниб","Да","Да","Да"],[15,"Тоцилизумаб","Да","-","-"],[16,"Упадацитиниб","Да","Да","Да"],[17,"Устекинумаб","-","Да","-"],[18,"Цертолизумаб пэгол","Да","Да","Да"],[19,"Этанерцепт","Да","Да","Да"]]}
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
          <Pin /> Региональный (Кабардино-Балкарская Республика)
        </Text>
        <div className={styles['stat-table']}>
          <StatList
            data={[
              {
                title: 'Количество пациетов с РА',
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
                text: '12%'
              }
            ]}
          />
        </div>
      </div>
      <div className={styles['report-row']}>
        <Table
          heading={['№', 'МНН', 'РА', 'ПсА', 'СпА']}
          data={[[1,"Абатацепт","Да","-","-"],[2,"Адалимумаб","Да","Да","Да"],[3,"Апремиласт","-","Да","-"],[4,"Барицитиниб","Да","-","-"],[5,"Голимумаб","Да","Да","Да"],[6,"Гуселькумаб","-","Да","-"],[7,"Иксекизумаб","-","Да","Да"],[8,"Инфликсимаб","-","Да","Да"],[9,"Нетакимаб","-","Да","Да"],[10,"Олокизумаб","Да","-","-"],[11,"Ритускимаб","Да","-","-"],[12,"Сарилумаб","Да","-","-"],[13,"Секукинумаб","-","Да","Да"],[14,"Тофацитиниб","Да","Да","Да"],[15,"Тоцилизумаб","Да","-","-"],[16,"Упадацитиниб","Да","Да","Да"],[17,"Устекинумаб","-","Да","-"],[18,"Цертолизумаб пэгол","Да","Да","Да"],[19,"Этанерцепт","Да","Да","Да"]]}
        />
      </div>
     <div className={styles['report-row']}>
       <Text color="blue" className={styles.heading} size="xxl">
         <img src={headerLogo} alt=""/>
         Ценовой анализ торговых наименований лекарственных препаратов (ЛП) по показанию ревматоидный артрит (РА) <sup>1,2</sup>
       </Text>
     </div>
      <div className={styles['report-row']}>
        <Text color="blue" className={styles.heading} size="xxl">
          <img src={headerLogo} alt=""/>
          Результаты анализа затрат текущего и планируемого бюджета
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
            Бюджет планируемого распределения предоставляет экономию средств в сравнении с бюджетом текущего распределения в размере
          </Text>
          <Text size="xxl">
            {getLocalCurrencyStr(901144365)} или 8,9%
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
          nextBtnText="Согласовать отчёт"
        />
      </form>
      {showConfirm && (
        <ReactModal onClose={() => setShowConfirm(false)}>
          <Confirm
            onSubmit={onSubmit}
            onCancel={() => setShowConfirm(false)}
          />
        </ReactModal>
      )}
    </>
  )
}
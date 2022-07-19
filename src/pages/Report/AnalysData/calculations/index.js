import { metoJectData } from '../../../../data';

export const getIncreaseVal = (price, increase) => {
  if (increase <= 0) {
    return Number(price) * 1.1
  }
  return (Number(price) + Number(price*increase/100)) * 1.1
}

export const getCleanIncreaseVal = (price, increase) => {
  return Number(price) + Number(price*increase/100)
}

export const getExpenseCurrentBudgetItem = ({
  item, nosologia, packagesUnit, patientsUnit,
  tradeIncrease, includeFirst, includeSecond, includeThird,
}) => {
  const currentNosology = item[nosologia]

  let res = 0
  const { patientsPsa, patientsRa, patientsSpa, patients } = item
  const totalPackPrice = Number(getIncreaseVal(Number(item.pricePerPack), Number(tradeIncrease)))

  if (patientsPsa >= 1 && nosologia === 'psa') {
    if (includeFirst) {
      res +=
        (((0.05 * Number(patientsPsa) * currentNosology.initial.year1) + (0.95 * Number(patientsPsa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res += (((0.05 * Number(patientsPsa) * currentNosology.initial.year2) + (0.95 * Number(patientsPsa) * currentNosology.secondary.year2)))
    }
    if (includeThird) {
      res += (((0.05 * Number(patientsPsa) * currentNosology.initial.year3) + (0.95 * Number(patientsPsa) * currentNosology.secondary.year3)))
    }
  }

  if (patientsRa  >= 1 && nosologia === 'ra') {
    if (includeFirst) {
      res +=
        (((0.05 * Number(patientsRa) * currentNosology.initial.year1) + (0.95 * Number(patientsRa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res +=
        (((0.05 * Number(patientsRa) * currentNosology.initial.year2) + (0.95 * Number(patientsRa) * currentNosology.secondary.year2)))
    }
    if (includeThird) {
      res += (((0.05 * Number(patientsRa) * currentNosology.initial.year3) + (0.95 * Number(patientsRa) * currentNosology.secondary.year3)))
    }
  }

  if (patientsSpa >= 1 && nosologia === 'spa') {
    if (includeFirst) {
      res +=
        (((0.05 * Number(patientsSpa) * currentNosology.initial.year1) + (0.95 * Number(patientsSpa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res += (((0.05 * Number(patientsSpa) * currentNosology.initial.year2) + (0.95 * Number(patientsSpa) * currentNosology.secondary.year2))
      )   }
    if (includeThird) {
      res += ( ((0.05 * Number(patientsSpa) * currentNosology.initial.year3) + (0.95 * Number(patientsSpa) * currentNosology.secondary.year3)))
    }
  }

  if (res < 0) {
    return 0
  }

  return res * totalPackPrice
}

export const getExpenseCurrentBudget = ({
  nosologia,
  healYear,
  data,
  tradeIncrease,
  packagesUnit,
  patientsUnit
}) => {
  if (!data) {
    return 0
  }
  const includeFirst = healYear.includes(1)
  const includeSecond = healYear.includes(2)
  const includeThird = healYear.includes(3)

  let res = 0
  if (!includeFirst && !includeSecond && !includeThird) {
    return 0
  }

  data.forEach((item) => {
    res += getExpenseCurrentBudgetItem({
      item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird,
      packagesUnit, patientsUnit
    })
  })

  return res
}

export const getExpensePlanBudgetItem = ({
 item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird,
     packagesUnit,
     patientsUnit
}) => {
  const currentNosology = item[nosologia]

  let res = 0
  const { planPatientsPsa, planPatientsRa, planPatientsSpa, planPatients } = item
  const totalPackPrice = Number(getIncreaseVal(Number(item.pricePerPack), Number(tradeIncrease)))

  if (planPatientsPsa >= 1 && nosologia === 'psa') {

    if (includeFirst) {
      res +=
        (((0.05 * Number(planPatientsPsa) * currentNosology.initial.year1) + (0.95 * Number(planPatientsPsa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res += (((0.05 * Number(planPatientsPsa) * currentNosology.initial.year2) + (0.95 * Number(planPatientsPsa) * currentNosology.secondary.year2)))
    }
    if (includeThird) {
      res += (((0.05 * Number(planPatientsPsa) * currentNosology.initial.year3) + (0.95 * Number(planPatientsPsa) * currentNosology.secondary.year3)))
    }
  }

  if (planPatientsRa >= 1 && nosologia === 'ra') {
    if (includeFirst) {
      res +=
        (((0.05 * Number(planPatientsRa) * currentNosology.initial.year1) + (0.95 * Number(planPatientsRa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res +=
        (((0.05 * Number(planPatientsRa) * currentNosology.initial.year2) + (0.95 * Number(planPatientsRa) * currentNosology.secondary.year2)))
    }
    if (includeThird) {
      res += (((0.05 * Number(planPatientsRa) * currentNosology.initial.year3) + (0.95 * Number(planPatientsRa) * currentNosology.secondary.year3)))
    }
  }

  if (planPatientsSpa >= 1 && nosologia === 'spa') {
    if (includeFirst) {
      res +=
        (((0.05 * Number(planPatientsSpa) * currentNosology.initial.year1) + (0.95 * Number(planPatientsSpa) * currentNosology.secondary.year1)))
    }
    if (includeSecond) {
      res += (((0.05 * Number(planPatientsSpa) * currentNosology.initial.year2) + (0.95 * Number(planPatientsSpa) * currentNosology.secondary.year2))
      )}
    if (includeThird) {
      res += ( ((0.05 * Number(planPatientsSpa) * currentNosology.initial.year3) + (0.95 * Number(planPatientsSpa) * currentNosology.secondary.year3)))
    }
  }

  if (res < 0) {
    return 0
  }

  return Number(res.toFixed(3))  * totalPackPrice
}

export const getExpensePlanBudget = ({
   nosologia,
   healYear,
   data,
   tradeIncrease,
   packagesUnit,
   patientsUnit
 }) => {

  if (!data) {
    return 0
  }

  const includeFirst = healYear.includes(1)
  const includeSecond = healYear.includes(2)
  const includeThird = healYear.includes(3)

  if (!includeFirst && !includeSecond && !includeThird) {
    return 0
  }

  let res = 0

  data.forEach((item) => {
      res += getExpensePlanBudgetItem({
        item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird,
        packagesUnit,
        patientsUnit
      })
  })

  return res
}

export const getExpensePercentDiff = (currentBudget, planBudget) => {
  if (!currentBudget || !planBudget) {
    return ''
  }
  const res = ( currentBudget - planBudget ) / ( (currentBudget+planBudget)/2 )

  if (res < 0) {
    return null
  }

  return 100 * Math.abs( res ).toFixed(2);
}

export const getPricePackPerPatient = ({
 item, nosologia, tradeIncrease, patientStatus, year
}) => {
  const totalPackPrice = getIncreaseVal(Number(item.pricePerPack), Number(tradeIncrease))
  const currentNosology = item[nosologia]
  let packsRequired = 0
  if (patientStatus === 'first') {
    if (year === 1) {
      packsRequired = currentNosology.initial.year1
    } else if (year === 2) {
      packsRequired = currentNosology.initial.year2
    } else {
      packsRequired = currentNosology.initial.year3
    }
  } else {
    if (year === 1) {
      packsRequired = currentNosology.secondary.year1
    } else if (year === 2) {
      packsRequired = currentNosology.secondary.year2
    } else {
      packsRequired = currentNosology.secondary.year3
    }
  }
  return totalPackPrice * packsRequired
}

export const getSavedPerPatientMoney = ({
  item,
  nosologia,
  patientStatus,
  tradeIncrease,
  diff
}) => {
  // при отрицательном бюджете выводим 0 во всех расчетах в анализе данных
  const currentNosology = item[nosologia]

  let packsRequired = 0

  if (patientStatus === 'first') {
    packsRequired = currentNosology.initial.year1
  } else {
    packsRequired = currentNosology.secondary.year1
  }

  return diff / Number((packsRequired * getIncreaseVal(item.pricePerPack, tradeIncrease)).toFixed(2))
}

const metoDject = metoJectData

export const getEfficiency = ({
  item,
  nosologia,
  patientStatus,
  tradeIncrease,
}) => {
  const currentNosology = item[nosologia]
  const metoDjectNosology = metoDject[nosologia]

  let packsRequired = 0
  let metoDjectRequired = 0

  if (patientStatus === 'first') {
    packsRequired = 52/24 * currentNosology.initial.year1
    metoDjectRequired = 52/24 * metoDjectNosology.initial.year1
  } else {
    packsRequired = 52/24 * currentNosology.secondary.year1
    metoDjectRequired = 52/24 * metoDjectNosology.secondary.year1
  }

  return Number((packsRequired * getIncreaseVal(item.pricePerPack, tradeIncrease)).toFixed(2)) +
    Number((metoDjectRequired * getIncreaseVal(metoDject.pricePerPack, tradeIncrease)).toFixed(2))
}

export const getFormattedNumber = (num) => {
  if (num === '') {
    return ''
  }
  return Number(Number(num).toFixed(2))
}
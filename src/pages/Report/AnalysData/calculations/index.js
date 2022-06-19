import { tradeNamesData } from '../../../../data';

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
  const totalPackPrice = getIncreaseVal(Number(item.pricePerPack), Number(tradeIncrease))
  if (item.label === 'Артлегиа') {
    console.log(item, 'item')
    console.log({totalPackPrice})
  }

  if (patientsPsa && nosologia === 'psa') {
    let percent = null

    if (patientsUnit === 'percent') {
      percent = patientsPsa / 100
    } else {
      percent = patientsPsa / Math.round(patients)
    }

    if (includeFirst) {
      res +=
        (((0.05 * patientsPsa * currentNosology.initial.year1) + (0.95 * patientsPsa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res += (((0.05 * patientsPsa * currentNosology.initial.year2) + (0.95 * patientsPsa * currentNosology.secondary.year2)) * percent)
    }
    if (includeThird) {
      res += (((0.05 * patientsPsa * currentNosology.initial.year3) + (0.95 * patientsPsa * currentNosology.secondary.year3)) * percent)
    }
  }

  if (patientsRa && nosologia === 'ra') {
    let percent = null


    if (patientsUnit === 'percent') {
      percent = patientsRa / 100
    } else {
      percent = patientsRa / Math.round(patients)
    }

    console.log({percent})

    if (includeFirst) {
      res +=
        (((0.05 * patientsRa * currentNosology.initial.year1) + (0.95 * patientsRa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res +=
        (((0.05 * patientsRa * currentNosology.initial.year2) + (0.95 * patientsRa * currentNosology.secondary.year2)) * percent)
    }
    if (includeThird) {
      res += (((0.05 * patientsRa * currentNosology.initial.year3) + (0.95 * patientsRa * currentNosology.secondary.year3)) * percent)
    }
  }

  if (patientsSpa && nosologia === 'spa') {
    let percent = null

    if (patientsUnit === 'percent') {
      percent = patientsSpa / 100
    } else {
      percent = patientsSpa / Math.round(patients)
    }

    if (includeFirst) {
      res +=
        (((0.05 * patientsSpa * currentNosology.initial.year1) + (0.95 * patientsSpa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res += (((0.05 * patientsSpa * currentNosology.initial.year2) + (0.95 * patientsSpa * currentNosology.secondary.year2)) * percent
      )   }
    if (includeThird) {
      res += ( ((0.05 * patientsSpa * currentNosology.initial.year3) + (0.95 * patientsSpa * currentNosology.secondary.year3)) * percent)
    }
  }

  if (res < 0) {
    return 0
  }

  if (item.label === 'Артлегиа') {
    console.log(res, 'res')
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
  const { patientsPsa, patientsRa, patientsSpa, planPatients } = item
  const totalPackPrice = getIncreaseVal(Math.round(item.pricePerPack), Number(tradeIncrease))


  if (patientsPsa && nosologia === 'psa') {
    let percent = null

    if (patientsUnit === 'percent') {
      percent = patientsPsa / 100
    } else {
      percent = patientsPsa / Math.round(planPatients)
    }

    if (includeFirst) {
      res +=
        (((0.05 * patientsPsa * currentNosology.initial.year1) + (0.95 * patientsPsa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res += (((0.05 * patientsPsa * currentNosology.initial.year2) + (0.95 * patientsPsa * currentNosology.secondary.year2)) * percent)
    }
    if (includeThird) {
      res += (((0.05 * patientsPsa * currentNosology.initial.year3) + (0.95 * patientsPsa * currentNosology.secondary.year3)) * percent)
    }
  }

  if (patientsRa && nosologia === 'ra') {
    let percent = null

    if (patientsUnit === 'percent') {
      percent = patientsRa / 100
    } else {
      percent = patientsRa / Math.round(planPatients)
    }

    if (includeFirst) {
      res +=
        (((0.05 * patientsRa * currentNosology.initial.year1) + (0.95 * patientsRa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res +=
        (((0.05 * patientsRa * currentNosology.initial.year2) + (0.95 * patientsRa * currentNosology.secondary.year2)) * percent)
    }
    if (includeThird) {
      res += (((0.05 * patientsRa * currentNosology.initial.year3) + (0.95 * patientsRa * currentNosology.secondary.year3)) * percent)
    }
  }

  if (patientsSpa && nosologia === 'spa') {
    let percent = null

    if (patientsUnit === 'percent') {
      percent = patientsSpa / 100
    } else {
      percent = patientsSpa / Number(planPatients)
    }

    if (includeFirst) {
      res +=
        (((0.05 * patientsSpa * currentNosology.initial.year1) + (0.95 * patientsSpa * currentNosology.secondary.year1)) * percent)
    }
    if (includeSecond) {
      res += (((0.05 * patientsSpa * currentNosology.initial.year2) + (0.95 * patientsSpa * currentNosology.secondary.year2)) * percent
      )}
    if (includeThird) {
      res += ( ((0.05 * patientsSpa * currentNosology.initial.year3) + (0.95 * patientsSpa * currentNosology.secondary.year3)) * percent)
    }
  }



  if (res < 0) {
    return 0
  }

  return res  * totalPackPrice
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

const metoDject = tradeNamesData.find((item) => item.label === 'Методжект')

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
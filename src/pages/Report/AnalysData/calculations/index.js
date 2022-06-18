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
  item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird
}) => {
  const currentNosology = item[nosologia]
  if (!currentNosology.disabled) {
    let totalPacks = 0
    const totalPackPrice = getIncreaseVal(Number(item.pricePerPack) * Number(item.patients), Number(tradeIncrease))

    if (includeFirst) {
      totalPacks += (0.05 * item.packages * currentNosology.initial.year1) + (0.95 * item.packages * currentNosology.secondary.year1)
    }
    if (includeSecond) {
      totalPacks += (0.05 * item.packages * currentNosology.initial.year2) + (0.95 * item.packages * currentNosology.secondary.year2)
    }
    if (includeThird) {
      totalPacks += (0.05 * item.packages * currentNosology.initial.year3) + (0.95 * item.packages * currentNosology.secondary.year3)
    }
    return totalPackPrice * totalPacks
  }

  return 0
}

export const getExpenseCurrentBudget = ({
  nosologia,
  healYear,
  data,
  tradeIncrease,
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
      item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird
    })
  })

  return res
}

export const getExpensePlanBudgetItem = ({
 item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird
}) => {
  const currentNosology = item[nosologia]
  if (!currentNosology.disabled) {
    let totalPacks = 0
    const totalPackPrice = getIncreaseVal(Number(item.pricePerPack) * Number(item.planPatients), Number(tradeIncrease))

    if (includeFirst) {
      totalPacks += (0.05 * item.planPackages * currentNosology.initial.year1) + (0.95 * item.planPackages * currentNosology.secondary.year1)
    }
    if (includeSecond) {
      totalPacks += (0.05 * item.planPackages * currentNosology.initial.year2) + (0.95 * item.planPackages * currentNosology.secondary.year2)
    }
    if (includeThird) {
      totalPacks += (0.05 * item.planPackages * currentNosology.initial.year3) + (0.95 * item.planPackages * currentNosology.secondary.year3)
    }

    return totalPackPrice * totalPacks
  }

  return 0
}

export const getExpensePlanBudget = ({
   nosologia,
   healYear,
   data,
   tradeIncrease,
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
        item, nosologia, tradeIncrease, includeFirst, includeSecond, includeThird
      })
  })

  return res
}

export const getExpensePercentDiff = (currentBudget, planBudget) => {
  if (!currentBudget || !planBudget) {
    return ''
  }

  return 100 * Math.abs( ( currentBudget - planBudget ) / ( (currentBudget+planBudget)/2 ) ).toFixed(2);
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
}) => {
  const currentNosology = item[nosologia]

  let packsRequired = 0

  if (patientStatus === 'first') {
    packsRequired = currentNosology.initial.year1
  } else {
    packsRequired = currentNosology.secondary.year1
  }

  return Number((packsRequired * getIncreaseVal(item.pricePerPack, tradeIncrease)).toFixed(2))
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
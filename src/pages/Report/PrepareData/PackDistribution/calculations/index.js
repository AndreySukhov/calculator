const percentToValue = (percent, num) => (percent / 100) * num;
function valueToPercent(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

/** паценты на пачку */
const calculatePatientsPerPacks = ({
  packs,
  psaYear1,
  raYear1,
  spaYear1,
  psaYearNext,
  raYearNext,
  spaYearNext,
  packsPsa,
  packsRa,
  packsSpa,
  enabledInputs,
  packagesSelect,
  psaDisabled,
  raDisabled,
  spaDisabled,
}) => {
  let total = null
  let res = {}

  if (enabledInputs === 1) {
    let year1Val = null;
    let yearNextVal = null;
    if (!psaDisabled) {
      year1Val = psaYear1;
      yearNextVal = psaYearNext;
    } else if (!raDisabled) {
      year1Val = raYear1;
      yearNextVal = raYearNext;
    } else if (!spaDisabled) {
      year1Val = spaYear1;
      yearNextVal = spaYearNext;
    }
    total = (0.05 * packs / year1Val) + (0.95 * packs / yearNextVal)

    res.patients = Number(parseFloat(total))

    return res
  }

  if (packsPsa) {
    let psaTotal = null
    if (packagesSelect === 'percent') {
      const percent = (packsPsa / 100)
      psaTotal = ((0.05 * packs / psaYear1) + (0.95 * packs / psaYearNext)) * percent
    } else {
      const percent = (packsPsa / packs)
      psaTotal = ((0.05 * packs / psaYear1) + (0.95 * packs / psaYearNext)) * percent
    }

    if (psaTotal) {
      res.patientsPsa = psaTotal
      total = psaTotal
    }
  }
  if (packsRa) {
    let packsRaTotal = null
    if (packagesSelect === 'percent') {
      const percent = (packsRa / 100)
      packsRaTotal = ((0.05 * packs / raYear1) + (0.95 * packs / raYearNext)) * percent
    } else {
      const percent = (packsRa / packs)
      packsRaTotal = ((0.05 * packs / raYear1) + (0.95 * packs / raYearNext)) * percent
    }

    if (packsRaTotal) {
      res.patientsRa = packsRaTotal;

      if (!total) {
        total = packsRaTotal
      } else {
        total += packsRaTotal
      }
    }
  }

  if (packsSpa) {
    let packsSpaTotal = null
    if (packagesSelect === 'percent') {
      const percent = (packsSpa / 100)
      packsSpaTotal = ((0.05 * packs / spaYear1) + (0.95 * packs / spaYearNext)) * percent
    } else {
      const percent = (packsSpa / packs)
      packsSpaTotal = ((0.05 * packs / spaYear1) + (0.95 * packs / spaYearNext)) * percent
    }

    if (packsSpaTotal) {
      res.patientsSpa = packsSpaTotal;
      if (!total) {
        total = packsSpaTotal
      } else {
        total += packsSpaTotal
      }
    }
  }
  if (total) {
    res.patients = Number(parseFloat(total))
  }

  return res;
}

export const getPatientsValue = (data, packagesSelect) => {
  return calculatePatientsPerPacks({
    packs: data.packages,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
    packsPsa: data.packsPsa,
    packsRa: data.packsRa,
    packsSpa: data.packsSpa,
    enabledInputs: data.enabledInputs,
    packagesSelect,
    psaDisabled: data.psa.disabled,
    raDisabled: data.ra.disabled,
    spaDisabled: data.spa.disabled,
  })
}

export const getPlanPatientsValue = (data, packagesSelect) => {
  return calculatePatientsPerPacks({
    packs: data.planPackages,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
    packsPsa: data.packsPsa,
    packsRa: data.packsRa,
    packsSpa: data.packsSpa,
    enabledInputs: data.enabledInputs,
    packagesSelect,
    psaDisabled: data.psa.disabled,
    raDisabled: data.ra.disabled,
    spaDisabled: data.spa.disabled,
  })
}

const getPatientPerPack = ({
  patients,
  psaYear1,
  raYear1,
  spaYear1,
  psaYearNext,
  raYearNext,
  spaYearNext,
  psaDisabled,
  raDisabled,
  spaDisabled,
  patientsPsa,
  patientsRa,
  patientsSpa,
  enabledInputs,
  patientsSelect
}) => {
  let total = null
  let res = {}

  if (enabledInputs === 1) {
    let year1Val = null;
    let yearNextVal = null;

    if (!psaDisabled) {
      year1Val = psaYear1;
      yearNextVal = psaYearNext;
    } else if (!raDisabled) {
      year1Val = raYear1;
      yearNextVal = raYearNext;
    } else if (!spaDisabled) {
      year1Val = spaYear1;
      yearNextVal = spaYearNext;
    }
    total = (0.05 * patients * year1Val) + (0.95 * patients * yearNextVal)

    res.packages = Number(total)

    return res
  }

  if (patientsPsa) {
    let psaTotal = null
    if (patientsSelect === 'percent') {
      const percent = (patientsPsa / 100)
      psaTotal = ((0.05 * patients * psaYear1) + (0.95 * patients * psaYearNext)) * percent
    } else {
      const percent = (patientsPsa / patients)
      psaTotal = ((0.05 * patients * psaYear1) + (0.95 * patients * psaYearNext)) * percent
    }

    if (psaTotal) {
      res.packsPsa = psaTotal
      total = psaTotal
    }
  }

  if (patientsRa) {
    let raTotal = null
    if (patientsSelect === 'percent') {
      const percent = (patientsRa / 100)
      raTotal = ((0.05 * patients * raYear1) + (0.95 * patients * raYearNext)) * percent
    } else {
      const percent = (patientsRa / patients)
      raTotal = ((0.05 * patients * raYear1) + (0.95 * patients * raYearNext)) * percent
    }
    if (raTotal) {
      if (!total) {
        total = raTotal
      } else {
        total += raTotal
      }
      res.packsRa = raTotal
    }
  }

  if (patientsSpa) {
    let spaTotal = null
    if (patientsSelect === 'percent') {
      const percent = (patientsSpa / 100)
      spaTotal = ((0.05 * patients * spaYear1) + (0.95 * patients * spaYearNext)) * percent
    } else {
      const percent = (patientsSpa / patients)
      spaTotal = ((0.05 * patients * spaYear1) + (0.95 * patients * spaYearNext)) * percent
    }
    if (spaTotal) {
      if (!total) {
        total = spaTotal
      } else {
        total += spaTotal
      }
      res.packsSpa = spaTotal
    }
  }

  if (total) {
    res.packages = Number(total)
  }

  return res;
}

export const getPacksValue = (data, patientsSelect) => {
  return getPatientPerPack({
    patients: data.patients,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
    psaDisabled: data.psa.disabled && !data.psa.defaultChecked,
    raDisabled: data.ra.disabled && !data.ra.defaultChecked,
    spaDisabled: data.spa.disabled && !data.spa.defaultChecked,
    patientsPsa: data.patientsPsa,
    patientsRa: data.patientsRa,
    patientsSpa: data.patientsSpa,
    enabledInputs: data.enabledInputs,
    patientsSelect,
  })
}

export const getPlanPacksValue = (data, patientsSelect) => {
  const planPatientsCoef = data.planPatients / data.patients
  return getPatientPerPack({
    patients: data.planPatients,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
    psaDisabled: data.psa.disabled && !data.psa.defaultChecked,
    raDisabled: data.ra.disabled && !data.ra.defaultChecked,
    spaDisabled: data.spa.disabled && !data.spa.defaultChecked,
    patientsPsa: planPatientsCoef * data.patientsPsa,
    patientsRa: planPatientsCoef * data.patientsRa,
    patientsSpa: planPatientsCoef * data.patientsSpa,
    enabledInputs: data.enabledInputs,
    patientsSelect
  })
}

export const getIsPacksError = (option, units) => {
  if (option.enabledInputs <= 1) {
    return false
  }

  let compareNum = 0
  if (!option.psa.disabled) {
    compareNum += Number(option.packsPsa)
  }

  if (!option.spa.disabled) {
    compareNum += Number(option.packsSpa)
  }

  if (!option.ra.disabled) {
    compareNum += Number(option.packsRa)
  }

  return Math.round(compareNum) !== (units === 'quantity' ? Math.round(option.packages) : 100)
}

export const getIsPatientsError = (option, units) => {
  if (option.enabledInputs <= 1) {
    return false
  }

  let compareNum = 0
  if (!option.psa.disabled) {
    compareNum += Number(option.patientsPsa)
  }

  if (!option.spa.disabled) {
    compareNum += Number(option.patientsSpa)
  }

  if (!option.ra.disabled) {
    compareNum += Number(option.patientsRa)
  }
  return Math.round(compareNum) !== (units === 'quantity' ? Math.round(option.patients) : 100)
}

export const convertByUnits = (data, name, newSelectVal) => {
  if (name === 'packages') {
    if (newSelectVal === 'percent') {
      return data.map((item) => {
        if (item.enabledInputs === 1) {
          return item
        }
        const newData = {
          ...item
        }

        if (item.packsPsa) {
          newData.packsPsa = valueToPercent(Number(item.packsPsa), Number(item.packages))
        }

        if (item.packsSpa) {
          newData.packsSpa = valueToPercent(Number(item.packsSpa), Number(item.packages))
        }

        if (newData.packsRa) {
          newData.packsRa = valueToPercent(Number(item.packsRa), Number(item.packages))
        }
        return newData
      })
    } else if (newSelectVal === 'quantity') {
      return data.map((item) => {
        if (item.enabledInputs === 1) {
          return item
        }
        const newData = {
          ...item
        }

        if (item.packsPsa) {
          newData.packsPsa = percentToValue(Number(item.packsPsa), Math.round(item.packages))
        }

        if (item.packsSpa) {
          newData.packsSpa = percentToValue(Number(item.packsSpa), Math.round(item.packages))
        }

        if (item.packsRa) {
          newData.packsRa = percentToValue(Number(item.packsRa), Math.round(item.packages))
        }
        return newData
      })
    }
  }

  if (name === 'patients') {
    if (newSelectVal === 'percent') {
      return data.map((item) => {
        if (item.enabledInputs === 1) {
          return item
        }

        const newData = {
          ...item
        }

        if (item.patientsPsa) {
          newData.patientsPsa = valueToPercent(Number(item.patientsPsa), Number(item.patients))
        }

        if (item.patientsSpa) {
          newData.patientsSpa = valueToPercent(Number(item.patientsSpa), Number(item.patients))

        }

        if (item.patientsRa) {
          newData.patientsRa = valueToPercent(Number(item.patientsRa), Number(item.patients))
        }
        return newData
      })
    } else if (newSelectVal === 'quantity') {
      return data.map((item) => {
        if (item.enabledInputs === 1) {
          return item
        }
        const newData = {
          ...item
        }

        if (item.patientsPsa) {
          newData.patientsPsa = percentToValue(Number(item.patientsPsa), Math.round(item.patients))
        }

        if (item.patientsSpa) {
          newData.patientsSpa = percentToValue(Number(item.patientsSpa), Math.round(item.patients))
        }

        if (item.patientsRa) {
          newData.patientsRa = percentToValue(Number(item.patientsRa), Math.round(item.patients))
        }
        return newData
      })
    }
  }
}

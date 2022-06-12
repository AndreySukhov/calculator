/** паценты на пачку */
const calculatePatientsPerPacks = ({
  packs,
  psaYear1,
  raYear1,
  spaYear1,
  psaYearNext,
  raYearNext,
  spaYearNext,
  psaDisabled,
  raDisabled,
  spaDisabled,
}) => {
  let total = null
  let res = {}
  if (!psaDisabled) {
    total = (0.05 * packs / psaYear1) + (0.95 * packs / psaYearNext)
  }
  if (!raDisabled) {
    if (!total) {
      total = (0.05 * packs / raYear1) + (0.95 * packs / raYearNext)
    } else {
      total += (0.05 * packs / raYear1) + (0.95 * packs / raYearNext)
    }
  }
  if (!spaDisabled) {
    if (!total) {
      total = (0.05 * packs / spaYear1) + (0.95 * packs / spaYearNext)
    } else {
      total += (0.05 * packs / spaYear1) + (0.95 * packs / spaYearNext)
    }
  }

  if (total) {
    res.patients = parseFloat(total).toFixed(2)
  }

  return res;
}

export const getPatientsValue = (data) => {
  return calculatePatientsPerPacks({
    packs: data.packages,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
    psaDisabled: data.psa.disabled,
    raDisabled: data.ra.disabled,
    spaDisabled: data.spa.disabled,
  })
}

export const getPlanPatientsValue = (data) => {
  return calculatePatientsPerPacks({
    packs: data.planPackages,
    psaYear1: data.psa.initial.year1,
    raYear1: data.ra.initial.year1,
    spaYear1: data.spa.initial.year1,
    psaYearNext: data.psa.secondary.year1,
    raYearNext: data.ra.secondary.year1,
    spaYearNext: data.spa.secondary.year1,
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
}) => {
  let total = null
  let res = {}
  if (!psaDisabled) {
    total = (0.05 * patients * psaYear1) + (0.95 * patients * psaYearNext)

  }
  if (!raDisabled) {
    if (!total) {
      total = (0.05 * patients * raYear1) + (0.95 * patients * raYearNext)
    } else {
      total += (0.05 * patients * raYear1) + (0.95 * patients * raYearNext)
    }
  }

  if (!spaDisabled) {
    if (!total) {
      total = (0.05 * patients * spaYear1) + (0.95 * patients * spaYearNext)
    } else {
      total += (0.05 * patients * spaYear1) + (0.95 * patients * spaYearNext)
    }
  }

  if (total) {
    res.packages = parseFloat(total).toFixed(2)
  }

  return res;
}

export const getPacksValue = (data) => {
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
  })
}

export const getPlanPacksValue = (data) => {
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

  return compareNum !== (units === 'quantity' ? Math.round(option.packages) : 100)
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

  return compareNum !== (units === 'quantity' ? Math.round(option.patients) : 100)
}

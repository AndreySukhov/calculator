
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
    res.patients = total
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
    res.packages = total
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

const test = {
  'packages': 10,
  'patients': 0,
  'packsPsa': '',
  'packsRa': '1',
  'packsSpa': '',
  'patientsPsa': '',
  'patientsRa': '',
  'patientsSpa': '',
  'label': 'Актемра',
  'psa': {
      'disabled': false,
      'defaultChecked': false,
      'initial': {
          'year1':
            15, 'year2':
            15, 'year3':
            15
        }
      , 'secondary':
      {
          'year1':
            16, 'year2':
            16, 'year3':
            16
        }
      ,
      'checked':
        true
    }
  ,
  'ra':
    {
      'disabled':
        false, 'defaultChecked':
        false, 'initial':
        {
          'year1':
            13, 'year2':
            13, 'year3':
            13
        }
      ,
      'secondary':
        {
          'year1':
            14, 'year2':
            14, 'year3':
            14
        }
      ,
      'checked':
        false
    }
  ,
  'spa':
    {
      'disabled':
        false, 'defaultChecked':
        false, 'initial':
        {
          'year1':
            15, 'year2':
            15, 'year3':
            15
        }
      ,
      'secondary':
        {
          'year1':
            16, 'year2':
            16, 'year3':
            16
        }
      ,
      'checked':
        false
    }
  ,
  'mnn':
    'Тоцилизумаб', 'application':
    'Подкожно', 'productionForm':
    '162мг/0,9мл', 'itemsInPack':
    4, 'pricePerPack':
    '53053.50'
}
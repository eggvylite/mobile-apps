import Moment from 'moment'
import CommonFunction from "./CommonFunction"


export const commontimeline = (opt, year) => {
  let result = {}

  switch (opt) {
    case '0':
      result.begin = Moment().startOf('day').toISOString()
      result.end = Moment().endOf('day').toISOString()
      break
    case '1':
      result.begin = Moment().startOf('year').format('YYYY-MM-DD')
      result.end = Moment().endOf('year').format('YYYY-MM-DD')
      break
    case '2':
      result.begin = Moment().startOf('quarter').toISOString()
      result.end = Moment().endOf('quarter').toISOString()
      break
    case '3':
      result.begin = Moment().startOf('month').format('YYYY-MM-DD')
      result.end = Moment().endOf('month').format('YYYY-MM-DD')
      break
    case '4':
      result.begin = Moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
      result.end = Moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
      break
    case '5':
      result.begin = Moment().subtract(1, 'quarter').startOf('quarter').toISOString()
      result.end = Moment().subtract(1, 'quarter').endOf('quarter').toISOString()
      break
    case '6':
      result.begin = Moment().startOf('week').toISOString()
      result.end = Moment().endOf('week').toISOString()
      break
    case '8':
      result.begin = Moment().subtract(1, 'year').startOf('year').toISOString()
      result.end = Moment().subtract(1, 'year').endOf('year').toISOString()
      break
    case '9':
      result.begin = Moment().startOf('day').toISOString()
      result.end = Moment().add(6, 'day').endOf('day').toISOString()
      break
    case '10':
      result.begin = Moment().startOf('day').toISOString()
      result.end = Moment().add(13, 'day').endOf('day').toISOString()
      break
    case '11':
      result.begin = Moment().startOf('day').toISOString()
      result.end = Moment().add(27, 'day').endOf('day').toISOString()
      break
    case '12':
      result.begin = Moment().subtract(7, 'day').startOf('week').toISOString()
      result.end = Moment().subtract(7, 'day').endOf('week').toISOString()
      break
    case '13':
      result.begin = Moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD')
      result.end = Moment().endOf('month').format('YYYY-MM-DD')
      break
    case '14':
      result.begin = Moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
      result.end = Moment().endOf('month').format('YYYY-MM-DD')
      break
    default:
      break
  }

  return result
}

export const formatDate = (date) => {
    const df = Moment(new Date(date)).format("MMM-YYYY")
    return df
}

export const apiformatDate = (date) => {
    const df = Moment(new Date(date)).format("YYYY-MM")
    return df
}

export const dropdownacc = (defaccount = []) => {
  return defaccount.map(value => {
    let number = '';

    if (value?.account_number) {
      number = ' - XX' + CommonFunction.slicenum(value.account_number);
    }

    return {
      type: `${value?.type || ''}${number}`,
      guid: value?.guid
    };
  });
};

export function commondateformat(input) {
    const output = Moment(input, 'YYYY-MM').format('MMM YYYY');
    return output
}


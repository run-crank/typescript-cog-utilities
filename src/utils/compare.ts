import { UnknownOperatorError, InvalidOperandError } from '../constants/errors';
import * as moment from 'moment';
import { parse as parseCsvString } from 'csv-string';
import { validOperators } from '../constants/valid-operators';

export const operatorFailMessages: any = {
  'be': 'Expected %s field to be %s, but it was actually %s',
  'not be': 'Expected %s field not to be %s, but it was also %s',
  'contain': 'Expected %s field to contain %s, but it is not contained in %s',
  'not contain': 'Expected %s field not to contain %s, but it is contained in %s',
  'be greater than': '%s field is expected to be greater than %s, but its value was %s',
  'be less than': '%s field is expected to be less than %s, but its value was %s',
  'be set': 'Expected %s field to be set, but it was not',
  'not be set': 'Expected %s field not to be set, but it was actually set to %s',
  'be one of': 'Expected %s field to be one of these values (%s), but it was actually %s',
  'not be one of': 'Expected %s field to not be one of these values (%s), but it was actually %s',
  'match': 'Expected %s field to match the pattern %s, but it does not',
  'not match': 'Expected %s field not to match the pattern %s, but it does',
};

export const operatorSuccessMessages: any = {
  'be': 'The %s field was set to %s, as expected',
  'not be': 'The %s field was not set to %s, as expected',
  'contain': 'The %s field contains %s, as expected',
  'not contain': 'The %s field does not contain %s, as expected',
  'be greater than': 'The %s field was greater than %s, as expected',
  'be less than': 'The %s field was less than %s, as expected',
  'be set': '%s field was set, as expected',
  'not be set': '%s field was not set, as expected',
  'be one of': '%s field was set to one of these values (%s), as expected',
  'not be one of': '%s field was not set to one of these values (%s), as expected',
  'match': 'The %s field matches the pattern %s, as expected',
  'not match': 'The %s field does not match the pattern %s, as expected',
};

export function compare(operator: string, actualValue: any, value: string = null) {
  const dateTimeFormat = /\d{4}-\d{2}-\d{2}(?:.?\d{2}:\d{2}:\d{2})?/;

  operator = operator || '';
  actualValue = this.stringifyValue(actualValue);
  value = this.stringifyValue(value);

  if (validOperators.includes(operator.toLowerCase())) {
    if (operator.toLowerCase() == 'be') {
      return actualValue == value;
    } else if (operator.toLowerCase() == 'not be') {
      return actualValue != value;
    } else if (operator.toLowerCase() == 'contain') {
      return actualValue.toLowerCase().includes(value.toLowerCase());
    } else if (operator.toLowerCase() == 'not contain') {
      return !actualValue.toLowerCase().includes(value.toLowerCase());
    } else if (operator.toLowerCase() == 'be greater than') {
      if (dateTimeFormat.test(actualValue) && dateTimeFormat.test(value)) {
        return moment(actualValue).isAfter(value);
      } else if (!isNaN(Number(actualValue)) && !isNaN(Number(value))) {
        return parseFloat(actualValue) > parseFloat(value);
      } else {
        throw new InvalidOperandError(operator, actualValue, value);
      }
    } else if (operator.toLowerCase() == 'be less than') {
      if (dateTimeFormat.test(actualValue) && dateTimeFormat.test(value)) {
        return moment(actualValue).isBefore(value);
      } else if (!isNaN(Number(actualValue)) && !isNaN(Number(value))) {
        return parseFloat(actualValue) < parseFloat(value);
      } else {
        throw new InvalidOperandError(operator, actualValue, value);
      }
    } else if (operator.toLowerCase() == 'be set') {
      return actualValue != '';
    } else if (operator.toLowerCase() == 'not be set') {
      return actualValue == '';
    } else if (operator.toLowerCase() == 'be one of') {
      return parseCsvString(value)[0]
        .map(v => v.trim())
        .includes(actualValue.trim());
    } else if (operator.toLowerCase() == 'not be one of') {
      return !parseCsvString(value)[0]
        .map(v => v.trim())
        .includes(actualValue.trim());
    } else if (operator.toLowerCase() == 'match') {
      const regex = new RegExp(value);
      return regex.test(actualValue);
    } else if (operator.toLowerCase() == 'not match') {
      const regex = new RegExp(value);
      return !regex.test(actualValue);
    }
  } else {
    throw new UnknownOperatorError(operator);
  }
}

export function stringifyValue(object: any) {
  if (object === null || object === undefined) {
    return '';
  } else if (typeof object === 'object') {
    return JSON.stringify(object);
  } else {
    return String(object);
  }
}

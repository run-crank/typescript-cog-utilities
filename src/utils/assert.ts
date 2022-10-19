import * as moment from 'moment';
import { parse as parseCsvString } from 'csv-string';

import { InvalidOperandError, UnknownOperatorError } from '../constants/errors';
import { validOperators } from '../constants/valid-operators';

// tslint:disable-next-line:interface-name
export interface AssertionResult {
  valid: boolean;
  message: string;
}

const VALID_OPERATORS = validOperators;
const DATE_TIME_FORMAT = /\d{4}-\d{2}-\d{2}(?:.?\d{2}:\d{2}:\d{2})?/;
const DATE_FORMAT = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const EMAIL_FORMAT = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const COMPARERS: Record<string, (actual: any, expected: any) => boolean> = {
  'be': (actual: any, expected: any) => {
    if (DATE_TIME_FORMAT.test(actual) && DATE_TIME_FORMAT.test(expected) && (DATE_FORMAT.test(actual) || DATE_FORMAT.test(expected))) {
      actual = actual.toString().slice(0, 10);
      expected = expected.toString().slice(0, 10);
    }
    if (EMAIL_FORMAT.test(String(actual).toLowerCase()) && EMAIL_FORMAT.test(String(expected).toLowerCase())) {
      actual = actual.toString().toLowerCase();
      expected = expected.toString().toLowerCase();
    }
    return actual == expected;
  },
  'not be': (actual: any, expected: any) => {
    if (DATE_TIME_FORMAT.test(actual) && DATE_TIME_FORMAT.test(expected) && (DATE_FORMAT.test(actual) || DATE_FORMAT.test(expected))) {
      actual = actual.toString().slice(0, 10);
      expected = expected.toString().slice(0, 10);
    }
    if (EMAIL_FORMAT.test(String(actual).toLowerCase()) && EMAIL_FORMAT.test(String(expected).toLowerCase())) {
      actual = actual.toString().toLowerCase();
      expected = expected.toString().toLowerCase();
    }
    return actual != expected;
  },
  'contain': (actual: any, expected: any) => !!actual.toLowerCase().includes(expected.toLowerCase()),
  'not contain': (actual: any, expected: any) => !actual.toLowerCase().includes(expected.toLowerCase()),
  'be greater than': (actual: any, expected: any) => {
    if (DATE_TIME_FORMAT.test(actual) && DATE_TIME_FORMAT.test(expected)) {
      return moment(actual).isAfter(expected);
    } else if (!isNaN(Number(actual)) && !isNaN(Number(expected))) {
      return parseFloat(actual) > parseFloat(expected);
    } else {
      throw new InvalidOperandError('be greater than', actual, expected);
    }
  },
  'be less than': (actual: any, expected: any) => {
    if (DATE_TIME_FORMAT.test(actual) && DATE_TIME_FORMAT.test(expected)) {
      return moment(actual).isBefore(expected);
    } else if (!isNaN(Number(actual)) && !isNaN(Number(expected))) {
      return parseFloat(actual) < parseFloat(expected);
    } else {
      throw new InvalidOperandError('be less than', actual, expected);
    }
  },
  'be set': (actual: any, expected: any) => {
    actual = [null, undefined].includes(actual) ? '' : actual;
    return actual != '';
  },
  'not be set': (actual: any, expected: any) => {
    actual = [null, undefined].includes(actual) ? '' : actual;
    return actual == '';
  },
  'be one of': (actual: any, expected: any) =>
    !!parseCsvString(expected)[0]
      .map(v => v.trim())
      .includes(actual.trim()),
  'not be one of': (actual: any, expected: any) =>
    !parseCsvString(expected)[0]
      .map(v => v.trim())
      .includes(actual.trim()),
  'match': (actual: any, expected: any) => {
    const regex = new RegExp(expected);
    return regex.test(actual);
  },
  'not match': (actual: any, expected: any) => {
    const regex = new RegExp(expected);
    return !regex.test(actual);
  },
};

const piiRedactedMessage = 'PII removed';

const FAIL_MESSAGES: Record<string, (actual: any, expected: any, field: string, piiLevel: string) => string> = {
  'be': (actual: any, expected: any, field: string, piiLevel: string = null) => `Expected ${field} field to be "${expected}", but it was actually "${piiLevel ? piiRedactedMessage : actual}"`,
  'not be': (actual: any, expected: any, field: string, piiLevel: string = null) => `Expected ${field} field not to be "${expected}", but it was also "${piiLevel ? piiRedactedMessage : actual}"`,
  'contain': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field to contain "${expected}", but it is not contained in "${piiLevel ? piiRedactedMessage : actual}"`,
  'not contain': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field not to contain "${expected}", but it is contained in "${piiLevel ? piiRedactedMessage : actual}"`,
  'be greater than': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `${field} field is expected to be greater than "${expected}", but its value was "${piiLevel ? piiRedactedMessage : actual}"`,
  'be less than': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `${field} field is expected to be less than "${expected}", but its value was "${piiLevel ? piiRedactedMessage : actual}"`,
  'be set': (actual: any, expected: any, field: string, piiLevel: string = null) => `Expected ${field} field to be set, but it was not`,
  'not be set': (actual: any, expected: any, field: string, piiLevel: string = null) => `Expected ${field} field not to be set, but it was actually set to "${piiLevel ? piiRedactedMessage : actual}"`,
  'be one of': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field to be one of these values ("${expected}"), but it was actually "${piiLevel ? piiRedactedMessage : actual}"`,
  'not be one of': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field to not be one of these values ("${expected}"), but it was actually "${piiLevel ? piiRedactedMessage : actual}"`,
  'match': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field to match the pattern "${expected}", but it does not. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'not match': (actual: any, expected: any, field: string, piiLevel: string = null) =>
    `Expected ${field} field not to match the pattern "${expected}", but it does. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
};

const SUCCESS_MESSAGES: Record<string, (expected: any, field: string, actual: any, piiLevel: string) => string> = {
  'be': (expected: any, field: string, actual: any, piiLevel: string = null) => `The ${field} field was set to "${expected}", as expected`,
  'not be': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field was not set to "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'contain': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field contains "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'not contain': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field does not contain "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'be greater than': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field was greater than "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'be less than': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field was less than "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'be set': (expected: any, field: string, actual: any, piiLevel: string = null) => `${field} field was set, as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'not be set': (expected: any, field: string, actual: any, piiLevel: string = null) => `${field} field was not set, as expected`,
  'be one of': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `${field} field was set to one of these values ("${expected}"), as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'not be one of': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `${field} field was not set to one of these values ("${expected}"), as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'match': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field matches the pattern "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
  'not match': (expected: any, field: string, actual: any, piiLevel: string = null) =>
    `The ${field} field does not match the pattern "${expected}", as expected. The actual value is "${piiLevel ? piiRedactedMessage : actual}"`,
};

export function assert(operator: string, actualValue: any, expectedValue: any, field: string, piiLevel: string = null): AssertionResult {
  operator = operator ? operator.toLowerCase().trim() : '';
  actualValue = stringifyValue(actualValue);
  expectedValue = stringifyValue(expectedValue);

  if (!VALID_OPERATORS.includes(operator)) {
    throw new UnknownOperatorError(operator);
  }

  const result: AssertionResult = {
    valid: false,
    message: '',
  };

  result.valid = COMPARERS[operator](actualValue, expectedValue);
  result.message = result.valid ? SUCCESS_MESSAGES[operator](expectedValue, field, actualValue, piiLevel) : FAIL_MESSAGES[operator](actualValue, expectedValue, field, piiLevel);

  return result;
}

function stringifyValue(object: any) {
  if (object === null || object === undefined) {
    return '';
  } else if (typeof object === 'object') {
    return JSON.stringify(object);
  } else {
    return String(object);
  }
}

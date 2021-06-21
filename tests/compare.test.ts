import { compare } from '../src/utils/compare';

describe('testing compare function', () => {
  describe('testing be and not be operator', () => {
    test('compare be should return true', () => {
      const operator = 'be';
      const actualValue = 'value';
      const value = 'value';
      expect(compare(operator, actualValue, value)).toBe(true);
    });
    test('compare be should return false', () => {
      const operator = 'be';
      const actualValue = 'notValue';
      const value = 'value';
      expect(compare(operator, actualValue, value)).toBe(false);
    });
    test('compare not be should return false', () => {
      const operator = 'not be';
      const actualValue = 'value';
      const value = 'value';
      expect(compare(operator, actualValue, value)).toBe(false);
    });
    test('compare not be should return true', () => {
      const operator = 'not be';
      const actualValue = 'notValue';
      const value = 'value';
      expect(compare(operator, actualValue, value)).toBe(true);
    });
    describe('with boolean', () => {
      test('compare be with boolean value should return true', () => {
        const operator = 'be';
        const actualValue = true;
        const value = 'true';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be with boolean value should return false', () => {
        const operator = 'be';
        const actualValue = false;
        const value = 'true';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
    });

    describe('with null', () => {
      test('compare be with null value should return true', () => {
        const operator = 'be';
        const value: any = '';
        expect(compare(operator, null, value)).toBe(true);
      });
      test('compare be with null value should return false', () => {
        const operator = 'be';
        const value = 'anyValue';
        expect(compare(operator, null, value)).toBe(false);
      });
    });
    describe('with undefined', () => {
      test('compare be with undefined value should return true', () => {
        const operator = 'be';
        const value: any = '';
        expect(compare(operator, undefined, value)).toBe(true);
      });
      test('compare be with undefined value should return false', () => {
        const operator = 'be';
        const value = 'anyValue';
        expect(compare(operator, undefined, value)).toBe(false);
      });
    });
  });

  describe('testing contain and not contain operator', () => {
    test('compare contain should return true', () => {
      const operator = 'contain';
      const actualValue = 'value';
      const value = 'val';
      expect(compare(operator, actualValue, value)).toBe(true);
    });
    test('compare contain should return false', () => {
      const operator = 'contain';
      const actualValue = 'volue';
      const value = 'val';
      expect(compare(operator, actualValue, value)).toBe(false);
    });
    test('compare not contain should return false', () => {
      const operator = 'not contain';
      const actualValue = 'value';
      const value = 'val';
      expect(compare(operator, actualValue, value)).toBe(false);
    });
    test('compare not contain should return true', () => {
      const operator = 'not contain';
      const actualValue = 'volue';
      const value = 'val';
      expect(compare(operator, actualValue, value)).toBe(true);
    });
    test('compare contain with object type value should return true', () => {
      const operator = 'contain';
      const actualValue = { anyKey: 'anyValue' };
      const value = 'val';
      expect(compare(operator, actualValue, value)).toBe(true);
    });
  });
  describe('testing be greater than and be less than operator', () => {
    describe('with numbers', () => {
      test('compare be greater than should return true', () => {
        const operator = 'be greater than';
        const actualValue = '2';
        const value = '1';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be greater than should return false', () => {
        const operator = 'be greater than';
        const actualValue = '1';
        const value = '2';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare be less than should return false', () => {
        const operator = 'be less than';
        const actualValue = '2';
        const value = '1';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare be less than should return true', () => {
        const operator = 'be less than';
        const actualValue = '1';
        const value = '2';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
    });
    describe('with dates', () => {
      test('compare be greater than should return true', () => {
        const operator = 'be greater than';
        const actualValue = '1999-01-02';
        const value = '1999-01-01';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be greater than should return false', () => {
        const operator = 'be greater than';
        const actualValue = '1999-01-01';
        const value = '1999-01-02';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare be less than should return false', () => {
        const operator = 'be less than';
        const actualValue = '1999-01-02';
        const value = '1999-01-01';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare be less than should return true', () => {
        const operator = 'be less than';
        const actualValue = '1999-01-01';
        const value = '1999-01-02';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
    });
  });
  describe('testing be set and not be set', () => {
    describe('with string', () => {
      describe('be set', () => {
        test('compare be set to non null/empty string should return true', () => {
          const operator = 'be set';
          const actualValue = 'anyValue';
          expect(compare(operator, actualValue)).toBe(true);
        });
        test('compare be set to null should return false', () => {
          const operator = 'be set';
          const actualValue: string = null;
          expect(compare(operator, actualValue)).toBe(false);
        });
        test('compare be set to empty string should return false', () => {
          const operator = 'be set';
          const actualValue = '';
          expect(compare(operator, actualValue)).toBe(false);
        });
      });
      describe('not be set', () => {
        test('compare not be set to empty string should return true', () => {
          const operator = 'not be set';
          const actualValue = '';
          expect(compare(operator, actualValue)).toBe(true);
        });
        test('compare not be set to null should return false', () => {
          const operator = 'not be set';
          const actualValue: string = null;
          expect(compare(operator, actualValue)).toBe(true);
        });
        test('compare not be set to non null/empty string should return false', () => {
          const operator = 'not be set';
          const actualValue = 'anyValue';
          expect(compare(operator, actualValue)).toBe(false);
        });
      });
    });
    describe('with numbers', () => {
      test('compare be set to non 0 should return true', () => {
        const operator = 'be set';
        const actualValue = 12345;
        expect(compare(operator, actualValue)).toBe(true);
      });
      test('compare be set to 0 should return true', () => {
        const operator = 'be set';
        const actualValue = '1999-01-02';
        expect(compare(operator, actualValue)).toBe(true);
      });
      test('compare not be set to any number should return true', () => {
        const operator = 'not be set';
        const actualValue = 0;
        expect(compare(operator, actualValue)).toBe(false);
      });
    });
  });
  describe('testing be one of and not be one of operators', () => {
    describe('be one of', () => {
      test('compare be one of with a single value should return true', () => {
        const operator = 'be one of';
        const actualValue = 'xyz';
        const value = 'xyz';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be one of with comma-separated values should return true', () => {
        const operator = 'be one of';
        const actualValue = 'xyz';
        const value = 'abc,jkl,xyz,sdf';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be one of with comma and space separated values should return true', () => {
        const operator = 'be one of';
        const actualValue = 'xyz';
        const value = 'abc, jkl, xyz, sdf';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare be one of with quoted comma-separated values should return true', () => {
        const operator = 'be one of';
        const actualValue = 'x, yz';
        const value = '"a bc", jkl, "x, yz"';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
    });
    describe('not be one of', () => {
      test('compare not be one of with a single value should return true', () => {
        const operator = 'not be one of';
        const actualValue = 'xyz';
        const value = 'abc';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare not be one of with comma-separated values should return true', () => {
        const operator = 'not be one of';
        const actualValue = 'xyz';
        const value = 'abc,jkl,opq,sdf';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare not be one of with comma and space separated values should return true', () => {
        const operator = 'not be one of';
        const actualValue = 'xyz';
        const value = 'abc, jkl, opq, sdf';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare not be one of with quoted comma-separated values should return true', () => {
        const operator = 'not be one of';
        const actualValue = 'x, yz';
        const value = '"a bc", jkl, "o, pq"';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
    });
  });
  describe('testing match and not match operators', () => {
    describe('match', () => {
      test('compare match email regex with an email should return true', () => {
        const operator = 'match';
        const actualValue = 'test@test.com';
        const value = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare match email regex with an non email string should return false', () => {
        const operator = 'match';
        const actualValue = 'testtest';
        const value = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare match strong password regex with a strong password should return true', () => {
        const operator = 'match';
        const actualValue = 'Password123!@#';
        const value = '^(?=.*([A-Z]){1,})(?=.*[~!@#$%^&*_+=`|\(){}[:;\"\'<>,.?/-]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,100}$';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare match strong password with an weak password should return false', () => {
        const operator = 'match';
        const actualValue = 'aaaaaaaaaaaaa';
        const value = '^(?=.*([A-Z]){1,})(?=.*[~!@#$%^&*_+=`|\(){}[:;\"\'<>,.?/-]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,100}$';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
    });
    describe('not match', () => {
      test('compare not match email regex with a non email string should return true', () => {
        const operator = 'not match';
        const actualValue = 'testtest';
        const value = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare not match email regex with an email should return false', () => {
        const operator = 'not match';
        const actualValue = 'test@test.com';
        const value = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
      test('compare not match strong password regex with a weak password should return true', () => {
        const operator = 'not match';
        const actualValue = 'aaaaaaaaaaaaaaaa';
        const value = '^(?=.*([A-Z]){1,})(?=.*[~!@#$%^&*_+=`|\(){}[:;\"\'<>,.?/-]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,100}$';
        expect(compare(operator, actualValue, value)).toBe(true);
      });
      test('compare not match strong password with an strong password should return false', () => {
        const operator = 'not match';
        const actualValue = 'Password123!@#';
        const value = '^(?=.*([A-Z]){1,})(?=.*[~!@#$%^&*_+=`|\(){}[:;\"\'<>,.?/-]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,100}$';
        expect(compare(operator, actualValue, value)).toBe(false);
      });
    });
  });
});

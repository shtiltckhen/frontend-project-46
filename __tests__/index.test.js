import { cwd } from 'node:process';
import { resolve } from 'node:path';
import parse from '../src/parse.js';
import genDiff from '../src/index.js';

const jsonAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.json');
const jsonAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.json');

const ymlAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.yml');
const ymlAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.yml');

const jsonFilepath1 = '__fixtures__/file1.json';
const jsonFilepath2 = '__fixtures__/file2.json';

const ymlFilepath1 = '__fixtures__/file1.yml';
const ymlFilepath2 = '__fixtures__/file2.yml';

const expectedOutput = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

test('parse', () => {
  expect(() => {
    parse('');
  }).toThrow();
});

test('genDiff', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2)).toBe(expectedOutput);
  expect(genDiff(jsonAbsoluteFilepath1, jsonAbsoluteFilepath2)).toBe(expectedOutput);
  expect(genDiff(ymlFilepath1, ymlFilepath2)).toBe(expectedOutput);
  expect(genDiff(ymlAbsoluteFilepath1, ymlAbsoluteFilepath2)).toBe(expectedOutput);
  expect(genDiff(jsonFilepath1, ymlFilepath2)).toBe(expectedOutput);
});

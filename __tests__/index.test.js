import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';
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
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('parse', () => {
  expect(() => {
    parse('');
  }).toThrow();
});

test('genDiff', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2)).toBe(expectedOutput);
  expect(genDiff(jsonAbsoluteFilepath1, jsonAbsoluteFilepath2)).toEqual(expectedOutput);
  expect(genDiff(ymlFilepath1, ymlFilepath2)).toBe(expectedOutput);
  expect(genDiff(ymlAbsoluteFilepath1, ymlAbsoluteFilepath2)).toBe(expectedOutput);
  expect(genDiff(jsonFilepath1, ymlFilepath2)).toBe(expectedOutput);
});

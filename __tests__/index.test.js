import { cwd } from 'node:process';
import { resolve } from 'node:path';
import parse from '../src/parse.js';
import genDiff from '../src/index.js';
import expectedPlain from '../__fixtures__/expectedPlain.js';
import expectedStylish from '../__fixtures__/expectedStylish.js';
import expectedJSON from '../__fixtures__/expectedJSON.js';

const jsonAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.json');
const jsonAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.json');

const ymlAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.yml');
const ymlAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.yml');

const jsonFilepath1 = '__fixtures__/file1.json';
const jsonFilepath2 = '__fixtures__/file2.json';

const ymlFilepath1 = '__fixtures__/file1.yml';
const ymlFilepath2 = '__fixtures__/file2.yml';

test('parse', () => {
  expect(() => {
    parse('');
  }).toThrow();
});

test('genDiff stylish', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'stylish')).toBe(expectedStylish);
  expect(genDiff(jsonAbsoluteFilepath1, jsonAbsoluteFilepath2, 'stylish')).toBe(expectedStylish);
  expect(genDiff(ymlFilepath1, ymlFilepath2, 'stylish')).toBe(expectedStylish);
  expect(genDiff(ymlAbsoluteFilepath1, ymlAbsoluteFilepath2, 'stylish')).toBe(expectedStylish);
  expect(genDiff(jsonFilepath1, ymlFilepath2, 'stylish')).toBe(expectedStylish);
  expect(genDiff(jsonFilepath1, jsonFilepath2)).toBe(expectedStylish);
});

test('genDiff plain', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'plain')).toBe(expectedPlain);
});

test('genDiff json', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'json')).toBe(expectedJSON);
});

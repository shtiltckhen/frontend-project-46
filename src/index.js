import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';
import { load } from 'js-yaml';

const getObject = (filepath) => {
  const path = filepath.startsWith('/') ? filepath : resolve(cwd(), filepath);
  const ext = extname(filepath);
  const obj = readFileSync(path, 'utf8');
  let result = {};
  if (ext === '.json') {
    result = JSON.parse(obj);
  } else if (ext === '.yaml' || ext === '.yml') {
    result = load(obj);
  }
  return result;
};

const findDiff = (file1, file2) => {
  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const result = keys1.reduce((acc, key) => {
    if (keys2.includes(key) && file1[key] === file2[key]) {
      acc.push({ key, value: file1[key], status: 'unchanged' });
    } else if (keys2.includes(key) && file1[key] !== file2[key]) {
      acc.push({ key, value: file1[key], status: 'removed' });
      acc.push({ key, value: file2[key], status: 'added' });
    } else if (!keys2.includes(key)) {
      acc.push({ key, value: file1[key], status: 'removed' });
    }
    return acc;
  }, []);
  keys2.filter((key) => !keys1.includes(key))
    .map((key) => result.push({ key, value: file2[key], status: 'added' }));
  return result.sort((a, b) => {
    const x = a.key >= b.key ? 1 : -1;
    return x;
  });
};

const outputDiff = (diff) => {
  const result = diff.reduce((acc, string) => {
    switch (string.status) {
      case 'unchanged':
        acc.push(`    ${string.key}: ${string.value}`);
        break;
      case 'removed': acc.push(`  - ${string.key}: ${string.value}`);
        break;
      case 'added': acc.push(`  + ${string.key}: ${string.value}`);
        break;
      default:
        throw new Error(`Unexpected status: ${string.status}`);
    }
    return acc;
  }, []);
  result.unshift('{');
  result.push('}');
  return result.join('\n');
};

export default (filepath1, filepath2) => {
  const file1 = getObject(filepath1);
  const file2 = getObject(filepath2);
  const diff = findDiff(file1, file2);
  return outputDiff(diff);
};

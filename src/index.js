import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';
import parse from './parse.js';

const getDiffFiles = (file1, file2) => {
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

const getData = (filepath) => {
  const path = filepath.startsWith('/') ? filepath : resolve(cwd(), filepath);
  const data = readFileSync(path, 'utf8');
  const ext = extname(filepath);
  return [data, ext];
};

export default (filepath1, filepath2) => {
  const [data1, ext1] = getData(filepath1);
  const [data2, ext2] = getData(filepath2);

  const file1 = parse(data1, ext1);
  const file2 = parse(data2, ext2);
  const diff = getDiffFiles(file1, file2);
  return outputDiff(diff);
};

export { parse };

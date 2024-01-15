import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';
import parse from './parse.js';
import makeTree from './makeTree.js';

const fotmaterStylish = (tree, depth = 1) => {
  const getValue = (value) => {
    const newValue = Array.isArray(value)
      ? fotmaterStylish(value, depth + 1)
      : value;
    return newValue;
  };

  const replacer = '    ';

  const result = tree.map((line) => {
    switch (line.status) {
      case 'unchanged':
        return `${replacer.repeat(depth)}${line.key}: ${getValue(line.value)}`;
      case 'changed':
        return `${replacer.repeat(depth - 1)}${line.action === 'removed' ? '  - ' : '  + '}${line.key}: ${getValue(line.value)}`;
      default:
        throw new Error(`Unexpected status: ${line.status}`);
    }
  });
  result.unshift('{');
  result.push(`${replacer.repeat(depth - 1)}}`);
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
  const diff = makeTree(file1, file2);
  return fotmaterStylish(diff);
};

import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';
import parse from './parse.js';
import makeTree from './makeTree.js';
import formatterStylish from './formatters/formatterStylish.js';
import formatterPlain from './formatters/formatterPlain.js';

const getData = (filepath) => {
  const path = filepath.startsWith('/') ? filepath : resolve(cwd(), filepath);
  const data = readFileSync(path, 'utf8');
  const ext = extname(filepath);
  return [data, ext];
};

export default (filepath1, filepath2, format = 'stylish') => {
  const [data1, ext1] = getData(filepath1);
  const [data2, ext2] = getData(filepath2);

  const file1 = parse(data1, ext1);
  const file2 = parse(data2, ext2);
  const tree = makeTree(file1, file2);
  switch (format) {
    case 'stylish':
      return formatterStylish(tree);
    case 'plain':
      return formatterPlain(tree);
    default:
      throw new Error(`Unexpected format: ${format}`);
  }
};

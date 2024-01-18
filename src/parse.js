import { load } from 'js-yaml';
import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve, extname } from 'node:path';

const readFile = (filepath) => {
  const path = resolve(cwd(), filepath);
  const data = readFileSync(path, 'utf8');
  const ext = extname(filepath);
  return [data, ext];
};

const parse = (data, ext) => {
  switch (ext) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return load(data);
    default:
      throw new Error(`Unknown extname: '${ext}'!`);
  }
};

const getObject = (filepath) => {
  const [data, ext] = readFile(filepath);

  return parse(data, ext);
};

export default getObject;

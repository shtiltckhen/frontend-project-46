import { load } from 'js-yaml';

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

export default parse;

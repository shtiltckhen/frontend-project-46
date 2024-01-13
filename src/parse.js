import { load } from 'js-yaml';

const parse = (data, ext) => {
  // let result = {};
  // if (ext === '.json') {
  //  result = JSON.parse(data);
  // } else if (ext === '.yaml' || ext === '.yml') {
  //  result = load(data);
  // }
  // return result;

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

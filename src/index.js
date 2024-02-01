import getObject from './parse.js';
import makeTree from './makeTree.js';
import formatterStylish from './formatters/formatterStylish.js';
import formatterPlain from './formatters/formatterPlain.js';
import formatterJSON from './formatters/formatterJSON.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const object1 = getObject(filepath1);
  const object2 = getObject(filepath2);

  const tree = makeTree(object1, object2);
  switch (format) {
    case 'stylish':
      return formatterStylish(tree);
    case 'plain':
      return formatterPlain(tree);
    case 'json':
      return JSON.stringify(formatterJSON(tree));
    default:
      throw new Error(`Unexpected format: ${format}`);
  }
};

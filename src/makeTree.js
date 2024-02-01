import sortBy from 'lodash/sortBy.js';

const isObject = (node) => Object.prototype.toString.call(node) === '[object Object]';

const getValue = (node) => {
  const keys = Object.keys(node);
  return keys.map((key) => {
    const value = node[key];
    if (isObject(value)) {
      return { key, children: getValue(value) };
    }
    return { key, value, children: [] };
  });
};

const makeTree = (file1, file2) => {
  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const tree = keys1.map((key) => {
    const value1 = file1[key];
    if (keys2.includes(key)) {
      const value2 = file2[key];
      if (isObject(value1) && isObject(value2)) {
        return { key, status: 'hasChildren', children: makeTree(value1, value2) };
      }
      if (isObject(value1) || isObject(value2)) {
        return isObject(value1)
          ? {
            key, status: 'changed', newValue: value2, children: getValue(value1),
          }
          : {
            key, status: 'changed', oldValue: value1, children: getValue(value2),
          };
      }
      return value1 === value2
        ? {
          key, status: 'unchanged', value: value1, children: [],
        }
        : {
          key, status: 'changed', oldValue: value1, newValue: value2, children: [],
        };
    }
    return isObject(value1)
      ? { key, status: 'removed', children: getValue(value1) }
      : {
        key, status: 'removed', value: value1, children: [],
      };
  });
  const restKeys = keys2
    .filter((key) => !keys1.includes(key))
    .map((key) => (isObject(file2[key])
      ? { key, status: 'added', children: getValue(file2[key]) }
      : {
        key, status: 'added', value: file2[key], children: [],
      }));
  const sortedTree = sortBy([...tree, ...restKeys], [(o) => o.key]);
  return sortedTree;
};

export default makeTree;

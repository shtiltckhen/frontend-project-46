const isObject = (node) => Object.prototype.toString.call(node) === '[object Object]';

const getValue = (node) => {
  if (!isObject(node)) {
    return node;
  }
  const keys = Object.keys(node);
  return keys.map((key) => {
    const value = node[key];
    const newValue = isObject(value) ? getValue(value) : value;
    return { key, value: newValue };
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
        return { status: 'haveChildren', children: true, key, value: makeTree(value1, value2) };
      }
      if (value1 === value2) {
        return { status: 'unchanged', key, value: value1 };
      }
      if (isObject(value1)) {
        return { status: 'changed', children: true, key, oldValue: getValue(value1), newValue: value2 };
      }
      if (isObject(value2)) {
        return { status: 'changed', children: true, key, oldValue: value1, newValue: getValue(value2) };
      }
      if (value1 !== value2) {
        return { status: 'changed', children: true, key, oldValue: value1, newValue: value2 };
      }
    } else if (isObject(value1)) {
      return { status: 'removed', children: true, key, value: getValue(value1) };
    }
    return { status: 'removed', key, value: value1 };
  });
  const restKeys = keys2
    .filter((key) => !keys1.includes(key))
    .map((key) => {
      if (isObject(file2[key])) {
        return { status: 'added', children: true, key, value: getValue(file2[key]) };
      }
      return { status: 'added', key, value: file2[key] };
    });
  tree.push(restKeys);
  return tree.flat().sort((a, b) => {
    const x = a.key >= b.key ? 1 : -1;
    return x;
  });
};

export default makeTree;

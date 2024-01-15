const isObject = (node) => Object.prototype.toString.call(node) === '[object Object]';

const getValue = (value) => {
  if (!isObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  return keys.map((key) => {
    const newValue = isObject(value[key]) ? getValue(value[key]) : value[key];
    return { status: 'unchanged', key, value: newValue };
  });
};

const makeTree = (file1, file2) => {
  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const tree = keys1.reduce((acc, key) => {
    const value1 = file1[key];
    const value2 = file2[key];
    if (keys2.includes(key)) {
      if (isObject(value1) && isObject(value2)) {
        acc.push({ status: 'unchanged', key, value: makeTree(value1, value2) });
      } else if (value1 === value2) {
        acc.push({ status: 'unchanged', key, value: value1 });
      } else {
        acc.push(
          {
            status: 'changed', action: 'removed', key, value: getValue(value1),
          },
          {
            status: 'changed', action: 'added', key, value: getValue(value2),
          },
        );
      }
    } else {
      acc.push({
        status: 'changed', action: 'removed', key, value: getValue(value1),
      });
    }
    return acc;
  }, []);
  const restKeys = keys2
    .filter((key) => !keys1.includes(key))
    .map((key) => ({
      status: 'changed', action: 'added', key, value: getValue(file2[key]),
    }));
  tree.push(restKeys);
  return tree.flat().sort((a, b) => {
    const x = a.key >= b.key ? 1 : -1;
    return x;
  });
};

export default makeTree;

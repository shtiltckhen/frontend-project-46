const formatterPlain = (tree, parent = '') => {
  const getValue = (value) => {
    if (value === null || value === undefined || typeof (value) === 'boolean') {
      return value;
    }
    if (typeof (value) === 'object') {
      return '[complex value]';
    }
    return `'${value}'`;
  };
  return tree
    .map((node) => {
      switch (node.status) {
        case 'unchanged':
          break;
        case 'haveChildren':
          return formatterPlain(node.value, `${parent + node.key}.`);
        case 'changed':
          return `Property '${parent + node.key}' was updated. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
        case 'removed':
          return `Property '${parent + node.key}' was removed`;
        case 'added':
          return `Property '${parent + node.key}' was added with value: ${getValue(node.value)}`;
        default:
          throw new Error(`Unexpected status: ${node.status}`);
      }
    })
    .filter(Boolean)
    .flat().join('\n');
};
export default formatterPlain;

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
      const nameProperty = parent + node.key;
      switch (node.status) {
        case 'unchanged':
          break;
        case 'haveChildren':
          return formatterPlain(node.value, `${nameProperty}.`);
        case 'changed':
          return `Property '${nameProperty}' was updated. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
        case 'removed':
          return `Property '${nameProperty}' was removed`;
        case 'added':
          return `Property '${nameProperty}' was added with value: ${getValue(node.value)}`;
        default:
          throw new Error(`Unexpected status: ${node.status}`);
      }
    })
    .filter(Boolean)
    .flat().join('\n');
};
export default formatterPlain;

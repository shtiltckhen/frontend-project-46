const getValue = (value) => {
  if (value === null || value === undefined || typeof (value) === 'boolean') {
    return value;
  }
  if (typeof (value) === 'object') {
    return '[complex value]';
  }
  return `'${value}'`;
};

const formatterPlain = (tree, parent = '') => tree
  .map((node) => {
    const nameProperty = parent + node.key;
    let string;
    switch (node.status) {
      case 'unchanged':
        break;
      case 'hasChildren':
        string = formatterPlain(node.value, `${nameProperty}.`);
        break;
      case 'changed':
        string = `Property '${nameProperty}' was updated. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
        break;
      case 'removed':
        string = `Property '${nameProperty}' was removed`;
        break;
      case 'added':
        string = `Property '${nameProperty}' was added with value: ${getValue(node.value)}`;
        break;
      default:
        throw new Error(`Unexpected status: ${node.status}`);
    }
    return string;
  })
  .filter(Boolean)
  .join('\n');

export default formatterPlain;

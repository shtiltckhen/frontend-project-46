const getValue = (value) => {
  if (value === null || value === undefined || typeof (value) === 'boolean' || typeof (value) === 'number') {
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
    switch (node.status) {
      case 'hasChildren':
        return formatterPlain(node.children, `${nameProperty}.`);
      case 'changed': {
        const oldValue = Object.hasOwn(node, 'oldValue') ? getValue(node.oldValue) : getValue(node.children);
        const newValue = Object.hasOwn(node, 'newValue') ? getValue(node.newValue) : getValue(node.children);
        return `Property '${nameProperty}' was updated. From ${oldValue} to ${newValue}`;
      }
      case 'removed':
        return `Property '${nameProperty}' was removed`;
      case 'added': {
        const value = Object.hasOwn(node, 'value') ? getValue(node.value) : getValue(node.children);
        return `Property '${nameProperty}' was added with value: ${value}`;
      }
      case 'unchanged':
        return '';
      default:
        throw new Error(`Unexpected status: ${node.status}`);
    }
  })
  .filter(Boolean)
  .join('\n');

export default formatterPlain;

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
    let string;
    const nameProperty = parent + node.key;
    if (node.status === 'hasChildren') {
      string = formatterPlain(node.children, `${nameProperty}.`);
    }
    if (node.status === 'changed') {
      const oldValue = Object.hasOwn(node, 'oldValue') ? getValue(node.oldValue) : getValue(node.children);
      const newValue = Object.hasOwn(node, 'newValue') ? getValue(node.newValue) : getValue(node.children);
      string = `Property '${nameProperty}' was updated. From ${oldValue} to ${newValue}`;
    }
    if (node.status === 'removed') {
      string = `Property '${nameProperty}' was removed`;
    }
    if (node.status === 'added') {
      const value = Object.hasOwn(node, 'value') ? getValue(node.value) : getValue(node.children);
      string = `Property '${nameProperty}' was added with value: ${value}`;
    }
    return string;
  })
  .filter(Boolean)
  .join('\n');

export default formatterPlain;

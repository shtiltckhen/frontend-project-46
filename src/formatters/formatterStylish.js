const getString = (key, value, sign, indent, level) => `${indent(level)}  ${sign} ${key}: ${value}`;

const getValue = (curValue, indent, level) => {
  if (!Array.isArray(curValue)) {
    return curValue;
  }
  const result = curValue.map((node) => getString(node.key, getValue(node.value, indent, level + 1), ' ', indent, level));
  result.unshift('{');
  result.push(`${indent(level)}}`);
  return result.join('\n');
};

const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const indent = (level) => (replacer.repeat(replacerCount * (level - 1)));
  const formatedTree = tree.flatMap((node) => {
    let string;
    switch (node.status) {
      case 'hasChildren':
        string = (getString(node.key, formatterStylish(node.value, replacer, replacerCount, depth + 1), ' ', indent, depth));
        break;
      case 'unchanged':
        string = (getString(node.key, node.value, ' ', indent, depth));
        break;
      case 'changed':
        string = [(getString(node.key, getValue(node.oldValue, indent, depth + 1), '-', indent, depth)),
          (getString(node.key, getValue(node.newValue, indent, depth + 1), '+', indent, depth))];
        break;
      case 'added':
      case 'removed':
        string = (getString(node.key, getValue(node.value, indent, depth + 1), node.status === 'added' ? '+' : '-', indent, depth));
        break;
      default:
        throw new Error(`Unexpected status: ${node.status}`);
    }
    return string;
  });

  formatedTree.unshift('{');
  formatedTree.push(`${indent(depth)}}`);
  return formatedTree.join('\n');
};

export default formatterStylish;

const getValue = (curValue, replacer, replacerCount, level) => {
  if (!Array.isArray(curValue)) {
    return curValue;
  }
  const result = curValue.map((node) => `${replacer.repeat(replacerCount * level)}${node.key}: ${getValue(node.value, replacer, replacerCount, level + 1)}`);

  result.unshift('{');
  result.push(`${replacer.repeat(replacerCount * (level - 1))}}`);
  return result.join('\n');
};

const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const getString = (key, value, sign) => `${replacer.repeat(replacerCount * (depth - 1))}  ${sign} ${key}: ${getValue(value, replacer, replacerCount, depth + 1)}`;

  const formatedTree = tree.reduce((acc, node) => {
    switch (node.status) {
      case 'haveChildren':
        acc.push(`${replacer.repeat(replacerCount * depth)}${node.key}: ${formatterStylish(node.value, replacer, replacerCount, depth + 1)}`);
        break;
      case 'unchanged':
        acc.push(`${replacer.repeat(replacerCount * depth)}${node.key}: ${node.value}`);
        break;
      case 'changed':
        acc.push(getString(node.key, node.oldValue, '-'));
        acc.push(getString(node.key, node.newValue, '+'));
        break;
      case 'added':
      case 'removed':
        acc.push(getString(node.key, node.value, node.status === 'added' ? '+' : '-'));
        break;
      default:
        throw new Error(`Unexpected status: ${node.status}`);
    }
    return acc;
  }, []);

  formatedTree.unshift('{');
  formatedTree.push(`${replacer.repeat(replacerCount * (depth - 1))}}`);
  return formatedTree.join('\n');
};

export default formatterStylish;

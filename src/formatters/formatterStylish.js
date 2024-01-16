const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const getString = (key, value, sign, level) => `${replacer.repeat(replacerCount * (level - 1))}  ${sign} ${key}: ${value}`;
  const getValue = (curValue, level) => {
    if (!Array.isArray(curValue)) {
      return curValue;
    }
    const result = curValue.map((node) => getString(node.key, getValue(node.value, level + 1), ' ', level));
    result.unshift('{');
    result.push(`${replacer.repeat(replacerCount * (level - 1))}}`);
    return result.join('\n');
  };
  const formatedTree = tree.reduce((acc, node) => {
    switch (node.status) {
      case 'haveChildren':
        acc.push(getString(node.key, formatterStylish(node.value, replacer, replacerCount, depth + 1), ' ', depth));
        break;
      case 'unchanged':
        acc.push(getString(node.key, node.value, ' ', depth));
        break;
      case 'changed':
        acc.push(getString(node.key, getValue(node.oldValue, depth + 1), '-', depth));
        acc.push(getString(node.key, getValue(node.newValue, depth + 1), '+', depth));
        break;
      case 'added':
      case 'removed':
        acc.push(getString(node.key, getValue(node.value, depth + 1), node.status === 'added' ? '+' : '-', depth));
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

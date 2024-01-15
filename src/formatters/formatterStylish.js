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
  const formatedTree = tree.reduce((acc, node) => {
    switch (node.status) {
      case 'haveChildren':
        acc.push(`${replacer.repeat(replacerCount * depth)}${node.key}: ${formatterStylish(node.value, replacer, replacerCount, depth + 1)}`);
        break;
      case 'unchanged':
        acc.push(`${replacer.repeat(replacerCount * depth)}${node.key}: ${node.value}`);
        break;
      case 'changed':
        acc.push(`${replacer.repeat(replacerCount * (depth - 1))}  - ${node.key}: ${getValue(node.oldValue, replacer, replacerCount, depth + 1)}`);
        acc.push(`${replacer.repeat(replacerCount * (depth - 1))}  + ${node.key}: ${getValue(node.newValue, replacer, replacerCount, depth + 1)}`);
        break;
      case 'added':
        acc.push(`${replacer.repeat(replacerCount * (depth - 1))}  + ${node.key}: ${getValue(node.value, replacer, replacerCount, depth + 1)}`);
        break;
      case 'removed':
        acc.push(`${replacer.repeat(replacerCount * (depth - 1))}  - ${node.key}: ${getValue(node.value, replacer, replacerCount, depth + 1)}`);
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

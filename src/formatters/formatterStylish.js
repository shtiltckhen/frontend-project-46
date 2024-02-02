const getString = (key, value, sign, indent) => `${indent}  ${sign} ${key}: ${value}`;

const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const getIndent = (level) => (replacer.repeat(replacerCount * (level - 1)));
  const formatedTree = tree.flatMap((node) => {
    const indent = getIndent(depth);
    switch (node.status) {
      case 'hasChildren':
        return getString(node.key, formatterStylish(node.children, replacer, replacerCount, depth + 1), ' ', indent);
      case 'unchanged':
        return getString(node.key, node.value, ' ', indent);
      case 'changed': {
        const oldValue = Object.hasOwn(node, 'oldValue') ? node.oldValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
        const newValue = Object.hasOwn(node, 'newValue') ? node.newValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
        return [getString(node.key, oldValue, '-', indent),
          getString(node.key, newValue, '+', indent)];
      }
      case 'added':
      case 'removed': {
        const value = node.children.length === 0
          ? node.value
          : formatterStylish(node.children, replacer, replacerCount, depth + 1);
        return getString(node.key, value, node.status === 'added' ? '+' : '-', indent);
      }
      case undefined: {
        const value = node.children.length === 0
          ? node.value
          : formatterStylish(node.children, replacer, replacerCount, depth + 1);
        return getString(node.key, value, ' ', indent);
      }
      default:
        throw new Error(`Unexpected status: ${node.status}`);
    }
  });
  const result = ['{', ...formatedTree, `${getIndent(depth)}}`];
  return result.join('\n');
};

export default formatterStylish;

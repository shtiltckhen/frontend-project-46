const getString = (key, value, sign, indent) => `${indent}  ${sign} ${key}: ${value}`;

const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const getIndent = (level) => (replacer.repeat(replacerCount * (level - 1)));
  const formatedTree = tree.flatMap((node) => {
    const indent = getIndent(depth);
    if (node.status === 'hasChildren') {
      return getString(node.key, formatterStylish(node.children, replacer, replacerCount, depth + 1), ' ', indent);
    }
    if (node.status === 'unchanged') {
      return getString(node.key, node.value, ' ', indent);
    }
    if (node.status === 'changed') {
      const oldValue = Object.hasOwn(node, 'oldValue') ? node.oldValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      const newValue = Object.hasOwn(node, 'newValue') ? node.newValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      return [getString(node.key, oldValue, '-', indent),
        getString(node.key, newValue, '+', indent)];
    }
    if (node.status === 'added' || node.status === 'removed') {
      const value = node.children.length === 0
        ? node.value
        : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      return getString(node.key, value, node.status === 'added' ? '+' : '-', indent);
    }
    const value = node.children.length === 0
      ? node.value
      : formatterStylish(node.children, replacer, replacerCount, depth + 1);
    return getString(node.key, value, ' ', indent);
  });
  const result = ['{', ...formatedTree, `${getIndent(depth)}}`];
  return result.join('\n');
};

export default formatterStylish;

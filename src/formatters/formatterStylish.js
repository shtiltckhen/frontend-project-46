const getString = (key, value, sign, indent, level) => `${indent(level)}  ${sign} ${key}: ${value}`;

const formatterStylish = (tree, replacer = ' ', replacerCount = 4, depth = 1) => {
  const indent = (level) => (replacer.repeat(replacerCount * (level - 1)));
  const formatedTree = tree.flatMap((node) => {
    if (node.status === 'hasChildren') {
      return getString(node.key, formatterStylish(node.children, replacer, replacerCount, depth + 1), ' ', indent, depth);
    }
    if (node.status === 'unchanged') {
      return getString(node.key, node.value, ' ', indent, depth);
    }
    if (node.status === 'changed') {
      const oldValue = Object.hasOwn(node, 'oldValue') ? node.oldValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      const newValue = Object.hasOwn(node, 'newValue') ? node.newValue : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      return [getString(node.key, oldValue, '-', indent, depth),
        getString(node.key, newValue, '+', indent, depth)];
    }
    if (node.status === 'added' || node.status === 'removed') {
      const value = node.children.length === 0
        ? node.value
        : formatterStylish(node.children, replacer, replacerCount, depth + 1);
      return getString(node.key, value, node.status === 'added' ? '+' : '-', indent, depth);
    }
    const value = node.children.length === 0
      ? node.value
      : formatterStylish(node.children, replacer, replacerCount, depth + 1);
    return getString(node.key, value, ' ', indent, depth);
  });

  formatedTree.unshift('{');
  formatedTree.push(`${indent(depth)}}`);
  return formatedTree.join('\n');
};

export default formatterStylish;

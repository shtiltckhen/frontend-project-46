const indent = (level) => `${'  '.repeat(level)}`;

const getValue = (value) => `${typeof (value) === 'string' ? `"${value}"` : value}`;

const formatterJSON = (tree, depth = 1) => {
  const formatedTree = tree.map((node) => {
    const result = [`${indent(depth)}"key": "${node.key}",`];
    if (node.status !== 'hasChildren' && node.status !== undefined) {
      result.push(`${indent(depth)}"status": "${node.status}",`);
    }
    if (node.status === 'changed') {
      const oldValue = Object.hasOwn(node, 'oldValue') ? getValue(node.oldValue) : formatterJSON(node.children, depth + 1).trim();
      const newValue = Object.hasOwn(node, 'newValue') ? getValue(node.newValue) : formatterJSON(node.children, depth + 1).trim();
      result.push(
        `${indent(depth)}"oldValue": ${oldValue},`,
        `${indent(depth)}"newValue": ${newValue}`,
      );
    } else {
      const value = node.children.length === 0
        ? getValue(node.value)
        : formatterJSON(node.children, depth + 1).trim();
      result.push(`${indent(depth)}"value": ${value}`);
    }
    result.unshift(`${indent(depth - 1)}{`);
    result.push(`${indent(depth - 1)}}`);
    return result.join('\n');
  });
  return formatedTree.join(',\n');
};

export default formatterJSON;

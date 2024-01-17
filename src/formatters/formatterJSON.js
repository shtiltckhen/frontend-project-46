const getValue = (node, depth) => {
  if (Array.isArray(node)) {
    const res = node.map((obj) => {
      const result = [`${'  '.repeat(depth)}{\n${'  '.repeat(depth + 1)}"key": "${obj.key}"`,
        `${'  '.repeat(depth + 1)}"value": ${getValue(obj.value, depth + 1).trimStart()}\n${'  '.repeat(depth)}}`];
      return result.join(',\n');
    });
    return res.join(',\n');
  }
  return `${typeof (node) === 'string' ? `"${node}"` : node}`;
};

const formatterJSON = (tree, depth = 1) => {
  const result = tree.map((node) => {
    let output;
    switch (node.status) {
      case 'hasChildren':
        output = [`${'  '.repeat(depth - 1)}{\n${'  '.repeat(depth)}"key": "${node.key}"`,
          `${'  '.repeat(depth)}"value": ${formatterJSON(node.value, depth + 1).trimStart()}\n${'  '.repeat(depth - 1)}}`];
        break;
      case 'unchanged':
        output = [`${'  '.repeat(depth - 1)}{\n${'  '.repeat(depth)}"status": "${node.status}"`,
          `${'  '.repeat(depth)}"key": "${node.key}"`,
          `${'  '.repeat(depth)}"value": ${getValue(node.value, depth).trimStart()}\n${'  '.repeat(depth - 1)}}`];
        break;
      case 'changed':
        output = [`${'  '.repeat(depth - 1)}{\n${'  '.repeat(depth)}"status": "${node.status}"`,
          `${'  '.repeat(depth)}"key": "${node.key}"`,
          `${'  '.repeat(depth)}"oldValue": ${getValue(node.oldValue, depth).trimStart()}`,
          `${'  '.repeat(depth)}"newValue": ${getValue(node.newValue, depth).trimStart()}\n${'  '.repeat(depth - 1)}}`];
        break;
      case 'removed':
      case 'added':
        output = [`${'  '.repeat(depth - 1)}{\n${'  '.repeat(depth)}"status": "${node.status}"`,
          `${'  '.repeat(depth)}"key": "${node.key}"`,
          `${'  '.repeat(depth)}"value": ${getValue(node.value, depth).trimStart()}\n${'  '.repeat(depth - 1)}}`];
        break;
      default:
        throw new Error(`Unexpected status: "${node.status}"`);
    }
    return output.join(',\n');
  });
  return result.join(',\n');
};

export default formatterJSON;

const indent = (level) => `${'  '.repeat(level)}`;

const getValue = (node, depth) => {
  if (Array.isArray(node)) {
    const res = node.map((obj) => {
      const result = [`${indent(depth - 1)}{\n${indent(depth)}"key": "${obj.key}"`,
        `${indent(depth)}"value": ${getValue(obj.value, depth + 1).trimStart()}\n${indent(depth - 1)}}`];
      return result.join(',\n');
    });
    return res.join(',\n');
  }
  return `${typeof (node) === 'string' ? `"${node}"` : node}`;
};

const getString = (status, key, value, func, depth) => {
  const result = [];
  if (status !== 'hasChildren') {
    result.push(`${indent(depth - 1)}{\n${indent(depth)}"status": "${status}"`, `${indent(depth)}"key": "${key}"`);
  } else {
    result.push(`${indent(depth - 1)}{\n${indent(depth)}"key": "${key}"`);
  }
  if (status === 'changed') {
    result.push(
      `${indent(depth)}"oldValue": ${func(value[0], depth + 1).trimStart()}`,
      `${indent(depth)}"newValue": ${func(value[1], depth + 1).trimStart()}\n${indent(depth - 1)}}`,
    );
  } else {
    result.push(`${indent(depth)}"value": ${func(value, depth + 1).trimStart()}\n${indent(depth - 1)}}`);
  }
  return result;
};

const formatterJSON = (tree, depth = 1) => {
  const formatedTree = tree.map((node) => {
    let output;
    switch (node.status) {
      case 'hasChildren':
        output = getString(node.status, node.key, node.value, formatterJSON, depth);
        break;
      case 'unchanged':
        output = getString(node.status, node.key, node.value, getValue, depth);
        break;
      case 'changed':
        output = getString(node.status, node.key, [node.oldValue, node.newValue], getValue, depth);
        break;
      case 'removed':
      case 'added':
        output = getString(node.status, node.key, node.value, getValue, depth);
        break;
      default:
        throw new Error(`Unexpected status: "${node.status}"`);
    }
    return output.join(',\n');
  });
  return formatedTree.join(',\n');
};

export default formatterJSON;

export function getTreeDepth(node) {
  const children = Array.isArray(node?.children) ? node.children : [];
  return 1 + children.reduce((depth, child) => Math.max(depth, getTreeDepth(child)), 0);
}

export function withMaxVisibleDepth(node, maxVisibleDepth, depth = 1) {
  const limit = Math.max(1, Math.trunc(Number(maxVisibleDepth)) || 1);
  const children = Array.isArray(node?.children)
    ? node.children.map(child => withMaxVisibleDepth(child, limit, depth + 1))
    : [];
  const clone = { ...node, children };

  if (children.length) {
    clone.payload = {
      ...node.payload,
      fold: depth >= limit ? 1 : 0
    };
  } else if (node?.payload) {
    clone.payload = { ...node.payload };
  }

  return clone;
}

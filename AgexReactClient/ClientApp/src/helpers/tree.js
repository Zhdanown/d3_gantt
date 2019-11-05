export const rebaseToggledState = (target, source) => {
  recurse(source);
  return target;

  function recurse(sourceNode) {
    if (!sourceNode.children && sourceNode._children) {
      let targetNode = findTargetNode(target, sourceNode.id);

      if (targetNode && targetNode.children) {
        targetNode._children = targetNode.children;
        targetNode.children = null;
      }
    }

    if (sourceNode.children) {
      sourceNode.children.forEach(childNode => recurse(childNode));
    }
    if (sourceNode._children) {
      sourceNode._children.forEach(childNode => recurse(childNode));
    }
  }

  function findTargetNode(currentNode, targetId) {
    let foundTargetNode = null;
    if (currentNode.id === targetId) return currentNode;
    else if (currentNode.children) {
      for (let childNode of currentNode.children) {
        foundTargetNode = findTargetNode(childNode, targetId);
        if (foundTargetNode) return foundTargetNode;
      }
    } else if (currentNode._children) {
      for (let childNode of currentNode._children) {
        foundTargetNode = findTargetNode(childNode, targetId);
        if (foundTargetNode) return foundTargetNode;
      }
    } else return null;
  }
};

export const appendIdsToNodes = hierarchy => {
  recurse(hierarchy);

  function recurse(node) {
    node.id = getId(node);
    if (node.children) node.children.forEach(node => recurse(node));
  }

  return hierarchy;
};

export const getId = d => {
  let key = "";
  appendParentId(d);

  function appendParentId(d) {
    key = key + "/" + d.data.id;
    if (d.parent) appendParentId(d.parent);
  }

  // prepend node id for operations to distinguish them
  if (d.height === 0) key = d.data.node && d.data.node.id + key;

  return key;
};

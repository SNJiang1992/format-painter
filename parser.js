function parseDom(dom) {
  let targetDom = null;
  let nodeArray = [];

  getTargetDom(dom);

  getAllStyle(targetDom);

  function getTargetDom(dom) {
    for (let i of dom.childNodes) {
      if (i.nodeType === 3 && i.nodeValue && i.nodeValue.trim() !== '') {
        targetDom = dom;
        return;
      }
    }
    getTargetDom(dom.children[0]);
  }

  function getAllStyle(dom) {
    if (!dom) return;
    const tagName = dom.tagName.toLowerCase();
    if (tagName === 'p') {
      nodeArray.push({
        tagName: 'span',
        attributes: Array.from(dom.attributes).map((i) => {
          return {
            name: i.name,
            value: i.value,
          };
        }),
      });
      return;
    } else {
      nodeArray.push({
        tagName: tagName,
        attributes: Array.from(dom.attributes).map((i) => {
          return {
            name: i.name,
            value: i.value,
          };
        }),
      });
      getAllStyle(dom.parentNode);
    }
  }
  return nodeArray;
}

function addStyle(text, nodeArray) {
  let currentNode = null;
  nodeArray.forEach((ele, index) => {
    let node = document.createElement(ele.tagName);
    for (const attr of ele.attributes) {
      node.setAttribute(attr.name, attr.value);
    }
    if (index === 0) {
      node.innerText = text;
      currentNode = node;
    } else {
      node.appendChild(currentNode);
      currentNode = node;
    }
  });
  return currentNode;
}

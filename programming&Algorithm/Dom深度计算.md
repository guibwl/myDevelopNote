
递归版本
```js
const getDepth = node => {
  if (!node.children || node.children.length === 0) {
    return 1;
  }
  const maxChildrenDepth = [...node.children].map(v => getDepth(v));
  return 1 + Math.max(...maxChildrenDepth)
};

const body = document.querySelector('body')

getDepth(body);
```

非递归版本
```js
const getDepth = root => {
    if(!root) return 0;
    let queue = [];
    let level = 0;
    queue.push(root);

    while(queue.length) {
        let length = queue.length;
        while(length -- ) {
            let node = queue.shift();
            if (node.children) {
                const children = [...node.children];
                queue = queue.concat(children);
            }
        }
        level ++;
    }
    return level;
};

const body = document.querySelector('body')

getDepth(body);
```
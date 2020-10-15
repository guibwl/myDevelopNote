使用二分查找思想，实现等价Array.prototype.indexOf的功能。

```js
function findIndex(key, arr) {

    let midIndex = Math.floor(arr.length/2);
    let leftIndex = 0;
    let rightIndex = arr.length - 1;

    while (true) {

        if (arr[midIndex] === key) return midIndex;

        if (arr[midIndex] > key) {

            if ((leftIndex + 1) === midIndex) return -1;

            rightIndex = midIndex;
            midIndex = Math.floor((midIndex - leftIndex)/2) + leftIndex;
        }


        if (arr[midIndex] < key) {

            if ((midIndex + 1) === rightIndex) return -1;

            leftIndex = midIndex;
            midIndex = Math.floor((rightIndex - midIndex)/2) + midIndex;
        }
    }
}


findIndex(34, [1, 3, 3, 3, 4, 4, 5, 12, 34, 44, 77, 88, 88]);
```
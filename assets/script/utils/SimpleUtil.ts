import { director, Node } from "cc";

export class SimpleUtil {

    static defaultSort(arr: Array<any>) {
        console.time('默认排序');
        arr.sort((a, b) => {
            return a - b;
        })

        console.timeEnd('默认排序');
        console.log(arr);
        return arr;
    }

    //简单冒泡排序
    static simpleBubbleSort(arr: Array<any>) {
        console.time('简单冒泡排序');
        let len = arr.length, temp;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        console.timeEnd('简单冒泡排序');
        console.log(arr);
        return arr;
    }

    //双向取值
    static bubbleSort(arr: Array<any>) {
        console.time('冒泡排序');
        let low = 0, height = arr.length - 1, temp;
        while (low < height) {
            //找最大值
            for (let i = low; i < height; i++) {
                if (arr[i] > arr[i + 1]) {
                    temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
            height--;
            //找最小值
            for (let i = height; i > low; i--) {
                if (arr[i] < arr[i - 1]) {
                    temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
            low++
        }
        console.timeEnd('冒泡排序');
        console.log(arr);
        return arr;
    }


    //选择排序  每一个和所有后面的进行排序
    static selectSort(arr: Array<number>) {
        let len = arr.length;
        let minIndex, temp;
        console.time('选择排序耗时');
        for (let i = 0; i < len - 1; i++) {
            minIndex = i;
            //找最小的值得下标
            for (let j = i + 1; j < len; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        console.timeEnd('选择排序耗时');
        console.log(arr)
    }

    //插入排序
    static insertSort(arr: Array<number>) {
        console.time("插入排序耗时");
        let len = arr.length, key;
        for (let i = 1; i < len; i++) {
            let j = i - 1;
            key = arr[i];
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        console.timeEnd("插入排序耗时");
        console.log(arr);
    }

    static binaryInsertionSort(arr: Array<number>) {
        console.time('二分插入排序耗时：');
        let len = arr.length;
        for (let i = 1; i < len; i++) {
            let key = arr[i], left = 0, right = i - 1;
            while (left <= right) {
                let middle = Math.floor((left + right) / 2);
                if (key < arr[middle]) {
                    right = middle - 1
                } else {
                    left = middle + 1;
                }
            }
            for (let j = i - 1; j >= left; j--) {
                arr[j + 1] = arr[j];
            }
            arr[left] = key;
        }
        console.timeEnd('二分插入排序耗时：');
        console.log(arr);
        return arr;
    }

    //希尔排序
    static shellSort(arr: Array<number>) {
        let len = arr.length, temp, gap = 1;
        console.time('希尔排序耗时:');
        //动态定义间隔
        while (gap < len / 5) {
            gap = gap * 5 + 1;
        }
        for (gap; gap > 0; gap = Math.floor(gap / 5)) {
            for (let i = gap; i < len; i++) {
                temp = arr[i];
                for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
                    arr[j + gap] = arr[j]
                }
                arr[j + gap] = temp;
            }
        }
        console.timeEnd('希尔排序耗时:');
        console.log(arr);
        return arr;
    }

    static newShellSort(arr) {
        // arr = [7, 3, 5, 9, 1, 6, 2, 8, 4]
        console.time('新希尔排序耗时:');
        let len = arr.length, gap = 1;
        // 定义增量序列
        while (gap < len / 3) {
            gap = gap * 3 + 1;
        }
        while (gap > 0) {
            for (let i = gap; i < len; i++) {
                let temp = arr[i];
                let j = i - gap;
                while (j >= 0 && arr[j] > temp) {
                    arr[j + gap] = arr[j];
                    j -= gap;
                }
                arr[j + gap] = temp;
            }
            gap = Math.floor(gap / 3);
        }

        console.timeEnd('新希尔排序耗时:');
        console.log(arr);
        return arr;
    }
    static getGameCameraNode(): Node {
        return this.getCanvas().getChildByName("GameCamera");
    }

    static getCanvas(): Node {
        return <Node><unknown>director.getScene().getChildByName("Canvas");
    }

}

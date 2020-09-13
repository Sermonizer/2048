/*
 * @Author: your name
 * @Date: 2020-08-11 13:28:03
 * @LastEditTime: 2020-08-11 13:38:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2048-master\test.js
 */
let arr1 = [87, 88, 91, 85, 81, 85, 83, 88, 75, 76, 96, 86, 78, 76]
let arr2 = [0.5, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 2, 2]

let arr3 = arr1.map(function (num) {
    return (num / 10 - 5).toFixed(2)
})

let arr4 = arr2.map(function (num, index) {
    return (num * arr3[index]).toFixed(2)
})

let sum = 0
for (let i = 0; i < arr4.length; i++) {
    sum += arr4[i]
}
sum = Math.floor(sum / arr4.length)
console.log(sum);
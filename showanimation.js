/*
 * @Author: your name
 * @Date: 2020-07-14 22:40:44
 * @LastEditTime: 2020-08-11 11:50:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2048-master\showanimation.js
 */
// 动画效果的逻辑

// 显示方块时的动画
function showNumberWithAnimation(i, j, randNumber) {
  var numberCell = $("#numberCell-" + i + "-" + j);
  numberCell.css("background-color", getNumberBackColor(randNumber));
  numberCell.css("color", getNumberColor(randNumber));
  numberCell.text(randNumber);
  // 实现动画效果，用jquery的animate（，time）函数, 延时50ms
  // 更换位置，由0时的50，50变为0，0；
  numberCell.animate(
    {
      top: getPosTop(i, j),
      left: getPosLeft(i, j),
      width: "100px",
      height: "100px",
    },
    50
  );
}

// 方块移动时的动画
function showMoveAnimation(fromx, fromy, tox, toy) {
  var numberCell = $("#numberCell-" + fromx + "-" + fromy);
  numberCell.animate(
    {
      top: getPosTop(tox, toy),
      left: getPosLeft(tox, toy),
    },
    200
  );
}

// 得分更新
function updateScore(score) {
  $("#score").text(score);
}

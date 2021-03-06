// 游戏主逻辑
var board = new Array(); // 存放4*4格子上的数据
var score = 0; // 存放得分
var hasChanged = new Array(); // 每个格子一轮只能改变一次值

// 主函数
$(document).ready(function () {
  newGame();
});

// 按下newgame按键
function newGame() {
  // 初始化棋盘格
  init();
  // 随机生成两个数字
  generateOneNumber();
  generateOneNumber();
}

function init() {
  // 获取16个格子的位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 首先取小格子对应的元素,通过id来取
      var gridCell = $("#gridCell-" + i + "-" + j);
      // 计算每一个gridcell的top和left值
      gridCell.css("top", getPosTop(i, j));
      gridCell.css("left", getPosLeft(i, j));
    }
  }
  // board是2维数组,初始化board
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasChanged[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      // 初始化haschanged数组
      hasChanged[i][j] = false;
    }
  }
  // 通过该函数通知前端，在两个格子展示
  updateBoardView();
  // 初始化得分
  score = 0;
  updateScore(score);
}

// numberCell: 16个小格子上显示的数字，为0则不显示
// 用二维数组board存储格子中的值，值变化后，将改变通知前端，动态显示numberCell
function updateBoardView() {
  // 因为index里没用numberCell这个元素，因此其在js中是动态显示的
  // 如果有numberCell，就删除掉，根据现有board重新显示
  $(".numberCell").remove();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      // 每个board元素都应该生成numberCell
      $("#gridContainer").append(
        '<div class="numberCell" id="numberCell-' + i + "-" + j + '"></div>'
      );
      // 设置一个变量，用来操作当前的numberCell
      var theNumberCell = $("#numberCell-" + i + "-" + j);
      // 如果board=0，就放在中间
      if (board[i][j] == 0) {
        theNumberCell.css("width", "0px");
        theNumberCell.css("height", "0px");
        theNumberCell.css("top", getPosTop(i, j) + 50);
        theNumberCell.css("left", getPosLeft(i, j) + 50);
      }
      // 否则就覆盖gridCell
      else {
        theNumberCell.css("width", "100px");
        theNumberCell.css("height", "100px");
        theNumberCell.css("top", getPosTop(i, j));
        theNumberCell.css("left", getPosLeft(i, j));
        // 获取背景色，不同值背景色不同
        theNumberCell.css("background-color", getNumberBackColor(board[i][j]));
        // 获取字体大小
        theNumberCell.css("font-size", getNumberSize(board[i][j]));
        // 获取前景色，即数字的颜色
        theNumberCell.css("color", getNumberColor(board[i][j]));
        // 显示值
        theNumberCell.text(board[i][j]);
      }
      // 改变一轮的数字显示后，恢复false
      hasChanged[i][j] = false;
    }
  }
}

function generateOneNumber() {
  // 首先判断棋盘有么有空间生成
  if (noSpace(board)) {
    return false;
  }
  // 然后生成数字的位置
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  // 判断该处是否可用
  while (true) {
    if (board[randx][randy] == 0) {
      break;
    }
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }
  // 生成2或4
  var randNumber = Math.random() < 0.5 ? 2 : 4;
  // 在随机位置显示数字
  board[randx][randy] = randNumber;
  // 前端动画
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}

// 玩家按键后会发生神马？
$(document).keydown(function (event) {
  // 上下左右：格子相应的动作，其他：不动
  switch (event.keyCode) {
    case 37: // left
      if (moveLeft()) {
        // 向左移动后会生成一个新的数字
        setTimeout("generateOneNumber()", 210);
        // 判断游戏是否结束
        setTimeout("isGameover()", 300);
      }
      break;
    case 38: // up
      if (moveUp()) {
        // 向上移动后会生成一个新的数字
        setTimeout("generateOneNumber()", 210);
        // 判断游戏是否结束
        setTimeout("isGameover()", 300);
      }
      break;
    case 39: // right
      if (moveRight()) {
        // 向右移动后会生成一个新的数字
        setTimeout("generateOneNumber()", 210);
        // 判断游戏是否结束
        setTimeout("isGameover()", 300);
      }
      break;
    case 40: // down
      if (moveDown()) {
        // 向下移动后会生成一个新的数字
        setTimeout("generateOneNumber()", 210);
        // 判断游戏是否结束
        setTimeout("isGameover()", 300);
      }
      break;
    default:
      break;
  }
});
// 按下左键的逻辑
function moveLeft() {
  if (!canMoveLeft(board)) {
    return false;
  }
  for (var i = 0; i < 4; i++) {
    // 往左边移动，最左边的已无法移动
    for (var j = 1; j < 4; j++) {
      // 如果不等于0，判断是否可以左移
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          // 1.左边有空可以移动并且当前位置和能移动的位置间没有阻碍
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            // move动画
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 2.左边的数=现在的数
          else if (
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, k, j, board) &&
            // i,k处的值在当前渲染没被改变过
            !hasChanged[i][k]
          ) {
            // move
            showMoveAnimation(i, j, i, k);
            // add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            // 得分改变
            score += board[i][k];
            // 反馈到前端
            updateScore(score);
            hasChanged[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  // 数据改变后，通知前端
  // 利用函数等待200ms
  setTimeout("updateBoardView()", 200);
  // updateBoardView();
  return true;
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false;
  }
  // 首先，最右面一排不能右移；
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      // 如果不等于0
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          // 右面有空位，且道路通畅
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            // move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 右面没空位，但值相同
          else if (
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, j, k, board) &&
            !hasChanged[i][k]
          ) {
            // move
            showMoveAnimation(i, j, i, k);
            // add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            // 得分改变
            score += board[i][k];
            // 反馈到前端
            updateScore(score);
            hasChanged[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  // 数据改变后，通知前端，等待200ms
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }
  // 首先，最上面一排不能上移；
  for (var j = 0; j < 4; j++) {
    for (var i = 1; i < 4; i++) {
      // 如果不等于0
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          // 上面有空位，且道路通畅
          if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
            // move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 上面没空位，但值相同
          else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(k, i, j, board) &&
            !hasChanged[k][j]
          ) {
            // move
            showMoveAnimation(i, j, k, j);
            // add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            // 得分改变
            score += board[k][j];
            // 反馈到前端
            updateScore(score);
            hasChanged[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  // 数据改变后，通知前端
  // 利用函数等待200ms
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }
  // 首先，最下面一排不能下移；
  for (var j = 0; j < 4; j++) {
    for (var i = 2; i >= 0; i--) {
      // 如果不等于0
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          // 下面有空位，且道路通畅
          if (board[k][j] == 0 && noBlockVertical(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 下面没空位，但值相同
          else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(i, k, j, board) &&
            !hasChanged[k][j]
          ) {
            // move
            showMoveAnimation(i, j, k, j);
            // add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            // 得分改变
            score += board[k][j];
            // 反馈到前端
            updateScore(score);
            hasChanged[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  // 数据改变后，通知前端
  // 利用函数等待200ms
  setTimeout("updateBoardView()", 200);
  return true;
}

function isGameover() {
  if (noSpace(board) && noMove(board)) {
    gameOver();
  }
}

function gameOver() {
  alert("gameOver!");
}

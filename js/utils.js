// 格式化日期
export function formatTimestamp(timestamp){
//  方法一：調用 getFullYear()、getMonth() 等方法取得特定時間單位
 const date = new Date(timestamp * 1000);  // 將秒轉為毫秒，13 碼
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0');  // 月份從 0 開始，需加 1
 const day = String(date.getDate()).padStart(2, '0');  // 使用 padStart(2, '0') 確保數字不足 2 位時補 0（例如 5 轉為 05）
 const hours = String(date.getHours()).padStart(2, '0');
 const minutes = String(date.getMinutes()).padStart(2, '0');
 const seconds = String(date.getSeconds()).padStart(2, '0');
 return `${year} / ${month} / ${day} <br> ${hours}:${minutes}:${seconds}`;

//  方法二：
  // const time = new Date(timestamp * 1000);
  // const formatTime = time.toLocaleString('zh-TW', {
  //   hour12: false, // 使用 24 小時制
  // })
  // return formatTime;
}
// ===========================================================================
//// 數字加入千分比符號
// 方法一：使用正規表達式
// export function formatNumber(number) {
//   let parts = number.toString().split('.'); // 分割整數和小數部分
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 格式化整數部分
//   return parts.length > 1 ? parts.join('.') : parts[0]; // 拼接小數部分
// }

// 方法二：使用 split 和 join 語法
export function formatNumber(number) {
  let numberArr = number.toString().split('.'); // 分割整數和小數部分
  let integerArray = numberArr[0].split(''); // 將整數部分轉為字元陣列
  let result = [];

  // 從後往前處理，插入逗號
  let count = 0;
  while (integerArray.length > 0) {
    result.unshift(integerArray.pop()); // 每次從陣列尾部取出數字並加到結果前面
    count++;
    if (count % 3 === 0 && integerArray.length > 0) {
      result.unshift(','); // 每三位插入逗號
    }
  }

  // 合併小數部分（如果有的話）
  return numberArr[1] ? result.join('') + '.' + numberArr[1] : result.join('');
}
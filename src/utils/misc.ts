// function calculateResult() {
//   const r = [];
//   r.push(iterableArray[0])
//   for (let i = 0; i < iterableArray.length; i++) {
//     for (let k = i; k < iterableArray.length; k++) {
//       console.log("Tracking :" + iterableArray[i])
//       console.log("comparing with " + iterableArray[k])
//       if (iterableArray[i] != iterableArray[k]) {
//         console.log("New " + iterableArray[k] + " found with index: " + k)
//         r.push(iterableArray[k]);
//         i = k - 1;
//         break;
//       }
//     }
//   }
//   setResult(r)
// }

// function toRoman() {
//   // convert the number to a roman numeral
//   let number = input
//   let result = ""
//   let m = number / 1000;
//   while (m >= 1) {
//     result += "M"
//     m--;
//   }

//   let c = number % 1000;
//   if (c >= 900) {
//     result += "CM";
//   } else if (c >= 500) {
//     result += "D";
//     c -= 500;
//   } else if (c >= 400) {
//     result += "CD";
//     c -= 400;
//   }
//   if (c >= 100) {
//     let d = c / 100;
//     while (d >= 1) {
//       result += "C"
//       d--;
//     }
//   }
//   let x = number % 100;
//   if (x >= 90) {
//     result += "XC"
//     x -= 90;
//   } else
//     if (x >= 50) {
//       result += "L"
//       x -= 50;
//     }
//     else if (x >= 40) {
//       result += "XL";
//       x -= 40;
//     }
//   if (x >= 10) {
//     let i = x / 10
//     while (i >= 1) {
//       result += "X"
//       i--;
//     }
//   }
//   let y = number % 10;
//   if (y == 9) {
//     result += "IX"
//     y -= 9;
//   }
//   else if (y >= 5) {
//     result += "V"
//     y -= 5;
//   }
//   else if (y == 4) {
//     result += "IV"
//     y -= 4;
//   }
//   while (y > 0) {
//     result += "I"
//     y--;
//   }
//   // return result
//   setResult(result)
// }
// =================================================================
// I-Task:
// =================================================================

// Shunday function tuzing, u bir array argument qilib qabul qilib, osha arrayning 0 index qiymatni arrayning oxiriga qoyib return qilsin
// Masalan: getCompute(['h', 'e', 'l', 'l', 'o']) return qilishi kerak ['e', 'l', 'l', 'o', 'h']

function getCompute(array) {
  let frontEl = array.shift();
  array.push(frontEl);
  return array;
}
let result = getCompute(["h", "e", "l", "l", "o"]);
console.log(result);

const generateRandomID = function (length = 15) {
  const dataSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  var output = "";
  for (let i = 0; i < length; i++) {
    output += dataSet[Math.floor(Math.random() * (dataSet.length - 1))];
  }
  return output;
};

module.exports = { generateRandomID };

const process = require('process');
const readline = require('readline');

function caesar(shift, input) {
  if (!/^-?\d+$/.test(shift)) console.error('Shift is not an integer');
  if (shift < 0 || shift >= 26) console.error('Shift is out of range');

  var output = '',
    len = input.length;

  for (var i = 0; i < len; i++) {
    var c = input.charCodeAt(i);

    // Small fix for cedilla
    if (c == 231) c = 99;
    if (c == 199) c = 67;

    if (c >= 65 && c <= 90) {
      // upcase
      output += String.fromCharCode(((c - 65 + shift) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      // downcase
      output += String.fromCharCode(((c - 97 + shift) % 26) + 97);
    } else {
      // copy thru
      output += input.charAt(i);
    }
  }
  return output;
}

function main() {
  if (process.argv.length < 2) {
    console.error('not enough arguments');
    return;
  }

  const shift = parseInt(process.argv[2], 10);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', function (line) {
    const result = caesar(shift, line);
    process.stdout.write(result);
  });
}

main();

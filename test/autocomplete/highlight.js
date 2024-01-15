function highlightStr(target, source) {
  let currentIndex = 0;
  let highlighted = '';

  for (let i = 0; i < source.length; i++) {
    if (source[i] === target[currentIndex]) {
      highlighted += `<span>${source[i]}</span>`;
      currentIndex++;
      if (currentIndex >= target.length) {
        highlighted += source.slice(i + 1);
        break;
      }
    } else {
      highlighted += source[i];
    }
  }
  return highlighted;
}

const source = `airdrop-cli`;
const target = 'cli';
const result = highlightStr(target, source);

console.log(result);

const fs = require('fs');

async function test() {
  const res = await fetch("https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=2");
  const data = await res.json();
  const waqf = new Set();
  
  data.verses.forEach(v => {
    for (let c of v.text_indopak) {
      if (c >= '\u06D6' && c <= '\u06DC') {
        waqf.add(c);
      }
    }
  });
  console.log(Array.from(waqf).map(c => c + ' (U+' + c.charCodeAt(0).toString(16).toUpperCase() + ')').join('\n'));
}

test();

const s = "رَيۡبَۛۚۖ";
console.log("Original:", s);
console.log("With spaces:", s.replace(/([\u06D6-\u06DC])/g, '\u00A0$1'));
console.log("With thin spaces:", s.replace(/([\u06D6-\u06DC])/g, '\u2009$1'));

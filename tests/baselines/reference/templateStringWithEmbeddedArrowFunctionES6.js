//// [templateStringWithEmbeddedArrowFunctionES6.ts]
var x = `abc${ x => x }def`;

//// [templateStringWithEmbeddedArrowFunctionES6.js]
var x = `abc${function (x) { return x; }}def`;

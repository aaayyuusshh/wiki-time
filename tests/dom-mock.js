const { JSDOM } = require("jsdom");
const TEST_HTML = require("./testHtml.js");
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const dom = new JSDOM(TEST_HTML);
global.document = dom.window.document;
global.Node = dom.window.Node;
global.window = dom.window;

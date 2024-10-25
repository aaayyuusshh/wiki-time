const {Utils} = require('../src/scripts/content.js');

describe("content/Utils", () => {

  describe("splitArticleText", () => {
    it("should handle crazily irregularly spaced words with tabs and newlines correctly", () => {
      const input = "This   text \thas a\treally   str\n\n\nange\nand  irregular   spacing. It \n\nhas\t\tmultiple    types of     delimiters,\n   such as\t\ttabs,    spaces,\n\nand\nnewlines.";
      const result = Utils.splitArticleText(input);
      expect(result).toEqual([
          "This", "text", "has", "a", "really", "str", "ange", "and", "irregular", "spacing.",
          "It", "has", "multiple", "types", "of", "delimiters,", "such", "as",
          "tabs,", "spaces,", "and", "newlines."
      ]);
    });
  
    it("should handle an empty string input", () => {
        const input = "";
        const result = Utils.splitArticleText(input);
        expect(result).toEqual([""]);
    });
  });
});
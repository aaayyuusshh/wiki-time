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
  
  describe('filterNonWords', () => {
    it('should filter out empty strings, periods, and commas', () => {
        const input = ["Hello,", "", "...", ",", "world."];
        const result = Utils.filterNonWords(input);
        expect(result).toEqual(["Hello,", "world."]);
    });

    it('should return an empty array when given all empty strings', () => {
        const input = ["", "", ""];
        const result = Utils.filterNonWords(input);
        expect(result).toEqual([]);
    });
  });

  describe("extractArticleWords", () => {
    it("should extract words separated by spaces, tabs or newlines", () => {
      const input = "This string is ,,, ..,. \n\t             \n irregularly spaced...";
      const result = Utils.extractArticleWords(input);
      expect(result).toEqual(["This", "string", "is", "irregularly", "spaced..."]);
    });
  
    it("should keep punctuations attached to a word but remove lone punctuations", () => {
        const input = "Hello, , , ,                    (this) is a . test.   300";
        const result = Utils.extractArticleWords(input);
        expect(result).toEqual(["Hello,", "(this)", "is", "a", "test.", "300"]);
    });
  
    it("should remove long attached punctuations", () => {
        const input = "  This.  ,   is. a.           test. ,,,,,, ... ..,.,,";
        const result = Utils.extractArticleWords(input);
        expect(result).toEqual(["This.", "is.", "a.", "test."]);
    });
  });
});

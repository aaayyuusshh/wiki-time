const {Utils, TimeCalculatorModule, UIModule, ParserModule} = require('../src/scripts/content.js');

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


describe("content/TimeCalculatorModule", () => {

  //@TODO can lowkey be added to chrome mock testing
  describe("getReadingTime", () => {
    it("should return the correct wpm", async () => {
      const result = await TimeCalculatorModule.getReadingTime();
      expect(result).toEqual(300);
    });

    it("should return 300 even if there was an error in setting wpm", async () => {
      chrome.storage.local.get.mockImplementationOnce((key) => {
        if(key === "wpm") return Promise.resolve({});
        if(key === "isExtensionOn") return Promise.resolve({isExtensionOn: true});
        return Promise.resolve({});
      });
    
      const result = await TimeCalculatorModule.getReadingTime();
      expect(result).toEqual(300);
    });
  });

  describe("calculateTextReadingTime", () => {
    it("should return 2 mins for 600 words", async () => {
      const result = await TimeCalculatorModule.calculateTextReadingTime(Array(600).fill("words"));
      expect(result).toEqual(2);
    });

    it("should return 2.5 mins for 750 words [this function doesn't ceil]", async () => {
      const result = await TimeCalculatorModule.calculateTextReadingTime(Array(750).fill("words"));
      expect(result).toEqual(2.5);
    });
  });

  describe("calculateImageReadingTime", () => {
    it("should return =~ 0.4166.. mins for 5 images", () => {
      const result = TimeCalculatorModule.calculateImageReadingTime(5);
      expect(result).toBeCloseTo(0.417, 3);
    });

    it("should return 0 mins for no images", () => {
      const result = TimeCalculatorModule.calculateImageReadingTime(0);
      expect(result).toEqual(0);
    });
  });

  describe("calculateReadingTime", () => {
    it("should return 0 mins for no words and no images", async () => {
      const result = await TimeCalculatorModule.calculateReadingTime([], 0);
      expect(result).toEqual(0);
    });

    it("should return correct ceiling value", async () => {
      const result = await TimeCalculatorModule.calculateReadingTime(Array(14488).fill("words"), 66);
      const expected =  Math.ceil((14488/300) + ((5*66)/60)); // 54
      expect(result).toEqual(expected);
    });

    it("should return 1 min for 1 word [this function ceils]", async () => {
      const result = await TimeCalculatorModule.calculateReadingTime(["word"], 0);
      expect(result).toEqual(1);
    });

    it("should return 1 min for just 1 image [this function ceils]", async () => {
      const result = await TimeCalculatorModule.calculateReadingTime([], 1);
      expect(result).toEqual(1);
    });
  });
});


describe("content/UIModule displayReadingTime", () => {

  it("should insert the reading time element into the DOM", () => {
    UIModule.displayReadingTime(10);
    const readingTimeDisplay = global.document.getElementById("readingTimeDisplay");
    expect(readingTimeDisplay).not.toBeNull();
  });

  it("should insert the specified reading time into the DOM", () => {
    UIModule.displayReadingTime(10);
    const readingTimeDisplay = global.document.getElementById("readingTimeDisplay");
    const readingTime = readingTimeDisplay.textContent;
    expect(readingTime).toEqual("10 min read");
  });
});

describe.only("content/ParserModule parseText", () => {
  let mockNode;

  beforeEach(() => {
    // create a fresh dom node before each test
    mockNode = document.createElement("div");
    document.body.appendChild(mockNode);
  });

  afterEach(() => {
    document.body.removeChild(mockNode);
    // clear mock state between tests
    // @TODO properly learn what this does
    jest.clearAllMocks();
  });

  it("should ignore elements with display none", () => {
    mockNode.innerHTML = `
      <div style="display: none;">Hidden Content</div>
      <div>Visible Content</div>
    `;
 
    const result = ParserModule.parseText(mockNode);
    expect(result).toContain("Visible Content");
    expect(result).not.toContain("Hidden Content");
  });

  it("should ignore elements with display none, including nested elements", () => {
    mockNode.innerHTML = `
      <div style="display: none;">
        Hidden Content
        <p>
          Deeply Hidden Content
          <span>Deeply Hidden Content</span>
        </p>
      </div>
      <div>Visible Content</div>
    `;

    const result = ParserModule.parseText(mockNode);
    expect(result).toContain("Visible Content");
    expect(result).not.toContain("Hidden Content");
    expect(result).not.toContain("Deeply Hidden Content");
  });
});

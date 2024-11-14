describe("DOM Mock", () => {
    it("should have a global document", () => {
        expect(global.document).toBeDefined();
        expect(global.document instanceof global.window.Document).toBe(true);
      });
    
      it("should have a global Node", () => {
        expect(global.Node).toBeDefined();
        expect(global.Node).toBe(global.window.Node);
      });
    
      it("should have a global window", () => {
        expect(global.window).toBeDefined();
        expect(typeof global.window).toBe("object");
      });
    
      it("should define TextEncoder and TextDecoder", () => {
        expect(global.TextEncoder).toBeDefined();
        expect(global.TextDecoder).toBeDefined();
        expect(new global.TextEncoder()).toBeInstanceOf(TextEncoder);
        expect(new global.TextDecoder()).toBeInstanceOf(TextDecoder);
      });

      it("should have .mw-content-ltr root element", () => {
        const contentElement = global.document.querySelector(".mw-content-ltr");
        expect(contentElement).not.toBeNull();
    });
});

describe("Chrome Storage Mock", () => {
    it("should return wpm value of 300 when key is 'wpm'", async () => {
      const result = await global.chrome.storage.local.get("wpm");
      expect(result).toEqual({ wpm: 300 });
    });
  
    it("should return isExtensionOn as true when key is 'isExtensionOn'", async () => {
      const result = await global.chrome.storage.local.get("isExtensionOn");
      expect(result).toEqual({ isExtensionOn: true });
    });
  
    it("should return an empty object for any other key", async () => {
      const result = await global.chrome.storage.local.get("otherKey");
      expect(result).toEqual({});
    });

    it("should be called as a mock function", () => {
        chrome.storage.local.get("wpm");
        expect(global.chrome.storage.local.get).toHaveBeenCalled();
        expect(global.chrome.storage.local.get).toHaveBeenCalledWith("wpm");
      });
  });

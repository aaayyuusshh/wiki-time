describe.only("DOM Mock", () => {
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

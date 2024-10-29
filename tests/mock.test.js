describe("DOM Setup Tests", () => {
    it("element with content should not be null", () => {
        const contentElement = global.document.querySelector(".mw-content-ltr");
        expect(contentElement).not.toBeNull();
    });
});

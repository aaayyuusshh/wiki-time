global.chrome = {
    storage: {
        local: {
            get: jest.fn(key => {
                // Directly returning a Promise that resolves the expected value.
                return Promise.resolve(
                    key === "wpm" ? { wpm: 300 } :
                    key === "isExtensionOn" ? { isExtensionOn: true } :
                    {}
                );
            })
        }
    }
};

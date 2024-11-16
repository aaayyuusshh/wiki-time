global.chrome = {
    storage: {
        local: {
            get: jest.fn((key) => {
                return Promise.resolve(
                    key === "wpm" ? { wpm: 300 } : key === "isExtensionOn" ? { isExtensionOn: true } : {}
                );
            })
        }
    }
};

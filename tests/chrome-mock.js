global.chrome = {
    storage: {
        local: {
            get: jest.fn(key => {
                return Promise.resolve((resolve => {
                    if (key === "wpm") {
                        resolve({wpm: 300});
                    }
                    else if(key === "isExtensionOn") {
                        resolve({isExtensionOn: true});
                    }
                    else {
                        resolve({});
                    }
                }));
            })
        }
    }
}
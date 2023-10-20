exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    specs: ['spec.js'],
    directConnect: false,
    multiCapabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            args: ["--headless"]
        }
    }]
};
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    chromeDriver: process.env.CHROMEWEBDRIVER,
    directConnect: true,
    multiCapabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            args: ["--headless"]
        }
    }]
};
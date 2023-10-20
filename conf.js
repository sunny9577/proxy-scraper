exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    chromeDriver: '/usr/local/share/chromedriver-linux64/chromedriver',
    specs: ['spec.js'],
    directConnect: true,
    multiCapabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            args: ["--headless"]
        }
    }]
};
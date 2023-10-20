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
    }],
    chromeDriver: './node_modules/chromedriver/lib/chromedriver/chromedriver' //Fix for https://github.com/angular/webdriver-manager/issues/523
};
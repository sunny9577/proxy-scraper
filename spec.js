var fs = require('fs');
var db = require('./db');
var config = require('./config');

describe('Scrapers', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000; //10 min timeout

    var saveToDb = config.SAVE_TO_DB;
    var proxyCount = 0;
    var proxies = new Object();
    proxies.lastUpdated = new Date();

    it('Proxynova Scraper', function() {

        console.log('Running...   Proxynova');
        var pages = ['https://www.proxynova.com/proxy-server-list/country-bd/ ', 'https://www.proxynova.com/proxy-server-list/country-br/ ', 'https://www.proxynova.com/proxy-server-list/country-cl/ ', 'https://www.proxynova.com/proxy-server-list/country-cn/ ', 'https://www.proxynova.com/proxy-server-list/country-co/ ', 'https://www.proxynova.com/proxy-server-list/country-fr/ ', 'https://www.proxynova.com/proxy-server-list/country-de/ ', 'https://www.proxynova.com/proxy-server-list/country-hk/ ', 'https://www.proxynova.com/proxy-server-list/country-in/ ', 'https://www.proxynova.com/proxy-server-list/country-id/ ', 'https://www.proxynova.com/proxy-server-list/country-jp/ ', 'https://www.proxynova.com/proxy-server-list/country-ke/ ', 'https://www.proxynova.com/proxy-server-list/country-nl/ ', 'https://www.proxynova.com/proxy-server-list/country-pl/ ', 'https://www.proxynova.com/proxy-server-list/country-ru/ ', 'https://www.proxynova.com/proxy-server-list/country-rs/ ', 'https://www.proxynova.com/proxy-server-list/country-kr/ ', 'https://www.proxynova.com/proxy-server-list/country-tw/ ', 'https://www.proxynova.com/proxy-server-list/country-th/ ', 'https://www.proxynova.com/proxy-server-list/country-ua/ ', 'https://www.proxynova.com/proxy-server-list/country-gb/ ', 'https://www.proxynova.com/proxy-server-list/country-us/ ', 'https://www.proxynova.com/proxy-server-list/country-ve/ ', 'https://www.proxynova.com/proxy-server-list/country-ir/ ', 'https://www.proxynova.com/proxy-server-list/country-tr/ ', 'https://www.proxynova.com/proxy-server-list/country-na/ ', 'https://www.proxynova.com/proxy-server-list/country-mz/ ', 'https://www.proxynova.com/proxy-server-list/country-it/ ', 'https://www.proxynova.com/proxy-server-list/country-eg/ ', 'https://www.proxynova.com/proxy-server-list/country-bg/'];
        var proxynova = [];
        var i = 0;

        function loadPage() {

            page = pages[i];

            console.log("Loading " + page);

            browser.driver.get(page);

            browser.driver.findElement(by.tagName('tbody')).findElements(by.tagName('tr')).then((data) => {

                data.forEach(row => {

                    row.findElements(by.tagName('td')).then((col) => {
                        
                        if(col[1]!= undefined){
                            var proxy = new Object();
                            col[0].getText().then((text) => {
                                    proxy.ip = text
                                }).then(() => {
                                    col[1].getText().then((text) => {
                                        proxy.port = text
                                    })
                                }).then(() => {
                                    col[5].getText().then((text) => {
                                        proxy.country = text
                                    })
                                }).then(() => {
                                    col[6].getText().then((text) => {
                                        proxy.anonymity = text
                                    })
                                }).then(() => {
                                    proxy.type = 'HTTP/HTTPS';
                                }).then(() => {
                                    proxynova.push(proxy);
                                    proxyCount++;
                                    saveIntoDb(proxy);
                                })
                                .catch((err) => {
                                    console.log("Exception Occured! in Proxynova" + err.stack);
                            })
                        }
                    });
                });
            }).then(() => {
                i++;
                if (i < pages.length)
                    loadPage();
                else
                    moveToAllProxies('proxynova', proxynova);
                    console.log(`Got ${proxyCount} proxies from proxynova`);
                    proxyCount = 0;
            });
        }

        loadPage();

    });

    it('US-proxy.org Scraper', function() {
        console.log('Running...   US-proxy.org');
        browser.driver.get('https://www.us-proxy.org/');
        dataidxid = 3;
        var usProxy = [];
        function nextPage(){
            browser.driver.findElement(by.id('proxylisttable')).findElements(by.tagName('tr')).then((rows) => {
                rows.forEach(row => {
                    var proxy = new Object();
                    row.findElements(by.tagName('td')).then((cols) => {
                        if (cols.length > 0) {
                            cols[0].getText().then((text) => {
                                proxy.ip = text;
                            }).then(() => {
                                cols[1].getText().then((text) => {
                                    proxy.port = text;
                                })
                            }).then(() => {
                                    proxy.country = 'United States';
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.type = text;
                                })
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.anonymity = 'HTTP/HTTPS';
                                })
                            }).then(() => {
                                usProxy.push(proxy);
                                proxyCount++;
                                saveIntoDb(proxy);
                            }).catch((err) => {
                                console.log("Exception Occured! in US Proxy" + err);
                            })
                        }
                    })
                });
                
            }).then(() => {
                if(dataidxid<=11){
                    dataidxid++;
                    browser.driver.findElement(by.xpath('//*[@id="proxylisttable_next"]/a')).click();
                    nextPage();
                }
                else{
                    moveToAllProxies('usproxy', usProxy);
                    console.log(`Got ${proxyCount} proxies from US proxy`);
                    proxyCount = 0;
                }
            })
        }

        nextPage();
    })

    it('hidemyna.me Scraper', function() {
        console.log('Running...   hidemyna.me');
        var hidemyname = [];
        var i = 0;

        function loadPage() {
            var curPage = i * 64;
            browser.driver.get('https://hidemyna.me/en/proxy-list/?maxtime=1000&anon=4&start=' + curPage + '#list');
            if (i == 0)
                browser.driver.sleep(10000);
            browser.driver.findElement(by.tagName('table')).findElement(by.tagName('tbody')).then((body) => {

                body.findElements(by.tagName('tr')).then((rows) => {

                    rows.forEach(row => {
                        row.findElements(by.tagName('td')).then((cols) => {

                            var proxy = new Object();

                            cols[0].getText().then((text) => {
                                proxy.ip = text;
                            }).then(() => {
                                cols[1].getText().then((text) => {
                                    proxy.port = text;
                                })
                            }).then(() => {
                                cols[2].getText().then((text) => {
                                    proxy.country = text;
                                })
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.type = text;
                                })
                            }).then(() => {
                                cols[5].getText().then((text) => {
                                    proxy.anonymity = text;
                                })
                            }).then(() => {
                                hidemyname.push(proxy);
                                proxyCount++;
                                saveIntoDb(proxy);
                            }).catch((err) => {
                                console.log("Exception Occured! in hidemyna.me" + err);
                            })
                        })
                    });
                })
            }).then(() => {
                i++;
                if (i <= 10)
                    loadPage();
                else {
                    moveToAllProxies('hidemyname', hidemyname);
                    console.log(`Got ${proxyCount} proxies from hidemyname`);
                    proxyCount = 0;
                }
            });
        }
        loadPage();
    });

    function saveIntoDb(proxy) {
        if (!saveToDb)
            return;
        var sql = "INSERT into proxies_tb (`proxy`,`port`,`country`,`type`,`anonymity`) VALUES('" + proxy.ip + "'," + proxy.port + ",'" + proxy.country + "','" + proxy.type + "','" + proxy.anonymity + "')";
        db.query(sql, (err, result) => {
            if (err)
                console.log(err)
        })
    }

    function moveToAllProxies(name, arr) {
        proxies[name] = arr;
    }

    it('Save', function() {
        fs.writeFile('proxies.json', JSON.stringify(proxies), function(err, data) {
            console.log("Successfully Saved proxies");
        });
    })
});
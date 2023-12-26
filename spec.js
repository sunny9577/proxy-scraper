const fs = require('fs');
const db = require('./db');
const config = require('./config');
const { getName } = require('country-list');
const YAML = require('yaml');
const js2xml = require('xml-js');

describe('Scrapers', function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000; //10 min timeout

    let proxies = { lastUpdated: new Date(), bySource: {}, byType: { socks5: [], socks4: [], http: [] } }

    it('Proxynova Scraper', function () {

        let scraperId = 'proxynova';
        let pages = ['https://www.proxynova.com/proxy-server-list/country-bd/ ', 'https://www.proxynova.com/proxy-server-list/country-br/ ', 'https://www.proxynova.com/proxy-server-list/country-cl/ ', 'https://www.proxynova.com/proxy-server-list/country-cn/ ', 'https://www.proxynova.com/proxy-server-list/country-co/ ', 'https://www.proxynova.com/proxy-server-list/country-fr/ ', 'https://www.proxynova.com/proxy-server-list/country-de/ ', 'https://www.proxynova.com/proxy-server-list/country-hk/ ', 'https://www.proxynova.com/proxy-server-list/country-in/ ', 'https://www.proxynova.com/proxy-server-list/country-id/ ', 'https://www.proxynova.com/proxy-server-list/country-jp/ ', 'https://www.proxynova.com/proxy-server-list/country-ke/ ', 'https://www.proxynova.com/proxy-server-list/country-nl/ ', 'https://www.proxynova.com/proxy-server-list/country-pl/ ', 'https://www.proxynova.com/proxy-server-list/country-ru/ ', 'https://www.proxynova.com/proxy-server-list/country-rs/ ', 'https://www.proxynova.com/proxy-server-list/country-kr/ ', 'https://www.proxynova.com/proxy-server-list/country-tw/ ', 'https://www.proxynova.com/proxy-server-list/country-th/ ', 'https://www.proxynova.com/proxy-server-list/country-ua/ ', 'https://www.proxynova.com/proxy-server-list/country-gb/ ', 'https://www.proxynova.com/proxy-server-list/country-us/ ', 'https://www.proxynova.com/proxy-server-list/country-ve/ ', 'https://www.proxynova.com/proxy-server-list/country-ir/ ', 'https://www.proxynova.com/proxy-server-list/country-tr/ ', 'https://www.proxynova.com/proxy-server-list/country-na/ ', 'https://www.proxynova.com/proxy-server-list/country-mz/ ', 'https://www.proxynova.com/proxy-server-list/country-it/ ', 'https://www.proxynova.com/proxy-server-list/country-eg/ ', 'https://www.proxynova.com/proxy-server-list/country-bg/'];
        let pageIndex = 0;
        let proxyFound = 0;
        proxies.bySource[scraperId] = [];


        function loadPage() {

            let page = pages[pageIndex++];
            browser.driver.get(page);

            console.log(scraperId + " Visiting... " + page);
            browser.driver.findElement(by.tagName('tbody')).findElements(by.tagName('tr')).then((data) => {
                data.forEach(row => {
                    row.findElements(by.tagName('td')).then((col) => {
                        if (col[1] != undefined) {
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
                                proxies.bySource[scraperId].push(proxy);
                                if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                                proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                                proxyFound++;
                            })
                                .catch((err) => {
                                    console.log("Exception Occured! in " + scraperId, err.stack);
                                })
                        }
                    });
                });
            }).then(() => {
                if (pageIndex < pages.length) {
                    loadPage();
                } else {
                    console.log(`Got ${proxyFound} proxies from ${scraperId}`);
                }
            }).catch((err) => {
                console.log("Exception Occured! in " + scraperId, err.stack);
            });
        }

        loadPage();

    });

    it('US-proxy.org Scraper', function () {

        let scraperId = 'usproxy';
        var pages = ['https://free-proxy-list.net/ ', 'https://www.socks-proxy.net/', 'https://www.us-proxy.org/', 'https://free-proxy-list.net/uk-proxy.html', 'https://www.sslproxies.org/', 'https://free-proxy-list.net/anonymous-proxy.html'];
        let pageIndex = 0;
        let proxyFound = 0;
        proxies.bySource[scraperId] = [];


        function loadPage() {

            let page = pages[pageIndex++];
            browser.driver.get(page);

            console.log(scraperId + " Visiting... " + page);
            browser.driver.findElement(by.className('table-responsive fpl-list')).findElements(by.tagName('tr')).then((rows) => {
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
                                cols[4].getText().then((text) => {
                                    proxy.country = text;
                                })
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.anonymity = text;
                                })
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.type = 'HTTP/HTTPS';
                                })
                            }).then(() => {
                                proxies.bySource[scraperId].push(proxy);
                                if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                                proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                                proxyFound++;
                            }).catch((err) => {
                                console.log("Exception Occured! in " + scraperId, err);
                            })
                        }
                    })
                });

            }).then(() => {
                if (pageIndex < pages.length) {
                    loadPage();
                } else {
                    console.log(`Got ${proxyFound} proxies from ${scraperId}`);
                }
            }).catch((err) => {
                console.log("Exception Occured! in " + scraperId, err.stack);
            });
        }

        loadPage();

    });

    it('openproxy.space Scraper', function () {

        try {
            let scraperId = 'openproxy';
            let pages = ['https://openproxy.space/list/http'];
            let pageIndex = 0;
            let proxyFound = 0;
            proxies.bySource[scraperId] = [];


            function loadPage() {

                let page = pages[pageIndex++];
                browser.driver.get(page);

                console.log(scraperId + " Visiting... " + page);
                browser.driver.executeScript('return __NUXT__').then(d => {
                    let proxyList = d.data[0].data;
                    proxyList.forEach(country => {
                        country.items.forEach(proxyItem => {
                            var proxy = new Object();
                            proxy.country = getName(country.code);
                            proxy.ip = proxyItem.split(':')[0];
                            proxy.port = proxyItem.split(':')[1];
                            proxy.type = 'unknown';
                            proxy.anonymity = 'unknown';
                            proxyFound++;
                            proxies.bySource[scraperId].push(proxy);
                            if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                            proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                        });
                    })
                    console.log(`Got ${proxyFound} proxies from ${scraperId}`);
                }).catch((error) => {
                    console.log("Exception Occured! in " + scraperId, error.stack);
                })
            }

            loadPage();
        } catch (error) {
            console.log("Exception Occured! in " + scraperId, error.stack);
        }

    });

    /*it('proxyscan.io Scraper', function () {

        let scraperId = 'proxyscan';
        let pages = ['https://www.proxyscan.io/'];
        let pageIndex = 0;
        let proxyFound = 0;
        proxies.bySource[scraperId] = [];


        function loadPage() {

            let page = pages[pageIndex++];
            browser.driver.get(page);

            console.log(scraperId + " Visiting... " + page);
            browser.driver.executeScript('window.scrollBy(0,document.body.scrollHeight)')
            browser.driver.sleep(5000);
            browser.driver.executeScript('window.scrollBy(0,document.body.scrollHeight)')
            browser.driver.sleep(5000);
            browser.driver.executeScript('window.scrollBy(0,document.body.scrollHeight)')
            browser.driver.sleep(5000);

            browser.driver.findElement(by.id('loadPage')).findElements(by.tagName('tr')).then((rows) => {
                rows.forEach(row => {
                    proxyFound++;
                    var proxy = new Object();
                    row.findElements(by.tagName('th')).then((cols) => {
                        if (cols.length > 0) {
                            cols[0].getText().then((text) => {
                                proxy.ip = text;
                            })
                        }
                    });
                    row.findElements(by.tagName('td')).then((cols) => {
                        if (cols.length > 0) {
                            cols[1].getText().then((text) => {
                                //proxy.ip = text;
                            }).then(() => {
                                cols[0].getText().then((text) => {
                                    proxy.port = text;
                                })
                            }).then(() => {
                                cols[1].getText().then((text) => {
                                    proxy.country = text;
                                })
                            }).then(() => {
                                cols[3].getText().then((text) => {
                                    proxy.type = text;
                                })
                            }).then(() => {
                                cols[4].getText().then((text) => {
                                    proxy.anonymity = text;
                                })
                            }).then(() => {
                                proxies.bySource[scraperId].push(proxy);
                                if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                                proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                                proxyFound++;
                            }).catch((err) => {
                                console.log("Exception Occured! in " + scraperId, err);
                            })
                        }
                    })
                });

            }).then(() => {
                if (pageIndex < pages.length) {
                    loadPage();
                } else {
                    console.log(`Got ${proxyFound} proxies from ${scraperId}`);
                }
            }).catch((err) => {
                console.log("Exception Occured! in " + scraperId, err.stack);
            });
        }

        try {
            loadPage();
        } catch (error) {
            console.log(error);
        }

    });*/

    it('freeproxy.world Scraper', function () {

        let scraperId = 'freeproxy';
        let pages = [];
        for (let i = 0; i <= 50; i++) {
            pages.push("https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=" + i);
        }
        let pageIndex = 0;
        let proxyFound = 0;
        proxies.bySource[scraperId] = [];


        function loadPage() {

            let page = pages[pageIndex++];
            browser.driver.get(page);

            console.log(scraperId + " Visiting... " + page);
            browser.driver.findElement(by.tagName('tbody')).findElements(by.tagName('tr')).then((rows) => {
                rows.forEach(row => {
                    try {
                        var proxy = new Object();
                        row.findElements(by.tagName('td')).then((cols) => {
                            if (cols.length > 3) {
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
                                    cols[5].getText().then((text) => {
                                        proxy.type = text;
                                    })
                                }).then(() => {
                                    cols[6].getText().then((text) => {
                                        proxy.anonymity = text;
                                    })
                                }).then(() => {
                                    proxies.bySource[scraperId].push(proxy);
                                    if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                                    proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                                    proxyFound++;
                                }).catch((err) => {
                                    console.log("Exception Occured! in " + scraperId, err);
                                })
                            }
                        })
                        proxyFound++;
                    } catch (error) {
                        console.log("Exception Occured! in " + scraperId, error.stack);
                    }
                });

            }).then(() => {
                if (pageIndex < pages.length) {
                    loadPage();
                } else {
                    console.log(`Got ${proxyFound} proxies from ${scraperId}`);
                }
            }).catch((err) => {
                console.log("Exception Occured! in " + scraperId, err.stack);
            });
        }

        loadPage();

    });

    it('geonode.com Scraper', function () {

        let scraperId = 'geonode';
        let pages = ['https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc&filterLastChecked=60'];
        let pageIndex = 0;
        let proxyFound = 0;
        proxies.bySource[scraperId] = [];


        function loadPage() {

            let page = pages[pageIndex++];
            browser.driver.get(page);

            console.log(scraperId + " Visiting... " + page);
            browser.driver.executeScript('return document.getElementsByTagName("body")[0].innerText').then(d => {
                try {
                    let proxyList = JSON.parse(d).data;
                    proxyList.forEach(proxyItem => {
                        var proxy = new Object();
                        proxy.country = getName(proxyItem.country);
                        proxy.ip = proxyItem.ip;
                        proxy.port = proxyItem.port;
                        proxy.type = proxyItem.protocols.join(" | ");
                        proxy.anonymity = proxyItem.anonymityLevel;
                        proxyFound++;
                        proxies.bySource[scraperId].push(proxy);
                        if (proxies.byType[getTypeMapping(proxy.type)] == undefined) proxies.byType[getTypeMapping(proxy.type)] = [];
                        proxies.byType[getTypeMapping(proxy.type)].push(proxy);
                    });
                } catch (error) {
                    console.log('Error occured in ' + scraperId, error);
                }
            })
        }

        loadPage();

    });

    it('Save', function () {

        //RAW JSON
        fs.writeFile('generated/raw.json', JSON.stringify(proxies, null, 2), function (err, data) {
            console.log("Successfully saved raw.json");
        });

        //Proxies Array
        let jsonArray = [];
        Object.keys(proxies.bySource).forEach(element => {
            if (Array.isArray(proxies.bySource[element])) {
                proxies.bySource[element].forEach(item => {
                    jsonArray.push(item);
                    saveIntoDb(item);
                });
            }
        });

        //Save as file by format - 5 files
        fs.writeFile('proxies.csv', getCSV(jsonArray).join('\n'), function (err, data) {
            console.log("Successfully saved proxies.csv");
        });
        fs.writeFile('proxies.json', JSON.stringify(jsonArray, null, 2), function (err, data) {
            console.log("Successfully saved proxies.json");
        });
        fs.writeFile('proxies.txt', getTXT(jsonArray).join('\n'), function (err, data) {
            console.log("Successfully saved proxies.txt");
        });
        fs.writeFile('proxies.yaml', YAML.stringify(jsonArray), function (err, data) {
            console.log("Successfully saved proxies.yaml");
        });
        fs.writeFile('proxies.xml', js2xml.js2xml(jsonArray, { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
            console.log("Successfully saved proxies.xml");
        });


        //Save as file by type - 15 files
        //SOCKS5
        fs.writeFile('generated/socks5_proxies.csv', getCSV(proxies.byType.socks5).join('\n'), function (err, data) {
            console.log("Successfully saved socks5_proxies.csv");
        });
        fs.writeFile('generated/socks5_proxies.json', JSON.stringify(proxies.byType.socks5, null, 2), function (err, data) {
            console.log("Successfully saved socks5_proxies.json");
        });
        fs.writeFile('generated/socks5_proxies.txt', getTXT(proxies.byType.socks5).join('\n'), function (err, data) {
            console.log("Successfully saved socks5_proxies.txt");
        });
        fs.writeFile('generated/socks5_proxies.yaml', YAML.stringify(proxies.byType.socks5), function (err, data) {
            console.log("Successfully saved socks5_proxies.yaml");
        });
        fs.writeFile('generated/socks5_proxies.xml', js2xml.js2xml(proxies.byType.socks5, { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
            console.log("Successfully saved socks5_proxies.xml");
        });
        //SOCKS4
        fs.writeFile('generated/socks4_proxies.csv', getCSV(proxies.byType.socks4).join('\n'), function (err, data) {
            console.log("Successfully saved socks4_proxies.csv");
        });
        fs.writeFile('generated/socks4_proxies.json', JSON.stringify(proxies.byType.socks4, null, 2), function (err, data) {
            console.log("Successfully saved socks4_proxies.json");
        });
        fs.writeFile('generated/socks4_proxies.txt', getTXT(proxies.byType.socks4).join('\n'), function (err, data) {
            console.log("Successfully saved socks4_proxies.txt");
        });
        fs.writeFile('generated/socks4_proxies.yaml', YAML.stringify(proxies.byType.socks4), function (err, data) {
            console.log("Successfully saved socks4_proxies.yaml");
        });
        fs.writeFile('generated/socks4_proxies.xml', js2xml.js2xml(proxies.byType.socks4, { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
            console.log("Successfully saved socks4_proxies.xml");
        });
        //HTTP
        fs.writeFile('generated/http_proxies.csv', getCSV(proxies.byType.http).join('\n'), function (err, data) {
            console.log("Successfully saved http_proxies.csv");
        });
        fs.writeFile('generated/http_proxies.json', JSON.stringify(proxies.byType.http, null, 2), function (err, data) {
            console.log("Successfully saved http_proxies.json");
        });
        fs.writeFile('generated/http_proxies.txt', getTXT(proxies.byType.http).join('\n'), function (err, data) {
            console.log("Successfully saved http_proxies.txt");
        });
        fs.writeFile('generated/http_proxies.yaml', YAML.stringify(proxies.byType.http), function (err, data) {
            console.log("Successfully saved http_proxies.yaml");
        });
        fs.writeFile('generated/http_proxies.xml', js2xml.js2xml(proxies.byType.http, { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
            console.log("Successfully saved http_proxies.xml");
        });

        //Update README.md
        if(jsonArray.length > 100) {
            let README = fs.readFileSync('README.md', 'utf-8');
            let dynamicLine = README.substring(README.indexOf('<!-- dynamic-count-start -->') + 29, README.indexOf('<!-- dynamic-count-end -->') - 1);
            README = README.replace(dynamicLine, '## Current Proxy Count: ' + (Math.floor(jsonArray.length/100)*100) + '+ 🚀');
            fs.writeFileSync('README.md', README);
        }

    })

    function getTypeMapping(proxyType) {
        if (['HTTP/HTTPS', 'unknown', 'HTTPS', 'HTTP'].includes(proxyType)) {
            return 'http';
        } else if(['SOCKS5,SOCKS4'].includes(proxyType)) {
            return ' socks5'
        } else if(['SOCKS4'].includes(proxyType)) {
            return ' socks4'
        } else if(['SOCKS5'].includes(proxyType)) {
            return ' socks5'
        } else {
            return proxyType;
        }
    }

    function getCSV(jsonArray) {
        let csvContent = [];
        jsonArray.forEach(item => {
            let values = [item.ip, item.port, item.country, item.anonymity, item.type];
            csvContent.push(values.join(','));
        })
        return csvContent;
    }

    function getTXT(jsonArray) {
        let txtContent = [];
        jsonArray.forEach(item => {
            let values = [item.ip, item.port];
            txtContent.push(values.join(':'));
        })
        return txtContent;
    }

    function saveIntoDb(proxy) {
        if (!config.SAVE_TO_DB) return;
        var sql = "INSERT into proxies_tb (`proxy`,`port`,`country`,`type`,`anonymity`) VALUES('" + proxy.ip + "'," + proxy.port + ",'" + proxy.country + "','" + proxy.type + "','" + proxy.anonymity + "')";
        db.query(sql, (err, result) => {
            if (err) console.log(err)
        })
    }
});
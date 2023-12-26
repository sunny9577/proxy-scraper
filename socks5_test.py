# Imports
import requests
import random
import time
from tabulate import tabulate

# A list of websites to test the proxies with
websites = ["https://icanhazip.com", "https://eset.com"]

# A flag to indicate if a working proxy is found
found = False

# A list to store the results for printing
results = []

# Socks5 Proxy Source
myUrl = "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/socks5_proxies.txt"

# A function to test a proxy with a given website and return the response code and latency
def test_proxy(proxy, website):
    try:
        start = time.time()
        response = requests.get(website, proxies={"http": "socks5://" + proxy, "https": "socks5://" + proxy}, timeout=5)
        end = time.time()
        return response.status_code, end - start
    except:
        return None, None

# A function to save a working proxy to a file
def save_proxy(proxy):
    with open("PROXY.txt", "w") as f:
        f.write(proxy)

# Try to read the working proxy from the file if it exists
try:
    with open("PROXY.txt", "r") as f:
        proxy = f.read().strip()
        print(f"\nTesting last known proxy {proxy} ...")
        # Test the proxy with each website and store the results
        for website in websites:
            code, latency = test_proxy(proxy, website)
            results.append([proxy, website, code, latency])
        # Check if the proxy works for all websites
        if all(code == 200 for proxy, website, code, latency in results):
            print(f"Found a working proxy: {proxy}")
            found = True
        else:
            print(f"Proxy {proxy} does not work for all websites")
except FileNotFoundError:
    # print("No PROXY.txt file found")
    print("")

# If no working proxy is found from the file, try to get one from the url
if not found:
    # Get the list of socks5 proxies from the url
    url = myUrl
    response = requests.get(url)
    proxies = response.text.splitlines()

    # Shuffle the proxies to pick a random one
    random.shuffle(proxies)

    # Loop through the proxies until a working one is found or the list is exhausted
    for proxy in proxies:
        print(f"\nTesting {proxy} please wait ...")
        # Test the proxy with each website and store the results
        results = []
        for website in websites:
            code, latency = test_proxy(proxy, website)
            results.append([proxy, website, code, latency])
        # Check if the proxy works for all websites
        if all(code == 200 for proxy, website, code, latency in results):
            print(f"Found a working proxy: {proxy}")
            save_proxy(proxy)
            found = True
            break
        else:
            print(f"Proxy {proxy} is not working ...")

# If a working proxy is found, print the results in a table format
if found:
    headers = ["PROXY", "WEBSITE", "RESPONSE CODE", "LATENCY IN SEC"]
    print(tabulate(results, headers=headers, tablefmt="pretty"))
else:
    print("No working proxy found")

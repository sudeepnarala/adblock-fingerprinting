import csv, json, bs4, requests, os
from concurrent.futures import ThreadPoolExecutor, as_completed

WEBSITES_CSV_PATH = os.path.split(os.path.dirname(__file__))[0] + '../top10milliondomains.csv'
WEBSITES_JSON_PATH = os.path.split(os.path.dirname(__file__))[0] + 'website_list.json'
NUM_WEBSITES = 1000

def load_url(url):
    print(f'Fetching {url}')
    r = None
    try:
        r = requests.get(url, timeout=5)
    except TimeoutError:
        print(f'Fetching {url} timed out')
    except ConnectionError:
        print(f'Error connecting to {url}')
    finally:
        print(f'Finished fetching {url}')
        return r
        


websites = []
# with open(WEBSITES_CSV_PATH) as csv_file:
#     csv_reader = csv.reader(csv_file)
#     next(csv_reader)
#     for i, row in enumerate(csv_reader):
#         if i == NUM_WEBSITES:
#             break
#         websites.append(f'http://{row[1]}')

with open(WEBSITES_JSON_PATH) as json_file:
    data = json.load(json_file)
    websites = list(map(lambda webObj: webObj['url'], data['websites']))
print('Finished compiling websites list')
    
with ThreadPoolExecutor() as executor:
    futures = {executor.submit(load_url, url): url for url in websites}
    admiral_instances = {}
    for future in as_completed(futures):
        response = future.result()
        if not response:
            continue
        url = futures[future]
        print(f'Processing {url}')
        if response.status_code != requests.codes.ok:
            print(f'Website {url} returned response with status code {response.status_code}')
            continue
        soup = bs4.BeautifulSoup(response.text, 'html.parser')
        tags = soup.find_all(lambda tag: len(tag.find_all()) == 0 and "admiral" in tag.text)
        if tags:
            admiral_instances[url] = tags
            print(url, tags)

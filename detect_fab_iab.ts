import fs from 'fs';
import { parse } from 'csv-parse';
import puppeteer, { Browser } from "puppeteer";

const website_csv_path = 'website_list.csv';

async function run() {
  let adblock_path : string = "extensions/adblock"; 
  let browser : Browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${adblock_path}`,
                `--load-extension=${adblock_path}`,
                '--no-sandbox'
            ]
  })
  let urls : Array<string> = [];
  fs.createReadStream(website_csv_path)
    .pipe(parse({ delimiter: ",", from_line: 2}))
    .on("data", (row : [string, string, string]) => {
      const domain = row[1];
      const url = `http://${domain}`;
      urls.push(url);
    })
    .on("error", (error: { message: any; }) => { 
      console.log(error.message);
    }).on("end", async () => {
      for (const url of urls) {
	 var page = await browser.newPage()
	 var found = false
	 const res = await Promise.race([(async (page)=> {
		await page.evaluateOnNewDocument(() => {

// This works
var wrapper = function(func) {
    return (...args) => {
        var element = func(...args)
        let observer = new MutationObserver(function(mutations) {
            for(let mutation of mutations) {
		// @ts-ignore
                if(mutation.target.className === "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links") {
                    found = true
                }
            }
        })
        var config = { attributes: true, attributeFilter: ["class"] };
        observer.observe(element, config);
        return element
    }
}

document.createElement = wrapper(document.createElement.bind(document))

		})
	 	await page.goto(url, {waitUntil: 'networkidle0'})
	 	const ret = await page.evaluate(() => {return found}) 
		console.log(ret)
		if(ret) {
	    		fs.appendFileSync("fab_iab.txt", `${url}, `)
	 	}
		else {
			console.log("FAB/IAB not detected")
		}
		return 1
	 })(page)
	,
        new Promise((resolve) => {
          setTimeout(resolve, 20000, 2);
        })
      ]
    ).catch(() => console.log("Some issue with "+url));
    if(res == 1) {
    	console.log("Finished page "+url)
    } else {
    	console.log("Timeout on page "+url)
    }
    // No matter what, close page
    await page.close()
    console.log("Closed page")
  }
  })
}

if (require.main === module) {
    run()
}

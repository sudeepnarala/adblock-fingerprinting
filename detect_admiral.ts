import fs from 'fs';
import { parse } from 'csv-parse';
import puppeteer, { Browser } from "puppeteer";

const website_csv_path = 'website_list.csv';

async function run() {
  let adblock_path : string = "extensions/adblock"; 
  let browser : Browser = await puppeteer.launch({
            headless: false,
//	    executablePath: "/home/mount/adblock/visiblev8_ads/chromium/src/out/Builder/chrome",
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
	 const res = await Promise.race([(async (page)=> {
	 	await page.goto(url, {waitUntil: 'networkidle0'})
	 	if (await page.evaluate(() => {return window.localStorage.v4ac1eiZr0})) {
	    		fs.appendFileSync("websites_with_admiral.txt", `${url}, `)
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

import fs from 'fs';
import { parse } from 'csv-parse';
import AdmiralDetector from './detector/admiral';
import puppeteer from 'puppeteer';

const website_csv_path = 'website_list.csv';

// async function run() {
//   let urls : Array<string> = [];
//   fs.createReadStream(website_csv_path)
//     .pipe(parse({ delimiter: ",", from_line: 2}))
//     .on("data", (row : [string, string, string]) => {
//       const domain = row[1];
//       const url = `http://${domain}`;
//       urls.push(url);
//     })
//     .on("error", (error: { message: any; }) => { 
//       console.log(error.message);
//     })
//     .on("end", async () => {
//       for (const url of urls) {
//         const detectors : Array<Detector> = [ new AdmiralDetector(url) ];
//         const results = await Promise.all(detectors.map(async (d) => {
//           try {
//             return await d.detect();
//           } catch (e) {
//             // if (e instanceof TimeoutError)
//               return null;
//             // else
//             //   throw e;
//           }
//         }));
//         console.log(url, results);
//       }
//     });
// }

async function run() {
  const adblock_path = "extensions/adblock";
  const browser = await puppeteer.launch({
    headless: false,
    args: [
        `--disable-extensions-except=${adblock_path}`,
        `--load-extension=${adblock_path}`,
        '--no-sandbox'
    ]
  });

  // Timeout is being used to ensure adblock installs before page load
  setTimeout(async () => {
    const page = await browser.newPage();
    await page.goto("https://cnbc.com", {waitUntil: 'networkidle0'});
    
    const beforeCookies = await page.cookies();
    console.log("Before cookies");
    console.log(beforeCookies);

    // Inspect DOM of desired website to figure out the selector of the button to be clicked
    await page.click('._4ao5eF8B');
    await page.reload({waitUntil: 'load'});

    const afterCookies = await page.cookies();
    console.log("After cookies");
    console.log(afterCookies);
  }, 5000)
}

if (require.main === module) {
    run()
}
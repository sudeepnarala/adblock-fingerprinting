import fs from 'fs';
import { parse } from 'csv-parse';
import AdmiralDetector from './detector/admiral';
import Detector from './detector/detector';
import { TimeoutError } from 'puppeteer';

const website_csv_path = 'website_list.csv';

async function run() {
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
    })
    .on("end", async () => {
      for (const url of urls) {
        const detectors : Array<Detector> = [ new AdmiralDetector(url) ];
        const results = await Promise.all(detectors.map(async (d) => {
          try {
            return await d.detect();
          } catch (e) {
            // if (e instanceof TimeoutError)
              return null;
            // else
            //   throw e;
          }
        }));
        console.log(url, results);
      }
    });
}

if (require.main === module) {
    run()
}
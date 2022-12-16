import fs from 'fs';
import { parse } from 'csv-parse';
import { Detector, Features } from './detector/detector';
import AdmiralDetector from './detector/admiral';

const website_csv_path = 'website_list.csv_';

async function run() {
  let urls : Array<string> = [];
  // let feature_collection : Array<Features> = [];
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
        const detector : Detector = new AdmiralDetector(url);
        await Promise.race([
          detector.detect().then((detected : Boolean) => {
            console.log(url, detected);
            // fs.appendFileSync("first_day_data.csv", `${url},${features.not_scrollable},${features.ad_word_present},${features.block_word_present},${features.continue_word_present},${features.whitelist_word_present},${features.ad_id},${features.block_id},${features.continue_id},${features.whitelist_id}\n`)
            return undefined;
          })
          .catch((error) => {
            fs.appendFileSync("problems.txt", `${url}, `)
          }), 
          new Promise((resolve) => {
            setTimeout(resolve, 10000);
          }).then(() => {
            fs.appendFileSync("problems.txt", `${url}, `)
          })
        ])
      }
    });
}

if (require.main === module) {
    run()
}

import fs from 'fs';
import { parse } from 'csv-parse';
import AdmiralDetector from './detector/admiral';
import Detector from './detector/detector';

const website_csv_path = 'website_list.csv';

async function run() {
    fs.createReadStream(website_csv_path)
      .pipe(parse({ delimiter: ",", from_line: 2}))
      .on("data", (row : [string, string, string]) => {
        const url = row[1];
        const detectors : Array<Detector> = [ new AdmiralDetector(url) ];
        const results = detectors.map((d) => d.detect());
        console.log(url, results);
      })
      .on("error", (error: { message: any; }) => { 
        console.log(error.message);
      });
}

if (require.main === module) {
    run()
}
import {Detector} from "./detector";

export default class AdmiralDetector extends Detector {
    private static admiral_url = 'npttech.com';

    protected async detect_internal() : Promise<Boolean> {
        const page = await Detector.browser.newPage();
        await page.goto(this.url, {waitUntil: 'networkidle0'});
        const html = await page.mainFrame().content();
        page.close();
        return html?.indexOf(AdmiralDetector.admiral_url) != -1;
    }
}
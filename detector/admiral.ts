import Detector from "./detector";

export default class AdmiralDetector extends Detector {
    private static admiral_url = 'https://getadmiral.com/pb';

    protected async detect_internal() : Promise<Boolean> {
        const page = await Detector.browser.newPage();
        const response = await page.goto(this.url, {waitUntil: 'networkidle0'});
        const html = await response?.text();
        return html?.indexOf(AdmiralDetector.admiral_url) != -1;
    }
}
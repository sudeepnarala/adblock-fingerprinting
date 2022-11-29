import Detector from "./detector"

class FABDetector extends Detector {
    constructor(url) {
        super(url)
    }
    async detect_internal() : Promise<Boolean> {
        return false
    }
}
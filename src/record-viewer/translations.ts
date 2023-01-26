import { locales } from "./config"

const translation = {}

for (let l of locales) {
    translation[l] = require(`./locale/${l}.json`)
}

export default translation
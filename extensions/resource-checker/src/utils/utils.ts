import { readFileSync } from "fs-extra";
import { join } from "path";

export function loadCSS(files: string[]) {
    let css = ""
    for (const file of files) {
        css += readFileSync(file, 'utf-8')
    }

    return css
}

export function loadJS(file: string) {
    let scriptElement = document.createElement('script')
    scriptElement.setAttribute('type', 'text/javascript')
    scriptElement.setAttribute('src', file)
    document.body.appendChild(scriptElement)
}


export function __ASSET__(path: string) {
    return __PLUGIN_PATH__ + `/assets/${path}`
}

export function __ROOT__(path: string) {
    return __PLUGIN_PATH__ + `/${path}`
}   
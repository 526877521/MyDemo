import { readFileSync } from "fs";
import { join } from "path";

const fileContent = readFileSync(join(__filename, "../../package.json"))
const PackageJSON = JSON.parse(fileContent.toString())
const __PLUGIN_PATH__ = Editor.Project.path + `/extensions/${PackageJSON.name}`
//@ts-ignore
globalThis.__PLUGIN_PATH__ = __PLUGIN_PATH__
//@ts-ignore
globalThis.PackageJSON = PackageJSON

/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(PackageJSON.name);
    },
    openHeapPanel() {
        Editor.Panel.open(PackageJSON.name + ".heap");
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() { }

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }

console.log(`[vite-plugin-vue3] loaded`);

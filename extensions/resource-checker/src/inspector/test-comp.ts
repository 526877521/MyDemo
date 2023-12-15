'use strict';
//@ts-ignore
import packageJSON from '../../package.json';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp, App} from 'vue';

type Selector<$> = { $: Record<keyof $, any | null> }
const weakMap = new WeakMap<any, App>();

export const template = `
<ui-prop type="dump" id="value"></ui-prop>
<ui-prop type="dump" id="value2"></ui-prop>
<div id="app" width="100%" height="100%">
</div>
`;

export const style = readFileSync(join(__dirname, '../../static/style/default/index.css'), 'utf-8');

import appTpl from './test-comp.vue';

export const $ = {
    app: '#app',
    value: '#value',
    value2: '#value2',
};

type PanelThis = Selector<typeof $> & { dump: any };

export const methods = {
};

export function update(this: PanelThis, dump: any) {
    this.dump = dump;
    this.$.value.render(dump.value.value);
    this.$.value2.render(dump.value.value2);
}

export function ready(this: PanelThis) {
    if (this.$.app) {
        const app = createApp(appTpl);
        
        app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
        
        app.mount(this.$.app);
        
        weakMap.set(this, app);
    }
}

export function close(this: PanelThis) {

};
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { findTextures } from '../../utils/find-texture';
import {BaseVirtualList} from '../../plugins/base-virtual-list';

const sizeSelect = ref(null)
const dir = ref('')
const assets = ref([])
const slider = ref(null)
const content = ref(null)
const height = ref(100)
const filter = ref("")

async function onCheckClick() {
    calcSliderHeight()

    assets.value = []
    let sizeIdx = sizeSelect.value.value
    let imgs = await findTextures(dir.value, [256, 512, 1024, 2048][sizeIdx - 1])
    assets.value = imgs
}

function onMounted() {
    calcSliderHeight()
    document.onresize = () => {
        calcSliderHeight()
    }
}

function calcSliderHeight() {
    height.value = document.body.clientHeight - content.value.clientHeight - 120   
}

function onAssetClick(img: any) {
    Editor.Message.send('assets', 'twinkle', img.uuid);
}

const finalAssets = computed(() => {
    if(!filter.value) {
        return assets.value;
    }

    let fstr = filter.value.toLowerCase();
    return assets.value.filter((item) => {
        return item.name.toLowerCase().indexOf(fstr) >= 0 || item.uuid.toLowerCase().indexOf(fstr) >= 0
    });
});
</script>

<template>
    <div class="settings">
        <div class="content" ref="content">
            <div class="wrap">
                <ui-prop class="row">
                    <ui-label>Size</ui-label>
                    <ui-select value="3" ref="sizeSelect">
                        <option value="1">256</option>
                        <option value="2">512</option>
                        <option value="3">1024</option>
                        <option value="4">2048</option>
                    </ui-select>
                </ui-prop>
                <ui-prop class="row">
                    <ui-label>Path</ui-label>
                    <ui-input v-model="dir"></ui-input>
                </ui-prop>
                <ui-prop class="row">
                    <ui-button @confirm="onCheckClick">Check</ui-button>
                </ui-prop>
            </div>            
            <ui-input placeholder="search" v-model="filter"></ui-input>
        </div>
        <base-virtual-list :data="finalAssets" :height="height" ref="slider" class="slider" :itemHeight="30">
            <template #default="{ item }">
                <div @click="onAssetClick(item)" style="height:30px">
                    <!-- <img :src="item.file" class="image-icon" @click="onAssetClick(item)"/> -->
                    <ui-label class="selectable">{{ item.name }}</ui-label>
                    <ui-label class="selectable">{{ item.width }}x{{ item.height }}</ui-label>
                    <ui-label class="selectable">{{ item.uuid }}</ui-label>
                </div>
            </template>
        </base-virtual-list>
    </div>
</template>
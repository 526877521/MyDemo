<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import * as fs from 'fs'
var parser = require('heapsnapshot-parser');
import {BaseVirtualList} from '../../plugins/base-virtual-list';

const file = ref("")
const assets = ref([])
const slider = ref(null)
const content = ref(null)
const height = ref(100)
const filter = ref("")

async function onCheckClick() {
    if(!file.value) {
        Editor.Dialog.warn('Please select a file first!');
        return;
    }

    calcSliderHeight()

    assets.value = []
    var snapshotFile = fs.readFileSync(file.value, {encoding: "utf-8"});
    var snapshot = parser.parse(snapshotFile);

    var nodes = (snapshot.nodes as []).sort(function(a: any, b: any) {
        return b.self_size - a.self_size;
    });

    var nodeToEdges: {[key: number]: any[]} = {};
    for (var i = 0; i < snapshot.edges.length; i++) {
        var edge = snapshot.edges[i];
        if (!edge.toNode || edge.type == "weak" || edge.type == "shortcut") {
            continue;
        }
        if (!nodeToEdges[edge.toNode.id]) {
            nodeToEdges[edge.toNode.id] = [];
        }
        nodeToEdges[edge.toNode.id].push(edge);
    }

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i] as any;
        if(node.type === "object") {
            // 查找cc对象
            if(node.name === "Object") {
                let assetManagerNode = findNodeByProperty(node, "assetManager");
                if(assetManagerNode) {
                    let assetNode = findNodeByProperty(assetManagerNode, "assets");
                    if(assetNode) {
                        let assetMap = findNodeByProperty(assetNode, "_map");
                        if(assetMap) {
                            let allAssetsNode = assetMap.references as any[];
                            let assetIds = {};
                            allAssetsNode.forEach(element => {
                                if(element.name.indexOf("@") < 0) {
                                    assetIds[element.name] = assetNode;
                                }
                                console.log(element.name);
                            });

                            let assetIdsArr = Object.keys(assetIds);
                            let dts = assetIdsArr.map(async (id) => {
                                let asset = await Editor.Message.request('asset-db', 'query-asset-info', id);
                                if(!asset) {
                                    return null
                                }
                                return {
                                    name: asset.name,
                                    uuid: asset.uuid,
                                    // size: calcRetainedSize(nodeToEdges, assetIds[id]),
                                }
                            });
                            let assetsArr = await Promise.all(dts);
                            assets.value = assetsArr.filter((item) => {
                                return item != null
                            });
                        }
                    }
                }
            }
        }
    }
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

function calcRetainedSize(nodeToEdges: {[key: number]: any[]}, node: any) {
    let size = 0;
    if(node) {
        let edges = nodeToEdges[node.id];
        if(edges) {
            edges.forEach((edge) => {
                size += edge.toNode.self_size;
            });
        }
    }
    return size;
}

function findNodeByProperty(node: any, property: string) {
    for (var i = 0; i < node.references.length; i++) {
        var ref = node.references[i];
        if(ref.type === "property" && ref.name == property) {
            return ref.toNode;
        }
    }
    return null;
}

function onMounted() {
    calcSliderHeight()
    document.onresize = () => {
        calcSliderHeight()
    }
}

async function onSelectFile() {
    const config: any = {};
    config.filters = [
        { name: 'HeapSnapshot', extensions: ['heapsnapshot'] },
    ];

    const data: any = await Editor.Dialog.select(config);
    if (data && data.filePaths && data.filePaths[0]) {
        file.value = data.filePaths[0]
    }
}

function calcSliderHeight() {
    height.value = document.body.clientHeight - content.value.clientHeight - 120
}

function onAssetClick(img: any) {
    Editor.Message.send('assets', 'twinkle', img.uuid);
}
</script>

<template>
    <div class="settings">
        <div class="content" ref="content">
            <div class="wrap">
                <ui-prop class="row">
                    <ui-label>Path</ui-label>
                    <ui-input v-model="file"></ui-input>
                    <ui-button @confirm="onSelectFile">Select</ui-button>
                </ui-prop>
                <ui-prop class="row">
                    <ui-button @confirm="onCheckClick">Check</ui-button>
                </ui-prop>
                <ui-input placeholder="search" v-model="filter"></ui-input>
            </div>
        </div>
        <base-virtual-list :data="finalAssets" :height="height" ref="slider" class="slider" :itemHeight="30">
            <template #default="{ item }">
                <div @click="onAssetClick(item)" style="height:30px">
                    <ui-label class="selectable">{{ item.name }}</ui-label>
                    <ui-label class="selectable">{{ item.uuid }}</ui-label>
                    <!-- <ui-label class="size">{{ item.size }}</ui-label> -->
                </div>
            </template>
        </base-virtual-list>
    </div>
</template>
<script>
export default {
    props: {
        asset: {
            type: Object,
            default: () => { }
        }
    },
    methods: {
        onAssetClick(asset) {
            Editor.Message.send('assets', 'twinkle', asset.uuid);
        }
    }
}
</script>

<template>
    <ui-prop class="row">
        <img :src="asset.file" class="image-icon" @click="onAssetClick(asset)" />
        <ui-label class="selectable">{{ asset.name }}</ui-label>
        <ui-label class="selectable">{{ asset.width }}x{{ asset.height }}</ui-label>
        <ui-label class="selectable">{{ asset.uuid }}</ui-label>
    </ui-prop>
</template>
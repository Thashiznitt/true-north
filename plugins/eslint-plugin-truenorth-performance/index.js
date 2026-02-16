const noScrollView = require('./rules/no-scrollview');
const enforceFlashList = require('./rules/enforce-flashlist');
const noRnImage = require('./rules/no-rn-image');
const enforceEstimatedItemSize = require('./rules/enforce-estimated-item-size');
const noInlineRenderItem = require('./rules/no-inline-renderitem');

module.exports = {
    rules: {
        'no-scrollview': noScrollView,
        'enforce-flashlist': enforceFlashList,
        'no-rn-image': noRnImage,
        'enforce-estimated-item-size': enforceEstimatedItemSize,
        'no-inline-renderitem': noInlineRenderItem,
    },
};

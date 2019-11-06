const SjMarkdownManager = require('../SjMarkdownManager');
const path = require('path');
const libraryGroupRootPath = path.resolve(__dirname, '../../../');

var HELP_LIB_VISNETWORKMAN = path.resolve(libraryGroupRootPath, './app/vis-networkman');



/** Exports **/
try {
    module.exports = exports = new SjMarkdownManager()
        .setAlias('vis-networkman')
        .setHome('vis-networkman/README')
        .setPublicDirRawFilesMap({
            'vis-networkman' : [
                // HELP_LIB_VISNETWORKMAN + '/src/js/*.js', HELP_LIB_VISNETWORKMAN + '/src/lib/vis/*.*'
                HELP_LIB_VISNETWORKMAN + '/src/js/vis-networkman.js',
                HELP_LIB_VISNETWORKMAN + '/src/lib/vis/vis-network.min.js',
                HELP_LIB_VISNETWORKMAN + '/src/lib/vis/vis-network.min.css'
            ],
        })
        .setLibraryNameMarkdownPathsMap({
            'vis-networkman' : [HELP_LIB_VISNETWORKMAN + '/doc/**/*.md'],
        })
        ;
} catch (e) {}
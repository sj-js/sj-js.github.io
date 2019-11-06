const SjMarkdownManager = require('../SjMarkdownManager');
const path = require('path');
const libraryGroupRootPath = path.resolve(__dirname, '../../../');

var CROSSMAN_DIR = path.resolve(libraryGroupRootPath, 'crossman');
var BOXMAN_DIR = path.resolve(libraryGroupRootPath, 'boxman');
var POPMAN_DIR = path.resolve(libraryGroupRootPath, 'popman');
var KEYMAN_DIR = path.resolve(libraryGroupRootPath, 'keyman');
var VARIABLEMAN_DIR = path.resolve(libraryGroupRootPath, 'variableman');
var TREEMAN_DIR = path.resolve(libraryGroupRootPath, 'treeman');
var STORAGEMAN_DIR = path.resolve(libraryGroupRootPath, 'storageman');
var SLIDEMAN_DIR = path.resolve(libraryGroupRootPath, 'slideman');
var PAINTMAN_DIR = path.resolve(libraryGroupRootPath, 'paintman');
var MENUMAN_DIR = path.resolve(libraryGroupRootPath, 'menuman');



/** Exports **/
try {
    module.exports = exports = new SjMarkdownManager()
        .setAlias('sj-js')
        .setHome('boxman/README')
        .setPublicDirRawFilesMap({
            crossman : [CROSSMAN_DIR + '/src/js/crossman.js'],
            boxman : [BOXMAN_DIR + '/src/js/boxman.js', BOXMAN_DIR + '/src/css/boxman.css'],
            popman : [POPMAN_DIR + '/src/js/popman.js'],
            keyman : [KEYMAN_DIR + '/src/js/keyman.js'],
            variableman : [VARIABLEMAN_DIR + '/src/js/variableman.js'],
        })
        .setLibraryNameMarkdownPathsMap({
            boxman : [BOXMAN_DIR + '/doc/**/*.md'],
            popman : [POPMAN_DIR + '/doc/**/*.md'],
            keyman : [KEYMAN_DIR + '/doc/**/*.md'],
            variableman : [VARIABLEMAN_DIR + '/doc/**/*.md'],
        })
        ;
} catch (e) {}
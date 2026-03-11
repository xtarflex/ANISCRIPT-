/**
 * AniScript v1.1.1
 * Main Entry Point
 */

import { compile } from './compiler/index.js';
import { initAnimateOnView } from './runtime/index.js';

export {
    compile,
    initAnimateOnView as init
};

export default {
    compile,
    init: initAnimateOnView
};

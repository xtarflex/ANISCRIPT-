/**
 * verify-release.js
 * Verifies that the package exports are working correctly.
 */

import { compile, init } from '../src/index.js';
import { compile as compileAlt } from '../src/compiler/index.js';
import { initAnimateOnView } from '../src/runtime/index.js';

console.log('--- AniScript Release Verification ---');

// Test 1: Main Exports
if (typeof compile === 'function' && typeof init === 'function') {
    console.log('✅ Main exports (compile, init) are present.');
} else {
    console.error('❌ Main exports are missing or invalid.');
    process.exit(1);
}

// Test 2: Compiler Entry Point
if (compileAlt && typeof compileAlt === 'function') {
    console.log('✅ Compiler direct export is working.');
} else {
    console.error('❌ Compiler direct export is missing.');
    process.exit(1);
}

// Test 3: Runtime Entry Point
if (initAnimateOnView && typeof initAnimateOnView === 'function') {
    console.log('✅ Runtime direct export is working.');
} else {
    console.error('❌ Runtime direct export is missing.');
    process.exit(1);
}

// Test 4: Compilation smoke test
const sample = ':: fade-up :: { test }';
const html = compile(sample);
if (html.includes('data-ani="fade-up"') && html.includes('test')) {
    console.log('✅ Compiler smoke test passed.');
} else {
    console.error('❌ Compiler smoke test failed.');
    console.log('Output:', html);
    process.exit(1);
}

console.log('\n🎉 All release verifications passed!');

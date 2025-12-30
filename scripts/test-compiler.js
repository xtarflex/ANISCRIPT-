import fs from 'fs';
import path from 'path';
import { compile } from '../src/compiler/index.js';

const fixturesPath = path.resolve('tests/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('Running Compiler Tests...\n');

const results = [];
fixtures.forEach((test, index) => {
    try {
        const result = compile(test.input);
        if (test.expected_error) {
            failed++;
            results.push({ index, name: test.name, status: 'FAIL', expected_error: test.expected_error, got: result });
        } else if (result.trim() === test.expected.trim()) {
            passed++;
            results.push({ index, name: test.name, status: 'PASS' });
        } else {
            failed++;
            results.push({ index, name: test.name, status: 'FAIL', expected: test.expected, got: result });
        }
    } catch (err) {
        if (test.expected_error && err.message.includes(test.expected_error)) {
            passed++;
            results.push({ index, name: test.name, status: 'PASS', note: 'Caught expected error' });
        } else {
            failed++;
            results.push({ index, name: test.name, status: 'FAIL', error: err.message });
        }
    }
});

const resultsPath = path.resolve('test_results.json');
fs.writeFileSync(resultsPath, JSON.stringify({ passed, failed, total: fixtures.length, results }, null, 2));
console.log(`\nTests: ${passed} passed, ${failed} failed, ${fixtures.length} total`);
console.log(`Detailed results written to ${resultsPath}`);

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}

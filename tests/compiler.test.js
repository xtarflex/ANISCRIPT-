import fs from 'fs';
import path from 'path';
import { compile } from '../src/compiler/index.js';

const fixturesPath = path.resolve('tests/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

describe('AniScript Compiler', () => {
    test.each(fixtures)('$name', (fixture) => {
        if (fixture.expected_error) {
            expect(() => compile(fixture.input)).toThrow(fixture.expected_error);
        } else {
            const result = compile(fixture.input);
            expect(result.trim()).toBe(fixture.expected.trim());
        }
    });
});

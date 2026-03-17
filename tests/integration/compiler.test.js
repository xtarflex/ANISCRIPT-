import fs from 'fs';
import path from 'path';
import { compile } from '../src/compiler/index.js';
import { Parser } from '../src/compiler/parser.js';

const fixturesPath = path.resolve('tests/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

describe('AniScript Compiler', () => {
    test.each(fixtures)('$name', (fixture) => {
        if (fixture.expected_error) {
            expect(() => compile(fixture.input, { strict: true })).toThrow(fixture.expected_error);
        } else {
            const result = compile(fixture.input);
            expect(result.trim()).toBe(fixture.expected.trim());
        }
    });
});

describe('AniScript Compiler Error Handling', () => {
    test('XSS Payload in Error Message is Escaped', () => {
        // Since standard parser errors might not reflect the full payload verbatim,
        // we can force an error inside the parser to test the catch block's escaping.
        const originalParse = Parser.prototype.parse;
        Parser.prototype.parse = function() {
            throw new Error("<script>alert('xss')</script>");
        };

        const result = compile("dummy input");

        // Restore
        Parser.prototype.parse = originalParse;

        expect(result).not.toContain("<script>alert('xss')</script>");
        expect(result).toContain("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
    });

    test('Strict mode throws instead of returning HTML', () => {
        const input = ":: fade-up :: { <script>alert('xss')</script>";
        expect(() => compile(input, { strict: true })).toThrow("Syntax Error: Unclosed content block");
    });
});

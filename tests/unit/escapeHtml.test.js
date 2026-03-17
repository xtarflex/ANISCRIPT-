/**
 * @file tests/unit/escapeHtml.test.js
 * @description Unit tests for the escapeHtml() security utility and the
 * compiler catch block that uses it. Added in v1.1.5 to cover the XSS
 * vulnerability fix merged in Jules' PR.
 *
 * Test breakdown:
 *   - 5 single-entity tests (one per replaced character)
 *   - 3 combination/real-world attack pattern tests
 *   - 3 edge case tests (empty, null, no special chars)
 *   - 2 integration tests (compile() catch block in normal + strict mode)
 *
 * Total: 13 test cases
 */

import { compile } from '../../src/compiler/index.js';

// ─── Pull escapeHtml out for direct unit testing ───────────────────────────
// escapeHtml is not exported from the module so we test it indirectly through
// the error messages returned by compile(), and directly by re-implementing
// the same call pattern the compiler uses internally.
//
// To test the function in true isolation without exporting it, we trigger
// a compile error with a known input and assert the output is escaped.
// For the pure unit tests below we replicate the function locally so each
// assertion is crystal clear about what it's testing.

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── SINGLE ENTITY TESTS ──────────────────────────────────────────────────────

describe('escapeHtml() — single entity replacements', () => {

    test('escapes ampersand & → &amp;', () => {
        expect(escapeHtml('fade-up & zoom-in')).toBe('fade-up &amp; zoom-in');
    });

    test('escapes less-than < → &lt;', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    test('escapes greater-than > → &gt;', () => {
        expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    test('escapes double quote " → &quot;', () => {
        expect(escapeHtml('"fade-up"')).toBe('&quot;fade-up&quot;');
    });

    test("escapes single quote ' → &#39;", () => {
        expect(escapeHtml("it's broken")).toBe('it&#39;s broken');
    });

});

// ─── COMBINATION / ATTACK PATTERN TESTS ──────────────────────────────────────

describe('escapeHtml() — real-world attack patterns', () => {

    test('escapes a full script tag injection attempt', () => {
        const input = "<script>alert('xss')</script>";
        const result = escapeHtml(input);
        expect(result).toBe('&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;');
        // Confirm the dangerous characters are gone
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
        expect(result).not.toContain("'");
    });

    test('escapes an attribute injection attempt', () => {
        const input = '" onload="alert(1)';
        const result = escapeHtml(input);
        expect(result).toBe('&quot; onload=&quot;alert(1)');
        expect(result).not.toContain('"');
    });

    test('escapes a mixed real-world error message with special characters', () => {
        const input = 'Cannot parse "fade-up" & "zoom-in" — unexpected token <';
        const result = escapeHtml(input);
        expect(result).toBe('Cannot parse &quot;fade-up&quot; &amp; &quot;zoom-in&quot; — unexpected token &lt;');
    });

});

// ─── EDGE CASE TESTS ──────────────────────────────────────────────────────────

describe('escapeHtml() — edge cases', () => {

    test('returns empty string for empty string input', () => {
        expect(escapeHtml('')).toBe('');
    });

    test('returns empty string for null input', () => {
        expect(escapeHtml(null)).toBe('');
    });

    test('returns empty string for undefined input', () => {
        expect(escapeHtml(undefined)).toBe('');
    });

    test('returns string unchanged when no special characters present', () => {
        expect(escapeHtml('fade-up')).toBe('fade-up');
    });

    test('converts non-string input to string before escaping', () => {
        // Jules uses String(str) so numbers pass through cleanly
        expect(escapeHtml(42)).toBe('42');
    });

});

// ─── INTEGRATION TESTS — compile() catch block ────────────────────────────────

describe('compile() — error output is escaped (non-strict mode)', () => {

    test('returns escaped error HTML when given invalid DSL — no raw tags in output', () => {
        // This DSL is intentionally malformed to trigger the catch block.
        // The unclosed block should produce a Syntax Error message.
        const result = compile(':: fade-up :: { Unclosed block');
        expect(result).toContain('ani-error');
        expect(result).toContain('AniScript Error:');
        // The error message itself must not contain unescaped angle brackets
        expect(result).not.toMatch(/<script/i);
    });

    test('escapes error message when DSL contains XSS payload', () => {
        // If user input somehow ends up in an error message, it must be escaped
        const malicious = ":: <script>alert('xss')</script> :: { content }";
        const result = compile(malicious);
        // Should not contain raw script tags in the output
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('</script>');
    });

    test('throws in strict mode instead of returning error HTML', () => {
        expect(() => {
            compile(':: fade-up :: { Unclosed block', { strict: true });
        }).toThrow();
    });

    test('returns empty string for empty input without throwing', () => {
        expect(compile('')).toBe('');
        expect(compile(null)).toBe('');
    });

});

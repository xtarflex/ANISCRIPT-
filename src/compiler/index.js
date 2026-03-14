import { Parser } from './parser.js';
import { escapeHTML } from './utils.js';

/**
 * Compiles AniScript DSL string into HTML.
 * @param {string} input 
 * @param {Object} options - Options for compilation.
 * @param {boolean} options.strict - If true, throws errors instead of returning error HTML.
 * @returns {string}
 */
export function compile(input, { strict = false } = {}) {
    if (!input) return '';
    try {
        const parser = new Parser(input);
        return parser.parse();
    } catch (error) {
        if (strict) throw error;
        console.error('AniScript Compilation Error:', error);
        return `<div class="ani-error" style="color: red; border: 1px solid red; padding: 10px; margin: 10px 0;">
            <strong>AniScript Error:</strong> ${escapeHTML(error.message)}
        </div>`;
    }
}

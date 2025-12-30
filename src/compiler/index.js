import { Parser } from './parser.js';

/**
 * Compiles AniScript DSL string into HTML.
 * @param {string} input 
 * @returns {string}
 */
export function compile(input) {
    if (!input) return '';
    try {
        const parser = new Parser(input);
        return parser.parse();
    } catch (error) {
        console.error('AniScript Compilation Error:', error);
        return `<div class="ani-error" style="color: red; border: 1px solid red; padding: 10px; margin: 10px 0;">
            <strong>AniScript Error:</strong> ${error.message}
        </div>`;
    }
}

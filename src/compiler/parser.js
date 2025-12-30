import { Lexer } from './lexer.js';

export class Parser {
    constructor(input) {
        this.lexer = new Lexer(input);
        this.currentToken = null;
        this.lookaheadBuffer = [];
    }

    peek() {
        if (!this.currentToken) {
            if (this.lookaheadBuffer.length > 0) {
                this.currentToken = this.lookaheadBuffer.shift();
            } else {
                this.currentToken = this.lexer.nextToken();
            }
        }
        return this.currentToken;
    }

    advance() {
        const tok = this.peek();
        this.currentToken = null; // Next peek will fetching
        return tok;
    }

    /**
     * Consumes all WHITESPACE (TEXT tokens that are whitespace) until a non-whitespace token.
     */
    skipWhitespace() {
        while (this.peek().type === 'TEXT' && /^\s+$/.test(this.peek().value)) {
            this.advance();
        }
    }

    match(type, skipWS = false) {
        if (skipWS) this.skipWhitespace();
        if (this.peek().type === type) {
            return this.advance();
        }
        return null;
    }

    expect(type, message, skipWS = false) {
        const token = this.match(type, skipWS);
        if (!token) {
            throw new Error(`Syntax Error: ${message || `Expected ${type} but got ${this.peek().type}`}`);
        }
        return token;
    }

    parse() {
        let output = '';
        while (this.peek().type !== 'EOF') {
            this.skipWhitespace();
            if (this.peek().type === 'EOF') break;
            output += this.parseNode();
        }
        return output;
    }

    parseNode() {
        const token = this.peek();
        if (token.type === 'DOUBLE_COLON') {
            if (this.isAnimationStart()) {
                return this.parseAnimation();
            } else {
                return this.advance().value; // Treat as literal ::
            }
        } else if (token.type === 'STAGGER_OPEN') {
            return this.parseStagger();
        } else if (token.type === 'EOF') {
            return '';
        } else {
            return this.advance().value;
        }
    }

    isAnimationStart() {
        if (this.peek().type !== 'DOUBLE_COLON') return false;

        const tokens = [];

        // Collect tokens to look ahead
        tokens.push(this.advance()); // Consume ::

        let looksLikeAni = false;
        while (this.peek().type !== 'EOF') {
            const tok = this.peek();
            // If we see anything that looks like start of animation name or params
            if (tok.type === 'IDENTIFIER' || tok.type === 'PIPE' || tok.type === 'COLON' ||
                tok.type === 'PARAM_DELAY' || tok.type === 'PARAM_DUR' || tok.type === 'BRACE_OPEN') {
                looksLikeAni = true;
                break;
            }
            if (tok.type === 'TEXT' && /^\s+$/.test(tok.value)) {
                tokens.push(this.advance());
                continue;
            }
            break;
        }

        // Put everything back into the lookahead buffer
        if (this.currentToken) {
            this.lookaheadBuffer = [this.currentToken, ...this.lookaheadBuffer];
        }
        this.lookaheadBuffer = [...tokens, ...this.lookaheadBuffer];
        this.currentToken = null; // Forces next peek() to take from lookaheadBuffer

        return looksLikeAni;
    }


    parseAnimation() {
        this.expect('DOUBLE_COLON', null, true);

        let aniName = null;
        let tag = 'div';
        let delay = '500ms';
        let duration = '1s';

        // Parse params: skip whitespace manually or use a loop that ignores it
        while (this.peek().type !== 'DOUBLE_COLON' && this.peek().type !== 'EOF') {
            const tok = this.advance();
            if (tok.type === 'IDENTIFIER') {
                const val = tok.value;
                if (val === 'div' || val === 'span') tag = val;
                else if (!aniName) aniName = val;
            } else if (tok.type === 'PARAM_DELAY') {
                delay = this.formatTime(tok.value);
            } else if (tok.type === 'PARAM_DUR') {
                duration = this.formatTime(tok.value);
            } else if (tok.type === 'TEXT' && /^\s+$/.test(tok.value)) {
                continue; // Ignore whitespace in params
            } else if (tok.type === 'PIPE' || tok.type === 'COLON') {
                continue; // Ignore separators
            }
        }

        if (!aniName) {
            throw new Error('Syntax Error: Missing animation name');
        }

        this.expect('DOUBLE_COLON', null, true);
        this.expect('BRACE_OPEN', null, true);

        let content = '';
        let braceDepth = 1;
        while (braceDepth > 0 && this.peek().type !== 'EOF') {
            const next = this.peek();
            if (next.type === 'BRACE_OPEN') {
                braceDepth++;
                content += this.advance().value;
            } else if (next.type === 'BRACE_CLOSE') {
                braceDepth--;
                if (braceDepth > 0) {
                    content += this.advance().value;
                }
            } else if (next.type === 'DOUBLE_COLON' && this.isAnimationStart()) {
                content += this.parseAnimation();
            } else if (next.type === 'STAGGER_OPEN') {
                content += this.parseStagger();
            } else {
                content += this.advance().value;
            }
        }

        if (braceDepth > 0) {
            throw new Error('Syntax Error: Unclosed content block');
        }

        this.expect('BRACE_CLOSE', null, false); // No skipWS before closing brace of content

        return `<${tag} data-ani="${aniName}" data-ani-delay="${delay}" data-ani-duration="${duration}">${content.trim()}</${tag}>`;
    }

    parseStagger() {
        const token = this.expect('STAGGER_OPEN', null, true);
        const staggerTime = this.formatTime(token.value);

        let content = '';
        while (this.peek().type !== 'STAGGER_CLOSE' && this.peek().type !== 'EOF') {
            this.skipWhitespace();
            if (this.peek().type === 'STAGGER_CLOSE' || this.peek().type === 'EOF') break;
            content += this.parseNode();
        }

        if (this.peek().type === 'EOF') {
            throw new Error('Syntax Error: Unclosed stagger block');
        }

        this.expect('STAGGER_CLOSE', null, true);

        return `<div data-ani-stagger="${staggerTime}">${content}</div>`;
    }

    formatTime(value) {
        if (!value) return value;
        if (/^\d+(\.\d+)?$/.test(value)) {
            return value + 'ms';
        }
        return value;
    }
}

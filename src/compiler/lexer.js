/**
 * @typedef {'DOUBLE_COLON' | 'STAGGER_OPEN' | 'STAGGER_CLOSE' | 'BRACE_OPEN' | 'BRACE_CLOSE' | 'PIPE' | 'COLON' | 'PARAM_DELAY' | 'PARAM_DUR' | 'IDENTIFIER' | 'TEXT' | 'EOF'} TokenType
 */

/**
 * @typedef {Object} Token
 * @property {TokenType} type
 * @property {string} value
 * @property {number} line
 * @property {number} col
 */

export class Lexer {
    constructor(input) {
        this.input = input || '';
        this.pos = 0;
        this.line = 1;
        this.col = 1;
    }

    nextToken() {
        if (this.pos >= this.input.length) {
            return { type: 'EOF', value: '', line: this.line, col: this.col };
        }

        const startLine = this.line;
        const startCol = this.col;

        // Escaping
        if (this.peek() === '\\') {
            this.advance(); // consume \
            if (this.pos < this.input.length) {
                const char = this.advance();
                return { type: 'TEXT', value: char, line: startLine, col: startCol };
            }
            return { type: 'TEXT', value: '\\', line: startLine, col: startCol };
        }

        // Multi-character control tokens
        if (this.match('::')) return { type: 'DOUBLE_COLON', value: '::', line: startLine, col: startCol };

        if (this.match('[[')) {
            this.consumeWhitespace();
            if (this.match('/]]')) return { type: 'STAGGER_CLOSE', value: '[[/]]', line: startLine, col: startCol };
            if (this.match('stagger:')) {
                // We handle the time part here to keep STAGGER_OPEN as one token
                this.consumeWhitespace();
                const val = this.readWhile((c) => /[a-zA-Z0-9ms\.]/.test(c));
                this.consumeWhitespace();
                this.expectChar(']]');
                return { type: 'STAGGER_OPEN', value: val, line: startLine, col: startCol };
            }
            return { type: 'TEXT', value: '[[', line: startLine, col: startCol };
        }

        if (this.match('dur:')) {
            const val = this.readWhile((c) => /[a-zA-Z0-9ms\.]/.test(c));
            return { type: 'PARAM_DUR', value: val, line: startLine, col: startCol };
        }

        const char = this.peek();

        if (char === '{') { this.advance(); return { type: 'BRACE_OPEN', value: '{', line: startLine, col: startCol }; }
        if (char === '}') { this.advance(); return { type: 'BRACE_CLOSE', value: '}', line: startLine, col: startCol }; }
        if (char === '|') { this.advance(); return { type: 'PIPE', value: '|', line: startLine, col: startCol }; }
        if (char === ':') { this.advance(); return { type: 'COLON', value: ':', line: startLine, col: startCol }; }
        if (char === '@') {
            this.advance();
            const val = this.readWhile((c) => /[a-zA-Z0-9ms\.]/.test(c));
            return { type: 'PARAM_DELAY', value: val, line: startLine, col: startCol };
        }

        // Whitespace as TEXT
        if (/\s/.test(char)) {
            return { type: 'TEXT', value: this.advance(), line: startLine, col: startCol };
        }

        // Identifier-like strings or general TEXT
        if (/[a-zA-Z0-9\-]/.test(char)) {
            const val = this.readWhile((c) => /[a-zA-Z0-9\-]/.test(c));
            return { type: 'IDENTIFIER', value: val, line: startLine, col: startCol };
        }

        // Default: any other single character as TEXT
        return { type: 'TEXT', value: this.advance(), line: startLine, col: startCol };
    }

    expectChar(str) {
        if (!this.match(str)) {
            throw new Error(`Syntax Error: Expected '${str}' at line ${this.line}, col ${this.col}`);
        }
    }

    readWhile(predicate) {
        let res = '';
        while (this.pos < this.input.length && predicate(this.peek())) {
            res += this.advance();
        }
        return res;
    }

    consumeWhitespace() {
        while (this.pos < this.input.length && /\s/.test(this.peek())) {
            this.advance();
        }
    }

    peek() {
        return this.input[this.pos];
    }

    match(str) {
        if (this.input.startsWith(str, this.pos)) {
            this.pos += str.length;
            this.col += str.length;
            return true;
        }
        return false;
    }

    advance() {
        const char = this.input[this.pos++];
        if (char === '\n') {
            this.line++;
            this.col = 1;
        } else {
            this.col++;
        }
        return char;
    }
}

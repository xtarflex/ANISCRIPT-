#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { compile } from '../src/compiler/index.js';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath) {
    console.log('Usage: node scripts/cli.js <input.txt> [output.html]');
    process.exit(1);
}

try {
    const input = fs.readFileSync(path.resolve(process.cwd(), inputPath), 'utf8');
    const output = compile(input);

    if (outputPath) {
        fs.writeFileSync(path.resolve(process.cwd(), outputPath), output);
        console.log(`Successfully compiled ${inputPath} to ${outputPath}`);
    } else {
        console.log(output);
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}

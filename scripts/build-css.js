import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const outputFile = path.join(distDir, 'aniscript.css');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const cssFiles = [
    path.join(rootDir, 'src/css/base/core.css'),
    // Add components in a specific order if needed, otherwise grab all
];

// Get all component css files
const componentsDir = path.join(rootDir, 'src/css/components');
const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.css'))
    .map(file => path.join(componentsDir, file));

const allFiles = [...cssFiles, ...componentFiles];

let combinedCss = '/* AniScript V1.0.0 - Combined Styles */\n';

for (const file of allFiles) {
    if (fs.existsSync(file)) {
        combinedCss += `\n/* Source: ${path.relative(rootDir, file)} */\n`;
        combinedCss += fs.readFileSync(file, 'utf8');
        combinedCss += '\n';
    } else {
        console.warn(`Warning: File not found: ${file}`);
    }
}

fs.writeFileSync(outputFile, combinedCss);
console.log(`✅ CSS build complete: ${outputFile}`);

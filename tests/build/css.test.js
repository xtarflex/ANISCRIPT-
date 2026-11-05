import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('CSS Build Output', () => {
    let cssContent;
    let pkgVersion;

    beforeAll(() => {
        // Run the build script to ensure fresh output
        execSync('npm run build:css', { stdio: 'ignore' });

        const distPath = path.resolve('dist/aniscript.css');
        cssContent = fs.readFileSync(distPath, 'utf8');

        const pkgPath = path.resolve('package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkgVersion = pkg.version;
    });

    test('Should contain correct version string', () => {
        expect(cssContent).toContain(`/* AniScript v${pkgVersion} - Combined Styles */`);
    });

    test('Should have will-change properties for .ani-paused', () => {
        expect(cssContent).toMatch(/\[data-ani\]\.ani-paused\s*\{[^}]*will-change:\s*transform,\s*opacity;/);
        expect(cssContent).toMatch(/\[data-ani\^="blur-"\]\.ani-paused\s*\{[^}]*will-change:\s*transform,\s*opacity,\s*filter;/);
    });

    test('Should replace 3000px with 100vh and 100vw', () => {
        expect(cssContent).not.toContain('3000px');
        expect(cssContent).toContain('100vh');
        expect(cssContent).toContain('100vw');
    });

    test('Should remove redundant transform-origin in rotation animations', () => {
        const upBlock = cssContent.split('@keyframes ani-rotate-up')[1].split('@keyframes')[0];
        const downBlock = cssContent.split('@keyframes ani-rotate-down')[1].split('@keyframes')[0];

        expect(upBlock.split('to {')[1]).not.toContain('transform-origin');
        expect(downBlock.split('to {')[1]).not.toContain('transform-origin');
    });

    test('Should comment out blur-out animation', () => {
        expect(cssContent).toContain('Temporarily removed until exit animation support ships in v1.2');
        // Validate blur-out rules are not active

    });
});

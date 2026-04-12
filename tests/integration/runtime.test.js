import { jest } from '@jest/globals';
import { initAnimateOnView } from '../../src/runtime/index.js';

describe('AniScript Runtime', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        // Mock IntersectionObserver
        global.IntersectionObserver = class IntersectionObserver {
            constructor() {}
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Attention seekers should not receive .ani-paused class', () => {
        document.body.innerHTML = `
            <div data-ani="shake-h"></div>
            <div data-ani="pulse"></div>
            <div data-ani="fade-in"></div>
        `;

        initAnimateOnView();

        const shake = document.querySelector('[data-ani="shake-h"]');
        const pulse = document.querySelector('[data-ani="pulse"]');
        const fade = document.querySelector('[data-ani="fade-in"]');

        expect(shake.classList.contains('ani-paused')).toBe(false);
        expect(pulse.classList.contains('ani-paused')).toBe(false);
        expect(fade.classList.contains('ani-paused')).toBe(true);
    });

    test('Staggered attention seekers should not receive .ani-paused class', () => {
        document.body.innerHTML = `
            <div data-ani-stagger="100ms">
                <div data-ani="wobble"></div>
                <div data-ani="slide-up"></div>
            </div>
        `;

        initAnimateOnView();

        const wobble = document.querySelector('[data-ani="wobble"]');
        const slide = document.querySelector('[data-ani="slide-up"]');

        expect(wobble.classList.contains('ani-paused')).toBe(false);
        expect(slide.classList.contains('ani-paused')).toBe(true);
    });
});

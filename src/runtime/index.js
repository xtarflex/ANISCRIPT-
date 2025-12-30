/**
 * @file index.js
 * @description Main entry point for AniScript runtime logic.
 */

import { createAniObserver } from './observer.js';

/**
 * Normalizes time strings to CSS time units (ms or s).
 * @param {string|number} time 
 * @returns {string}
 */
function normalizeTime(time) {
    if (!time) return '0ms';
    if (typeof time === 'number') return `${time}ms`;
    if (/^\d+$/.test(time)) return `${time}ms`;
    return time;
}

/**
 * Parses time string to milliseconds.
 * @param {string} timeStr 
 * @returns {number}
 */
function parseToMs(timeStr) {
    if (!timeStr) return 0;
    const match = timeStr.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 's' ? value * 1000 : value;
}

/**
 * Initializes AniScript animations on the page.
 * @param {Object} config - Configuration options for the observer.
 */
export function initAnimateOnView(config = {}) {
    // 1. Scan for stagger containers
    const staggerContainers = document.querySelectorAll('[data-ani-stagger]');
    staggerContainers.forEach(container => {
        const staggerValue = container.getAttribute('data-ani-stagger');
        const staggerMs = parseToMs(staggerValue);
        const children = container.querySelectorAll('[data-ani]');

        children.forEach((child, index) => {
            const baseDelay = child.getAttribute('data-ani-delay') || '0ms';
            const baseDelayMs = parseToMs(baseDelay);
            const totalDelayMs = baseDelayMs + (index * staggerMs);

            child.style.animationDelay = `${totalDelayMs}ms`;

            const duration = child.getAttribute('data-ani-duration');
            if (duration) {
                child.style.animationDuration = normalizeTime(duration);
            }

            // Mark as paused initially
            child.classList.add('ani-paused');
        });
    });

    // 2. Scan for individual elements not in a stagger container
    const allAnimatedElements = document.querySelectorAll('[data-ani]');
    const observer = createAniObserver(config);

    allAnimatedElements.forEach(el => {
        // If not already processed by stagger logic
        if (!el.classList.contains('ani-paused')) {
            const delay = el.getAttribute('data-ani-delay');
            const duration = el.getAttribute('data-ani-duration');

            if (delay) el.style.animationDelay = normalizeTime(delay);
            if (duration) el.style.animationDuration = normalizeTime(duration);

            el.classList.add('ani-paused');
        }

        observer.observe(el);
    });
}

// Auto-init if needed or export as default
export default {
    init: initAnimateOnView
};

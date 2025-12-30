/**
 * @file observer.js
 * @description IntersectionObserver logic for triggering AniScript animations.
 */

/**
 * Creates and returns an IntersectionObserver instance to manage animations.
 * @param {Object} options - Observer options (threshold, rootMargin).
 * @returns {IntersectionObserver}
 */
export function createAniObserver(options = { threshold: 0.1, rootMargin: '0px' }) {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.remove('ani-paused');
                el.classList.add('ani-running');
                // stop observing once it starts running
                observer.unobserve(el);
            }
        });
    }, options);
}

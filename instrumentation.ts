// Polyfill localStorage for SSR environments where it may be partially mocked
// (e.g., by browser automation tools like chrome-devtools-mcp) without methods.
export async function register() {
    if (
        typeof localStorage !== 'undefined' &&
        typeof localStorage.getItem !== 'function'
    ) {
        const noop = () => null;
        Object.assign(localStorage, {
            getItem: noop,
            setItem: noop,
            removeItem: noop,
            clear: noop,
        });
    }
}

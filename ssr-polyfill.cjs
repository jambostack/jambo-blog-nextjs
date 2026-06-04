// Patch localStorage if it exists as a broken stub (e.g., injected by browser automation tools)
// without the standard Storage interface methods. Runs before Next.js loads via --require.
if (typeof localStorage !== 'undefined' && typeof localStorage.getItem !== 'function') {
    const _store = Object.create(null);
    try {
        Object.defineProperty(global, 'localStorage', {
            value: {
                getItem: (k) => Object.prototype.hasOwnProperty.call(_store, k) ? _store[k] : null,
                setItem: (k, v) => { _store[String(k)] = String(v); },
                removeItem: (k) => { delete _store[String(k)]; },
                clear: () => { Object.keys(_store).forEach((k) => delete _store[k]); },
                get length() { return Object.keys(_store).length; },
                key: (i) => Object.keys(_store)[i] ?? null,
            },
            writable: true,
            configurable: true,
        });
    } catch (_) { /* non-configurable — skip */ }
}

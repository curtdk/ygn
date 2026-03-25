// LocalStorage polyfill for SSR
if (typeof window !== "undefined") {
  // Already on client, no need to polyfill
} else {
  // Mock localStorage for SSR
  const noop = () => {}
  const storage = new Map()
  
  globalThis.localStorage = {
    getItem: noop,
    setItem: noop,
    removeItem: noop,
    clear: noop,
    key: () => null,
    get length() { return 0 },
  }
}

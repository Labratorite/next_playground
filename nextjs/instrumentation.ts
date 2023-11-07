export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.USE_IN_MEMORY_STORAGE === 'true') {
    await import('./db/models/index');
  }
}

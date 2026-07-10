// Minimal timestamped logger.
const ts = () => new Date().toISOString();

export const log = {
  info: (...a) => console.log(ts(), "·", ...a),
  warn: (...a) => console.warn(ts(), "⚠", ...a),
  error: (...a) => console.error(ts(), "✖", ...a),
};

const TAG = "silent-finance";

enum Level {
  SILENT = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

let _level = process.env.NODE_ENV
  ? Level.DEBUG : Level.INFO;

export default {
  setLevel(level: Level) {
    _level = level;
  },

  error(...args: any[]) {
    if (_level < Level.ERROR) {
      return;
    }

    console.log(TAG, "[error]", ...args);
  },

  warn(...args: any[]) {
    if (_level < Level.WARN) {
      return;
    }

    console.log(TAG, "[warn]", ...args);
  },

  info(...args: any[]) {
    if (_level < Level.INFO) {
      return;
    }

    console.log(TAG, "[info]", ...args);
  },

  debug(...args: any[]) {
    if (_level < Level.DEBUG) {
      return;
    }

    console.log(TAG, "[debug]", ...args);
  },
};

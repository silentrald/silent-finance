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

    const last = args.at(-1);
    if (last && (last as any).error) {
      console.error(TAG, "[error]", ...args, last.error);
    } else {
      console.error(TAG, "[error]", ...args);
    }
  },

  warn(...args: any[]) {
    if (_level < Level.WARN) {
      return;
    }

    console.warn(TAG, "[warn]", ...args);
  },

  info(...args: any[]) {
    if (_level < Level.INFO) {
      return;
    }

    console.info(TAG, "[info]", ...args);
  },

  debug(...args: any[]) {
    if (_level < Level.DEBUG) {
      return;
    }

    console.log(TAG, "[debug]", ...args);
  },
};

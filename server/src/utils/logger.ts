type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const format = (level: LogLevel, event: string, data?: Record<string, any>) => {
  const base = { ts: new Date().toISOString(), level, event };
  return JSON.stringify(data ? { ...base, ...data } : base);
};

export const logger = {
  info(event: string, data?: Record<string, any>) {
    console.log(format('info', event, data));
  },
  warn(event: string, data?: Record<string, any>) {
    console.warn(format('warn', event, data));
  },
  error(event: string, data?: Record<string, any>) {
    console.error(format('error', event, data));
  },
  debug(event: string, data?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(format('debug', event, data));
    }
  },
};

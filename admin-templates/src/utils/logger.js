// Sistema de logging condicional para produção
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

export const logger = {
  log: () => {},
  warn: () => {},
  error: () => {},
  info: () => {},
  debug: () => {}
};

export default logger;

import pino from 'pino';

const formatters = {
  level(label: string) {
    return { level: label.toUpperCase() };
  },
};

export const logger: pino.Logger = pino({
  formatters,
  mixinMergeStrategy(mergeObject, mixinObject) {
    return Object.assign({}, mergeObject, mixinObject);
  },
});

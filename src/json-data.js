const fs = require('fs');
const path = require('path');
const reserved = require('reserved-words');
const shared = require('./shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const files = fs.readdirSync(root);

  if (!files.length) {
    return content;
  }

  const root = shared.resolveAssetsPath('data');
  const modulePath = shared.getModulePath(resourcePath);

  const dataObject = files.reduce((acc, file) => {
    const filePath = path.join(root, file);
    let contents;

    try {
      contents = fs.readFileSync(filePath);
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    const propertyName = convertFileNameToObjectPropertyName(file);

    if (!isPropertyNameValid(propertyName)) {
      console.error(
        `[SKY UX Plugin Error: stache-json-data] A valid Object property could not be determined from file ${filePath}!`
      );
      return acc;
    }

    acc[propertyName] = JSON.parse(contents);

    return acc;
  }, { });

  content = `
import {
  StacheJsonDataService,
  STACHE_JSON_DATA_SERVICE_CONFIG
} from '${modulePath}';

export const STACHE_JSON_DATA_PROVIDERS: any[] = [
  {
    provide: STACHE_JSON_DATA_SERVICE_CONFIG,
    useValue: ${JSON.stringify(dataObject)}
  },
  {
    provide: StacheJsonDataService,
    useClass: StacheJsonDataService
  }
];
${content}`;

  return shared.addToProviders(content, 'STACHE_JSON_DATA_PROVIDERS');
};

const convertFileNameToObjectPropertyName = (fileName) => {
  return fileName.split('.')[0]
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/_/g, '-')       // Replace all underscores with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text;
};

const isPropertyNameValid = (propertyName) => {
  if (!propertyName) {
    return false;
  }

  if (propertyName === 'prototype') {
    return false;
  }

  // Parsing as boolean because reserved-words returns `undefined` for falsy values.
  return !reserved.check(propertyName, 'es6', true);
};

module.exports = { preload };

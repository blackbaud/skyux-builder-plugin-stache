const fs = require('fs-extra');
const path = require('path');
const reserved = require('reserved-words');
const shared = require('./shared');
const glob = require('glob');

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return content.toString().replace(/stache\.jsonData\./g, 'stache.jsonData?.');
  }

  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const root = shared.resolveAssetsPath('data');
  const filePaths = glob.sync(path.join(root, '*.json'));

  if (!filePaths.length) {
    return content;
  }

  const dataObject = filePaths.reduce((acc, filePath) => {
    const fileName = path.basename(filePath);
    const propertyName = convertFileNameToObjectPropertyName(fileName);

    if (!isPropertyNameValid(propertyName)) {
      console.error(
        new shared.StachePluginError(
          `A valid Object property could not be determined from file ${fileName}! The property key '${propertyName}' cannot be used. Please choose another file name.`
        )
      );
      return acc;
    }

    let contents;

    try {
      contents = fs.readFileSync(filePath);
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    acc[propertyName] = JSON.parse(contents);

    return acc;
  }, { });

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import {
  StacheJsonDataService,
  STACHE_JSON_DATA_SERVICE_CONFIG
} from '${modulePath}';

/* tslint:disable:quotemark whitespace max-line-length */
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
/* tslint:enable:quotemark whitespace max-line-length */
${content}`;

  return shared.addToProviders(content, 'STACHE_JSON_DATA_PROVIDERS');
};

const convertFileNameToObjectPropertyName = (fileName) => {
  return fileName.split('.')[0]
    .replace(/\s+/g, '_')     // Replace spaces with underscores
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/-/g, '_')       // Replace all dashes with underscores
    .replace(/--+/g, '_')     // Replace multiple dashes with single underscore
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

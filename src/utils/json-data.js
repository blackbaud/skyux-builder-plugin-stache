const fs = require('fs-extra');
const path = require('path');
const reserved = require('reserved-words');
const shared = require('./shared');
const glob = require('glob');

// Matches {{ stache.jsonData. }} with any number of spaces between the '{{' and 'stache.',
// any keys following the 'jsonData.', and the closing '}}'
const angularBindingRegExp = new RegExp(/\{\{\s*stache.jsonData.*?\}\}/g);
const buildTimeBindingRegExp = new RegExp(/\{\{\s*@buildtime:\s*stache.jsonData.*?\}\}/g);

let _globalData;

const getGlobalData = () => {
  if (!_globalData) {
    _globalData = buildGlobalDataFromJson();
  }

  return _globalData;
};

const buildGlobalDataFromJson = () => {
  const root = shared.resolveAssetsPath('data');
  const filePaths = glob.sync(path.join(root, '*.json'));

  if (!filePaths.length) {
    return;
  }

  const dataObject = filePaths.reduce((acc, filePath) => {
    const fileName = path.basename(filePath);
    const propertyName = convertFileNameToObjectPropertyName(fileName);

    if (!isPropertyNameValid(propertyName)) {
      console.error(
        new shared.StachePluginError(
          `A valid Object property could not be determined from file ${fileName}!
          The property key '${propertyName}' cannot be used. Please choose another file name.`
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
  }, {});

  return dataObject;
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
  if (!propertyName || propertyName === 'prototype') {
    return false;
  }

  // Parsing as boolean because reserved-words returns `undefined` for falsy values.
  return !reserved.check(propertyName, 'es6', true);
};

const parseAllBuildTimeBindings = (content) => {
  const buildTimeBindings = content.match(buildTimeBindingRegExp);

  if (!buildTimeBindings) {
    return content;
  }

  buildTimeBindings.forEach(buildTimeBinding => {
    let dataValue = parseAngularBindings(buildTimeBinding);
    content = content.replace(buildTimeBinding, dataValue);
  });

  return content;
}

const parseAngularBindings = (unparsedValue) => {
  let angularBinding = unparsedValue.replace(/@buildtime:/g, '');
  let parsedData;

  if (angularBindingRegExp.test(angularBinding)) {
    const stacheData = getGlobalData();
    const bindings = angularBinding.match(angularBindingRegExp);

    bindings.forEach(binding => {
      const dataValue = getDataValue(binding, stacheData);
      angularBinding = angularBinding.replace(binding, dataValue);
    });

    parsedData = angularBinding;
  }

  return parsedData || unparsedValue;
};

const getDataValue = (keyString, dataObject) => {
  const keys = getKeysFromString(keyString);
  const jsonValue = keys.reduce((object, key) => {
    return object[key];
  }, dataObject);

  return jsonValue;
};

const getKeysFromString = (keyString) => {
  return keyString.replace('}}', '')        // Remove the trailing '}}'
    .replace(/\{\{\s*stache.jsonData./, '') // Remove the '{{ stache.jsonData'
    .replace(/\[/g, '.')                    // Replace the start of an array with .
    .replace(/\]/g, '')                     // Remove the closing array bracket
    .trim()
    .split('.');
};

module.exports = {
  getGlobalData,
  parseAngularBindings,
  parseAllBuildTimeBindings
};

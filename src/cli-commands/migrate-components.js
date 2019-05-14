const fs = require('fs-extra');
const path = require('path');
const logger = require('@blackbaud/skyux-logger');
const rootPath = process.cwd();

const migrateComponents = () => {
  return new Promise((resolve, reject) => {
    const srcPath = path.join(rootPath, 'src');
    let files;

    try {
      files = getNestedFiles(srcPath);
    }
    catch (error) {
      logger.error(`[Error] reading dir at: ${srcPath}: ${error}`);
      reject();
    }
    return resolve(files);
  });
}

const getNestedFiles = (dir, filePaths) => {
  let files = fs.readdirSync(dir);
  filePaths = filePaths || [];
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filePaths = getNestedFiles(path.join(dir, file), filePaths);
    } else {
      if (eligableForMigration(file)) {
        filePaths.push(path.join(dir, file));
      }
    }
  });
  return filePaths;
};

function eligableForMigration(file) {
  // include .ts, .js, .html files
  // exclude .json
  const shouldReturn = ((file
    .indexOf('.js') > -1
      || file.indexOf('.ts') > -1
      || file.indexOf('.html') > -1)
        && file.indexOf('.json') === -1);

  return shouldReturn;
}

const getFileContents = (files) => {
  return new Promise((resolve, reject) => {
    files.forEach((file) => {
      try {
        const content = fs.readFileSync(file, 'utf8');

        logger.info(`updating file ${file}`);

        let updatedContent = updateContent(content);
        fs.writeFileSync(file, updatedContent, { spaces: 2 });

        logger.info(`update complete.`);
      }
      catch (error) {
        logger.error('[Error] migrating file ${file}: ${error}');
        reject();
      }
    });

    resolve();
  });
}

function updateContent(content) {
  return content
    .replace(/stache-code-block/g, 'sky-code-block')
    .replace(/stache-code/g, 'sky-code')
    .replace(/stache-row/g, 'sky-row')
    .replace(/stache-column/g, 'sky-column')
    .replace(/stache-hero/g, 'sky-hero')
    .replace(/stache-hero-subheading/g, 'sky-hero-subheading')
    .replace(/stache-hero-heading/g, 'sky-hero-heading')
    .replace(/stache-img/g, 'sky-img')
    .replace(/stache-video/g, 'sky-video')
    .replace(/stache-internal/g, 'sky-restricted-view')
    .replace(/stacheInternal/g, 'skyRestrictedView');
}

const notify = () => {
  logger.info('stache-migrate has successfully updated your components.');
}

module.exports = () => {
  return migrateComponents()
    .then(getFileContents)
    .then(notify)
    .catch(logger.error);
}

# 1.0.4 (2017-08-11)

- Allow `preload` plugins to be called in a specific order.
- Fixed a bug that prevented eslint from linting the appropriate files.

# 1.0.4 (2017-07-03)

- Added `order` attribute to Route Meta Data Service. [#10](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/10)

# 1.0.3 (2017-06-16)

- Updated unit tests to supply Buffers instead of strings.

# 1.0.2 (2017-06-16)

- Modified file-name-to-object-key conversion for JSON file names.
- Added method to convert all `{{ stache.jsonData.* }}` to `{{ stache.jsonData?.* }}` to allow for asynchronous processing.

# 1.0.1 (2017-06-15)

- Added tslint ignore comments to automatically generated content.

# 1.0.0 (2017-06-15)

- Initial release to NPM.

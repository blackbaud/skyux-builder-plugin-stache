# 1.7.0 (2018-10-09)

- Created and exposed a runCommand method to enable new SKY UX cli commands. [#45](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/45)
- Created the `stache-update` SKY UX cli command to update the users package.json dependencies and installing them.
- Refactored plugins to a separate folder, exposed a `publicAPI` module containing both the preload and runCommand methods.

# 1.6.0 (2018-09-20)

- Updated to allow users to hide pages from the Stache sidebar. [#43](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/43)

# 1.5.1 (2018-08-02)

- Updated to allow users to have nested folders in Stache application data. [#39](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/39)
- Fixed issue with Windows integration

# 1.4.0 (2018-05-09)

- Updated logic to choose module path by application name instead of by application path. [#37](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/37)

# 1.3.1 (2018-01-05)

- Updated the marked dependency to fix a security issue. [#35](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/35)

# 1.3.0 (2017-11-20)

- Added markdown plugin. [#28](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/28) Thanks @Blackbaud-BobbyEarl!
- Removed search provider. [#32](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/32)

# 1.2.0 (2017-11-2)

- Added provider for search. [#20](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/20)
- Added provider for auth http. [#27](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/27)

# 1.1.1 (2017-10-20)

- Bugfix for `stache-code` to only escape characters when the `escapeCharacters` attribute is set to true on the element. [#25](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/25)

# 1.1.0 (2017-10-19)

- `stache-code` now escapes characters `<` and `{` [#23](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/23)

# 1.0.8 (2017-09-25)

- Fixed a bug causing the plugin to look for the `@blackbaud/stache2` route when serving Stache 2 repo locally on windows machines. [#21](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/21)

# 1.0.7 (2017-09-05)

- Fixed a [bug](https://github.com/blackbaud/stache2/issues/290) where providers would not be added if no `providers` array existed on the `app.extras` module. [#18](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/18)

# 1.0.6 (2017-08-24)

- Added support for nesting `<stache-include>` tags inside each other. [#17](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/17)
- Allow `@buildtime:` stache.jsonData to be parsed during build time. [#15](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/15)
- Stache tag attributes `navTitle`, `pageTitle`, and stache-include attribute `fileName`, are parsed during build time to allow the use of stache.jsonData bindings for their values. [#231](https://github.com/blackbaud/stache2/issues/231)

# 1.0.5 (2017-08-11)

- Now allowing `preload plugins` to be called in a specific order.
- Fixed a bug that prevented eslint from linting the appropriate files.
- Allows the stache-code-block to be used inside a stache-include.  [#293](https://github.com/blackbaud/stache2/issues/293)

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

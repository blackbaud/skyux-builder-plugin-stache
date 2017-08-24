# Stache SKY UX Builder Plugin

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-builder-plugin-stache.svg)](https://www.npmjs.com/package/@blackbaud/skyux-builder-plugin-stache)
[![status](https://travis-ci.org/blackbaud/skyux-builder-plugin-stache.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-builder-plugin-stache)

This plugin extends the functionality of [SKY UX Builder](https://github.com/blackbaud/skyux-builder) to enhance the [Stache 2](https://github.com/blackbaud/stache2) component library.

## Installation

```
npm install --save @blackbaud/skyux-builder-plugin-stache
```

## Usage

Open **skyuxconfig.json** and add the following:

```
{
  "plugins": [
    "@blackbaud/skyux-builder-plugin-stache"
  ]
}
```

## Found an issue?

Please log all issues related to Stache (and its plugins) at [blackbaud/stache2](https://github.com/blackbaud/stache2/issues).

## A Note About Plugin Order

1. `config` runs first to set up any config necessary that could affect later options.   At least that's the theory behind that one going first it seems to make sense.
2. `element attributes`  this runs second, to replace any element attributes (such as `fileName`) with their appropriate values,   This needs to run before the `include` plugin, so it can load in the correct fileName when loading the snippet.
3. `include`,  this plugin has to run before we do any further content replacement, as the snippets that get pulled into the file from this include block, could very well contain stache jsonData themselves.
4. `build-time`,  Here we need to run over ALL the contents of the page before any further manipulation and replace all the `@buildtime` data objects,  this is required before we run the `code-block` plugin, so that we can use the `@buildtime` inside them
5. `code-block` needs to run before the `json-data` plugin, but after the `@buildtime` plugin, as here we want to escape the `{{` characters so they can render properly on the page without being interpolated by Angular and causing errors.  It has to run before the `json-data` plugin, otherwise it will try to add the elvis operator to the blocks where it likely isn't wanted.

`route-meta-data` doesn't need to be in a particular order as it is grabbing ALL HTML files and looping through them to create and set the meta data object.
likewise I don't believe `template-reference-variable` is dependent on order either.

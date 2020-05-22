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

## A Note About Plugin Order

1. `config` runs first to set up any config necessary that could affect later options.   At least that's the theory behind that one going first it seems to make sense.
2. `include`,  this plugin has to run before we do any further content replacement, as the snippets that get pulled into the file from this include block, could very well contain stache jsonData themselves.
3. `element attributes`  this runs third, to replace specified element attributes with their appropriate values before they are needed in other plugins, even if they are part of the `<stache-include>` content.
4. `build-time`,  Here we need to run over ALL the contents of the page before any further manipulation and replace all the `@buildtime` data objects.

`route-meta-data` doesn't need to be in a particular order as it is grabbing ALL HTML files and looping through them to create and set the meta data object.
likewise I don't believe `template-reference-variable` is dependent on order either.

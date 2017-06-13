# Stache Route Metadata Plugin

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-builder-plugin-stache-route-metadata.svg)](https://www.npmjs.com/package/@blackbaud/skyux-builder-plugin-stache-route-metadata)
[![status](https://travis-ci.org/blackbaud/skyux-builder-plugin-stache-route-metadata.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-builder-plugin-stache-route-metadata)

This [SKY UX Builder](https://github.com/blackbaud/skyux-builder) plugin allows consumers to provide metadata for page routes, such as its title and order. This plugin is intended to be used with [Stache 2 Components](https://github.com/blackbaud/stache2).

## Installation

```
npm install --save @blackbaud/skyux-builder-plugin-stache-route-metadata
```

## Usage

Open **skyuxconfig.json** and add the following:

```
{
  "plugins": [
    "@blackbaud/skyux-builder-plugin-stache-route-metadata/collector",
    "@blackbaud/skyux-builder-plugin-stache-route-metadata/generator"
  ]
}
```

## Found an issue?

Please log all issues related to Stache (and its plugins) at [blackbaud/stache2](https://github.com/blackbaud/stache2/issues).

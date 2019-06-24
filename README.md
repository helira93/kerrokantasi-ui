Kerrokantasi UI
===============

[![Build Status](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui)

Kerrokantasi UI is the user interface powering kerrokantasi.hel.fi service. It
is a full featured interface for both answering and creating questionnaires as
supported by Kerrokantasi API.

## Installation

### Prerequisites

* Node v8 LTS
* Yarn

### Configuration

`config_dev.toml` is used for configuration when NODE_ENV != "production". It
is in TOML-format, which for our purposes is `Key=Value` format.

When NODE_ENV=="production", only environment variables are used for
configuration. This is done because we've had several painful accidents
with leftover configuration files. The environment variables are named
identically to the ones used in config_dev.toml. Do note that the variables
are case insensitive, ie. `KeRRokanTasi_aPi_bASe` is a valid name. Go wild!

In the repository root there is `config_dev.toml.example` which contains
every setting and comments explaining their use. If you only want to give
kerrokantasi-ui a test, all configuration you need to do is:
`mv config_dev.toml.example to config_dev.toml`
That will give you a partially working configuration for browsing test
questionnaires in our test API.

### Running development server

```
yarn start
```
No separate build step is currently available. There is a development server
though. It is somewhat unstable, but provides hot reloading:
```
yarn run dev
```

The server will output the URL for accessing kerrokantasi-ui.

### Running in production

Kerrokantasi-ui always builds itself on start. Therefore, be prepared
for a lenghty start-up time. You can use your favorite
process manager to run `yarn start`. Node-specific managers
can also directly run `server(/index.js)`.

### Other commands

* `yarn run fetch-plugins`: fetch optional plugins (see below)
* `yarn run test`: run tests

### Plugins

Questionnaires can make use of plugins. As of yet, their use case
has been to provide map based questionnaries. Examples include having
citizens indicate places for amenities and polling the public for
locations of city bike stations.

A default set of plugins can be installed using `yarn run fetch-plugins`.
The plugins are installed in `assets/plugins`. By default, kerrokantasi-ui
expects to find them in `assets/plugins` URL prefix. The development server
serves that path, but you can also use a web server of your choice for this.
For server insllations, the plugin fetcher supports downloading the plugins
to a directory specified on the command line (`yarn run fetch-plugins
/srv/my-kerrokantasi-plugins`).

It is also possible to change the paths that kerrokantasi-ui will search for
specific plugins. See `src/shared_config.json`, which is the configuration
source for both the plugin fetcher script and the UI itself. After
changing the paths therein, you can run the plugin fetcher and it will
place the plugins to those directories. Note that specifying path on the
command line overrides the path specified in shared_config.json.

## Writing of CSS

Kerrokantasi UI styles are now split under two main style files. These are:

1. The standalone kerrokantasi styles (a.k.a. white label styles), which allow
any city to start using the project without having the Helsinki branding
applied. File: `assets/sass/app.scss`
2. The second main style file is the City of Helsinki styles which use
the white label styles as a base but override some of the styles to give the
app the proper branding. File: `assets/sass/hel-app.scss`

Styles are imported to the app in the `src/index.js` file. Right now the City
of Helsinki specific styling is the one that is active and default kerrokantasi
styles are commented out. You can switch between these two to see how it affects
the end result of the app.

**Important:**
When writing new styles, the styles must be applied to the kerrokantasi styles
first without having any City of Helsinki branding involved. If there's some
colors or any other Helsinki specific styles, they must be done for the Helsinki
styles as overrides.

## Theming

Kerrokantasi styles can be themed to match your own brand. Styles are based
on Bootstrap version 3 (Sass).

Here is an example to show how to apply custom CSS:

Create a file e.g. `my-custom-theme.scss` and apply style imports accordingly
```
// This needs to be imported before kerrokantasi variables
@import "my-custom-variables.scss";

// Import the required kerrokantasi styles
@import "kerrokantasi-ui/assets/sass/kerrokantasi/variables.scss";
@import "kerrokantasi-ui/assets/sass/kerrokantasi/bootstrap.scss";
@import "kerrokantasi-ui/assets/sass/kerrokantasi/kerrokantasi.scss";

// These are imported after the kerrokantasi styles to apply overrides
@import "my-custom-styles-and-overrides.scss";
```

Then change the `kerrokantasi-ui/src/index.js` style import from
`import '../assets/sass/kerrokantasi.scss';` to `import 'PATH-TO-YOUR-FILE/my-custom-theme.scss';`

## Using the whitelabel theme assets

To have a non city specific theme, change the `city_config` config to `whitelabel`

## Installing city specific assets

Currently the process of using the theme is not super developer friendly as it does
not support the use of `yarn link`. This means that to do development on the project
it will have to be installed in the kerrokantasi-ui project and then edited within 
the kerrokantasi-ui `node_modules/<theme_assets>` folder. If someone can find
a solution to this, please fix.

Development steps:
0. Place the theme assets folder next to the `kerrokantasi-ui` folder
    * The structure should look like this:
      ```
      /
        /kerrokantasi-ui
        /<theme-assets-folder>
      ```
1. In the `kerrokantasi-ui` project run `yarn add ../<theme-assets-folder>`
2. Edit files in `kerrokantasi-ui/node_modules/<theme-assets-folder>` for changes to be reflected
3. Set the `city_config` config to <theme-assets-folder>


Production installation:
1. Add the project to the local `kerrokantasi-ui` project either by installing it
   the same way as in the dev environment, or from GitHub or if the package is published
   to npm, then install it from there.
2. Set the `city_config` config to <theme-assets-folder>

## Creating city specific assets

The assets of a city currently consists of the following things:
1. Styling
2. Favicons
3. Logos
4. Translation strings

An example of how a theme assets project could look like, either check out the `cities/helsinki`
folder in this project, or have a look already created theme assets such as:

https://github.com/City-of-Turku/kerrokantasi-ui-turku

### Aliases
The following aliases are available to use in SCSS and JS files:
* `kerrokantasi-ui`: Points to the root of this project
* `kerrokantasi-ui-modules`: Points to the node_modules of this project
* `@city-config`: Points to the root of the city specific assets
* `@city-assets`: Points to the assets folder in the city specific assets
* `@city-i18n`: Point to the i18n folder in the city specific assets
* `@@city-images`: Point to the image folder in the city specific assets

### Naming conventions
The following naming conventions needs to be used in order to city assets to
work.

* `/assets/app.scss`: The base style file that is imported
* `/i18n/[fi, sv, en].json`: Language files. If no string changes are to be made, only include `{}` in the files
* `/i18n/localization.json`: Other configuration related to localization. Currently holds map default position
* `/i18n/service-info/content.[fi, sv, en].md`: Service info page texts, if no file found service will display 
information that content was not found.
* `/assets/images/logo[fi, sv]-black.svg`: Black/Dark site logo
* `/assets/images/logo[fi, sv]-white.svg`: White/Light site logo

#### Favicons:
The following favicons are recommended, but not mandatory to include.

* `/assets/favicon/favicon.ico`
* `/assets/favicon/favicon-32x32.png`
* `/assets/favicon/favicon-16x16.png`
* `/assets/favicon/manifest.json`
* `/assets/favicon/safari-pinned-tab.svg`
* `/assets/favicon/browserconfig.xml`

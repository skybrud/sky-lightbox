> SkyLightbox - a flexible lightbox plugin for Vue.js 2, build on v-img

## !important
This module only provides a complete barebone ligthbox setup/display, thus encouraging you to make your own lightbox display with the modules provided functionality.
The reason for this is to allow full author flexibility across multiple projects and keeping the bundle size to a minimum and not become biased towards the design/content of a lightbox overlay.

# Getting started
## Quick start

In order to make the plugin work we need to download necessary dependencies.

``` bash
yarn add sky-lightbox
```

Next thing to do is adding the plugin to the Vue. Shown with dummy ligthbox componenet setup.

``` javascript
// Setup your preferred lightbox overlay component.
import { SkyLightboxMixin } from 'sky-lightbox';

export default {
    name: 'LigthboxComponent',
    mixins: [SkyLightboxMixin],
    mounted() {
        console.log('Custom lightbox component loaded');
    },
};
```

``` javascript
// Import Vue, sky-lightbox and custom lightbox component
import Vue from 'vue'
import SkyLightbox from 'sky-lightbox'

import LigthboxComponent from './LigthboxComponent.vue';

// Loading the plugin into the Vue.
Vue.use(SkyLightbox, { lightbox: LigthboxComponent });
```

### Configurations
Snippet with default settings;
``` javascript
const config = {
  // Use `alt` attribute as gallery slide title
  altAsTitle: false,
  // Event listener to open gallery will be applied to <img> element
  openOn: 'click',
  // Component to use as lightbox overlay instead of provided compoenent
  lightbox: SkyLightbox, // Internal component name.
}

Vue.use(SkyLightbox, config);

```

## Usage
### Basic example
Simple initialization to lightbox a single image
``` html
<img
    v-sky-lightbox
    src="image.png"
/>

OR

<img
    v-sky-lightbox="{
        src: 'image.png',
    }"
    src="image.png"
/>
```

### Group images in lightbox slider example
Simple initialization to lightbox a images which is a part of the same gallery / group.

``` html
<img
    v-sky-lightbox:group-name
    src="image.png"
/>

OR

<img
    v-sky-lightbox="{
        src: 'image.png',
        group: 'group-name',
    }"
    src="image.png"
/>
```



## Plugin
### `v-sky-lightbox`
Single source of input for enabling lightbox overlay for a given image.

#### Inline directive settings

| Option | Description | Default value | Data type |
| -------| --------- | ----------- | ------- |
| group  | The same as directive argument, but could be set dynamically | directive argument or undefined | string |
| src    | Image source that will be displayed in gallery | src attribute value from html tag | string |
| title  | Caption that will be displayed | empty string or value of the `alt` attribute, if `altAsTitle` is true | string |
| openOn | Event listener to open gallery will be applied to `<img>`. Available options are 'dblclick', 'mouseover' and all native JS events. | 'click' if another not stated when initializing plugin | string |
| opened | Function that will be executed on gallery open | undefined | function |
| closed | Function that will be executed on gallery close | undefined | function |
| changed(imageIndex) | Function that will be executed when switching between images in gallery | undefined | function |

* Any of these options except `opened`, `closed`, `changed` functions and `openOn` property could be changed at runtime.

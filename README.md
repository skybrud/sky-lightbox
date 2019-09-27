> SkyLightbox - a flexible lightbox plugin for Vue.js 2, build on v-img

## !important
This module only provides a complete barebone ligthbox setup/display, thus encouraging you to make your own lightbox display with the module's provided functionality.
The reason for this is to allow full author flexibility across multiple projects and to keep the bundle size to a minimum and not become biased towards the design/content of a lightbox overlay.

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
>

OR

<img
    v-sky-lightbox="{
        src: 'image.png',
    }"
    src="image.png"
>
```

### Group images in lightbox slider example
Simple initialization to lightbox an image which is part of a gallery / group.

``` html
<img
    v-sky-lightbox:group-name
    src="image.png"
>

OR

<img
    v-sky-lightbox="{
        src: 'image.png',
        group: 'group-name',
    }"
    src="image.png"
>
```

### The Lightbox Component
When `v-sky-lightbox` is used, the set lightbox component will be added to the bottom of the page. No matter how many groups are made, only one component will be made and reused for all galleries. This means that you cannot nest a lightbox inside a lightbox easily.

## Plugin
### `v-sky-lightbox`
Single source of input for enabling lightbox overlay for a given image.

#### Inline directive settings

| Option | Description | Default value | Data type |
| ------ | ----------- | ------------- | --------- |
| group  | The same as directive argument, but could be set dynamically | directive argument or undefined | string |
| src    | Image source that will be displayed in gallery | src attribute value from html tag | string |
| title  | Caption that will be displayed | empty string or value of the `alt` attribute, if `altAsTitle` is true | string |
| openOn | Event listener to open gallery will be applied to `<img>`. Available options are 'dblclick', 'mouseover' and all native JS events. | 'click' if another not stated when initializing plugin | string |
| opened | Function that will be executed on gallery open | undefined | function |
| closed | Function that will be executed on gallery close | undefined | function |
| changed(imageIndex) | Function that will be executed when switching between images in gallery | undefined | function |

* Any of these options except `opened`, `closed`, `changed` functions and `openOn` property could be changed at runtime.

### Component / Mixin
As this module is only a barebone setup, it only has a few vital pieces of data and methods to be used for the basic functionality of the lightbox.
However, the module also supplies behind-the-scenes functionality for normal use cases.

#### Functionality

| Functionality | Description |
| ------------- | ----------- |
| Closing | The lightbox component will automatically close if either 'Q' (for 'quit') or Escape is pressed on the keyboard. It will also close when a scroll is initiated. |
| Next image | The lightbox will move to the next image if either the Right Arrow or 'L' is pressed on the keyboard. |
| Previous image | The lightbox will move to the previous image if either the Left Arrow or 'H' is pressed on the keyboard. |
| Show UI | The component can hide the galleri UI until the mouse has moved. See the `visibleUI` in the Data section below. |

#### Data

| Data | Description | Data type |
| ---- | ----------- | --------- |
| closed | Whether or not the gallery is currently closed | boolean |
| currentGroup | The group assigned to the current gallery, if any | string |
| images | An array with the image or images currently in the gallery | array |
| currentImageIndex | The currently displayed image's index | number |
| titles | The title values of the images currently in the gallery | array |
| visibleUI | Whether or not the gallery UI should be shown or not | boolean |

*Note that this data is available to you, but not necessarily something you always want to use. The `visibleUI` variable, for example, can be used to hide and show the UI based on mouse movement, but you may also simply not use it, and have the UI always visble, or make your own system for extended functionality.*

#### Methods

| Method | Description | Arguments | Return |
| ------ | ----------- | --------- | ------ |
| close() | Close the gallery | n/a | void |
| prev() | Go to the previous image in the gallery | n/a | void |
| next() | Go to the next image in the gallery | n/a | void |
| select(index) | Jump to a specific image in the gallery | index: The index of the image to jump to | void |
| showUI() | Force `visibleUI` to true and restart the disappearence timeout | n/a | void |

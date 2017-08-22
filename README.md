# sky-lightbox

A lightbox component written in Vue

## Dependencies

- [Vue](https://vuejs.org)
- [sky-crop](https://github.com/skybrud/sky-crop/)
- [sky-video](https://github.com/skybrud/sky-video/)

## Usage

`<sky-lightbox :items="itemsArray" type="images|videos"></sky-lightbox>`

- `items` is an Array of objects with `src` for both images and videos, but also `poster` for videos.
- `type` is a String determining if content is images or videos. If empty or not set, defaults to images.

## Credits
 
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!


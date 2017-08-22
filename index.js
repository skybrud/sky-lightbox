import Vue from 'vue';
import store from 'store';

import skyLightboxStore from './store';
import skyLightbox from './sky-lightbox';
import skyLightboxToggle from './sky-lightbox-toggle';

store.registerModule('skyLightbox', skyLightboxStore);

Vue.component('sky-lightbox', skyLightbox);
Vue.component('sky-lightbox-toggle', skyLightboxToggle);

export default skyLightbox;

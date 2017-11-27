import Vue from 'vue';
import Store from 'store';

import SkyLightbox from './SkyLightbox';
import SkyLightboxToggle from './SkyLightboxToggle';
import SkyLightboxStore from './store';

Store.addModule('SkyLightbox', SkyLightboxStore);

Vue.component('SkyLightbox', SkyLightbox);
Vue.component('SkyLightboxToggle', SkyLightboxToggle);

export default SkyLightbox;

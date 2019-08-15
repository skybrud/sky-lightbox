import SkyLightboxMixin from './SkyLightbox.mixin';
import SkyLightboxConstruct from './SkyLightbox.directive';
import SkyLightbox from './SkyLightbox.vue';

const install = (Vue, settings) => {
	const defaultOptions = {
		altAsTitle: false,
		// thumbnails: false,
		openOn: 'click',
		lightbox: SkyLightbox,
	};

	// eslint-disable-next-line no-param-reassign
	const options = Object.assign(defaultOptions, settings);

	Vue.directive('sky-lightbox', SkyLightboxConstruct(Vue, options));
};

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(install);
}

export { SkyLightboxMixin };
export default install;

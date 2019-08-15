const addPluginAttributes = (el, binding, options) => {
	// Defaults
	let group = binding.arg || null;
	let openOn;
	let src = el.src; // eslint-disable-line prefer-destructuring
	let title;
	// let thumbnails;
	const events = {};

	if (options.altAsTitle) title = el.alt;

	/* eslint-disable prefer-destructuring */
	// Assigning values from plugin initialization options here
	openOn = options.openOn;
	// thumbnails = options.thumbnails;
	/* eslint-enable prefer-destructuring */

	// Overriding options if they're provided in binding.value
	if (typeof binding.value !== 'undefined') {
		group = binding.value.group || group;
		openOn = binding.value.openOn || openOn;
		src = binding.value.src || src;
		title = binding.value.title || title;
		// Lifecycle functions
		events.opened = binding.value.opened;
		events.closed = binding.value.closed;
		events.changed = binding.value.changed;

		// binding.value.thumbnails could be set to false, (part before || will always be ignored)
		// that's why we're comparing it to undefined but not using approach
		// as in src, group, title, etc.
		// if (binding.value.thumbnails !== undefined) {
		// 	thumbnails = binding.value.thumbnails; // eslint-disable-line prefer-destructuring
		// }
	}

	// Setting up data attributes for dynamic properties
	el.setAttribute('data-sky-lightbox-src', src);

	if (group) el.setAttribute('data-sky-lightbox-group', group);
	if (title) el.setAttribute('data-sky-lightbox-title', title);
	// if (thumbnails) el.setAttribute('data-sky-lightbox-thumbnails', thumbnails);

	if (!src) console.error('sky-lightbox element missing src parameter.');

	return {
		src,
		group,
		title,
		events,
		openOn,
		// thumbnails,
	};
};

export default function contruct(Vue, options) {
	const Screen = Vue.extend(options.lightbox);

	return {
		update(el, binding, vnode, oldVnode) {
			let altUpdated;
			let srcUpdated;

			if (oldVnode.data.attrs && vnode.data.attrs) {
				srcUpdated = oldVnode.data.attrs.src !== vnode.data.attrs.src;
				// handle alt tag change only if option altAsTitle is enabled
				if (options.altAsTitle) {
					altUpdated = oldVnode.data.attrs.alt !== vnode.data.attrs.alt;
				}
			}

			const bindingValueUpdated = binding.oldValue !== binding.value;

			if (srcUpdated || altUpdated || bindingValueUpdated) {
				addPluginAttributes(el, binding, options);
			}
		},

		bind(el, binding) {
			// Don't pass anything that could be dynamic from addedAttributes
			// object to vm.
			const addedAttributes = addPluginAttributes(el, binding, options);

			// Finding existing vm, or creating new one
			let vm = window.skyLightbox;

			if (!vm) {
				const element = document.createElement('div');
				element.setAttribute('id', 'imageScreen');
				document.querySelector('body').appendChild(element);

				// eslint-disable-next-line no-multi-assign
				vm = window.skyLightbox = new Screen().$mount('#imageScreen');
			}

			// Updating vm's data
			el.addEventListener(addedAttributes.openOn, () => {
				let images;

				if (!el.dataset.skyLightboxGroup) {
					images = [el];
				} else {
					images = Array.from(document.querySelectorAll(`[data-sky-lightbox-group="${el.dataset.skyLightboxGroup}"]`));
				}

				Vue.set(vm, 'images', images.map(e => e.dataset.skyLightboxSrc));
				Vue.set(vm, 'titles', images.map(e => e.dataset.skyLightboxTitle));
				// Vue.set(vm, 'thumbnails', el.dataset.skyLightboxThumbnails === 'true');
				Vue.set(vm, 'currentImageIndex', images.indexOf(el));
				Vue.set(vm, 'handlers', addedAttributes.events);
				Vue.set(vm, 'closed', false);
			});
		},
	};
}

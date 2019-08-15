var SkyLightboxMixin = {
	data: function data() {
		return {
			images: [],
			titles: [],
			visibleUI: true,
			currentImageIndex: 0,
			closed: true,
			uiTimeout: null,
			handlers: {},
			thumbnails: false,
		};
	},
	watch: {
		closed: function closed(newVal) {
			if (newVal && this.handlers.closed) {
				this.handlers.closed();
			}
			if (!newVal && this.handlers.opened) {
				this.handlers.opened();
			}
		},
	},
	methods: {
		// Not using currentImageIndex watcher because it will
		// fire on all cases when opened not first image and
		// index should be changed in order to show clicked image
		// in the image set.
		fireChangeEvent: function fireChangeEvent() {
			if (this.handlers.changed) {
				this.handlers.changed(this.currentImageIndex);
			}
		},
		close: function close() {
			if (!this.closed) {
				document.querySelector('body').classList.remove('body-fs-v-img');
				this.images = [];
				this.currentImageIndex = 0;
				this.closed = true;
			}
		},
		next: function next() {
			if (!this.closed && this.images.length > 1) {
				// if next index not exists in array of images, set index to first element
				if (this.currentImageIndex + 1 < this.images.length) {
					this.currentImageIndex++;
				} else {
					this.currentImageIndex = 0;
				}
				this.fireChangeEvent();
			}
		},
		select: function select(selectedImage) {
			this.currentImageIndex = selectedImage;
		},
		prev: function prev() {
			if (!this.closed && this.images.length > 1) {
				// if prev index not exists in array of images, set index to last element
				if (this.currentImageIndex > 0) {
					this.currentImageIndex--;
				} else {
					this.currentImageIndex = this.images.length - 1;
				}
				this.fireChangeEvent();
			}
		},
		showUI: function showUI() {
			var this$1 = this;

			if (!this.closed) {
				// UI's hidden, we reveal it for some time only on mouse move and
				// ImageScreen appear
				clearTimeout(this.uiTimeout);
				this.visibleUI = true;
				this.uiTimeout = setTimeout(function () {
					this$1.visibleUI = false;
				}, 3500);
			}
		},
	},
	created: function created() {
		var this$1 = this;

		window.addEventListener('keyup', function (e) {
			// esc key and 'q' for quit
			if (e.keyCode === 27 || e.keyCode === 81) { this$1.close(); }
			// arrow right and 'l' key (vim-like binding)
			if (e.keyCode === 39 || e.keyCode === 76) { this$1.next(); }
			// arrow left and 'h' key (vim-like binding)
			if (e.keyCode === 37 || e.keyCode === 72) { this$1.prev(); }
		});
		window.addEventListener('scroll', function () {
			this$1.close();
		});
		window.addEventListener('mousemove', function () {
			this$1.showUI();
		});
	},
};

var addPluginAttributes = function (el, binding, options) {
	// Defaults
	var group = binding.arg || null;
	var openOn;
	var src = el.src; // eslint-disable-line prefer-destructuring
	var title;
	// let thumbnails;
	var events = {};

	if (options.altAsTitle) { title = el.alt; }

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

	if (group) { el.setAttribute('data-sky-lightbox-group', group); }
	if (title) { el.setAttribute('data-sky-lightbox-title', title); }
	// if (thumbnails) el.setAttribute('data-sky-lightbox-thumbnails', thumbnails);

	if (!src) { console.error('sky-lightbox element missing src parameter.'); }

	return {
		src: src,
		group: group,
		title: title,
		events: events,
		openOn: openOn,
		// thumbnails,
	};
};

function contruct(Vue, options) {
	var Screen = Vue.extend(options.lightbox);

	return {
		update: function update(el, binding, vnode, oldVnode) {
			var altUpdated;
			var srcUpdated;

			if (oldVnode.data.attrs && vnode.data.attrs) {
				srcUpdated = oldVnode.data.attrs.src !== vnode.data.attrs.src;
				// handle alt tag change only if option altAsTitle is enabled
				if (options.altAsTitle) {
					altUpdated = oldVnode.data.attrs.alt !== vnode.data.attrs.alt;
				}
			}

			var bindingValueUpdated = binding.oldValue !== binding.value;

			if (srcUpdated || altUpdated || bindingValueUpdated) {
				addPluginAttributes(el, binding, options);
			}
		},

		bind: function bind(el, binding) {
			// Don't pass anything that could be dynamic from addedAttributes
			// object to vm.
			var addedAttributes = addPluginAttributes(el, binding, options);

			// Finding existing vm, or creating new one
			var vm = window.skyLightbox;

			if (!vm) {
				var element = document.createElement('div');
				element.setAttribute('id', 'imageScreen');
				document.querySelector('body').appendChild(element);

				// eslint-disable-next-line no-multi-assign
				vm = window.skyLightbox = new Screen().$mount('#imageScreen');
			}

			// Updating vm's data
			el.addEventListener(addedAttributes.openOn, function () {
				var images;

				if (!el.dataset.skyLightboxGroup) {
					images = [el];
				} else {
					images = Array.from(document.querySelectorAll(("[data-sky-lightbox-group=\"" + (el.dataset.skyLightboxGroup) + "\"]")));
				}

				Vue.set(vm, 'images', images.map(function (e) { return e.dataset.skyLightboxSrc; }));
				Vue.set(vm, 'titles', images.map(function (e) { return e.dataset.skyLightboxTitle; }));
				// Vue.set(vm, 'thumbnails', el.dataset.skyLightboxThumbnails === 'true');
				Vue.set(vm, 'currentImageIndex', images.indexOf(el));
				Vue.set(vm, 'handlers', addedAttributes.events);
				Vue.set(vm, 'closed', false);
			});
		},
	};
}

var script = {
	name: 'SkyLightbox',
	mixins: [SkyLightboxMixin],
};

/* script */
            var __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"appear":"","name":"sky-lightbox-fade"}},[(!_vm.closed)?_c('div',{staticClass:"sky-lightbox",on:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }return _vm.close($event)}}},[_c('div',{staticClass:"sky-lightbox__display"},[_c('button',{staticClass:"sky-lightbox__button sky-lightbox__button--close",on:{"click":_vm.close}},[_c('span',[_vm._v("×")])]),_vm._v(" "),_c('img',{attrs:{"src":_vm.images[_vm.currentImageIndex]}})])]):_vm._e()])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyLightbox.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkyLightbox = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var install = function (Vue, settings) {
	var defaultOptions = {
		altAsTitle: false,
		// thumbnails: false,
		openOn: 'click',
		lightbox: SkyLightbox,
	};

	// eslint-disable-next-line no-param-reassign
	var options = Object.assign(defaultOptions, settings);

	Vue.directive('sky-lightbox', contruct(Vue, options));
};

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(install);
}

export default install;
export { SkyLightboxMixin };

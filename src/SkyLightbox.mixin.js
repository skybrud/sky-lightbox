export default {
	data() {
		return {
			currentGroup: '',
			images: [],
			titles: [],
			visibleUI: true,
			currentImageIndex: 0,
			closed: true,
			uiTimeout: null,
			handlers: {},
		};
	},
	watch: {
		closed(newVal) {
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
		fireChangeEvent() {
			if (this.handlers.changed) {
				this.handlers.changed(this.currentImageIndex);
			}
		},
		close() {
			if (!this.closed) {
				// document.querySelector('body').classList.remove('body-fs-v-img'); // ? Doesn't seem to be used
				this.currentGroup = '';
				this.images = []; // ? Does clearing images et al. on close ruin possibilities of transitions and animations?
				this.currentImageIndex = 0;
				this.closed = true;
			}
		},
		next() {
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
		select(selectedImage) {
			if (this.images.length) { // Possible failsafe for unreasonable numbers
				while (selectedImage < 0) {
					selectedImage += this.images.length;
				}
				selectedImage %= this.images.length;
			}

			this.currentImageIndex = selectedImage;
			this.fireChangeEvent();
		},
		prev() {
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
		showUI() {
			if (!this.closed) {
				// UI's hidden, we reveal it for some time only on mouse move and
				// ImageScreen appear
				clearTimeout(this.uiTimeout);
				this.visibleUI = true;
				this.uiTimeout = setTimeout(() => {
					this.visibleUI = false;
				}, 3500);
			}
		},
	},
	created() {
		window.addEventListener('keyup', (e) => {
			// esc key and 'q' for quit
			if (e.keyCode === 27 || e.keyCode === 81) this.close();
			// arrow right and 'l' key (vim-like binding)
			if (e.keyCode === 39 || e.keyCode === 76) this.next();
			// arrow left and 'h' key (vim-like binding)
			if (e.keyCode === 37 || e.keyCode === 72) this.prev();
		});
		window.addEventListener('scroll', () => {
			this.close();
		});
		window.addEventListener('mousemove', () => {
			this.showUI();
		});
	},
};

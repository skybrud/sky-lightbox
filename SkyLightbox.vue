<script>
import SkyCrop from 'SkyCrop';
import SkyVideo from 'SkyVideo';

export default {
	components: {
		SkyCrop,
		SkyVideo,
	},
	props: {
		items: Array,
		type: String,
		name: {
			type: String,
			required: true,
		},
		setOpen: {
			default: false,
		},
		navigation: {
			type: String,
			default: 'numbers',
		},
	},
	computed: {
		open() {
			if (this.$store.getters['SkyLightbox/isOpen']) {
				return this.$store.getters['SkyLightbox/isOpen'](this.name);
			}

			return null;
		},
		activeIndex() {
			if (this.$store.getters['SkyLightbox/getActiveIndex']) {
				return this.$store.getters['SkyLightbox/getActiveIndex'](this.name);
			}

			return null;
		},
	},
	methods: {
		setActive(index) {
			if (this.open) {
				this.$store.commit('SkyLightbox/SET_ACTIVE_INDEX', {
					name: this.name,
					activeIndex: index,
				});
			}
		},
		next() {
			const activeIndex = this.$store.getters['SkyLightbox/getActiveIndex'](this.name);
			if (activeIndex === this.items.length - 1) {
				this.setActive(0);
			} else if (activeIndex < this.items.length) {
				this.setActive(activeIndex + 1);
			}
		},
		previous() {
			const activeIndex = this.$store.getters['SkyLightbox/getActiveIndex'](this.name);
			if (activeIndex === 0) {
				this.setActive(this.items.length - 1);
			} else if (activeIndex < this.items.length) {
				this.setActive(activeIndex - 1);
			}
		},
		toggle() {
			this.$store.commit('SkyLightbox/TOGGLE', {
				name: this.name,
				activeIndex: this.activeIndex,
			});
		},
		close() {
			if (this.open) {
				this.$store.commit('SkyLightbox/CLOSE', this.name);
			}
		},
	},
	mounted() {
		this.$store.commit('SkyLightbox/REGISTER', {
			name: this.name,
			open: this.setOpen,
			activeIndex: 0,
		});
		// key bindings
		window.addEventListener('keyup', (event) => {
			const keyCode = event.keyCode;

			// close overlay on ESC key
			if (keyCode === 27) {
				this.close();
			}

			// arrow key - right
			if (keyCode === 39) {
				this.next();
			}

			// arrow key - left
			if (keyCode === 37) {
				this.previous();
			}
		});
	},
};
</script>

<template src="./SkyLightbox.html"></template>
<style src="./SkyLightbox.scss" scoped></style>

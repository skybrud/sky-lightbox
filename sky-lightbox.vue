<script>
import SkyCrop from 'sky-crop';
import SkyVideo from 'sky-video';

export default {
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
	},
	components: {
		SkyCrop,
		SkyVideo,
	},
	created() {
		// register the overlay in Store
		this.$store.commit('skyLightbox/register', {
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
	methods: {
		setActive(index) {
			if (this.open) {
				this.$store.commit('skyLightbox/setActiveIndex', {
					name: this.name,
					activeIndex: index,
				});
			}
		},
		next() {
			const activeIndex = this.$store.getters['skyLightbox/getOverlay'](this.name).activeIndex;
			if (activeIndex === this.items.length - 1) {
				this.setActive(0);
			} else if (activeIndex < this.items.length) {
				this.setActive(activeIndex + 1);
			}
		},
		previous() {
			const activeIndex = this.$store.getters['skyLightbox/getOverlay'](this.name).activeIndex;
			if (activeIndex === 0) {
				this.setActive(this.items.length - 1);
			} else if (activeIndex < this.items.length) {
				this.setActive(activeIndex - 1);
			}
		},
		toggle() {
			this.$store.commit('skyLightbox/toggle', {
				name: this.name,
				activeIndex: this.activeIndex,
			});
		},
		close() {
			if (this.open) {
				this.$store.commit('skyLightbox/close', this.name);
			}
		},
	},
	computed: {
		open() {
			return this.$store.getters['skyLightbox/getOverlay'](this.name).open;
		},
		activeIndex() {
			return this.$store.getters['skyLightbox/getOverlay'](this.name).activeIndex;
		},
	},
};
</script>

<template src="./sky-lightbox.html"></template>
<style src="./sky-lightbox.scss"></style>

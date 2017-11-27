<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	methods: {
		toggle() {
			if (this.name) {
				this.$store.commit('SkyLightbox/TOGGLE', {
					name: this.name,
				});
			}
		},
	},
	template: '<button class="sky-lightbox-toggle" @click="toggle"><slot></slot></button>',
};
</script>

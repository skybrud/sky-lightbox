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
				this.$store.commit('skyLightbox/toggle', {
					name: this.name,
				});
			}
		},
	},
	template: '<button class="sky-lightbox-toggle" v-on:click="toggle"><slot></slot></button>',
};
</script>

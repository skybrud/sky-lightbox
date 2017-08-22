const getters = {
	overlays(state) {
		return state.overlays;
	},
	getOverlay(state) {
		return name => state.overlays[name];
	},
};

export default getters;

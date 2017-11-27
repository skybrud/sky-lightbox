const getters = {
	overlays(state) {
		return state.overlays;
	},
	getOverlay(state) {
		return name => state.overlays[name];
	},
	isOpen(state) {
		return (name) => {
			const overlay = state.overlays[name];
			return (overlay) ? overlay.open : false;
		};
	},
	getActiveIndex(state) {
		return (name) => {
			const overlay = state.overlays[name];
			return (overlay) ? overlay.activeIndex : false;
		};
	},
};

export default getters;

import Vue from 'vue';

const mutations = {
	REGISTER(state, p) {
		Vue.set(state.overlays, p.name, {
			name: p.name,
			open: p.open,
			activeIndex: 0,
		});
	},
	SET_ACTIVE_INDEX(state, p) {
		const overlay = state.overlays[p.name];
		Vue.set(overlay, 'activeIndex', p.activeIndex);
	},
	TOGGLE(state, p) {
		const overlay = state.overlays[p.name];
		Vue.set(overlay, 'open', !overlay.open);

		// set active index to start at specific slide
		// set to 0 if not set in payload
		Vue.set(overlay, 'activeIndex', p.activeIndex || 0);
	},
	CLOSE(state, name) {
		const overlay = state.overlays[name];
		Vue.set(overlay, 'open', false);
	},
};

export default mutations;

import Vue from 'vue';

const mutations = {
	register(state, p) {
		Vue.set(state.overlays, p.name, {
			name: p.name,
			open: p.open,
			activeIndex: 0,
		});
	},
	setActiveIndex(state, p) {
		const overlay = state.overlays[p.name];
		Vue.set(overlay, 'activeIndex', p.activeIndex);
	},
	toggle(state, p) {
		const overlay = state.overlays[p.name];
		Vue.set(overlay, 'open', !overlay.open);

		// set active index to start at specific slide
		// set to 0 if not set in payload
		Vue.set(overlay, 'activeIndex', p.activeIndex || 0);
	},
	close(state, name) {
		const overlay = state.overlays[name];
		Vue.set(overlay, 'open', false);
	},
};

export default mutations;

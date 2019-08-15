<script>
import SkyLightboxMixin from './SkyLightbox.mixin';

export default {
	name: 'SkyLightbox',
	mixins: [SkyLightboxMixin],
};
</script>
<style lang="scss">
    .sky-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        height: 100vh;
        width: 100vw;
        padding: 50px;
        overflow: hidden;
        background-color: transparentize($color: #fff, $amount: 0);
        touch-action: none;
    }

    .sky-lightbox__display {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;

        img {
            height: auto;
            width: auto;
            max-width: 90%;
            max-height: 90%;
            margin-bottom: 0;
        }
    }

    .sky-lightbox__button {
        position: absolute;
        top: 0;
        right: 0;
        border: 0;
        padding: 0;
        background-color: #333;
        color: #fff;
        cursor: pointer;

        > span {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1;
            width: 50px;
            height: 50px;
            transform: translateY(-0.1em);
        }

        &--close {
            font-size: 30px;
        }
    }
</style>

<template>
	<transition
		appear
		name="sky-lightbox-fade"
	>
		<div
			v-if="!closed"
			class="sky-lightbox"
			@click.self="close"
		>
			<div class="sky-lightbox__display">
				<button
					class="sky-lightbox__button sky-lightbox__button--close"
					@click="close"
				>
					<span>&times;</span>
				</button>

				<img :src="images[currentImageIndex]" >
			</div>
		</div>
	</transition>
</template>

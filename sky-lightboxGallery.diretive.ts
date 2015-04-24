/* global angular */
(function () {
	'use strict';
	angular.module('skyLightbox').directive('skyLightboxGallery',skyLightboxGallery);

	skyLightboxGallery.$inject = [];

	function skyLightboxGallery() {
		var directive = {
			restrict:'A',
			require:'^skyLightbox',
			link:link
		};

		function link(scope,element,attributes,skyLightboxCtrl) {
			skyLightboxCtrl.addImage(element,attributes.href,attributes.skyLightboxGallery);
		}

		return directive;
	}

})();

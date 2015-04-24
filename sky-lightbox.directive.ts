/* global angular */

interface Element {
    focus?:any
}

(function () {
	'use strict';

	angular.module('skyLightbox').directive('skyLightbox',skyLightbox);

	skyLightbox.$inject = ['$timeout','$sce','$window','skyWindowSizeListener','skyFit'];

	function skyLightbox($timeout, $sce, $window, skyWindowSizeListener, skyFit) {
		var directive = {
			restrict:'A',
			transclude:true,
			scope:true,
			templateUrl:'/sky-lightbox/sky-lightbox.html',
			link:link,
			controller:skyLightboxCtrl
		};

		skyLightboxCtrl.$inject = ['$scope'];

		function skyLightboxCtrl($scope) {

			var _this = this;

			$scope.galleries={};
			$scope.active = {
				gallery:'',
				obj:{},
				size:{}
			};

			$scope.windowSize = skyWindowSizeListener.add($scope);
			var margins = {
				top:60,
				bottom:90,
				left:60,
				right:60
			};

            var resizeWatcher: any = false;

			_this.show = function(gallery,image,noautostart) {
				var autostart = (noautostart ? 0 : 1);

				if (!resizeWatcher) {
					resizeWatcher = $scope.$watch('windowSize', function() {
						if($scope.active.obj.video) {
							_this.fit();
						} else {
							_this.fit($scope.active.obj.image);
						}
					},true);
				}



				$timeout(function(){
					$scope.active.index = $scope.galleries[gallery].indexOf(image);
					$scope.active.gallery=gallery;
					$scope.active.obj=image;
					if($scope.active.obj.video) {
						$scope.active.obj.videourl = $sce.trustAsResourceUrl($scope.active.obj.video.toString()+'&autoplay='+autostart);
						_this.fit();
					} else {
						_this.fit($scope.active.obj.image);
					}

					/* Set focus on the 'next'-button, for accessibility */
					$timeout(function() {
						if(autostart && $scope.galleries[gallery].length>1) {
							document.querySelector('#imgDisplay .controls button:last-child').focus();
						}
					},50);


				},0);
			};

			_this.fit = function(obj) {
				var fitSize = {
					//fit to windowSize - margins
					width:$scope.windowSize.width - margins.left - margins.right,
					height:$scope.windowSize.height - margins.top - margins.bottom
				};

				if (obj) {
					var img = new Image();
					img.src = obj;
					img.onload = function() {
						var srcSize = {
							width:img.naturalWidth,
							height:img.naturalHeight
						};
						$timeout(function() {
							$scope.active.size = skyFit.contain(srcSize, fitSize);
						},0);
					};
				} else {
					var autoSize = {
						width:1920,
						height:1080
					};
					$timeout(function() {
						$scope.active.size = skyFit.contain(autoSize, fitSize);
					},0);
				}
			};

			_this.parseVideo = function(url):string|boolean {
				var match='';
				/* TODO: implement videoParserService */
				if (url.match(/youtu/)) {
					match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
					if (match&&match[7].length==11){
						return '//www.youtube.com/embed/'+match[7]+'?rel=0&wmode=transparent';
					} else {
						return false;
					}
				}
				if (url.match(/vimeo/)) {
					match = url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);
					if (match){
						return '//player.vimeo.com/video/'+match[2]+'?title=0&amp;byline=0&amp;portrait=0';
					} else {
						return false;
					}
				}
				return false;
			};

			_this.addImage = function(element,image,g) {
				var gallery = g || Math.random().toString(25).substring(2,9); /* random string, if no gallery provided ... */
				if (!$scope.galleries[gallery]) {
					$scope.galleries[gallery]=[];
				}
				image = {
					image:image,
					video:_this.parseVideo(image)
				};

				$scope.galleries[gallery].push(image);

				if (image.video) {
					element.addClass('video');
				}

				element.on('click', function(event) {
					if (window.innerWidth > 700) {
						event.preventDefault();
						_this.show(gallery,image);
						return;
					}

					if (image.video) {
						event.preventDefault();
						element.replaceWith('<div class="inline-outer"><div class="inner"><iframe src="'+image.video+'"></iframe></div></div>');
					}

					return;
				});
			};

			_this.next = function() {
				var nextPosition = $scope.active.index+1;
				var currentGallery = $scope.galleries[$scope.active.gallery];
				_this.show($scope.active.gallery,currentGallery[(nextPosition !== currentGallery.length) ? nextPosition : 0],true);
			};
			_this.prev = function() {
				var nextPosition = $scope.active.index-1;
				var currentGallery = $scope.galleries[$scope.active.gallery];
				_this.show($scope.active.gallery,currentGallery[(nextPosition < 0) ? currentGallery.length-1 : nextPosition],true);
			};
			_this.close = function() {
				$timeout(function() {
					$scope.active = {
						gallery:'',
						obj:{}
					};
					//remove resize $watch
					resizeWatcher();
					resizeWatcher = false;
				});
			};

			$scope.next = _this.next;
			$scope.prev = _this.prev;
			$scope.close = _this.close;

		}

		function link(scope, element, attributes) {

			var keyHandler = function(event) {
				if(event.keyCode === 39) {
					scope.next();
				}
				if(event.keyCode === 37) {
					scope.prev();
				}
				if(event.keyCode === 27) {
					scope.close();
				}
			};

			var logKeys=false;
			scope.$watch('active', function() {
				if(!logKeys && scope.active.gallery) {
					angular.element($window).on('keydown',keyHandler);
					logKeys=true;
				}
				else if (logKeys && !scope.active.gallery) {
					angular.element($window).off('keydown',keyHandler);
					logKeys=false;
				}
			},true);
		}

		return directive;

	}

})();

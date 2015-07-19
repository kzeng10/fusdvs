angular.module('testApp', ['testAppdata', 'ngRoute'])
	.config(function($routeProvider, $locationProvider){
			$routeProvider
			.when('/',{templateUrl:'partials/main.html'})
			//when('/view/:id',{templateUrl:'/partials/view.html',controller:'viewController'}).
			.otherwise({redirectTo:'/'});
			$locationProvider.html5Mode(true);
		})
	.controller('TestCtrl', ['$rootScope', '$location', "speak", 'socketio', '$timeout', function ($rootScope, $location, speak, socketio, $timeout) {
		'use strict';

		$rootScope.newchannel = {
			pw: '',
			name: '',
			focus: false
		};
		$rootScope.entered = {
			pw: ''
		};
		$rootScope.isCreator = false; 
		$rootScope.authorized = false;
		$rootScope.showPWAlert = false;
		$rootScope.showCCAlert = false;
		$rootScope.correctPassword = undefined;
		$rootScope.peopleDir = ['Ann Crosbie', 'Larry Sweeney', 'Yang Shao', 'Michele Berke', 'Joshua Basa'];
		$rootScope.selectedPerson = ''; 		//text input or dropdown menu?


		$rootScope.remove = function(index) {
			if(confirm("Would you like to remove " + $rootScope.people[index].name + "?")) {
				speak.remove(index);
			}
		};
		$rootScope.add = function(name) {
			var time = new Date();
			var newPerson = {name: name, time: time.toLocaleTimeString() + " on " + time.toLocaleDateString()};
			speak.save(newPerson);
		};
		$rootScope.clearAll = function() {
			if(confirm("Would you like to clear the list?")) {
				speak.clearAll();
			}
		};
		$rootScope.clearHistory = function() {
			if(confirm("Would you like to clear the history?")) {
				speak.clearHistory();
			}
		};


		$rootScope.checkPW = function() { //change me!!!
			var enteredhash = CryptoJS.SHA512($rootScope.entered.pw).toString(CryptoJS.enc.Base64);
			console.log(enteredhash);
			if(enteredhash === $rootScope.correctPassword) {
				//entry granted
				$rootScope.authorized = true;
			}
			else{
				$rootScope.showPWAlert = true;
				$timeout(function() {
					$rootScope.showPWAlert = false;
				}, 3000);
			}
			
		};
		$rootScope.CCAlert = function() {
			$rootScope.showCCAlert = true;
			$timeout(function() {
				$rootScope.showCCAlert = false;
			}, 3000);
		}
		$rootScope.retrievePW = function() {
			socketio.emit('pw', {msg:'check', channel: $rootScope.channel});
		};
		$rootScope.goToNewChannel = function() {
			var hash = CryptoJS.SHA512($rootScope.newchannel.pw).toString(CryptoJS.enc.Base64);
			socketio.emit('pw', {msg: 'new', hash: hash, channel: $rootScope.newchannel.name });
			$rootScope.isCreator = true; //so you don't have to enter in password again
			$location.search('channel', $rootScope.newchannel.name); //moving to new channel
			$rootScope.newchannel = { //reset newchannel
				pw: '',
				name: '',
				focus: false
			};
			$rootScope.updateChannel();
		};
		$rootScope.gotoExistingChannel = function() {
			$rootScope.isCreator = false;
			$location.search('channel', $rootScope.existingChannel);
			$rootScope.updateChannel();
		}
		$rootScope.updateChannel = function() {
			speak.updateChannel();
			$rootScope.channel = $location.search().channel || 'default';
			$rootScope.people = speak.query();
			$rootScope.history = speak.queryHistory();
			$rootScope.retrievePW();
			$rootScope.reinitSockets();
			$rootScope.CCAlert();
		};
		$rootScope.reinitSockets = function() {
			socketio.on('personAdder_'+$rootScope.channel, function (person) {
	            $rootScope.people.push(person);
	            $rootScope.history.push(person);
	        });
	        socketio.on('personRemover_'+$rootScope.channel, function(index) {
	        	if(index == "all") {
	        		$rootScope.people = [];
	        	}
	        	else if(index == "historyClear") {
	        		$rootScope.history = [];
	        	}
	        	else{
	        		$rootScope.people.splice(index, 1);
	        	}
	        }); 
	        socketio.on('pw_'+$rootScope.channel, function(val) {
	        	$rootScope.correctPassword = val;
	        	$rootScope.authorized = !!!val || $rootScope.isCreator;
	        });
		};

        $rootScope.updateChannel();
	}])
	// From http://briantford.com/blog/angular-socket-io
	.factory('socketio', ['$rootScope', function ($rootScope) {
		'use strict';
		
		var socket = io.connect({
		    'reconnection': true,
		    'reconnectionDelay': 1000,
		    'reconnectionAttempts': 3
		});
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	}])
	.directive('modal', function () {
	    return {
			template: '<div class="modal fade" data-backdrop="static" data-keyboard="false">' + 
			  '<div class="modal-dialog">' + 
			    '<div class="modal-content">' + 
			      '<div class="modal-header">' + 
			        '<h4 class="modal-title">{{ title }}</h4>' + 
			      '</div>' + 
			      '<div class="modal-body" ng-transclude></div>' + 
			    '</div>' + 
			  '</div>' + 
			'</div>',
			restrict: 'E',
			transclude: true,
			replace:true,
			scope:true,
			link: function postLink(scope, element, attrs) {
				scope.title = attrs.title;

				scope.$watch(attrs.visible, function(value){
				  if(value == true)
				    $(element).modal('show');
				  else
				    $(element).modal('hide');
				});

				$(element).on('shown.bs.modal', function(){
				  scope.$apply(function(){
				    scope.$parent[attrs.visible] = true;
				  });
				});

				$(element).on('hidden.bs.modal', function(){
				  scope.$apply(function(){
				    scope.$parent[attrs.visible] = false;
				  });
				});
			}
		};
    })
	.directive('onEnter', ['$document', function ($document) {
		return function (scope, element, attrs) {
	        $document.bind("keydown keypress", function (e) {
	        	var keycode = (!!e.keyCode ? e.keyCode : e.which).toString();
	            if(keycode === '13' && !!scope.selectedPerson && !scope.newchannel.focus) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.onEnter);
	                });

	                e.preventDefault();
	            }
	        });
	    };
	}]);
	

	
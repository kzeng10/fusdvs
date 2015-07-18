angular.module('testApp', ['testAppdata', 'ngRoute'])
	.config(function($routeProvider, $locationProvider){
			$routeProvider
			.when('/',{templateUrl:'partials/main.html'})
			//when('/view/:id',{templateUrl:'/partials/view.html',controller:'viewController'}).
			.otherwise({redirectTo:'/'});
			$locationProvider.html5Mode(true);
		})
	.controller('TestCtrl', ['$scope', '$location', "speak", 'socketio', '$timeout', function ($scope, $location, speak, socketio, $timeout) {
		'use strict';
		$scope.newchannel = {
			name: '',
			pw: ''
		};
		$scope.authorized = false; //hasPassword()
		$scope.password = undefined;
		$scope.showAlert = false;
		$scope.channel = $location.search().channel || 'default';
		$scope.people = speak.query();
		$scope.history = speak.queryHistory();
		$scope.peopleDir = ['Ann Crosbie', 'Larry Sweeney', 'Yang Shao', 'Michele Berke', 'Joshua Basa'];
		$scope.selectedPerson = ''; 		//text input or dropdown menu?
		$scope.remove = function(index) {
			if(confirm("Would you like to remove " + $scope.people[index].name + "?")) {
				speak.remove(index);
			}
		};
		$scope.add = function(name) {
			var time = new Date();
			var newPerson = {name: name, time: time.toLocaleTimeString() + " on " + time.toLocaleDateString()};
			speak.save(newPerson);
		};
		$scope.clearAll = function() {
			if(confirm("Would you like to clear the list?")) {
				speak.clearAll();
			}
		};
		$scope.clearHistory = function() {
			if(confirm("Would you like to clear the history?")) {
				speak.clearHistory();
			}
		};
		$scope.onSubmit = function() {
			//if password doesn't match
			$scope.showAlert = true;
			$timeout(function() {
				$scope.showAlert = false;
			}, 5000);
		};
		$scope.retrievePW = function() {
			socketio.emit('pw', {msg:'check', channel:$scope.channel});
		};
		$scope.goToNewChannel = function() {
			var hash = CryptoJS.SHA512($scope.newchannel.pw).toString(CryptoJS.enc.Base64);
			console.log($scope.newchannel.name + " " + hash);
			socketio.emit('pw', {msg: 'new', hash: hash, channel: $scope.newchannel.name });
			$location.search('channel', $scope.newchannel.name);
			$scope.update();
			$scope.authorized = true; //so you don't have to enter in password again
		};
		$scope.update = function() {
			$scope.channel = $location.search().channel || 'default';
			$scope.people = speak.query();
			$scope.history = speak.queryHistory();
		};
		socketio.on('personAdder_'+$scope.channel, function (person) {
            $scope.people.push(person);
            $scope.history.push(person);
        });
        socketio.on('personRemover_'+$scope.channel, function(index) {
        	if(index == "all") {
        		$scope.people = [];
        	}
        	else if(index == "historyClear") {
        		$scope.history = [];
        	}
        	else{
        		$scope.people.splice(index, 1);
        	}
        });
        socketio.on('pw', function(val) {
        	$scope.password = val;
        	$scope.authorized = !!!val;
        });

	}])
	// From http://briantford.com/blog/angular-socket-io
	.factory('socketio', ['$rootScope', function ($rootScope) {
		'use strict';
		
		var socket = io.connect();
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
	            if(keycode === '13' && !!scope.selectedPerson) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.onEnter);
	                });

	                e.preventDefault();
	            }
	        });
	    };
	}]);
	

	
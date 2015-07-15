angular.module('testApp', ['testAppdata', 'ngRoute'])
	.config(function($routeProvider, $locationProvider){
			$routeProvider
			.when('/',{templateUrl:'partials/main.html'})
			//when('/view/:id',{templateUrl:'/partials/view.html',controller:'viewController'}).
			.otherwise({redirectTo:'/'});
			$locationProvider.html5Mode(true);
		})
	.controller('TestCtrl', ['$scope', '$location', "speak", 'socketio', function ($scope, $location, speak, socketio) {
		'use strict';
		$scope.channel = $location.search().channel || 1;
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
        })
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
	}]);

	
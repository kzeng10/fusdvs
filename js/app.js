angular.module('testApp', ['testAppdata', 'ngRoute'])
	.config(function($routeProvider, $locationProvider){
			$routeProvider
			.when('/',{templateUrl:'partials/main.html'})
			//when('/view/:id',{templateUrl:'/partials/view.html',controller:'viewController'}).
			.otherwise({redirectTo:'/'});
			$locationProvider.html5Mode(true);
		})
	.controller('TestCtrl', ['$scope', "speak", 'socketio', function ($scope, speak, socketio) {
		'use strict';
		$scope.people = speak.query();
		$scope.peopleDir = ['Person1','Person2','Person3'];
		$scope.selectedPerson = $scope.peopleDir[0];
		console.log($scope.selectedPerson);
		$scope.remove = function(index) {
			speak.remove(index);
			// $scope.people.splice(index, 1);
		}
		$scope.add = function(name) {
			// console.log(name);
			var newPerson = {name: name};
			speak.save(newPerson);
		}
		socketio.on('personAdder', function (person) {
            $scope.people.push(person);
        });
        socketio.on('personRemover', function(index) {
        	$scope.people.splice(index, 1);
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
	
angular.module('testAppdata', ['ngResource']).factory('speak', ['$resource', function($resource) {
    'use strict';
    
    var server = $resource('/people');
    var deleteurl = $resource('/remove');
    return {
        save: function (person) {
            console.log(person);
            server.save(person);
        },
        
        query: function () {
            return server.query();
        },

        remove: function (index) {
            // deleteurl.save(person);
            console.log(index);
            deleteurl.save({index:index});

        }
    };
}]);
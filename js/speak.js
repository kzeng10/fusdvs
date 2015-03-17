angular.module('testAppdata', ['ngResource']).factory('speak', ['$resource', function($resource) {
    'use strict';
    
    var server = $resource('/people');
    var history = $resource('/history');
    var deleteurl = $resource('/remove');
    return {

        save: function (person) {
            console.log(person);
            server.save(person);
        },
        
        query: function () {
            return server.query();
        },

        queryHistory: function() {
            return history.query();
        },

        clearHistory: function() {
            console.log("Cleared history!");
            history.save({clear: true});
        },

        remove: function (index) {
            // deleteurl.save(person);
            console.log(index);
            deleteurl.save({index:index});
        },

        clearAll: function() {
            console.log("Cleared all!");
            deleteurl.save({clearAll: true});
        }
    };
}]);
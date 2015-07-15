angular.module('testAppdata', ['ngResource']).factory('speak', ['$resource', '$location', function ($resource, $location) {
    'use strict';
    
    var channel = $location.search().channel || 'default';
    var server = $resource('/people', {channel:channel});
    var history = $resource('/history', {channel:channel});
    var deleteurl = $resource('/remove', {channel:channel});
    
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

        queryDefaultChannel: function() {
            return defaultChannel;
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
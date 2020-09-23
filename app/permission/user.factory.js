(function() {
    'use strict';

    angular
        .module('app.permission')
        .factory('UserService', UserService);

    /* @ngInject */
    function UserService($q, RoleStore) {
        //var currentUser =  angular.fromJson(sessionStorage.currentUser) ;
        var service = {
            getCurrentUser: getCurrentUser,
            hasPermission: hasPermission,
            checkIfHasPermission : checkIfHasPermission,
            ifUserHasPermission: ifUserHasPermission

        };

        return service;

        ///////////////

        function getCurrentUser() {
            return angular.fromJson(sessionStorage.currentUser);
        }
        function checkIfHasPermission(permission) {
            var hasPermission = false;
            var currentUser = getCurrentUser();
            angular.forEach(currentUser.roles, function(role) {
                if(RoleStore.hasRoleDefinition(role)) {
                    // get the role
                    var roles = RoleStore.getStore();

                    if(angular.isDefined(roles[role])) {
                        // check if the permission we are validating is in this role's permissions
                        if(-1 !== roles[role].validationFunction.indexOf(permission)) {
                            hasPermission = true;
                        }
                    }
                }
            })
            return hasPermission;
        }
        function hasPermission(permission, currentUser) {
            var deferred = $q.defer();
            var hasPermission = false;

            // check if user has permission via its roles
            angular.forEach(currentUser.roles, function(role) {
                // check role exists
                if(RoleStore.hasRoleDefinition(role)) {
                    // get the role
                    var roles = RoleStore.getStore();

                    if(angular.isDefined(roles[role])) {
                        // check if the permission we are validating is in this role's permissions
                        if(-1 !== roles[role].validationFunction.indexOf(permission)) {
                            hasPermission = true;
                        }
                    }
                }
            });

            // if we have permission resolve otherwise reject the promise
            if(hasPermission) {
                deferred.resolve();
            }
            else {
                deferred.reject();
            }

            // return promise
            return deferred.promise;
        }
        function ifUserHasPermission(permission) {
            if(-1 !== getCurrentUser().permissions.indexOf(permission)) {
                return  true;
            }
            else
                return false;
            
        }
    }
})();

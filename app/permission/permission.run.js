(function() {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $state, PermissionStore, RoleStore, UserService) {
        // normally this would be done at the login page but to show quick
        // demo we grab username from cookie and login the user
        // var cookieUser = $cookies.get('tri-user');
        // if(angular.isDefined(cookieUser)) {
        //     UserService.login(cookieUser);
        // }
        //console.log(JSON.parse(sessionStorage.permissions))
        var permissions =[];
        var sessionUser;
        if(angular.isDefined(sessionStorage.currentUser)) {
            sessionUser = angular.fromJson(sessionStorage.currentUser) ;
            permissions = sessionUser.permissions;
        }
        // permissions =['add','oo'];
        // console.log( angular.toJson(sessionStorage.permissions))
        // create permissions and add check function verify all permissions
        //var permissions = sessionStorage.permissions ;//['viewEmail', 'viewGitHub', 'viewCalendar', 'viewLayouts', 'viewTodo', 'viewElements', 'viewAuthentication', 'viewCharts', 'viewMaps'];
        PermissionStore.defineManyPermissions(permissions, function (permissionName) {
            return UserService.hasPermission(permissionName, sessionUser);
        });

        // create roles for app
        RoleStore.defineManyRoles({
            'LOGEDUSER': permissions
        });


        ///////////////////////

        // default redirect if access is denied
        function accessDenied() {
            $state.go('authentication.login');
        }

        // watches

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            deniedHandle();
        });
    }
})();

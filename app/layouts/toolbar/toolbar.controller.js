(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('ToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($window,$scope,UserService,PermissionStore,RoleStore, $translate, $rootScope,triLoaderService, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, $document, triBreadcrumbsService, triSettings, triLayout) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        if(angular.isDefined(sessionStorage.currentLanguage)){
            var selectedLang = vm.languages.find(FindLanguageByCode);
            selectedLang.isSelected = true;
            vm.selectedLanguage = selectedLang.key;
        }
        else{
            var selectedLang = vm.languages.find(FindLanguageDefault);
            selectedLang.isSelected = true;
            vm.selectedLanguage = 'en'
        }

        function FindLanguageByCode(language) {
            return language.key === sessionStorage.currentLanguage;
        }
        function FindLanguageDefault(language) {
            return language.key === 'en';
        }
        
        
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.isFullScreen = false;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;
        vm.currentUser = UserService.getCurrentUser();
        // if(!angular.isDefined(vm.currentUser)){
        //     $window.location.reload();
        // }
        vm.logout = function(){
            $window.localStorage.setItem('logged_out', true);
            sessionStorage.clear();
            var permissions =[];
            PermissionStore.defineManyPermissions(permissions, function (permissionName) {
                return UserService.hasPermission(permissionName, sessionUser);
            });
    
            // create roles for app
            RoleStore.defineManyRoles({
                'LOGEDUSER': permissions
            });
            $state.go('authentication.login');
        };
        ////////////////

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }
        function switchLanguage(languageCode) {
            triLoaderService.setLoaderActive(true);
            $translate.use(languageCode)
            .then(function() {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Language Changed'))
                    .position('bottom right')
                    .hideDelay(500)
                );
                $rootScope.$emit('changeTitle');
            }).then(function(){
                function CallbackFunctionToFindLanguageById(language) {

                    return language.key === languageCode;
                }
                angular.forEach(vm.languages,function(value,index){
                    value.isSelected = false;
                })
                var selectedLang = vm.languages.find(CallbackFunctionToFindLanguageById);
                sessionStorage.currentLanguage = selectedLang.key;
                vm.selectedLanguage = selectedLang.key;
                selectedLang.isSelected = true;
                sessionStorage.currentLangDirection = selectedLang.dir;
                var MainContainer = angular.element( document.querySelector( '#nonoMainContainer' ) );
                MainContainer = MainContainer.parent();
                MainContainer.removeClass('nonoltr');
                MainContainer.removeClass('nonortl');
                MainContainer.addClass('nono'+ selectedLang.dir);
                MainContainer.css('direction', selectedLang.dir);
                triLoaderService.setLoaderActive(false);
                //$window.location.reload();
            });
        }

        function hideMenuButton() {
            switch(triLayout.layout.sideMenuSize) {
                case 'hidden':
                    // always show button if menu is hidden
                    return false;
                case 'off':
                    // never show button if menu is turned off
                    return true;
                default:
                    // show the menu button when screen is mobile and menu is hidden
                    return $mdMedia('gt-sm');
            }
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();

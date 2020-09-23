(function() {
    'use strict';

    angular
        .module('app')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $window) {
        function storageChange (event) {
            if(event.key === 'logged_out') {
                $window.localStorage.setItem('logged_out', true);
                sessionStorage.clear();
                $state.go('authentication.login');
                $window.location.reload();
            }
        }
        $window.addEventListener('storage', storageChange, false);
        // default redirect if access is denied
        function redirectError() {
            $state.go('500');
        }

        // watches

        // redirect all errors to permissions to 500
        var errorHandle = $rootScope.$on('$stateChangeError', redirectError);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            errorHandle();
        });
    }
})();
function ChangeFormattedDate(DateToChange) {
    var month = DateToChange.getMonth()+1;
    if(month<10){
        month = '0'+ month;
    }
    var day = DateToChange.getDate();
    if(day<10){
        day = '0'+ day;
    }
    var year = DateToChange.getFullYear(); //2019-04-25
    return year + "-" + month + "-" + day;
}
function showAddToast(AddedMessage,$mdToast) {
    $mdToast.show({
        template: '<md-toast><md-icon class="rxp-green-message-icon" md-font-icon="zmdi zmdi-check"></md-icon><span flex>'+AddedMessage+'</span></md-toast>',
        position: 'bottom right',
        hideDelay: 3000
    });
    
}
function showAutoSaveToast(AddedMessage,$mdToast) {
    $mdToast.show({
        template: '<md-toast><md-icon class="rxp-green-message-icon" md-font-icon="zmdi zmdi-check"></md-icon><span flex>'+AddedMessage+'</span></md-toast>',
        position: 'top left',
        hideDelay: 2000
    });
    
}
function showAddErrorToast(errormessage ,$mdToast) {
                
    $mdToast.show({
        template: '<md-toast><md-icon class="nono-red-message-icon" md-font-icon="zmdi zmdi-close"></md-icon><span flex> '+ errormessage +'</span></md-toast>',
        position: 'bottom right',
        hideDelay: 4000
    });
    
}
function showAutoSaveErrorToast(errormessage ,$mdToast) {
                
    $mdToast.show({
        template: '<md-toast><md-icon class="nono-red-message-icon" md-font-icon="zmdi zmdi-close"></md-icon><span flex> '+ errormessage +'</span></md-toast>',
        position: 'top left',
        hideDelay: 2000
    });
    
}
function GetConfirmCloseTemplate(){
    var TemplateHTMl = '<md-dialog id="rxp-confirmation-box">'+
                '<h3 class="rxp-centered-container">Close form without saving data?</h3>'+
                '<div class="rxp-dialog-info-div">Are you sure you want to close this Form? All changes will be discarded.</div>'+
                '<div layout="row">'+
                    '<div flex="50" flex-xs="50" layout="column">'+
                        '<md-button class=" md-raised" ng-click="confirmDialog.closeform()">Yes Close</md-button>'+
                    '</div>'+
                    '<div  flex="50" flex-xs="50" layout="column">'+
                        '<md-button class="md-primary md-raised" ng-click="confirmDialog.hide()">No</md-button>'+
                    '</div>'+
                '</div>'+
                '</md-dialog>'
    return TemplateHTMl;
}
function GetConfirmDeleteProductTemplate(Pname){
    var TemplateHTMl = '<md-dialog id="rxp-confirmation-box">'+
                '<h3 class="rxp-centered-container">Delete Product: '+ Pname +'?</h3>'+
                '<div class="rxp-dialog-info-div">Are you sure you want to Delete this Product? this action can not be undone.</div>'+
                '<div layout="row">'+
                    '<div flex="50" flex-xs="50" layout="column">'+
                        '<md-button class=" md-raised" ng-click="confirmDialog.closeform()">Yes Delete</md-button>'+
                    '</div>'+
                    '<div  flex="50" flex-xs="50" layout="column">'+
                        '<md-button class="md-primary md-raised" ng-click="confirmDialog.hide()">No</md-button>'+
                    '</div>'+
                '</div>'+
                '</md-dialog>'
    return TemplateHTMl;
}
function removeDuplicates(myArr) {
    return myArr.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
}
function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i).toUpperCase());
    }
    return a;
}
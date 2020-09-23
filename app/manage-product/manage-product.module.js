(function() {
    'use strict';

    angular
        .module('manageproduct', [
        ]);
})();
angular.module('manageproduct', []).directive('fileModel', ['$parse', function ($parse) {
    console.log("xx")
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
        
          element.bind('change', function(){
            console.log("elemnt",element)
          $parse(attrs.fileModel).assign(scope,element[0].files)
             scope.$apply();
          });
       }
    };
 }])
 .config( [
   '$compileProvider',
   function( $compileProvider )
   {   
       $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|localhost|mailto|chrome-extension):/);
       // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
   }
]);
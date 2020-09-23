(function() {
    'use strict';

    angular
        .module('app')
        .config(appConfig)
        .directive('ngEnter', function() {
            return function(scope, element, attrs) {
                element.bind('keydown keypress', function(event) {
                    if(event.which === 13) {
                        scope.$apply(function(){
                            scope.$eval(attrs.ngEnter, {'event': event});
                        });
    
                        event.preventDefault();
                    }
                });
            };
        })
        .directive('mdChips', function($timeout) {
            return {
              restrict: 'E',
              require: 'mdChips', // Extends the original mdChips directive
              link: function(scope, element, attributes, mdChipsCtrl) {
                mdChipsCtrl.onInputBlur = function () {
                    if(!this.autocompleteCtrl){
                    this.inputHasFocus = false;
                    var chipBuffer = this.getChipBuffer();
                    if (chipBuffer != "") { // REQUIRED, OTHERWISE YOU'D GET A BLANK CHIP
                        this.appendChip(chipBuffer);
                        this.resetChipBuffer();
                    }}
                  }
              }
            }
          });;

    /* @ngInject */
    function appConfig($compileProvider) {
        // Make sure this still works in controllers (breaking change in angular 1.6)
        $compileProvider.preAssignBindingsEnabled(true);
    }

})();

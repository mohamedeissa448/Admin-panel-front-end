(function() {
    'use strict';

    angular
        .module('dashboard')
        .component('counterWidget', {
            templateUrl: 'app/dashboard/widgets/counter-widget/counter-widget.tmpl.html',
            controllerAs: 'vm',
            bindings: {
                title: '@',
                count: '<',
                icon: '@',
                background: '@',
                color: '@'
            }
        });
})();

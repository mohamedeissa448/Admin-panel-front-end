(function() {
    'use strict';
    angular
        .module('dashboard')
        .component('tabsWidget', {
            templateUrl: 'app/dashboard/widgets/tabs-widget/tabs-widget.tmpl.html',
            controller: TabsWidget,
            controllerAs: 'vm',
            bindings: {
                languages: '<',
                countries: '<'
            }
        });

    /* @ngInject */
    function TabsWidget() {
        var vm = this;

        vm.tableQueries = {
            languages: {
                order: '-percent',
                limit: 5,
                page: 1
            },
            countries: {
                order: '-percent',
                limit: 5,
                page: 1
            }
        };
    }
})();

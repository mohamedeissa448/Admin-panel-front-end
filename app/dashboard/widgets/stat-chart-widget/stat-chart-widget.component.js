(function() {
    'use strict';
    angular
        .module('dashboard')
        .component('statChartWidget', {
            templateUrl: 'app/dashboard/widgets/stat-chart-widget/stat-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: StatWidgetController,
            bindings: {
                name: '@',
                statistic: '@',
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function StatWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }

})();

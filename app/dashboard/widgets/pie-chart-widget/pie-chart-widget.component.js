(function() {
    'use strict';
    angular
        .module('dashboard')
        .component('pieChartWidget', {
            templateUrl: 'app/dashboard/widgets/pie-chart-widget/pie-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: PieChartWidgetController,
            bindings: {
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function PieChartWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();

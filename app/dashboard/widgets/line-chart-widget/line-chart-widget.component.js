(function() {
    'use strict';
    angular
        .module('dashboard')
        .component('lineChartWidget', {
            templateUrl: 'app/dashboard/widgets/line-chart-widget/line-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: LineChartWidgetController,
            bindings: {
                start: '<',
                end: '<',
                timeSpans: '<',
                onTimeChange: '&',
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function LineChartWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();

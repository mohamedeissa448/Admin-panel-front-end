(function() {
  "use strict";

  angular.module("sales").config(moduleConfig);

  /* @ngInject */
  function moduleConfig($stateProvider, triMenuProvider) {
    $stateProvider.state("triangular.sales", {
      url: "/manage-sales",
      templateUrl:
        "app/sales/manage-sales/manage-sales.tmpl.html",
      controller: "ManageSalesController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["sales"]
        }
      }

    })
    triMenuProvider.addMenu({
      name: "sales",
      icon: "fa fa-money",
      type: "link",
      permission: "sales",
      state: "triangular.sales",
      priority: 2.1,
    });
  }
})();

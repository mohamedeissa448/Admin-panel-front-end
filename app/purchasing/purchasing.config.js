(function() {
  "use strict";

  angular.module("purchasing").config(moduleConfig);

  /* @ngInject */
  function moduleConfig($stateProvider, triMenuProvider) {
    $stateProvider.state("triangular.purchasing", {
      url: "/manage-purchasing",
      templateUrl:
        "app/purchasing/manage-purchasing/manage-purchasing.tmpl.html",
      controller: "ManagepurchasingController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["purchasing"]
        }
      }

    })
    triMenuProvider.addMenu({
      name: "Purchasing",
      icon: "fa fa-shopping-cart",
      type: "link",
      permission: "purchasing",
      state: "triangular.purchasing",
      priority: 2.1,
    });
  }
})();

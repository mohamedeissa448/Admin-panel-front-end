(function() {
  "use strict";

  angular.module("accounting").config(moduleConfig);

  /* @ngInject */
  function moduleConfig($stateProvider, triMenuProvider) {
    $stateProvider.state("triangular.accounting-purchases", {
      url: "/manage-accounting-purchases",
      templateUrl:
        "app/Accounting/manage-accounting-purchases/manage-accounting-purchases.tmpl.html",
      controller: "ManageAccountingPurchasesController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["accounting-purchases"]
        }
      }

    }).state("triangular.accounting-sales", { 
      url: "/manage-accounting-sales",
      templateUrl:
        "app/Accounting/manage-accounting-sales/manage-accounting-sales.tmpl.html",
      controller: "ManageAccountingSalesController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["accounting-sales"]
        }
      }

    }).state("triangular.accounting-supplier-account-statement", { 
      url: "/supplier-account-statement",
      templateUrl:
        "app/Accounting/supplier-account-statement/supplier-account-statement.tmpl.html",
      controller: "ManageSupplierAccountStatementController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["accounting-supplier-account-statement"]
        }
      }

    }).state("triangular.accounting-customer-account-statement", { 
      url: "/customer-account-statement",
      templateUrl:
        "app/Accounting/customer-account-statement/customer-account-statement.tmpl.html",
      controller: "ManageCustomerAccountStatementController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["accounting-customer-account-statement"]
        }
      }

    }).state("triangular.accounting-statistics", { 
      url: "/accounting-statistics",
      templateUrl:
        "app/Accounting/accounting-statistics/accounting-statistics.tmpl.html",
      controller: "ManageAccountingStatisticsController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["accounting-statistics"]
        }
      }

    });
    triMenuProvider.addMenu({
      name: "Accounting",
      icon: "fa fa-industry",
      type: "dropdown",
      permission: "accounting",
      priority: 2.1,
      children: [
        {
            name: 'Purchases',
            state: "triangular.accounting-purchases",
            permission: 'accounting-purchases',
            type: 'link'
        },
        {
          name: 'Supplier Account Statement',
          state: "triangular.accounting-supplier-account-statement",
          permission: 'accounting-supplier-account-statement',
          type: 'link'
      },{
          name: 'Sales',
          state: "triangular.accounting-sales",
          permission: 'accounting-sales',
          type: 'link'
      },{
        name: 'Customer Account Statement',
        state: "triangular.accounting-customer-account-statement",
        permission: 'accounting-customer-account-statement',
        type: 'link'
    },{
      name: 'Accounting Statistics',
      state: "triangular.accounting-statistics",
      permission: 'accounting-statistics',
      type: 'link'
  }
      ]
    });
  }
})();

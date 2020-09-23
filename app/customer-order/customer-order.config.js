(function() {
  "use strict";

  angular.module("customerorder").config(moduleConfig);

  /* @ngInject */
  function moduleConfig($stateProvider, triMenuProvider) {
    $stateProvider.state("triangular.customer-order", {
      url: "/manage-customer-order",
      templateUrl:
        "app/customer-order/manage-customer-order/manage-customer-order.tmpl.html",
      controller: "ManageCustomerOrderController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["manageCustomerOrder"]
        }
      }

    }).state("triangular.manage-order-products", {
      url: "/manage-order-products",
      templateUrl:
        "app/customer-order/manage-order-products/manage-order-products.tmpl.html",
      controller: "ManageOrderProductsController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["manageCustomerOrder"]
        }
      }

    })
    

    triMenuProvider.addMenu({
      name: "Customer Order",
      icon: "fa fa-shopping-cart",
      type: "dropdown",
      permission: "manageCustomerOrder",
      priority: 2.1,
      children: [
        {
            name: 'My Orders',
            state: "triangular.customer-order",
            permission: 'manageCustomerOrder',
            type: 'link'
        },{
          name: 'Fix Products',
          state: "triangular.manage-order-products",
          permission: 'manageCustomerOrder',
          type: 'link'
      },
      ]
    });
  }
})();

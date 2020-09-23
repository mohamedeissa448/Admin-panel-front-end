(function() {
  "use strict";

  angular.module("stores").config(moduleConfig);

  /* @ngInject */
  function moduleConfig($stateProvider, triMenuProvider) {
    $stateProvider.state("triangular.stores", {
      url: "/manage-stores",
      templateUrl:
        "app/stores/manage-stores/manage-stores.tmpl.html",
      controller: "ManageStoresController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["stores"]
        }
      }

    }).state("triangular.store-product-card", {
      url: "/store-product-card",
      templateUrl:
        "app/stores/store-product-card/store-product-card.tmpl.html",
      controller: "StoreProductCardController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["product card"]
        }
      }

    })
    .state("triangular.manage-inventory-operations", {
      url: "/manage-inventory-operations",
      templateUrl:
        "app/stores/inventory-operation/manage-inventory-operation.tmpl.html",
      controller: "ManageInventoryOperationController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
          only: ["manageInventoryOperations"]
        }
      }

    })
<<<<<<< HEAD
=======
    .state("triangular.manage-storage-places", {
      url: "/manage-storage-places",
      templateUrl:
        "app/stores/storage-places/manage-storage-places.tmpl.html",
      controller: "ManageStoragePlacesController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
         // only: ["canDefineStorageBlaces"]
        }
      }

    })
    .state("triangular.manage-increase-inventory", {
      url: "/manage-increase-inventory",
      templateUrl:
        "app/stores/manage-increase-inventory/manage-increase-inventory.tmpl.html",
      controller: "ManageIncreaseInventoryController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
         // only: ["canDefineStorageBlaces"]
        }
      }

    })
    .state("triangular.manage-decrease-inventory", {
      url: "/manage-decrease-inventory",
      templateUrl:
        "app/stores/manage-decrease-inventory/manage-decrease-inventory.tmpl.html",
      controller: "ManageDecreaseInventoryController",
      controllerAs: "vm",
      data: {
        layout: {
          contentClass: "layout-column"
        },
        permissions: {
         // only: ["canDefineStorageBlaces"]
        }
      }

    })
>>>>>>> 75410da3b83f66d3087ebb15184541b2157703b9
    ;

    triMenuProvider.addMenu({
      name: "Inventory",
      icon: "fa fa-book fa-fw",
      type: "dropdown",
      permission: "stores",
      priority: 2.1,
      children: [
        {
            name: 'Store 1',
            state: "triangular.stores",
            permission: 'store 1',
            type: 'link'
        },{
          name: 'Product Card',
          state: "triangular.store-product-card",
          permission: 'product card',
          type: 'link'
      },
      {
        name: 'Inventory Operations',
        state: "triangular.manage-inventory-operations",
        permission: 'manageInventoryOperations',
        type: 'link'
<<<<<<< HEAD
    },
      ]
=======
    },{
      name: 'Storage Places',
      state: "triangular.manage-storage-places",
      //permission: 'canDefineStorageBlaces',
      type: 'link'
    },
    {
      name: 'Increase Inventory',
      state: "triangular.manage-increase-inventory",
      //permission: 'canDefineStorageBlaces',
      type: 'link'
    },
    {
      name: 'Decrease Inventory',
      state: "triangular.manage-decrease-inventory",
      //permission: 'canDefineStorageBlaces',
      type: 'link'
    }
     ]
>>>>>>> 75410da3b83f66d3087ebb15184541b2157703b9
    });
  }
})();

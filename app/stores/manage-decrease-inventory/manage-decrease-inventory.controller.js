(function() {
  "use strict";

  angular
    .module("stores")
    .controller("ManageDecreaseInventoryController", ManageDecreaseInventoryController);

  /* @ngInject */
  function ManageDecreaseInventoryController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.decreaseInventoryGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
      vm.decreaseInventoryGrid.jsGrid({
        width: "100%",
        height: "70vh",
        autoload: false,
        sorting: true,
        selecting: false,
        paging: true,
        inserting: false,
        editing: false,
        pageIndex: 1,
        pageSize: 20,
        pageButtonCount: 15,
        data: vm.increasesInventorylist,
        fields: [
          {title: "Code",name: "DecreaseInventory_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var decreaseInventoryDateString = $filter("date")(
                item.DecreaseInventory_Date,
                "dd MMM yyyy"
              );
              return decreaseInventoryDateString;
            }
          },
          { title: "Note",name: "DecreaseInventory_Note",align: "center", width: 140},
          { title: "Done By",name: "DecreaseInventory_DoneBy_User.User_Name",align: "center", width: 40},
          { 
            title: "view" ,align: "center", width: 30,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show Details")
                .text("")
                .on("click", function() {
                  showDecreaseInventoryDetails(item);
                });
              return $link;
            }
        },
        ]
      });
    }

    function retriveDecreasesInventory() {
      $http({
        method: "get",
        url: "http://localhost:4000/decreaseInventory/getAll",//35.246.143.96:3111
      }).then(function(data) {
        vm.increasesInventorylist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    retriveDecreasesInventory();


    vm.SubmitSearch = function() {
      vm.isLoading = true;
      $http({
        method: "POST",
        url: "http://localhost:4000/decreaseInventory/searchDecreaseInventory",
        data:  { DecreaseInventory_Date : vm.DecreaseInventory_Date }
      }).then(function(data) {
        
          vm.increasesInventorylist = data.data;
          createJsGrid();
        
      });
    };

    vm.showAddDecreaseInventory = function() {
      $mdDialog.show({
        controller: "AddDecreaseInventoryController",
        controllerAs: "vm",
        templateUrl:
          "app/stores/manage-decrease-inventory/add-decrease-inventory/add-decrease-inventory.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.decreaseInventoryGrid.innerHTML = "";
          retriveDecreasesInventory();
        }
      });
    };


    function showDecreaseInventoryDetails (itemToEdit) {
      $mdDialog.show({
        controller: "viewDecreaseInventoryDetails",
        controllerAs: "vm",
        templateUrl:
          "app/stores/manage-decrease-inventory/view-decrease-inventory/view-decrease-inventory.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.decreaseInventoryGrid.innerHTML = "";
          retriveDecreasesInventory();
        },
        locals: {
          id: itemToEdit._id
        }
      });
    }
  }
})();

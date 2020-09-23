(function() {
  "use strict";

  angular
    .module("stores")
    .controller("ManageIncreaseInventoryController", ManageIncreaseInventoryController);

  /* @ngInject */
  function ManageIncreaseInventoryController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.increaseInventoryGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
      vm.increaseInventoryGrid.jsGrid({
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
          {title: "Code",name: "IncreaseInventory_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var increaseInventoryDateString = $filter("date")(
                item.IncreaseInventory_Date,
                "dd MMM yyyy"
              );
              return increaseInventoryDateString;
            }
          },
          { title: "Note",name: "IncreaseInventory_Note",align: "center", width: 140},
          { title: "Done By",name: "IncreaseInventory_DoneBy_User.User_Name",align: "center", width: 40},
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
                  showIncreaseInventoryDetails(item);
                });
              return $link;
            }
        },
        ]
      });
    }

    function retriveIncreasesInventory() {
      $http({
        method: "get",
        url: "http://localhost:4000/increaseInventory/getAll",//35.246.143.96:3111
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
    retriveIncreasesInventory();


    vm.SubmitSearch = function() {
      vm.isLoading = true;
      $http({
        method: "POST",
        url: "http://localhost:4000/increaseInventory/searchIncreaseInventory",
        data:  { IncreaseInventory_Date : vm.IncreaseInventory_Date }
      }).then(function(data) {
        
          vm.increasesInventorylist = data.data;
          createJsGrid();
        
      });
    };

    vm.showAddIncreaseInventory = function() {
      $mdDialog.show({
        controller: "AddIncreaseInventoryController",
        controllerAs: "vm",
        templateUrl:
          "app/stores/manage-increase-inventory/add-increase-inventory/add-increase-inventory.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.increaseInventoryGrid.innerHTML = "";
          retriveIncreasesInventory();
        }
      });
    };


    function showIncreaseInventoryDetails (itemToEdit) {
      $mdDialog.show({
        controller: "viewIncreaseInventoryDetails",
        controllerAs: "vm",
        templateUrl:
          "app/stores/manage-increase-inventory/view-increase-inventory/view-increase-inventory.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.increaseInventoryGrid.innerHTML = "";
          retriveIncreasesInventory();
        },
        locals: {
          id: itemToEdit._id
        }
      });
    }
  }
})();

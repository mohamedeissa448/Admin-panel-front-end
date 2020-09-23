(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("CheckSupplierController", CheckSupplierController);

  /* @ngInject */
  function CheckSupplierController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
   // if (UserService.ifUserHasPermission("ApproveSupplierData")) {
      vm.isLoading = false;
      vm.User_Code = UserService.getCurrentUser().id;
      vm.SupplierName = ItemToEdit.Supplier_Name;
      vm.ApproveData = function() {
        vm.isLoading = true;
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/checkSupplier",
          data: {
            isChecked: vm.isChecked,
            User_Code: vm.User_Code, //person who checked
            Supplier_Code: ItemToEdit.Supplier_Code //supplier that person checked
          }
        }).then(function(data) {
          if (data.data.message == true) {
            showAddToast("Supplier checked successfully", $mdToast);
            $mdDialog.hide();
            
          } else {
            showAddErrorToast(
              "Duplicate supplier, Please check supplier's email address",
              $mdToast
            );
            vm.isLoading = false;
          }
        });
      };
      vm.DeclineData = function() {
        triLoaderService.setLoaderActive(true);
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/declineSupplier", //http://35.246.143.96:3111
          data: {
            Decline_Comment:vm.declineComment,
            Supplier_IsChecked:false,
            User_Code: vm.User_Code, //person who declined
            Supplier_Code: ItemToEdit.Supplier_Code //product that person declined
          }
        }).then(function(data) {
          if (data.data.message == true) {
            showAddToast("Supplier declined successfully", $mdToast);
            $mdDialog.hide();
            triLoaderService.setLoaderActive(false);
            
          } else {
            showAddErrorToast(
              "Something went wrong,Please try again later!",
              $mdToast
            );
            triLoaderService.setLoaderActive(false);
          }
        });
      };
  //  } else {
   // }

    vm.CloseForm = function() {
      $mdDialog.hide();
    };
  }
})();

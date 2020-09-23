(function() {
  "use strict";

  angular
    .module("manageproduct")
    .controller("CheckProductController", CheckProductController);

  /* @ngInject */
  function CheckProductController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.ProductName = ItemToEdit.Product_Name;
    //if (UserService.ifUserHasPermission("ApproveProductData")) {
    vm.isLoading = false;
    vm.User_Code = UserService.getCurrentUser().id;
    vm.ApproveData = function() {
      triLoaderService.setLoaderActive(true);
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/checkProduct", //http://35.246.143.96:3111
        data: {
          isChecked: true,
          User_Code: vm.User_Code, //person who checked
          Product_Code: ItemToEdit.Product_Code //product that person checked
        }
      }).then(function(data) {
        if (data.data.message.code == 11000) {
          showAddErrorToast(
            "Duplicate Customer, Please check customer's email address",
            $mdToast
          );
          triLoaderService.setLoaderActive(false);
        } else {
          showAddToast("Product checked successfully", $mdToast);
          $mdDialog.hide();
          triLoaderService.setLoaderActive(false);
        }
      });
    };
    vm.DeclineData = function() {
      triLoaderService.setLoaderActive(true);
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/declineProduct", //http://35.246.143.96:3111
        data: {
          Decline_Comment:vm.declineComment,
          Product_IsChecked:false,
          User_Code: vm.User_Code, //person who declined
          Product_Code: ItemToEdit.Product_Code //product that person declined
        }
      }).then(function(data) {
        if (data.data.message == true) {
          showAddToast("Product declined successfully", $mdToast);
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
    vm.CloseForm = function() {
      $mdDialog.hide();
    };
    //} else {
    //}
  }
})();

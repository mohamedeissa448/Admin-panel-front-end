(function() {
  "use strict";

  angular
    .module("managecustomers")
    .controller("CheckCustomerController", CheckCustomerController);

  /* @ngInject */
  function CheckCustomerController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.CustomerName = ItemToEdit.Customer_Name;
    if (UserService.ifUserHasPermission("ApproveCustomerData")) {
      vm.isLoading = false;
      vm.User_Code = UserService.getCurrentUser().id;
      vm.ApproveData = function() {
        triLoaderService.setLoaderActive(true);
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/checkCustomer", //http://35.246.143.96:3111
          data: {
            isChecked: true,
            User_Code: vm.User_Code, //person who checked
            Customer_Code: ItemToEdit.Customer_Code //customer that person checked
          }
        }).then(function(data) {
          if (data.data.message== true) {
            showAddToast("Customer checked successfully", $mdToast);
            $mdDialog.hide();
            triLoaderService.setLoaderActive(false);
          }
           else {
            showAddErrorToast(
              "Something went wrong,Please try again later!",
              $mdToast
            );
            triLoaderService.setLoaderActive(false);
           }
            
        });
      }; 
       vm.DeclineData = function() {
        triLoaderService.setLoaderActive(true);
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/declineCustomer", //http://35.246.143.96:3111
          data: {
            Decline_Comment:vm.declineComment,
            Customer_IsChecked:false,
            User_Code: vm.User_Code, //person who declined
            Customer_Code: ItemToEdit.Customer_Code //product that person declined
          }
        }).then(function(data) {
          if (data.data.message == true) {
            showAddToast("Customer declined successfully", $mdToast);
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
    } else {
    }
  }
})();

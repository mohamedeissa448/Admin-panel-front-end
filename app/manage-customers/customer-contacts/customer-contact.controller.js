(function() {
  "use strict";

  angular
    .module("managecustomers")
    .controller("CustomerContactController", CustomerContactController);

  /* @ngInject */
  function CustomerContactController(
    $mdToast,
    triLoaderService,
    $http,
    $mdDialog,
    UserService,
    Customer_Code,
    Customer_Contact,
    Customer_Name
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.Customer_ContactEmail = [];
    vm.Customer_ContactTelphone = [];
    vm.Customer_Name = Customer_Name;
    vm.Customer_Contact = Customer_Contact;
    vm.isLoading = false;
    vm.AddContact = function() {
      if (!vm.ItemUnderEdit) {
        var contactToAdd = {
          Customer_ContactTitle: vm.Customer_ContactTitle,
          Customer_ContactName: vm.Customer_ContactName,
          Customer_ContactTelphone: vm.Customer_ContactTelphone,
          Customer_ContactEmail: vm.Customer_ContactEmail
        };
        vm.Customer_Contact.push(contactToAdd);
      } else {
        vm.Customer_Contact[vm.itemindextoedit].Customer_ContactTitle =
          vm.Customer_ContactTitle;
        vm.Customer_Contact[vm.itemindextoedit].Customer_ContactName =
          vm.Customer_ContactName;
        vm.Customer_Contact[vm.itemindextoedit].Customer_ContactTelphone =
          vm.Customer_ContactTelphone;
        vm.Customer_Contact[vm.itemindextoedit].Customer_ContactEmail =
          vm.Customer_ContactEmail;
        vm.ItemUnderEdit = false;
      }
      vm.Customer_ContactEmail = [];
      vm.Customer_ContactTelphone = [];
      vm.Customer_ContactTitle = "";
      vm.Customer_ContactName = "";
    };
    vm.itemindextoedit;
    vm.editContact = function(contact) {
      vm.ItemUnderEdit = true;
      vm.Customer_ContactEmail = contact.Customer_ContactEmail;
      vm.Customer_ContactTelphone = contact.Customer_ContactTelphone;
      vm.Customer_ContactTitle = contact.Customer_ContactTitle;
      vm.Customer_ContactName = contact.Customer_ContactName;
      vm.itemindextoedit = vm.Customer_Contact.indexOf(contact);
      console.log(vm.itemindextoedit);
    };
    vm.CloseContact = function() {
      $mdDialog.hide();
    };
    vm.DeleteContact = function(contact) {
      console.log(vm.Customer_Contact);
      console.log(contact);
      vm.Customer_Contact.splice(vm.Customer_Contact.indexOf(contact), 1);
      console.log(vm.Customer_Contact);
    };
    vm.SaveContact = function() {
      vm.isLoading = true;
      var data = {};
      var data = {
        Customer_Code: Customer_Code,
        Customer_Contact: vm.Customer_Contact,
        User_Code: vm.logedUser.id
      };
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/EditCustomerContact",
        data: data
      }).then(function(data) {
        vm.isLoading = false;
        showAddToast("Contacts updated successfully", $mdToast);
      });
    };
  }
})();

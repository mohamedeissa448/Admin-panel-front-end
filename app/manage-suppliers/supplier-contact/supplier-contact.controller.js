(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("SupplierContactController", SupplierContactController);

  /* @ngInject */
  function SupplierContactController(
    $mdToast,
    $http,
    $mdDialog,
    UserService,
    Supplier_Code,
    Supplier_Name
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();

    vm.Supplier_ContactEmail = [];
    vm.Supplier_ContactTelphone = [];
    vm.Supplier_Name = Supplier_Name;
    vm.isLoading = false;
    $http({
      method: "Post",
      url: "http://35.246.143.96:3111/getupplierContactsByID",
      data: { Supplier_Code: Supplier_Code }
    }).then(function(data) {
      vm.Supplier_Contact = data.data[0].Supplier_Contact;
    });

    vm.AddContact = function() {
      if (!vm.ItemUnderEdit) {
        var contactToAdd = {
          Supplier_ContactTitle: vm.Supplier_ContactTitle,
          Supplier_ContactName: vm.Supplier_ContactName,
          Supplier_ContactTelphone: vm.Supplier_ContactTelphone,
          Supplier_ContactEmail: vm.Supplier_ContactEmail
        };
        vm.Supplier_Contact.push(contactToAdd);
      } else {
        vm.Supplier_Contact[vm.itemindextoedit].Supplier_ContactTitle =
          vm.Supplier_ContactTitle;
        vm.Supplier_Contact[vm.itemindextoedit].Supplier_ContactName =
          vm.Supplier_ContactName;
        vm.Supplier_Contact[vm.itemindextoedit].Supplier_ContactTelphone =
          vm.Supplier_ContactTelphone;
        vm.Supplier_Contact[vm.itemindextoedit].Supplier_ContactEmail =
          vm.Supplier_ContactEmail;
        vm.ItemUnderEdit = false;
      }
      vm.Supplier_ContactEmail = [];
      vm.Supplier_ContactTelphone = [];
      vm.Supplier_ContactTitle = "";
      vm.Supplier_ContactName = "";
    };
    vm.editContact = function(contact) {
      vm.ItemUnderEdit = true;
      vm.Supplier_ContactEmail = contact.Supplier_ContactEmail;
      vm.Supplier_ContactTelphone = contact.Supplier_ContactTelphone;
      vm.Supplier_ContactTitle = contact.Supplier_ContactTitle;
      vm.Supplier_ContactName = contact.Supplier_ContactName;
      vm.itemindextoedit = vm.Supplier_Contact.indexOf(contact);
      console.log(vm.itemindextoedit);
    };
    vm.CloseContact = function() {
      $mdDialog.hide();
    };
    vm.DeleteContact = function(contact) {
      console.log(vm.Supplier_Contact);
      console.log(contact);
      vm.Supplier_Contact.splice(vm.Supplier_Contact.indexOf(contact), 1);
      console.log(vm.Supplier_Contact);
    };
    vm.SaveContact = function() {
      vm.isLoading = true;
      var data = {};
      var data = {
        Supplier_Code: Supplier_Code,
        Supplier_Contact: vm.Supplier_Contact,
        User_Code: vm.logedUser.id
      };
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/EditSupplierContact",
        data: data
      }).then(function(data) {
        vm.isLoading = false;
        showAddToast("Contacts updated successfully", $mdToast);
      });
    };
  }
})();

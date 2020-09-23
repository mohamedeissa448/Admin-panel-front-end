(function() {
    'use strict';

    angular
        .module('dashboard')
        .controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController($http) {
        var vm = this;
         ///////////////first table///////////////////////////
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getProductsNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.productsNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getSuppliersNumber",//35.246.143.96:3111
            data: {}
          }).then(function(response) {
            console.log("response ",response)
            vm.suppliersNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCustomersNumber",//35.246.143.96:3111
            data: {}
          }).then(function(response) {
            console.log("response ",response)
            vm.customersNumber = response.data.count;
        });
                /////get quality checked Numbers /////////
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCheckedProductsNumber",//35.246.143.96:3111
            data: {}
          }).then(function(response) {
            console.log("response ",response)
            vm.checkedProductsNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCheckedSuppliersNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.checkedSuppliersNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCheckedCustomersNumber",//35.246.143.96:3111
            data: {}
          }).then(function(response) {
            console.log("response ",response)
            vm.checkedCustomersNumber = response.data.count;
        });
        ///////////////second table///////////////////////////
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getAllRequestPricesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.requestPricesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getAllSendOffersNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.sendOffersNumber = response.data.count;
        });
        ///////////////third table 'sys-setup' ///////////////////////////
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCategoriesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.categoriesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getCertificatesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.certificatesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getClassesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.classesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getReleaseTypesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.releaseTypesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getFormsNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.formsNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getProductCategoriesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.productCategoriesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getSellingAreasNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.sellingAreasNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getSupplierTypesNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.supplierTypesNumber = response.data.count;
        });
        $http({
            method: "GET",
            url: "http://35.246.143.96:3111/getAllUsersNumber",//35.246.143.96:3111
            data: {} 
          }).then(function(response) {
            console.log("response ",response)
            vm.usersNumber = response.data.count;
        });


    }
})();

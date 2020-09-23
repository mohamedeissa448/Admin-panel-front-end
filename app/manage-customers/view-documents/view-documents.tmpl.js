//const flatten = require("gulp-flatten");

(function () {
    'use strict';

    angular
        .module('managecustomers')
        .controller('ViewCustomerDocumentsController', ViewCustomerDocumentsController);

    /* @ngInject */
    function ViewCustomerDocumentsController($mdToast, $mdDialog,$scope, triLoaderService,UserService, $http, itemToViewItsDocuments) {
      var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",itemToViewItsDocuments)
      vm.Customer_Name=itemToViewItsDocuments.Customer_Name;
      vm.Customer_Code=itemToViewItsDocuments.Customer_Code;
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        } else {
          return null;
        }
      }
  
      vm.customerDocuments = [];
        vm.filesToUpload=[];
        $http({
          method: "post",
          url: "http://35.246.143.96:3111/customer/getDocuments",
          data: {Customer_Code : vm.Customer_Code}
        }).then(function(data) {
          if(data.data.Customer_Documents && data.data.Customer_Documents.length>0)
          vm.customerDocuments = data.data.Customer_Documents;
        });
    
        vm.AddcustomerDocument = function() {
            console.log("$scope.files",$scope.files)
            vm.filesToUpload.push($scope.files[0])
            var document = {
                'Document_Name'         :$scope.files[0].name,
               'Document_Description'   :vm.Document_Description,
               'Document_End_Date'      :vm.Document_End_Date
           
            };
            vm.customerDocuments.push(document);
            console.log("document",document);
            console.log("vm.filesToUpload",vm.filesToUpload);
            //clear form data
            vm.Document_Description="";
            vm.Document_End_Date=""
        };
  
        vm.DeleteRequest = function(document) {
          console.log("document", document);
          if(document['_id']){
            $http({
              method: "post",
              url: "http://35.246.143.96:3111/customer/deleteDocument",
              data: {
                Customer_Code : vm.Customer_Code,
                documentID: document['_id'],
                Document_Url:document['Document_Url']
              }
            }).then(function(data) {
              if(data.data.message == true){
                showAddToast("Document deleted Successfully", $mdToast);
                vm.customerDocuments.splice(vm.customerDocuments.indexOf(document), 1);
                var indexToRemove=0
                angular.forEach(vm.filesToUpload,function(file,index){
                  if(file.name==document.Document_Name){
                    indexToRemove=index
                  }
                })
                vm.filesToUpload.splice(indexToRemove, 1);
                console.log("after delete customerDocuments", vm.customerDocuments);
                console.log("after delete filesToUpload", vm.filesToUpload);
              }       
              else{
                    showAddErrorToast('Something Went Wrong,Please try again later..',$mdToast);
                 }
            });
          }else{
            showAddToast("Document deleted Successfully", $mdToast);
            vm.customerDocuments.splice(vm.customerDocuments.indexOf(document), 1);
            var indexToRemove=0
            angular.forEach(vm.filesToUpload,function(file,index){
              if(file.name==document.Document_Name){
                indexToRemove=index
              }
            })
            vm.filesToUpload.splice(indexToRemove, 1);
            console.log("after delete customerDocuments", vm.customerDocuments);
            console.log("after delete filesToUpload", vm.filesToUpload);
          }
            
        };
  
      vm.CloseUpdateDocuments = function() {
        $mdDialog.hide();
      };
      vm.SubmitRequest = function() {
        triLoaderService.setLoaderActive(true);
        var fd=new FormData();
             //console.log("$scope.files",$scope.files);
             angular.forEach(vm.filesToUpload,function(file){
                 console.log("file inside",file)
             fd.append('file',file);
             });
             fd.append('Customer_Code',vm.Customer_Code);
             fd.append('customerDocuments',JSON.stringify(vm.customerDocuments));
             console.log("vm.customerDocuments",vm.customerDocuments)

             console.log("fd",fd)
            $http.post('http://35.246.143.96:3111/customer/addDocuments',
              fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}                     
                 }) 
                 .then(function(data){
                      if(data.data.message == true)
                      showAddToast("Documents Updated Successfully", $mdToast);
                    else{
                    showAddToast("Something Went Wrong,Please try again later..", $mdToast);
                  }
                  triLoaderService.setLoaderActive(false);
                })  
                vm.CloseUpdateDocuments();
      };
    }
})();
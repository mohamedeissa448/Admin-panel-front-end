(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageCertificateController', ManageCertificateController);

    /* @ngInject */
    function ManageCertificateController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.CertificateGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveCertificate();
        function retriveCertificate(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getCertificate",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Certificateslist = data.data;
            }
            else{
                vm.Certificateslist = data.data;
            }
            vm.CertificateGrid.jsGrid({
                width: "100%",
                height: "400px",
                autoload: false,
                sorting: true,
                selecting: false,
                paging: true,
                inserting: false,
                editing: false,
                pageIndex: 1,
                pageSize: 20,
                pageButtonCount: 15,
                data: vm.Certificateslist,
                fields: [
                    { title: "Code", name: "Certificate_Code", type: "number", width: 35},
                    { title: "Pack Name", name: "Certificate_Name", type: "text", width: 100},
                    { title: "Desc", name: "Certificate_Description", type: "text", width: 100},
                    { title: "Active",  name: "Certificate_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openCategortToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openCategortToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditCertificateController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-certificates/edit-certificate.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.CertificateGrid.innerHTML = "";
                    retriveCertificate();
                },
                locals: {
                    Certificate_Code: itemToEdit.Certificate_Code,
                    Certificate_Name: itemToEdit.Certificate_Name,
                    Certificate_Description: itemToEdit.Certificate_Description,
                    Certificate_IsActive: itemToEdit.Certificate_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddCertificateController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-certificates/add-certificate.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.CertificateGrid.innerHTML = "";
                    retriveCertificate();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.CertificateSearch;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getCertificateByname',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Certificateslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();
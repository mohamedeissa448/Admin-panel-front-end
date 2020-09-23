(function() {
    'use strict';

    angular
        .module('access-externally')
        .controller('SupplierFillPriceController', SupplierFillPriceController);

    /* @ngInject */
    function SupplierFillPriceController($http, $mdToast,triLoaderService, triSettings,$stateParams) {
        var vm = this;
        vm.isLoding = true;
        vm.isStarting = true;
        vm.isFinished = false;
        vm.triSettings = triSettings;
        var data ={};
        data.row_id = $stateParams.rqid;
        data.supplier_id = $stateParams.spid;
        $http({
            method:'post',
            url:'http://35.246.143.96:3111/getRequestPriceByID',
            data :data
        }).then(function(data){
            FormDataToFit(data.data);
            vm.isLoding = false;
            vm.isStarting = false;
        },function(error){
            console.log(error);
        });
        function FormDataToFit(recivedData){
            vm.RequestPriceData =recivedData.RequestPrice_Product;
            if(vm.RequestPriceData == undefined){
                vm.dataIsEntered = 'Data already entered,'
                vm.isFinished = true;
            }
            else{
                vm.RequestPriceData.forEach(function(item,index){
                    item.Wieght_Name = recivedData.Weight[index].Weight_Name;
                    item.Product_Name = recivedData.Product[index].Product_Name;
                    
                })
            }
        }
        vm.SubmitRequest = function(){
           vm.isLoding = true;
            var ProductDetailsToSend =[];
            angular.copy(vm.RequestPriceData, ProductDetailsToSend);
            ProductDetailsToSend.forEach(function(v){ delete v._id; delete v.Quantity_Required; delete v.Product_Name; delete v.Wieght_Name });
            var dataToSend = {};
            dataToSend.ID = $stateParams.rqid;
            dataToSend.RequestPrice_Supplier_ID = $stateParams.spid;
            dataToSend.RequestPrice_Details = ProductDetailsToSend;
            dataToSend.Valid_Till = vm.RequestPrice_Valid_Date;
            dataToSend.Place_of_Delivery = vm.Place_of_Delivery;
            dataToSend.Taxes_Types = vm.Taxes_Types;
            dataToSend.Method_of_Payment = vm.Method_of_Payment;
            dataToSend.Delivery_Time = vm.Delivery_Time;
            dataToSend.Delivery_Cost = vm.Delivery_Cost;
            dataToSend.Work_Time_Off = vm.Work_Time_Off;
            console.log(dataToSend);
            $http({
                method:"post",
                url:"http://35.246.143.96:3111/updateRequestPrice",
                data :dataToSend
            }).then(function(data){
                if(data.message ='true'){
                    showAddToast('Prices submitted successfully',$mdToast);
                    vm.isLoding = false;
                    vm.isFinished = true;
                }
            });
        }
    }
})();

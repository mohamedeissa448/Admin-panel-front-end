(function() {
    'use strict';

    angular
        .module('accounting')
        .controller('PayForBillsForPurchasingsController', PayForBillsForPurchasingsController);

    /* @ngInject */
    function PayForBillsForPurchasingsController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this;
        vm.logedUser = UserService.getCurrentUser();
        //start get purchasing Bills
        
            $http.get("http://35.246.143.96:3111/getAllPurchasingsBills").then(function (response) {			   
                vm.selectedBillItem = null;
                vm.searchBillText = null;
                vm.queryBills = queryBills;
                vm.PurchasingBills =response.data ;
                vm.selectedBill = [];
                vm.isLoading = false; 
                function queryBills($query) {
                    var lowercaseQuery = angular.lowercase($query);
                    return vm.PurchasingBills.filter(function(bills) {
                        var lowercaseName = angular.lowercase(bills.Product_Incoming_Bill_Number);
                        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                            return bills;
                        }
                    });
                }
                
            })
        //end
        vm.calcBillTotalPrices=function(){
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getAllPurchaseProductsOfAspecificBill",//35.246.143.96:3111
                data : { Product_Incoming_Bill_Number : vm.selectedBill[0].Product_Incoming_Bill_Number }
            }).then(function(reposne){
                vm.purchasingslist = reposne.data;
                vm.Total_All_Purchasings_Prices_After_Taxes = 0;
                vm.Total_All_Purchasings_Payments_Prices = 0
                angular.forEach(vm.purchasingslist, function(element, key) {
                    vm.Total_All_Purchasings_Prices_After_Taxes += element.Total_Price_After_Taxes ;
                    vm.Total_All_Purchasings_Payments_Prices += element.Total_Paid_Price ;
                  });
                })
        }
        vm.paymentData={}
        vm.SubmitData=function(form){
            console.log("clicked")
            var Cash_Payment={
                Paying_Date: vm.Cash_Paying_Date,
                Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
                HigChem_Delivering_Cash_Number: vm.Cash_HigChem_Delivering_Cash_Number,
                Supplier_Recieving_Cash_Number: vm.Cash_Supplier_Recieving_Cash_Number,
                HigChem_Safe_Keeper_Name: vm.Cash_HigChem_Safe_Keeper_Name,
                Supplier_Reciever_Info:{
                    Name: vm.Cash_Name,
                    Address: vm.Cash_Address,
                    ID_Number: vm.Cash_ID_Number,
                    Position: vm.Cash_Position
                }   
              }
            console.log("Cash_Payment",Cash_Payment)
            var Cheque_Payment={
                Cheque_Date:vm.Cheque_Date,
                Amount_Of_Paying: vm.Cheque_Amount_Of_Paying,
                HigChem_Delivering_Cheque_Number: vm.Cheque_HigChem_Delivering_Cheque_Number,
                Supplier_Recieving_Cheque_Number: vm.Cheque_Supplier_Recieving_Cheque_Number,
                HigChem_Safe_Keeper_Name: vm.Cheque_HigChem_Safe_Keeper_Name,
                Supplier_Reciever_Info:{
                    Name: vm.Cheque_Name,
                    Address: vm.Cheque_Address,
                    ID_Number: vm.Cheque_ID_Number,
                    Position: vm.Cheque_Position,
                },
                Cheque_Details :{
                    Bank_Name :vm.Bank_Name,
                    Bank_Branch :vm.Bank_Branch,
                    Cheque_Number :vm.Cheque_Number,
                    Cheque_Date: vm.Cheque_Date
                }
            }
            console.log("Cheque_Payment",Cheque_Payment)
            //we need to determine what the type of the payment: 'cash' or 'cheque'
            //if(it is cheque that means that Cash_Payment.Amount_Of_Paying is undefined)
            //if(it is cash that means that Cheque_Payment.Amount_Of_Paying is undefined)
            if(Cash_Payment.Amount_Of_Paying){
                vm.paymentData.Payment_Method_Name = "cash";
                vm.paymentData.Cash_Payment=Cash_Payment;
                vm.paymentData.Amount_Of_Paying = Cash_Payment.Amount_Of_Paying ;
            }else if(Cheque_Payment.Amount_Of_Paying){
                vm.paymentData.Payment_Method_Name = "cheque";
                vm.paymentData.Cheque_Payment=Cheque_Payment
                vm.paymentData.Amount_Of_Paying = Cheque_Payment.Amount_Of_Paying ;
            }
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getAllPurchaseProductsOfAspecificBill",//35.246.143.96:3111
                data : { Product_Incoming_Bill_Number : vm.selectedBill[0].Product_Incoming_Bill_Number }
            }).then(function(reposne){
                vm.purchasingslist = reposne.data;
                vm.Total_All_Purchasings_Prices_After_Taxes = 0;
                vm.Total_All_Purchasings_Payments_Prices = 0
                angular.forEach(vm.purchasingslist, function(element, key) {
                    vm.Total_All_Purchasings_Prices_After_Taxes += element.Total_Price_After_Taxes ;
                    vm.Total_All_Purchasings_Payments_Prices += element.Total_Paid_Price ;
                  });
                  var remaining_monet_to_pay = vm.Total_All_Purchasings_Prices_After_Taxes - vm.Total_All_Purchasings_Payments_Prices
                  console.log("remaining_monet_to_pay",remaining_monet_to_pay)
                  console.log("vm.Total_All_Purchasings_Prices_After_Taxes",vm.Total_All_Purchasings_Prices_After_Taxes)
                  console.log("vm.Total_All_Purchasings_Payments_Prices",vm.Total_All_Purchasings_Payments_Prices)

                  if(vm.paymentData.Amount_Of_Paying.toFixed(2) > remaining_monet_to_pay.toFixed(2)+1){//cause of imprecision of floating numbers,I added 1
                    console.log("true")
    
                    showAddErrorToast("You can't pay money more than the remaining "+remaining_monet_to_pay,$mdToast);
                    return
                   
                }else{
                       //we need to get only bills numbers inside an array called vm.paymentData.BillsNumbers
                    vm.paymentData.BillsNumbers =[]
                    angular.forEach(vm.selectedBill, function(item, index) {
                        vm.paymentData.BillsNumbers.push(item.Product_Incoming_Bill_Number) ;
                    });
                    
                    vm.paymentData.Payment_CreatedByUser = vm.logedUser.mongoID;
        
                    $http({
                        method:"POST",
                        url:"http://35.246.143.96:3111/addPaymentsForOneBillOrMore",//35.246.143.96:3111
                        data : { paymentData: vm.paymentData }
                    }).then(function(reposne){
                        if(reposne.data.message == true){
                            showAddToast('payment added successfully',$mdToast); 
                        }else{
                            showAddErrorToast("Something went wrong,Please try again later",$mdToast);
                        }
                        $mdDialog.hide();
                        triLoaderService.setLoaderActive(false);
    
                    });
                }
            });
           

            }
        vm.CloseForm = function(){
            
                $mdDialog.hide();
            
        }
        function ConfirmCloseDialog(){
            var Result;
            $mdDialog.show({
                multiple: true,skipHide: true,
                controllerAs:'confirmDialog',
                bindToController: true,
                controller: function($mdDialog){
                    var vmc = this;
                    vmc.closeform = function closeform(){
                        $mdDialog.hide();
                        Result =  true;
                    }
                    vmc.hide = function hide(){
                        $mdDialog.hide();
                        Result = false;
                    }
                  }
                ,template: GetConfirmCloseTemplate()
            }).then(function() {
                if(Result){
                    $mdDialog.hide();
                }
            });
        }

        }
        
}
)();
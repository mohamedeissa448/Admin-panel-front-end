(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('EditUserPermissionController', EditUserPermissionController);

    /* @ngInject */
    function EditUserPermissionController($mdToast, $timeout, triLoaderService,$http, $filter, SelectedUser) {
        var vm = this;
        vm.permission = [];
        vm.UsersPermissions = SelectedUser.User_Permissions;
        $http.get('http://35.246.143.96:3111/getMasterPermisions').then(function(data){
            vm.AllPermissionsList = data.data;
            vm.PermissionsGroupsList = [];
            vm.AllPermissionsList.forEach(function(part, index, PermissionItem) {
                PermissionItem[index].IsEnabled = false;
                vm.PermissionsGroupsList.push(
                    PermissionItem[index].PermissionCategory
                 )
            })
           
         }).then(function(){
            vm.PermissionsGroupsUniqueGroupsList = [];
            vm.PermissionsGroupsUniqueGroupsList = uniquearray(vm.PermissionsGroupsList);
        }).then(function(){
            vm.GroupedPermissionsOpjectList = [];
            vm.PermissionsGroupsUniqueGroupsList.forEach(function(part, index, GroupsList) {
                vm.GroupedPermissionsOpjectList[index] = {
                    PermissionCategoryName: GroupsList[index],
                    PermissionSubList : {}
                }
            })
        }).then(function(){
            //console.log(vm.GroupedPermissionsOpjectList)
            vm.GroupedPermissionsOpjectList.forEach(function(part, index, GroupsOpjectList) {
                var PermissionOfCat = $filter('filter')(vm.AllPermissionsList, {'PermissionCategory':GroupsOpjectList[index].PermissionCategoryName}, true);
                vm.GroupedPermissionsOpjectList[index].PermissionSubList = PermissionOfCat;
            })
            
        }).then(function(){
            vm.employeeChanged();
        });
        var uniquearray = function(origArr) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;
        
            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(origArr[x]);
                }
            }
            return newArr;
        }
        vm.employeeChanged = function(){
            console.log("vm.UsersPermissions",vm.UsersPermissions)
            vm.UsersPermissions.forEach(function(part, index, EmpuserPermission) {
                vm.GroupedPermissionsOpjectList.forEach(function(part, index2, GroupsOpjectList) {
                    GroupsOpjectList[index2].PermissionSubList.forEach(function(part, index3, PermissionSubList) {
                        console.log("PermissionSubList[index3]",PermissionSubList[index3]);
                        console.log("EmpuserPermission[index]",EmpuserPermission[index])

                        if(PermissionSubList[index3].PermissionName == EmpuserPermission[index]){
                            PermissionSubList[index3].IsEnabled = true;
                        }
                    })
                })
            })
        }
        vm.SavePermissionData = function(){
            triLoaderService.setLoaderActive(true);
            var NewPermissionList = [];
            vm.GroupedPermissionsOpjectList.forEach(function(part, index, GroupsOpjectList) {
                GroupsOpjectList[index].PermissionSubList.forEach(function(part, index2, PermissionSubList) {
                    if(PermissionSubList[index2].IsEnabled == true){
                        NewPermissionList.push(PermissionSubList[index2].PermissionName)
                    }
                })
            });
            
            var datatosend = {};
            datatosend.User_Code = SelectedUser.User_Code;
            datatosend.User_Permissions = NewPermissionList;
            $http({
                method:"POST",
                url:"http://localhost:4000/editUserPermissions",
                data :datatosend
            }).then(function(data){
                triLoaderService.setLoaderActive(false);
                if(data.data.message){
                    showAddToast('Permissions has saved successfully',$mdToast);
                }
                else{
                    showAddErrorToast('Error! Permissions not Saved',$mdToast);
                }
                
            })
        }
    }
})();
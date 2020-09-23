(function() {
    'use strict';

    angular
        .module('sys-setup')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-category', {
            url: '/system-setup/manage-category',
            templateUrl: 'app/sys-setup/manage-category/manage-category.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageCategoryController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-class', {
            url: '/system-setup/manage-classes',
            templateUrl: 'app/sys-setup/manage-class/manage-class.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageClassController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-concentration', {
            url: '/system-setup/manage-concentrations',
            templateUrl: 'app/sys-setup/manage-concentration/manage-concentration.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageConcentrationController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-form', {
            url: '/system-setup/manage-form',
            templateUrl: 'app/sys-setup/manage-form/manage-form.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageFormController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-packing', {
            url: '/system-setup/manage-packing',
            templateUrl: 'app/sys-setup/manage-packing/manage-packing.tmpl.html',
            // set the controller to load for this page
            controller: 'ManagePackingController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-payment-method', {
            url: '/system-setup/manage-payment-method',
            templateUrl: 'app/sys-setup/manage-payment-method/manage-payment-method.tmpl.html',
            // set the controller to load for this page
            controller: 'ManagePaymentMethodController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-product-category', {
            url: '/system-setup/manage-product-category',
            templateUrl: 'app/sys-setup/manage-product-category/manage-product-category.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageProductCategoryController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-release-type', {
            url: '/system-setup/manage-release-type',
            templateUrl: 'app/sys-setup/manage-release-type/manage-release-type.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageReleaseTypeController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-selling-area', {
            url: '/system-setup/manage-selling-areas',
            templateUrl: 'app/sys-setup/manage-sell-areas/manage-sell-areas.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageSellAreaController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-storage-type', {
            url: '/system-setup/manage-storage-type',
            templateUrl: 'app/sys-setup/manage-storage-type/manage-storage-type.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageStorageTypeController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-supplier-type', {
            url: '/system-setup/manage-supplier-type',
            templateUrl: 'app/sys-setup/manage-supplier-type/manage-supplier-type.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageSupplierTypeController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-ways-of-delivery', {
            url: '/system-setup/manage-ways-of-delivery',
            templateUrl: 'app/sys-setup/manage-ways-of-delivery/manage-ways-of-delivery.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageWaysOfDeliveryController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-types-of-business', {
            url: '/system-setup/manage-types-of-business',
            templateUrl: 'app/sys-setup/manage-types-of-business/manage-types-of-business.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageTypesOfBusinessController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-product-origin-variant', {
            url: '/system-setup/manage-product-origin-variant',
            templateUrl: 'app/sys-setup/manage-product-origin-variant/manage-product-origin-variant.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageProductOriginVariantController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-product-units', {
            url: '/system-setup/manage-product-units',
            templateUrl: 'app/sys-setup/manage-product-units/manage-product-units.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageProductUnitsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-weight-unit', {
            url: '/system-setup/manage-weight-unit',
            templateUrl: 'app/sys-setup/manage-weight-unit/manage-weight-unit.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageWeightUnitController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-countries', {
            url: '/system-setup/manage-countries',
            templateUrl: 'app/sys-setup/manage-countries/manage-country.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageCountryController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-certificates', {
            url: '/system-setup/manage-certificates',
            templateUrl: 'app/sys-setup/manage-certificates/manage-certificate.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageCertificateController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        })
        .state('triangular.manage-temperature-unit', {
            url: '/system-setup/manage-temperature-unit',
            templateUrl: 'app/sys-setup/manage-temperature-unit/manage-temperature-unit.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageTemperatureUnitController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['SystemSetup']
                }
            }
        });


        triMenuProvider.addMenu({
            name: 'System Setup',
            icon: 'fa fa-cogs',
            permission: 'SystemSetup',
            type: 'dropdown',
            priority: 4.1,
            children: [
                {
                    name: 'Industrial Categories',
                    state: 'triangular.manage-category',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Certificates',
                    state: 'triangular.manage-certificates',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Classes',
                    state: 'triangular.manage-class',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Concentrations',
                    state: 'triangular.manage-concentration',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Countries',
                    state: 'triangular.manage-countries',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Custom Release Types',
                    state: 'triangular.manage-release-type',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Product Forms',
                    state: 'triangular.manage-form',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Packings',
                    state: 'triangular.manage-packing',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Payment Methods',
                    state: 'triangular.manage-payment-method',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Product Categories',
                    state: 'triangular.manage-product-category',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Selling Areas',
                    state: 'triangular.manage-selling-area',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Storage Types',
                    state: 'triangular.manage-storage-type',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Supplier Types',
                    state: 'triangular.manage-supplier-type',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Temperature Units',
                    state: 'triangular.manage-temperature-unit',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Ways Of Delivery',
                    state: 'triangular.manage-ways-of-delivery',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Types Of Business',
                    state: 'triangular.manage-types-of-business',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Product Origin Variants',
                    state: 'triangular.manage-product-origin-variant',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Product Units',
                    state: 'triangular.manage-product-units',
                    permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: 'Weight Units',
                    state: 'triangular.manage-weight-unit',
                    permission: 'SystemSetup',
                    type: 'link'
                }
            ]
        });
    }
})();

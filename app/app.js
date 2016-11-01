'use strict';
angular.module('manageBoard', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        var states = [
            {
                name: 'login',
                template: '<login-view></login-view>',
                url: '/login'
            },
            {
                name: "home",
                template: '<home-view></home-view>',
                url: '/home',
                resolve: {
                    authorized: ['$q', 'authorizationService', '$log', function($q, authorizationService, $log) {
                        var deferred = $q.defer();
                        authorizationService.isAuthorized().then(function(isAuthorized) {
                            if (isAuthorized) {
                                deferred.resolve();
                            } else {
                                $log.debug(deferred);
                                deferred.reject("Login error! Please Try again");
                            }
                        });

                        return deferred.promise;
                    }]
                }
            },
            {
                name: 'emails',
                template: '<email-container mailboxes="mailboxes"></email-container>',
                url: '/emails',
                resolve: {
                    mailboxes: ['emailService', function (emailService) {
                        return emailService.getMailboxes();
                    }]
                },
                controller: function (mailboxes, $scope) {
                    $scope.mailboxes = mailboxes;
                }
            },
            {
                name: 'emails.box',
                template: '<email-list emails="emails"></email-list>',
                url: '/:boxId',
                controller: function($stateParams, $scope, emails) {
                    $scope.emails = emails.filter(email => email.mailbox === $stateParams.boxId);
                },
                resolve: {
                    emails: function(emailService) {
                        return emailService.getEmails();
                    }
                }
            },
            {
                "name": 'users',
                "template": '<users-container></users-container>',
                "url": '/users'
            },
            {
                "name": 'todos',
                "template": '<todos-container></todos-container>',
                "url": '/todos'
            }
        ];

        states.forEach((state) => $stateProvider.state(state));

        $urlRouterProvider.otherwise('login');
    })
    .run(function($rootScope, $log, $state) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.error(error);
            alert(error);
            $state.go('login');
        });
    });

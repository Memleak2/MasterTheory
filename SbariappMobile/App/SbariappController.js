// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',

  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', { templateUrl: "home.html", reloadOnSearch: false });
    $routeProvider.when('/scroll', { templateUrl: "scroll.html", reloadOnSearch: false });
    $routeProvider.when('/overlay', { templateUrl: "overlay.html", reloadOnSearch: false });
    $routeProvider.when('/forms', { templateUrl: "forms.html", reloadOnSearch: false });
    $routeProvider.when('/carousel', { templateUrl: "carousel.html", reloadOnSearch: false });
    $routeProvider.otherwise({ redirectTo: '/', reloadOnSearch: false });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.service('analytics', [
  '$rootScope', '$window', '$location', function ($rootScope, $window, $location) {
      var send = function (evt, data) {
          ga('send', evt, data);
      };
  }
]);

app.directive('dragToDismiss', function ($drag, $parse, $timeout) {
    return {
        restrict: 'A',
        compile: function (elem, attrs) {
            var dismissFn = $parse(attrs.dragToDismiss);
            return function (scope, elem, attrs) {
                var dismiss = false;

                $drag.bind(elem, {
                    constraint: {
                        minX: 0,
                        minY: 0,
                        maxY: 0
                    },
                    move: function (c) {
                        if (c.left >= c.width / 4) {
                            dismiss = true;
                            elem.addClass('dismiss');
                        } else {
                            dismiss = false;
                            elem.removeClass('dismiss');
                        }
                    },
                    cancel: function () {
                        elem.removeClass('dismiss');
                    },
                    end: function (c, undo, reset) {
                        if (dismiss) {
                            elem.addClass('dismitted');
                            $timeout(function () {
                                scope.$apply(function () {
                                    dismissFn(scope);
                                });
                            }, 400);
                        } else {
                            reset();
                        }
                    }
                });
            };
        }
    };
});


app.directive("carouselExampleItem", function ($rootScope, $swipe) {
    return function (scope, element, attrs) {
        var startX = null;
        var startY = null;
        var endAction = "cancel";
        var carouselId = element.parent().parent().attr("id");

        var translateAndRotate = function (x, y, z, deg) {
            element[0].style["-webkit-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
            element[0].style["-moz-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
            element[0].style["-ms-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
            element[0].style["-o-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
            element[0].style["transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
        };

        $swipe.bind(element, {
            start: function (coords) {
                endAction = null;
                startX = coords.x;
                startY = coords.y;
            },

            cancel: function (e) {
                endAction = null;
                translateAndRotate(0, 0, 0, 0);
                e.stopPropagation();
            },

            end: function (coords, e) {
                if (endAction == "prev") {
                    $rootScope.carouselPrev(carouselId);
                } else if (endAction == "next") {
                    $rootScope.carouselNext(carouselId);
                }
                translateAndRotate(0, 0, 0, 0);
                e.stopPropagation();
            },

            move: function (coords) {
                if (startX != null) {
                    var deltaX = coords.x - startX;
                    var deltaXRatio = deltaX / element[0].clientWidth;
                    if (deltaXRatio > 0.3) {
                        endAction = "next";
                    } else if (deltaXRatio < -0.3) {
                        endAction = "prev";
                    } else {
                        endAction = null;
                    }
                    translateAndRotate(deltaXRatio * 200, 0, 0, deltaXRatio * 15);
                }
            }
        });
    }
});

app.controller('MainController', function ($rootScope, $scope, analytics, $http, $timeout, $window) {

    var _isNotMobile = (function () {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
        return !check;
    })();


    $rootScope.$on("$routeChangeStart", function () {
        //if (_isNotMobile) {
        //    $scope.ko = true;
        //    $scope.title = "NON SEI AUTORIZZATO ZIO! :P";
        //    $scope.message = 'Questo servizio è consultabile esclusivamente dalle app di Sbariapp';
        //    $window.location = "#/overlay";

        //}
        $rootScope.loading = true;

    });

    $rootScope.$on("$routeChangeSuccess", function () {

        //if (_isNotMobile) {
        //    $scope.ko = true;
        //    $scope.title = "NON SEI AUTORIZZATO ZIO! :P";
        //    $scope.message = 'Questo servizio è consultabile esclusivamente dalle app di Sbariapp';
        //    $window.location = "#/overlay";

        //}
        $rootScope.loading = false;
        //if ($window.location.hash == '#/') {
        //    $scope.backUrl = '#/';
        //}
        //else if ($window.location.hash == '#/scroll') {
        //    $scope.backUrl = '#/';
        //}
        //else if ($window.location.hash == '#/forms') {
        //    $scope.backUrl = '#/scroll';
        //}
        //else if ($window.location.hash == '#/carousel') {
        //    $scope.backUrl = '#/forms';
        //}
        //else {
        //    $scope.backUrl = '#/';
        //}

    });


    $scope.goHome = function () {
        $window.location = '#/';
    }


    $scope.goBack = function () {
        $scope.dummy = [];
        $window.location = $scope.backUrl;
    }

    $scope.showMessage = function () {
        $scope.title = "Non penso si possa trovare molto se non scrivi nulla....";
        $scope.message = 'Se non hai la più pallida idea di cosa fare...prova a cliccare su uno nostri tips in basso o seleziona una categoria con il pulsante in alto a sinistra';
        $window.location = "#/overlay";
    };

    $http.get('http://localhost:1337/Hubble/GetFermionNBoson')
 .success(function (data) {
     $scope.categories = data;
 })
 .error(function (data, status) {
     $scope.title = "Errore del server Orion!";
     $scope.message = "Sembra che ci sia un errore nel prelevare le categorie :(";
     $window.location = "#/overlay";
 });
    $scope.disableGoingTo = false;

    $scope.setEventPopularity = function (event, type) {

        var postData;
        if (type == 'View')
            postData = { _id: $scope.event._id, Stats: { ViewedNumber: 1, GoingTo: 0 }, Caller: 'App' };
        else {

            $("#gt").remove();
            postData = { _id: $scope.event._id, Stats: { ViewedNumber: 0, GoingTo: 1 }, Caller: 'App' };
        }

        $http({
            url: 'http://localhost:1337/Hubble/ExpandStar',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
        }).error(function (data, status, headers, config) {
        });
    }

    $scope.UnsetEvent = function () {
        $scope.event = null;
    }

    $scope.onTimeout = function () {
        if ($scope.event != null) {
            var postData = { _id: $scope.event._id, Caller: 'App' };
            $("#gt").effect("shake", { direction: "left", times: 4, distance: 4 });
            $http({
                url: 'http://localhost:1337/Hubble/WatchUniverseExtension',
                method: "POST",
                data: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {

                if (data.Stats.ViewedNumber != $scope.event.Stats.ViewedNumber) {
                    $scope.event.Stats.ViewedNumber = data.Stats.ViewedNumber
                    $("#viewed").animate({ fontSize: '3em', color: 'red' }, "slow")
                    $("#viewed").animate({ fontSize: '1em', color: 'black' }, "slow")
                }


                if (data.Stats.GoingTo != $scope.event.Stats.GoingTo) {
                    $scope.event.Stats.GoingTo = data.Stats.GoingTo;
                    $("#going").animate({ fontSize: '3em', color: 'red' }, "slow")
                    $("#going").animate({ fontSize: '1em', color: 'black' }, "slow")
                }

            }).error(function (data, status, headers, config) {
            });
        }
        mytimeout = $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    $scope.stop = function () {
        $scope.event = null;
        $timeout.cancel(mytimeout);
    }

    $scope.setSelectedEvent = function (event) {
        $scope.disableGoingTo = false;
        $scope.event = event;
        window.location = "#/forms";
        $scope.setEventPopularity(event, "View");
    }

    var getEvents = function (postData) {
        $http({
            url: 'http://localhost:1337/Hubble/ShowMeUniverse',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.events = data;
            if ($scope.events.length == 0 || $scope.events == undefined) {
                $scope.title = "Nessuno fa nulla.....";
                $scope.message = "Pare non ci sia nulla da fare in questi giorni...prova con un altra categoria";
                $window.location = "#/overlay";
            }
            else
                window.location = "#/scroll";
        }).error(function (data, status, headers, config) {
            $scope.title = "Errore del server Orion!";
            $scope.message = "Ops...sembra ci siano problemi nel prelevare gli eventi...";
            $window.location = "#/overlay";
        });
    }

    $scope.checkEventExists = function () {
        if ($scope.events == null || $scope.events.length == 0) {
            window.location = "#/";
        }
    }

    $scope.checkEventIsSetted = function () {
        if ($scope.event == null) {
            window.location = "#/";
        }
    }

    $scope.getEventsByKeywords = function (keyWords) {

        var today = new Date();
        var from = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        var to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7, 00, 00, 00));
        $scope.lastDate = from;
        var postData = {
            Enabled: 1,
            When: { $gt: from, $lt: to },
            $or: [
                { Category: { '$regex': '.*' + keyWords + '.*', "$options": "-i" } },
                { EventName: { '$regex': '.*' + keyWords + '.*', "$options": "-i" } },
                { Owner: { '$regex': '.*' + keyWords + '.*', "$options": "-i" } },
                { ShortDescription: { '$regex': '.*' + keyWords + '.*', "$options": "-i" } },
                { ExtendedDescription: { '$regex': '.*' + keyWords + '.*', "$options": "-i" } },
            ],
            Caller: 'App'
        };
        $scope.dummy = [];
        getEvents(postData);
    }

    $scope.getEventsByCategory = function (category) {

        var today = new Date();
        var from = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        var to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7, 00, 00, 00));
        $scope.lastDate = from;


        var postData = {
            Enabled: 1,
            When: { $gt: from, $lt: to },
            Category: category,
            Caller: 'App'
        };
        $scope.dummy = [{ dummy: '' }];
        getEvents(postData);
    }

    $scope.getEventsByAdvised = function (advising) {

        var today = new Date();
        var from = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        var to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7, 00, 00, 00));

        $scope.lastDate = from;

        var postData = {
            Enabled: 1,
            When: { $gt: from, $lt: to },
            AdvisedFor: advising,
            Caller: 'App'
        };
        getEvents(postData);
    }
});

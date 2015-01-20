var app = angular.module('ApplicationConfig', ['imageupload']);

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', { templateUrl: "Dashboard.html" });
    $routeProvider.when('/Login', { templateUrl: "Login.html" });
    $routeProvider.when('/Dashboard', { templateUrl: "Dashboard.html" });
    $routeProvider.when('/Grid', { templateUrl: "Grid.html" });
    $routeProvider.when('/Event', { templateUrl: "Event.html" });
    $routeProvider.when('/SbariappNow', { templateUrl: "Sbariappnow.html" });
    $routeProvider.when('/Personal', { templateUrl: "Personal.html" });
    $routeProvider.when('/Blank', { templateUrl: "blank-page.html" });
    $routeProvider.otherwise({ redirectTo: '/' });

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

app.controller('MainController', function ($rootScope, $scope, analytics, $http, $timeout, $window) {
    $scope.isLogged = $window.sessionStorage.token != undefined;

    
    $scope.initDialog = function () {

        $("#dialog-form").dialog({
            show: {
                effect: "bounce",
                duration: 1000
            },
            hide: {
                effect: "puff",
                duration: 1000
            },
            autoOpen: false,
            height: 600,
            width: 1000,
            modal: true,
            buttons: {
                Chudi: function () {
                    $("#dialog-form").dialog("close");
                },
            },
        });
        $("#dialog-form").dialog("close");
    }

    $scope.op = function () {
        $("#dialog-form").dialog("open");
    };

    $scope.chartFilterType = ['Categorie', 'Keywords', 'Tips'];

    function initChart(now,forward) {

        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "dataProvider": now,
            "startDuration": 1.5,
            "graphs": [{
                "balloonText": "<b>[[category]]: [[value]]</b>",
                "colorField": "color",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "val"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "header",
            "categoryAxis": {
                "gridPosition": "start",
                "labelRotation": 45
            },
            "amExport": {}

        });

        var chDiv = AmCharts.makeChart("chart", {
            "type": "serial",
            "theme": "light",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "dataProvider": forward,
            "startDuration": 1.5,
            "graphs": [{
                "balloonText": "<b>[[category]]: [[value]]</b>",
                "colorField": "color",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "val"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "header",
            "categoryAxis": {
                "gridPosition": "start",
                "labelRotation": 45
            },
            "amExport": {}

        });
    }

    function initTopFive(data) {
        var topFive = AmCharts.makeChart("topFive", {
            "type": "serial",
            "theme": "light",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "dataProvider": data,
            "startDuration": 1.5,
            "graphs": [{
                "balloonText": "<b>[[category]]: [[value]]</b>",
                "colorField": "color",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "val"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "header",
            "categoryAxis": {
                "gridPosition": "start",
                "labelRotation": 45
            },
            "amExport": {}

        });
    }

    $scope.registerUser = function (email, password, telephone) {
        $scope.regMessage = "";
        $scope.loading = true;
        var postData = { 'email': email, "password": password, "telephone": telephone };

        $http({
            url: 'http://localhost:1338/Hubble/CreateSolarSystem',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {

            $scope.loading = false;
            $("#dialog-form").dialog("close");

            $window.alert('La registrazione e\' avvenuta correttamente.\r\nOra puoi effettuare l accesso con le tue credenziali.');

        }).error(function (data, status, headers, config) {

            $scope.loading = false;
            $scope.regMessage = data
            if (status == 401)
                delete $window.sessionStorage.token;
        });
    }

    $scope.getTopFive = function () {
        $http({
            url: 'http://localhost:1338/Hubble/GetIdrogen',
            method: "POST",
            data: JSON.stringify(""),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            initTopFive(data);
        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;

            $window.location = "#/Blank"
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
        });
    }

    $scope.getUserInfo = function () {

        var postData = {
            token: $window.sessionStorage.token
        };

        $http({
            url: 'http://localhost:1338/Hubble/GetSolarSystemComposition',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.email = data.Email;
            $scope.telephone = data.Telephone;
            $scope.since = data.Since;
        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;

            $window.location = "#/Blank"
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
        });
    }

    $scope.getSbariappNowData = function (type) {

        var t;

        if (type == "Categorie")
            t = "Cat";
        else if (type == "Tips")
            t = "Tip";
        else
            t = "Keyword";

        var postData = { type: t };

        $http({
            url: 'http://localhost:1338/Hubble/GetUniverseComposition',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            initChart(data.now, data.forward);
        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;

            $window.location = "#/Blank"
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
        });
    }


    $rootScope.$on("$routeChangeStart", function () {

        $scope.isLogged = $window.sessionStorage.token != undefined;
        $scope.username = $window.sessionStorage.username;

        if (window.location.hash != "#/Login" && window.location.hash != "#/Blank")
            if (!$scope.isLogged)
                window.location = "#/Login";

    });
    $rootScope.$on("$routeChangeSuccess", function () {
       
    });

    $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {

            var postData = {
                userId: username,
                pwd: password
            };

            $http({
                url: 'http://localhost:1338/Hubble/IndetifyElement',
                method: "POST",
                data: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                $scope.username = data.split("|")[0];
                $window.sessionStorage.username = $scope.username;
                $window.sessionStorage.token = data.split("|")[1];
                window.location = "#/Dashboard";
                $scope.msg = undefined;
            }).error(function (data, status, headers, config) {
                if (status == 401) {
                    $scope.msg = data;
                    delete $window.sessionStorage.token;
                }
                else {
                    delete $window.sessionStorage.token;
                    $window.location = "#/Blank"
                    $scope.pageImg = "/images/rageGif.gif";
                    $scope.Message = data
                    $scope.linkName = "Clicca qui per riprovare l'accesso";
                    $scope.link = "#/Login";
                }
            });
        }
    }

    $scope.logout = function logout() {
        if ($scope.isLogged = true) {

            var postData = {
                token: $window.sessionStorage.token
            };

            $http({
                url: 'http://localhost:1338/Hubble/DestroyElement',
                method: "POST",
                data: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                delete $window.sessionStorage.token;
                $window.location = "#/Login";
            }).error(function (data, status, headers, config) {
                delete $window.sessionStorage.token;
                $window.location = "#/Blank"
                $scope.pageImg = "/images/working.gif";
                $scope.Message = data
                $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
                $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
            });
        }
    }

    $scope.pending = -1;
    $scope.running = -1;

    $scope.stellarium = function stellarium() {
        var postData = {
            token: $window.sessionStorage.token
        };

        $http({
            url: 'http://localhost:1338/Hubble/Stellarium',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.pending = data.Pending;
            $scope.running = data.Running;
        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;

            $window.location = "#/Blank"
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
        });
    }


    $scope.in = function () {
        $("#datepicker").datepicker($.datepicker.regional['it']);
    }

    $scope.setEvent = function (thumb, image, image2, image3, event) {
        
        if (event == undefined || event.EventName == undefined || event.Email == undefined
            || event.ShortDescription == undefined || event.ExtendedDescription == undefined)
            return;

        if (event.Category == undefined || event.Category == '')
        {
            $window.alert("Impostare una categoria per l'evento");
            return;
        }
        if (event.AdvisedFor == undefined || event.AdvisedFor == '') {
            $window.alert("Impostare un tip per questo evento");
            return;
        }
        if (event.Where == undefined) {
            $window.alert("Impostare il comune in cui si svolgera' l'evento");
            return;
        }

        if (thumb == undefined)
        {
            $window.alert("L'icona dell'evento e' obbligatoria");
            return;
        }
        if (image == undefined && image2 == undefined && image3 == undefined) {
            $window.alert("E' necessario inserire almeno un'immagine dimostrativa dell'evento");
            return;
        }

        var hours = $('#hours').val();

        if (isNaN(parseInt(hours)))
        {
            $window.alert("L'ora dell'evento inserita non e' valida");
            return;
        }
        if (parseInt(hours) >= 24) {
            $window.alert("L'ora dell'evento inserita non e' valida");
            return;
        }

        var date = $("#datepicker").datepicker('getDate');
        var today = date != null ? date : new Date();
        today.setHours(parseInt(hours), 0, 0);


        event.When = today
        var via = $('#via').val();

        event.Where = via + " " + event.Where;

        $scope.pageImg = "/images/working.gif";
        $scope.Message = "Attendi mentre i nostri operatori caricano il tuo evento...";
        $window.location = "#/Blank"

        var postData = {
            ev: event,
            thm: { 'type': thumb.resized.type, 'data': thumb.resized.dataURL },
            img: image == undefined ? undefined : { 'type': image.resized.type, 'data': image.resized.dataURL },
            img2: image2 == undefined ? undefined : { 'type': image2.resized.type, 'data': image2.resized.dataURL },
            img3: image3 == undefined ? undefined : { 'type': image3.resized.type, 'data': image3.resized.dataURL },
            token: $window.sessionStorage.token
        };
        
        $http({
            url: 'http://localhost:1338/Hubble/StarBorn',
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.pageImg = "/images/robotGIF.gif";
            $scope.Message = "Congratulazioni il tuo evento e' stato correttamente inserito.\r\nTi ricordiamo che il team di sbariapp provvedera' a pubblicarlo nel piu' breve tempo possibile.";
            $scope.linkName = "Clicca qui per pubblicare un altro evento";
            $scope.link = "#/Event";

        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";

        });
    }

    $scope.GetEvents = function (state) {

        //$scope.loading = true;
        var postData;
        var url;
        if (state !=  'warmhole') {
            postData = {
                Caller: 'Site',
                Enabled: state == 'pending' ? 0 : 1,
                token: $window.sessionStorage.token
            };
            url = 'http://localhost:1338/Hubble/ShowMeUniverse';
        }
        else {
            postData = {
                token: $window.sessionStorage.token
            };

            url = 'http://localhost:1338/Hubble/JumpWarmHole'
        }

        $http({
            url: url,
            method: "POST",
            data: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.events = data;
            $scope.gridHeader = state == 'pending' ? "Eventi in attesa di conferma" : state == 'running' ? "Eventi in corso" : "Eventi scaduti";
            $window.location = '#/Grid';
        }).error(function (data, status, headers, config) {
            if (status == 401)
                delete $window.sessionStorage.token;
            $window.location = "#/Blank"
            $scope.pageImg = "/images/rageGif.gif";
            $scope.Message = data
            $scope.linkName = status != 401 ? "Clicca qui per tornare alla Dashboard" : "Clicca qui per effettuare l'accesso";
            $scope.link = status != 401 ? "#/Dashboard" : "#/Login";
        });
    }

});



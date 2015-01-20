//var _isNotMobile = (function () {
//    var check = false;
//    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
//    return !check;
//})();

var Hubble = require('./Hubble');
var String = require('./StringTheory');
var http = require('http');


var getHeader = function () {
    return {
        'Content-Type': 'application/json' ,
        'Access-Control-Allow-Origin': '*' , 
        'Access-Control-Allow-Methods' : ['OPTIONS', 'GET', 'POST'],
        'Access-Control-Allow-Headers' : ['Content-Type','Content-Length','X-Requested-With']
    };
}


Hubble.onPost("/Hubble/ShowMeUniverse", function (req, res) {
    
    if (req.params.Caller == "Site") {
        if (req.params.token == undefined) {
            res.writeHead(401, getHeader());
            res.end("Area privata.E' necessario effettuare il login o registrarsi");
            return;
        }
        else if (!String.UserConnected(req.params.token)) {
            res.writeHead(401, getHeader());
            res.end("Sessione scaduta.E' necessario rieffettuare il login");
            return;
        }
        String.setNewLastOperation(req.params.token);
        req.params['PublisherId'] = String.UserIdByToken(req.params.token);
        delete req.params.token;
    }
    if (req.params.Caller == "App") {
        if (req.params.Category != undefined)
            String.UniverseComposition("Cat", req.params.Category.replace(/\.\*/g, "").replace(/\\\i/g, ""))
        else if (req.params.AdvisedFor != undefined)
            String.UniverseComposition("Tip", req.params.AdvisedFor.replace(/\.\*/g, "").replace(/\\\i/g, ""))
        else if (req.params.$or != undefined) {
            String.UniverseComposition("Keyword", req.params.$or[1].EventName.$regex.replace(/\.\*/g,"").replace(/\\\i/g, ""));
        }
    }

    var caller = req.params.Caller;
    delete req.params.Caller;
   
    String.GetMateria(caller, req.params, function (cb) {
        
        if (cb.Strings != undefined) {
            res.writeHead(500, getHeader());
            res.end("Orion è collassato...Errore tecnico..");
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onGet("/Hubble/GetFermionNBoson", function (req, res) {
    
    var caller = req.params.Caller;
    delete req.params.Caller;

    res.writeHead(200, getHeader());
    String.GetFermionNBoson(caller, req.params, function (cb) {
        res.end(JSON.stringify(cb));
    });
});

Hubble.onPost("/Hubble/IndetifyElement", function (req, res) {
    String.IdentifyElement(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(JSON.stringify(cb.AuthError));
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(JSON.stringify(cb.AuthError));
        }
        else {
            res.writeHead(200, getHeader());
            res.end(cb);
        }
    });
    
});

Hubble.onPost("/Hubble/CreateSolarSystem", function (req, res) {
    String.CreateSolarSystem(req.params.email, req.params.password, req.params.telephone, function (cb) {
        
        if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(JSON.stringify(cb.Error));
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/GetSolarSystemComposition", function (req, res) {
    String.GetSolarSystemComposition(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(JSON.stringify(cb.AuthError));
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(JSON.stringify(cb.AuthError));
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/Stellarium", function (req, res) {
    if (req.params.token != undefined)
        String.setNewLastOperation(req.params.token);
    
    String.Stellarium(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(cb.AuthError);
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(cb.Error);
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/GetUniverseComposition", function (req, res) {
    if (req.params.token != undefined)
        String.setNewLastOperation(req.params.token);
    
    String.GetUniverseComposition(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(cb.AuthError);
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(cb.Error);
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/JumpWarmHole", function (req, res) {
    if (req.params.token != undefined)
        String.setNewLastOperation(req.params.token);
    
    String.JumpWarmHole(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(cb.AuthError);
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(cb.Error);
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/GetIdrogen", function (req, res) {
    if (req.params.token != undefined)
        String.setNewLastOperation(req.params.token);
    
    String.GetIdrogen(null, req, function (cb) {
        
        if (cb.AuthError != undefined) {
            res.writeHead(401, getHeader());
            res.end(cb.AuthError);
        }
        else if (cb.Error != undefined) {
            res.writeHead(500, getHeader());
            res.end(cb.Error);
        }
        else {
            res.writeHead(200, getHeader());
            res.end(JSON.stringify(cb));
        }
    });
    
});

Hubble.onPost("/Hubble/DestroyElement", function (req, res) {
    
    res.writeHead(200, getHeader());
    String.DestroyElement(null, req, function (cb) {
        res.end(cb);
    });
    
});

Hubble.onPost("/Hubble/WatchUniverseExtension", function (req, res) {
    
    var caller = req.params.Caller;
    delete req.params.Caller;

    res.writeHead(200, getHeader());
    String.WacthUniverseExtension(caller, req.params, function (cb) {
        res.end(JSON.stringify(cb));
    });
});
Hubble.onPost("/Hubble/ExpandStar", function (req, res) {
    
    var caller = req.params.Caller;
    delete req.params.Caller;

    res.writeHead(200, getHeader());
    String.ExpandStar(caller, req.params, function (cb) {
        res.end();
    });
});

Hubble.onPost("/Hubble/StarBorn", function (req, res) {
    
    if (req.params.token == undefined) {
        res.writeHead(401, getHeader());
        res.end("Area privata.E' necessario effettuare il login o registrarsi");
        return;
    }
    else if (!String.UserConnected(req.params.token)) {
        res.writeHead(401, getHeader());
        res.end("Sessione scaduta.E' necessario rieffettuare il login");
        return;
    }
    
    String.setNewLastOperation(req.params.token);
    
    req.params.ev['PublisherId'] = String.UserIdByToken(req.params.token);
    if (req.params.ev.When != undefined)
        req.params.ev.When = new Date(req.params.ev.When);
    
    
    delete req.params.token;
    
    
    String.CreateMateria("", req.params, function (cb) {
        
        if (cb.Strings == undefined) {
            res.writeHead(200, getHeader());
            res.end();
        }
        else {
            res.writeHead(500, getHeader());
            res.end("Ops...c'è stato un problema con i server di sbariapp...Riprova, se il problema persiste contatta il team");
        }
    });
    
});

Hubble.onPost("/Hubble/StarAlter", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end();
});

Hubble.onPost("/Hubble/BlackHole", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end();
});


var appListener = http.createServer(function (req, res) {
    try {
        console.log(req.headers.origin + ' has called ' + req.url + ' on port 1337 at:' + new Date().toString("dd/M/yy h:mm:ss"));
        Hubble.observe(req, res);
    }
    catch (E) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Hubble has a problem :(");
    }
});
appListener.listen(1337);


console.log("App service started...Bok globules are ready to be collided..and hubble watching Orion....");

var crudListener = http.createServer(function (req, res) {
    try {
        console.log(req.headers.origin + ' has called ' + req.url + ' on port 1338 at:' + new Date().toString("dd/M/yy h:mm:ss"));
        String.checkTokenExpired();
        Hubble.observe(req, res);
    }
    catch (E) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Hubble has a problem :(" + E);
    }
});

crudListener.listen(1338);

console.log("CRUD service started...Bok globules are ready to be collided..and hubble watching Orion....");

process.on('uncaughtException', function (err) {

    console.log("Orion error " + err);
});
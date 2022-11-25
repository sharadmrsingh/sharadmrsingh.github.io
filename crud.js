var express = require('C:/Users/HP/AppData/Roaming/npm/node_modules/express');
var app = express();
var fs = require("fs");
var payloadChecker = require('C:/Users/HP/AppData/Roaming/npm/node_modules/payload-validator');
var bodyParser = require('C:/Users/HP/AppData/Roaming/npm/node_modules/body-parser');
// Shorthand for app: var router=express.Router();
var expectedPayload = {
    "id": "",
    "name": ""
}
//middleware
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// Read Api
app.get('/crud', function (req, res) {
    fs.readFile('crud.json', 'utf-8', function (err, data) {
        console.log(data);
        res.end(data);
        //res.send(data);
    });
});

// Create Api
app.post('/crud', function (req, res) {
    // First read existing users.
    if (req.body) {
        var result = payloadChecker.validator(req.body, expectedPayload, ["id", "name"], false);
        var numberRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/
        var isNumber;
        //Checking if id value entered is integer or not
        if (numberRegex.test(req.body['id']) && req.body['id'] != '') {
            isNumber = true;
        }
        else if (req.body['id'] == '') {
            // Go on
        }
        else {
            isNumber = false;
            res.json({ "message": "id must be a number" });
            return 0;
        }
        //Checking if name entered is string
        if (numberRegex.test(req.body['name']) && req.body['name'] != '') {
            res.json({ "message": "name cannot be a number" });
            return 0;
        }
        else if (req.body['name'] == '') {
            // Go on
        }
        if (result.success && isNumber) {
            fs.readFile('crud.json', 'utf-8', function (err, data) {
                data = JSON.parse(data);
                data[data.length] = req.body;

                // stringify JSON Object
                var jsonContent = JSON.stringify(data);//jsonObj);
                console.log('jsonContent: ' + jsonContent);

                fs.writeFile("crud.json", jsonContent,//jsonContent.toString(),//data.toString(), 
                    'utf8', function (err) {
                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            return console.log(err);
                        }
                        console.log("JSON file has been saved.");
                    });
            });
            res.json({ "message": "Success" });
        }
        else {
            res.json({ "message": result.response.errorMessage });
        }
    }
    else {
        res.json({ "message": "Send correct json data" });
    }
});

// Upate Api
app.put('/crud/:id', function (req, res) {
    // First read existing users.
    if (req.body) {
        var result = payloadChecker.validator(req.body, expectedPayload, ["name"], false);
        var numberRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/
        var isNumber = true;

        //Checking if name entered is string
        if (numberRegex.test(req.body['name']) && req.body['name'] != '') {
            res.json({ "message": "name cannot be a number" });
            return 0;
        }
        else if (req.body['name'] == '') {
            // Go on
        }
        if (result.success && isNumber) {
            fs.readFile('crud.json', 'utf-8', function (err, data) {
                data = JSON.parse(data);

                var userId = req.params['id'];
                if (userId == 0) {
                    res.json({ "message": "no data found with this id" });
                    return 0;
                }
                else if (userId > 0 && userId <= data.length) {
                    userId = userId - 1;
                }
                data[userId]['name'] = req.body['name'];

                // stringify JSON Object
                var jsonContent = JSON.stringify(data);
                console.log('jsonContent: ' + jsonContent);

                fs.writeFile("crud.json", jsonContent,
                    'utf8', function (err) {
                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            return console.log(err);
                        }
                        console.log("JSON file has been saved.");
                    });
            });
            if (req.params['id']) {
                return 0;
            }
            else {
                res.json({ "message": "Success.Data updated sucessfully." });
            }
        }
        else {
            res.json({ "message": result.response.errorMessage });
        }
    }
    else {
        res.json({ "message": "Send correct json data" });
    }
});

// Delete Api
app.delete('/crud/:id', function (req, res) {
    fs.readFile('crud.json', 'utf-8', function (err, data) {
        data = JSON.parse(data);
        var userId = req.params['id'];
        if (userId == 0) {
            res.json({ "message": "no data found with this id" });
        }
        else if (userId > 0 && userId <= data.length) {
            userId = userId - 1;
        }
        delete data[userId];
        data.length = data.length - 1;

        // stringify JSON Object
        var jsonContent = JSON.stringify(data);//jsonObj);
        console.log('jsonContent: ' + jsonContent);
        fs.writeFile("crud.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
        res.json({ "message": "Data deleted sucessfully" });
    });
});


var server = app.listen(8081, 'localhost', function (req, res) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})


/*Redundant code at bottom
//console.log('Test List users get api,navigate to 127.0.0.1:8081/listUsers\nTest get api that retrieves info with particular user id,navigate to 127.0.0.1:8081/user1 ,127.0.0.1:8081/user2 etc.');
//res.send("Test List users get api,navigate to 127.0.0.1:8081/listUsers<br>Test get api that retrieves info with particular user id,navigate to 127.0.0.1:8081/user1 ,127.0.0.1:8081/user2 etc.");
console.log('Data before updation: ');
console.log(data);
/*This is the local data which we were sending earlier,working perfectly fine
data[data.length] =//data+','+ 
{
    "id": "5",
    "name": "Abhishek"
};//
// parse json
//var jsonObj=JSON.parse(data);
//console.log('jsonObj: '+jsonObj);
console.log('Data after updation[original json file is not modified]: ');
console.log(data);
//res.end(JSON.stringify(data));
console.log('Add User POST api,hit on postman or thunderclient');
 console.log('Data using JSON stringify:');
console.log(JSON.stringify(data));
//res.send('Add User POST api');
/*console.log(req.params['id']);
console.log(data[0]);
console.log(data.length);
//data.body[':id']//req.params['id'];
 */
var request = require('request');
var express = require('express');
var azure = require('azure-storage');
var blobService = azure.createBlobService('faceimg', 'vjckPyJ37aWuElE81It17cMOZvy54+1pAXYEQWzmRyCqlqpYEOpST6ZZ1LO1dgtwtjs5P7wV3Bwih3B5q9vUrg==');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var mongoClient = require('mongodb').MongoClient;

const subKey = '3557f36bcd7d45edb927993db27a47fb';
const fileUrl = 'https://faceimg.blob.core.windows.net/faceimgs/';
const mongodbUrl = 'mongodb://crimeinfomobile:kaaGy7qBriWfQCLBvp1N3D8nRmL7MB3lKYBfKrwBNjbUVVVEsmL3a6UcAa07IWZOa3n2wv8GO23f2Lb4Y4Rv0w==@crimeinfomobile.documents.azure.com:10255/?ssl=true&replicaSet=globaldb'

var router = express.Router();

router.get('/createFaceGroup', function(req, res){
  createFaceGroup(req.query.groupName, res);
});

router.get('/createPerson', function(req, res){
  createPerson(req.query.personName, res);
});

router.get('/listAllPerson', function(req, res){
  listAllPerson(res);
});

router.get('/deletePerson', function(req, res){
  deletePerson(req.query.personID, res);
});

router.post('/addFace', upload.single('photo'), function(req, res){
  var buffer = new Buffer(req.file.buffer);
  var personID = req.query.personID;
  uploadFileForAddFace(personID, buffer, res);
  // addFace(personID, res);
});

router.post('/identify', upload.single('photo'), function(req, res){
  var buffer = new Buffer(req.file.buffer);
  uploadFileForIdentify(buffer, res);
  var faceid = detectFace(res);
});

router.get('/trainGroup', function(req, res){
  trainPersonGroup(res);
});

router.get('/crimeInfo', function(req, res){
  var postcode = req.query.postcode;
  getCrimeInfo(postcode, res);
});

router.get('/identify', function(req, res){
  var faceid = detectFace(res);
});

module.exports = router;

let Duplex = require('stream').Duplex;
function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function createFaceGroup(groupName, client){
  var options = {
    method: 'PUT',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    body: {name: groupName},
    json: true
  };

  request(options, function(error, response, body){
    if (error) console.log(error);
    client.send(body);
  });
}

function createPerson(personName, client){
  var options = {
    method: 'POST',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    body: {name: personName},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function listAllPerson(client){
  var options = {
    method: 'GET',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function deletePerson(personID, client){
  var options = {
    method: 'DELETE',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/'+personID,
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send('{result: success}');
  });
}

function uploadFileForIdentify(buffer, client){
  var name = 'userUploadPhoto'
  var stream = bufferToStream(buffer);
  blobService.createBlockBlobFromStream('faceimgs', name, stream, buffer.length, function(error){
    if(error){
      client.write(error);
    };
  });
}

function uploadFileForAddFace(personID, buffer, client){
  var options = {
    method: 'GET',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/'+personID,
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    var name = body.name;
    var stream = bufferToStream(buffer);
    blobService.createBlockBlobFromStream('faceimgs', name, stream, buffer.length, function(error){
      if(error){
        client.write(error);
      };
    });
    addFace(personID, name, client);
  });
}

function addFace(personID, name, client){
  var url = fileUrl + name;
  var options = {
    method: 'POST',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/'+personID+'/persistedFaces',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    body: {url: fileUrl + name},
    json: true
  };
  console.log(url);
  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function trainPersonGroup(client){
  var options = {
    method: 'POST',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/train',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send('{result: success}');
  });
}

function detectFace(client){
  var options = {
    method: 'POST',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    body: {url: fileUrl + 'userUploadPhoto'},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    identify(body[0].faceId, client);
  });
}

function identify(faceid, client){
  var lst = [];
  lst.push(faceid);
  var options = {
    method: 'POST',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/identify',
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    body: {
      personGroupId: 'facedb',
      faceIds: lst,
      maxNumOfCandidatesReturned: 1,
      confidenceThreshold: 0.5
    },
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    var personID = body[0].candidates[0].personId;
    queryPerson(personID, client, true);
  });
}

function getCrimeInfo(postcode, client){
  // connect to mongodb
  mongoClient.connect(mongodbUrl, function (err, database) {
    if(err) console.log(err);
    var db = database.db('crimeInfo');
    console.log(db.databaseName);
    var collection = db.collection('only2017info');
    collection.find({
      Postcode:postcode
    },{
      "Suburb/Town Name": true,
      "CSA Offence Division": true,
      "Offence Count": true
    }).toArray(function(err, docs){
      if(err) console.log(err);
      client.send(docs);
      db.close();
    });
  });
}

function queryPerson(personID, client){
  var options = {
    method: 'GET',
    url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/'+personID,
    headers:
     {'content-type': 'application/json',
      'ocp-apim-subscription-key': subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body.name);
  });
}

var request = require("request");
var express = require("express");
var azure = require("azure-storage");
var blobService = azure.createBlobService("faceimg", "vjckPyJ37aWuElE81It17cMOZvy54+1pAXYEQWzmRyCqlqpYEOpST6ZZ1LO1dgtwtjs5P7wV3Bwih3B5q9vUrg==");
var multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({storage: storage});

const subKey = "3557f36bcd7d45edb927993db27a47fb";
const fileUrl = "https://faceimg.blob.core.windows.net/faceimgs/testBlob";
var router = express.Router();

router.get("/createFaceGroup", function(req, res){
  createFaceGroup(req.query.groupName, res);
});

router.get("/createPerson", function(req, res){
  createPerson(req.query.personName, res);
});

router.get("/listAllPerson", function(req, res){
  listAllPerson(res);
});

router.get("/deletePerson", function(req, res){
  deletePerson(req.query.personID, res);
});

router.post("/addFace", upload.single("photo"), function(req, res){
  var buffer = new Buffer(req.file.buffer);
  uploadFile(buffer, res);
  addFace(req.query.personID, res);
  trainPersonGroup();
});

router.post("/identify", upload.single("photo"), function(req, res){
  var buffer = new Buffer(req.file.buffer);
  uploadFile(buffer, res);
  var faceid = detectFace(res);
  //identify(faceid, res);
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
    method: "PUT",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
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
    method: "POST",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
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
    method: "GET",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function deletePerson(personID, client){
  var options = {
    method: "DELETE",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/"+personID,
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function uploadFile(buffer, client){
  var stream = bufferToStream(buffer);
  blobService.createBlockBlobFromStream("faceimgs", "testBlob", stream, buffer.length, function(error){
    if(error){
      client.send(error);
    };
  });
}

function addFace(personID, client){
  var options = {
    method: "POST",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/persons/"+personID+"/persistedFaces",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    body: {url: fileUrl},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

function trainPersonGroup(){
  var options = {
    method: "POST",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/facedb/train",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
  });
}

function detectFace(client){
  var options = {
    method: "POST",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    body: {url: fileUrl},
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
    method: "POST",
    url: "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/identify",
    headers:
     {"content-type": "application/json",
      "ocp-apim-subscription-key": subKey},
    body: {
      personGroupId: "facedb",
      faceIds: lst,
      maxNumOfCandidatesReturned: 1,
      confidenceThreshold: 0.5
    },
    json: true
  };

  request(options, function(error, response, body){
    if(error) console.log(error);
    client.send(body);
  });
}

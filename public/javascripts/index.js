$(function(){
  $('#createFaceGroup').on('click', function(){
      var newGroupName = $('#groupName').val() || 'facedb';
      var params = {
        groupName: newGroupName
      };
      // var url = window.location.hostname + '/api/createFaceGroup?' + $.param(params);
      var url = '/api/createFaceGroup?' + $.param(params);
      console.log(url);
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function(data){
          console.log(data);
          $('#CgroupResult').val(data.responseText);
        },
        error: function(err){
          console.log(err.responseText);
          $('#CgroupResult').val(err.responseText);
        }
      });
  });

  $('#createPerson').on('click', function(){
      var newPersonName = $('#personName').val() || 'person';
      var params = {
        personName: newPersonName
      };
      // var url = window.location.hostname + '/api/createFaceGroup?' + $.param(params);
      var url = '/api/createPerson?' + $.param(params);
      console.log(url);
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function(data){
          console.log(data);
          $('#CpersonResult').val(data.responseText);
        },
        error: function(err){
          console.log(err.responseText);
          $('#CpersonResult').val(err.responseText);
        }
      });
  });

  $('#deletePerson').on('click', function(){
      var personID = $('#personID').val() || '';
      var params = {
        personID: personID
      };
      // var url = window.location.hostname + '/api/createFaceGroup?' + $.param(params);
      var url = '/api/deletePerson?' + $.param(params);
      console.log(url);
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function(data){
          console.log(data);
          $('#DpersonResult').val('success');
        },
        error: function(err){
          console.log(err.responseText);
          $('#DpersonResult').val(err.responseText);
        }
      });
  });

  $('#listAllPerson').on('click', function(){
    // var url = window.location.hostname + '/api/createFaceGroup?' + $.param(params);
    var url = '/api/listAllPerson';
    console.log(url);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        $('#ListResult').val(data.responseText);
      },
      error: function(err){
        console.log(err.responseText);
        $('#ListResult').val(err.responseText);
      }
    });
  });

  var faceFile;
  $('#personFace').on('change', function(){
    faceFile = this.files[0];
  });

  $('#addFace').on('click', function(){
    var fd = new FormData();
    fd.append('photo', faceFile);

    var personID = $('#personIDForFace').val();
    var params = {
      personID: personID
    };
    var url = '/api/addFace?' + $.param(params);
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        $('#AFaceResult').val(xhr.response);
        console.log(xhr.response);
      }
    }
    xhr.open('POST', url, true);
    xhr.send(fd);
  });

  var candidateFile;
  $('#candidate').on('change', function(){
    candidateFile = this.files[0];
  });

  $('#identify').on('click', function(){
    var fd = new FormData();
    fd.append('photo', candidateFile);

    var url = '/api/identify';
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        $('#identifyResult').val(xhr.response);
        console.log(xhr.response);
      }
    }
    xhr.open('POST', url, true);
    xhr.send(fd);
  });

  $('#trainGroup').on('click', function(){
    // var url = window.location.hostname + '/api/createFaceGroup?' + $.param(params);
    var url = '/api/trainGroup';
    console.log(url);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        $('#trainResult').val(data.responseText);
      },
      error: function(err){
        console.log(err.responseText);
        $('#trainResult').val(err.responseText);
      }
    });
  });

  $('#searchCrimeInfo').on('click', function(){
    var postcode = $('#postcode').val();
    var params = {
      postcode: postcode
    };
    var url = '/api/crimeInfo?' + $.param(params);
    console.log(url);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        $('#crimeInfoResult').val(data.responseText);
      },
      error: function(err){
        console.log(err.responseText);
        $('#crimeInfoResult').val(err.responseText);
      }
    });
  });

});

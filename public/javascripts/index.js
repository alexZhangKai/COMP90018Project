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

});

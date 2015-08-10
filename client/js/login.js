// Globals for the client's session
var userId, username;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  $('.g-signin2').hide();
  $('#welcome').html(profile.getName());
  $('#userPic').attr('src', profile.getImageUrl());
  $('#userPic').show();
  $('#signOut').show();

  userId = profile.getId();
  username = profile.getName();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    userId = username = undefined;
    $('.g-signin2').show();
    $('#welcome').html('');
    $('#userPic').hide();
    $('#signOut').hide();
  });
}
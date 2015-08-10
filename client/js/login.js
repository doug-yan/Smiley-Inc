var userId;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();

  console.log('ID: ' + profile.getId());
}

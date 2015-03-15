var clientId = 'testClientId';
var clientSecret = 'testClientSecret';
var host = 'oauth/token';

var localPrincipal = {
    'key': 1,
    'userName': 'localUserPrincipal',
    'roles': ['grantingRole']
};

var remotePrincipal = {
    'key': 2,
    'userName': 'remoteUserPrincipal'
};

var oauthToken = {
    'token_type': "bearer",
    'access_token': "AAAA%2FAAA%3DAAAAAAAA",
    'expires_in': 1800
};

var userLogin = {
    'username': 'testuser',
    'password': 'testPW'
};
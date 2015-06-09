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
    "access_token":"eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0MzM4Nzc1OTcsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9VU0VSX0FETUlOIiwiUk9MRV9TWVNURU1fQURNSU4iXSwianRpIjoiNzY1Y2ZlMWYtMzkyYy00MTA2LTkwNzYtZDQ0MjY5OGExMjIyIiwiY2xpZW50X2lkIjoiaWFtVWkiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXX0.F_Plzh790q3afL347XSxoX-QD8mtMZ_MUZHP3zCXnMYWnwGyddOw0HfSI_fajrZNvFFTqP6EqK5DsN5q5kc56Ve0rgFO-D_BuBJ94wA8pFQBozP1BN5FhRmepavUVy6-sXn03a-LULzB1lmwSAdj4V2sK_b7rx2QGX1zQtU668VUtKzwz7f8BXlC1F9DxLc9eQX32WNEJG5nZjn8fd1O40AJjZtBp23Mpjgm6LFONvZhnIwDQUqrlpG_WtWRY6Eg4EJcz4QIm1eFvdrx3g9LP-Zsd1OlEPWoug7XpLZrSgSQqhffCLdn10PxE7enQYvZ6NIVW9s_Bq5U9RkPAQQNgw","token_type":"bearer","refresh_token":"eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJhdGkiOiI3NjVjZmUxZi0zOTJjLTQxMDYtOTA3Ni1kNDQyNjk4YTEyMjIiLCJleHAiOjE0MzM4Nzc5OTcsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfVVNFUl9BRE1JTiIsIlJPTEVfU1lTVEVNX0FETUlOIl0sImp0aSI6ImEwOGM3ODUxLWFjMGQtNGE4YS1iZTJlLWJhNDlkMDRkZDFkYiIsImNsaWVudF9pZCI6ImlhbVVpIn0.Wpk3Zd9LoAist72kieQY6nxZuwVFyOMKXYngLnZugwY7_uGVCdPTc0cW5C93N1SAoWG_oISLgwjFzZA_6UvxPiFNoZJS3HMyDA8vGE5gf_OJ3tc0sZpKJH0vK6vtA7uHUipNLO5k1NSyjX7uMEf03K8Au4TjgYayQ_sSeNNa28pR9dZiXimKe_TVruUuVsycsEELHZC6GkZlbRDqmv0kX9KEbELSgqSguywk-c_W18d9xWq3IbH3t_tqg2tIsdsZXVCg7pgM116D9vLf73UYUdU1W5HGIqptMudrrIocWXtwYLlFMz2cAmIHsycGc_MDvPolgTpA6tjkrkuZKfN14g",
    "expires_in":3599,
    "scope":"read write",
    "jti":"765cfe1f-392c-4106-9076-d442698a1222"
};

var userLogin = {
    'username': 'testuser',
    'password': 'testPW'
};

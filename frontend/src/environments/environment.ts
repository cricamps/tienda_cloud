export const environment = {
  production: false,

  apiUrl: 'http://localhost:8080/api',

  msalConfig: {
    auth: {
      // App "tienda-frontend" — ya tiene localhost:4200 registrado como SPA
      clientId: '498e47b6-e1a3-4881-ad4f-f2859feb9004',
      authority: 'https://CloudeGrupo2.b2clogin.com/CloudeGrupo2.onmicrosoft.com/B2C_1_grupo2',
      knownAuthorities: ['CloudeGrupo2.b2clogin.com'],
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    }
  },

  loginRequest: {
    scopes: ['openid', 'profile']
  },

  apiScopes: [
    'https://CloudeGrupo2.onmicrosoft.com/498e47b6-e1a3-4881-ad4f-f2859feb9004/api.read'
  ]
};

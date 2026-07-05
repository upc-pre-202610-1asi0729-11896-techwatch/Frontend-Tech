export const environment = {
  production: true,
  // Production build talks to the deployed backend directly (no dev-server proxy).
  apiBaseUrl: 'https://techwatch-backend-production.up.railway.app/api/v1',
  authenticationEndpointPath: '/authentication',
  usersEndpointPath: '/users',
  profilesEndpointPath: '/profiles',
  plansEndpointPath: '/plans',
  subscriptionsEndpointPath: '/subscriptions',
  propertiesEndpointPath: '/properties',
  devicesEndpointPath: '/devices',
  simulationSessionsEndpointPath: '/simulation-sessions',
  metricsEndpointPath: '/metrics',
  alertsEndpointPath: '/alerts',
  reportsEndpointPath: '/reports',
};

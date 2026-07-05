export const environment = {
  production: false,
  // In development the requests go through the ng serve proxy (proxy.conf.json),
  // which forwards /api to the Spring Boot backend at http://localhost:8080.
  apiBaseUrl: '/api/v1',
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

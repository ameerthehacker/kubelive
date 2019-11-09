'use strict';
const { transformServiceData } = require('../../src/transformers/service');

const buildServiceItems = (options) => {
  const item = {
    metadata: {
      name: options.name || 'some-service-name',
      creationTimestamp: options.creationTimestamp || Date.now()
    },
    spec: {
      type: options.type || 'ClusterIP',
      clusterIP: options.clusterIP || '0.0.0.0',
      externalIP: options.externalIP || '0.0.0.0',
      ports: options.ports || []
    }
  };

  return [item];
};

describe('transformServiceData()', () => {
  it('should set the service name correctly', () => {
    const serviceName = 'some-service-name';
    const items = buildServiceItems({
      name: serviceName
    });

    const service = transformServiceData(items)[0];

    expect(service.name.text).toEqual(serviceName);
  });

  it('should set the service name as selector', () => {
    const serviceName = 'some-service-name';
    const items = buildServiceItems({
      name: serviceName
    });

    const service = transformServiceData(items)[0];

    expect(service.name.isSelector).toBeTruthy();
  });

  it('should set the service type correctly', () => {
    const type = 'LoadBalancer';
    const items = buildServiceItems({
      type
    });

    const service = transformServiceData(items)[0];

    expect(service.type.text).toEqual(type);
  });

  it('should set the cluster IP correctly', () => {
    const clusterIP = '1.1.1.1';
    const items = buildServiceItems({
      clusterIP
    });

    const service = transformServiceData(items)[0];

    expect(service['cluster-ip'].text).toEqual(clusterIP);
  });

  it('should set the external IP to <pending> when type is load balancer and the external IP is undefined', () => {
    const items = buildServiceItems({
      externalIP: undefined,
      type: 'LoadBalancer'
    });

    const service = transformServiceData(items)[0];

    expect(service['external-ip'].text).toEqual('<pending>');
  });

  it('should set the external IP to <none> when type is not load balancer', () => {
    const items = buildServiceItems({
      externalIP: undefined,
      type: 'ClusterIP'
    });

    const service = transformServiceData(items)[0];

    expect(service['external-ip'].text).toEqual('<none>');
  });

  it('should set port descriptions correctly', () => {
    const items = buildServiceItems({
      ports: [
        {
          nodePort: 3000,
          port: 80,
          protocol: 'TCP'
        },
        {
          port: 80,
          protocol: 'HTTP'
        }
      ]
    });

    const service = transformServiceData(items)[0];

    expect(service['port(s)'].text).toEqual('80:3000/TCP,80/HTTP');
  });

  it('should set the time ago correctly', () => {
    const items = buildServiceItems({
      creationTimestamp: Date.now() - 60 * 60 * 24
    });

    const servie = transformServiceData(items)[0];

    expect(servie.age.text).toEqual('1m');
  });
});

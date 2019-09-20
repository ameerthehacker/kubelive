'use strict';
const { transformNodeData } = require('../../transformers/node');

const buildNodeItems = (options) => {
  const item = {
    metadata: {
      name: options.name || 'some-node-name',
      deletionTimestamp: options.deletionTimestamp,
      labels: options.labels || [],
      creationTimestamp: options.creationTimestamp || Date.now()
    },
    status: {
      conditions: options.conditions || [
        {
          type: 'ready'
        }
      ],
      nodeInfo: {
        kubeletVersion: options.kubeletVersion || '0.0.0'
      }
    }
  };

  return [item];
};

describe('transformNodeData()', () => {
  it('should set the node name correctly', () => {
    const nodeName = 'some-node-name';
    const items = buildNodeItems({
      name: nodeName
    });

    const node = transformNodeData(items)[0];

    expect(node.name.text).toEqual(nodeName);
  });

  it('should set the node name as selector', () => {
    const nodeName = 'some-node-name';
    const items = buildNodeItems({
      name: nodeName
    });

    const node = transformNodeData(items)[0];

    expect(node.name.isSelector).toBeTruthy();
  });

  it('should set the kubelet version correctly', () => {
    const kubeletVersion = '1.4.1';
    const items = buildNodeItems({
      kubeletVersion
    });

    const node = transformNodeData(items)[0];

    expect(node.version.text).toEqual(kubeletVersion);
  });

  it('should set the status correctly', () => {
    const type = 'ready';
    const conditions = [
      {
        type
      }
    ];
    const items = buildNodeItems({
      conditions
    });

    const node = transformNodeData(items)[0];

    expect(node.status.text).toEqual(type.toUpperCase());
  });

  it('should set the time ago correctly', () => {
    const items = buildNodeItems({
      creationTimestamp: Date.now() - 60 * 60 * 24
    });

    const node = transformNodeData(items)[0];

    expect(node.age.text).toEqual('1m');
  });

  it('should set the roles correctly', () => {
    const rolePrefix = 'node-role.kubernetes.io/';
    const role1 = 'some-role1';
    const role2 = 'some-role2';

    const items = buildNodeItems({
      labels: {
        [`${rolePrefix}${role1}`]: '',
        [`${rolePrefix}${role2}`]: ''
      }
    });
    const roleText = [role1, role2].join(',');

    const node = transformNodeData(items)[0];

    expect(node.role.text).toEqual(roleText);
  });

  it('should set <none> as role when there is no role labels', () => {
    const items = buildNodeItems({
      labels: {}
    });

    const node = transformNodeData(items)[0];

    expect(node.role.text).toEqual('<none>');
  });
});

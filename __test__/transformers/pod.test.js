'use strict';
const { colorCodeStatus, transformPodData } = require('../../transformers/pod');

const buildPodItems = (options) => {
  const item = {
    metadata: {
      name: options.name || 'some-pod-name',
      deletionTimestamp: options.deletionTimestamp
    },
    status: {
      phase: options.phase || 'Running',
      containerStatuses: options.containerStatuses,
      startTime: options.startTime || Date.now(),
      reason: options.reason
    },
    spec: {
      containers: options.containers || [{}]
    }
  };

  return [item];
};

const badStatusColorCode = { bgColor: 'red', color: 'white' };
const goodStatusColorCode = { bgColor: 'green', color: 'white' };
const inTransitColorCode = { bgColor: 'yellow', color: 'white' };

describe('colorCodeStatus()', () => {
  it('should return { bgColor: red, color: white } when status is Terminating', () => {
    expect(colorCodeStatus('Terminating')).toEqual(badStatusColorCode);
  });

  it('should return { bgColor: red, color: white } when status is Failed', () => {
    expect(colorCodeStatus('Failed')).toEqual(badStatusColorCode);
  });

  it('should return { bgColor: yellow, color: white } when status is Failed', () => {
    expect(colorCodeStatus('Pending')).toEqual(inTransitColorCode);
  });

  it('should return { bgColor: green, color: white } when status is Succeeded', () => {
    expect(colorCodeStatus('Succeeded')).toEqual(goodStatusColorCode);
  });

  it('should return { bgColor: green, color: white } when status is Running', () => {
    expect(colorCodeStatus('Running')).toEqual(goodStatusColorCode);
  });

  it('should return {} when status is not in the known list', () => {
    expect(colorCodeStatus('something-else')).toEqual({});
  });
});

describe('transformPodData()', () => {
  it('it should set the pod name correctly with isSelector: true', () => {
    const items = buildPodItems({
      name: 'some-random-pod-name'
    });
    const pod = transformPodData(items)[0];

    expect(pod.name).toEqual({
      text: items[0].metadata.name,
      isSelector: true
    });
  });

  it('it should set the ready containers count correctly', () => {
    // 2 containers ready out of 3
    const containerStatuses = [true, true, false];
    const containers = [{}, {}, {}];
    const readyContainers = containerStatuses.reduce((total, e) => {
      if (e) {
        total += 1;
      }

      return total;
    }, 0);
    const items = buildPodItems({
      containerStatuses: [
        {
          ready: containerStatuses[0]
        },
        {
          ready: containerStatuses[1]
        },
        {
          ready: containerStatuses[2]
        }
      ],
      containers
    });
    const pod = transformPodData(items)[0];

    expect(pod.ready.text).toEqual(`${readyContainers}/${containers.length}`);
  });

  it('it should set the item status to Terminating if deletionTimeStamp is present', () => {
    // 2 containers ready out of 3
    const items = buildPodItems({
      deletionTimestamp: Date.now()
    });
    const pod = transformPodData(items)[0];

    expect(pod.status.text).toEqual('Terminating');
  });

  it('it should set restartCount correctly', () => {
    const restartCounts = [2, 1, 4];
    const totalRestarts = restartCounts.reduce((total, e) => {
      return total + e;
    }, 0);
    const items = buildPodItems({
      containerStatuses: [
        {
          ready: true,
          restartCount: restartCounts[0]
        },
        {
          ready: true,
          restartCount: restartCounts[1]
        },
        {
          ready: true,
          restartCount: restartCounts[2]
        }
      ]
    });
    const pod = transformPodData(items)[0];

    expect(pod.restarts.text).toEqual(totalRestarts);
  });

  it('should not break ready count when container statuses is undefined', () => {
    const containers = [{}, {}];
    const items = buildPodItems({
      containers
    });
    const pod = transformPodData(items)[0];

    expect(pod.ready.text).toEqual(`0/${containers.length}`);
  });

  it('should not break restart count when container statuses is undefined', () => {
    const items = buildPodItems({});
    const pod = transformPodData(items)[0];

    expect(pod.restarts.text).toEqual(0);
  });

  it('should set reason as status when the pod has failed', () => {
    const reason = 'OutOfmemory';
    const items = buildPodItems({
      reason,
      phase: 'Failed'
    });
    const pod = transformPodData(items)[0];

    expect(pod.status.text).toEqual(reason);
  });

  it('should not set reason as status when the pod has not failed', () => {
    const reason = 'OutOfmemory';
    const items = buildPodItems({
      reason
    });
    const pod = transformPodData(items)[0];

    expect(pod.status.text).toEqual(items[0].status.phase);
  });

  it('should set the bgColor code for the status', () => {
    const items = buildPodItems({
      phase: 'Failed'
    });
    const pod = transformPodData(items)[0];

    expect(pod.status.bgColor).toEqual(badStatusColorCode.bgColor);
  });

  it('should set the color code for the status', () => {
    const items = buildPodItems({
      phase: 'Running'
    });
    const pod = transformPodData(items)[0];

    expect(pod.status.color).toEqual(goodStatusColorCode.color);
  });

  it('should set the time ago correctly', () => {
    const items = buildPodItems({
      startTime: Date.now() - 60 * 60 * 24
    });
    const pod = transformPodData(items)[0];

    expect(pod.age.text).toEqual('1m');
  });
});

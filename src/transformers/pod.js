'use strict';
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

/**
 * It provides how to colorize the status text based on the status string
 * @param {string} status pod phase status string obtained from the kube api
 * @returns object containing information on what should be the font color and background color
 */
const colorCodeStatus = (status) => {
  switch (status) {
    case 'Terminating':
      return { bgColor: 'red', color: 'white' };
    case 'Failed':
      return { bgColor: 'red', color: 'white' };
    case 'Pending':
      return { bgColor: 'yellow', color: 'white' };
    case 'Succeeded':
      return { bgColor: 'green', color: 'white' };
    case 'Running':
      return { bgColor: 'green', color: 'white' };
    default:
      return {};
  }
};

/**
 * It transforms the items object from kube api into a custom format
 * @param {Array<V1Pod>} items list of V1Pod object from the kube pod api
 * @returns List of custom formatted pod data
 */
const transformPodData = (items) => {
  const pods = [];

  for (let i = 0; i < items.length; i++) {
    let podPhaseOrReason;
    const item = items[i];
    const itemStatus = item.status;

    // workaround for missing terminating phase in kube api
    if (item.metadata.deletionTimestamp) {
      itemStatus.phase = 'Terminating';
    }

    podPhaseOrReason = itemStatus.phase;

    // update only if there are any reasons to present
    if (itemStatus.phase == 'Failed' && itemStatus.reason) {
      podPhaseOrReason = itemStatus.reason;
    }

    let readyContainers = 0;
    let restartCount = 0;

    if (itemStatus.containerStatuses) {
      itemStatus.containerStatuses.forEach((containerStatus) => {
        if (containerStatus.ready) {
          readyContainers++;
        }
        restartCount += containerStatus.restartCount;
      });
    }

    pods.push({
      name: { text: item.metadata.name, isSelector: true },
      ready: { text: `${readyContainers}/${item.spec.containers.length}` },
      status: {
        text: podPhaseOrReason,
        ...colorCodeStatus(itemStatus.phase),
        padText: true,
        extraPadding: 1
      },
      restarts: { text: restartCount },
      age: {
        text: timeAgo.format(item.status.startTime, { flavour: 'tiny' })
      }
    });
  }

  return pods;
};

module.exports = {
  colorCodeStatus,
  transformPodData
};

const k8sApi = require('../kube-api');
const React = require('react');
const importJsx = require('import-jsx');
const PodsComponent = importJsx('../components/pods');
const { Component } = require('react');
const propTypes = require('prop-types');
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

class Pods extends Component {
  constructor(props) {
    super(props);
    this.state = { pods: [] };
    this.timer;
    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');
  }

  componentWillUpdate(nextProps) {
    if(this.props.namespace != nextProps.namespace) {
      this.listenForChanges(nextProps.namespace);
    }
  }

  componentWillUnmount() {
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  listenForChanges(namespace) {
    if(this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      k8sApi.listNamespacedPod(namespace).then(response => {
        this.setState({ pods: this.transformPodData(response.body.items) });
      });
    }, 500);
  }

  colorCodeStatus(status) {
    switch(status) {
      case "Terminating":
        return { bgColor: "red", color: "white" }
      case "OutOfmemory":
        return { bgColor: "red", color: "white" }
      case "Failed":
        return { bgColor: "red", color: "white" }
      case "Pending":
        return { bgColor: "yellow", color: "white" }
      case "Succeeded":
        return { bgColor: "green", color: "white" }
      case "Running":
        return { bgColor: "green", color: "white" }
      default:
        return status;     
    }
  }

  transformPodData(items) {
    let pods = [];

    for(let i = 0; i < items.length; i++) {
      let podStatus;
      const item = items[i];

      const itemStatus = item.status;

      podStatus = itemStatus.phase;

      if(itemStatus.reason) {
        podStatus = itemStatus.reason;
      }

      if(item.metadata.deletionTimestamp) {
        podStatus = 'Terminating'
      }

      let readyContainers = 0;
      let restartCount = 0;

      if(itemStatus.containerStatuses) {
        itemStatus.containerStatuses.forEach(containerStatus => {
          if(containerStatus.ready) {
            readyContainers++;
          }
          restartCount += containerStatus.restartCount;
        });
      }

      pods.push({
        name: { text: item.metadata.name },
        ready: { text: `${readyContainers}/${item.spec.containers.length}` },
        status: { text: podStatus, ...this.colorCodeStatus(podStatus) },
        restarts: { text: restartCount },
        age: {
          text: this.timeAgo.format(item.status.startTime, { flavour: 'tiny' })
        }
      });
    }
    
    return pods;
  }

  render() {
    return <PodsComponent pods={this.state.pods} />;
  }
}

Pods.propTypes = {
  namespace: propTypes.string
};

module.exports = Pods;
<h1 align="center">Kubelive</h1>

<p align="center">
  <a href="https://circleci.com/gh/ameerthehacker/kubelive/tree/master">
    <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/ameerthehacker/kubelive?style=flat-square" />
  </a>
  <a href="https://codecov.io/gh/ameerthehacker/kubelive">
    <img alt="codecov" src="https://img.shields.io/codecov/c/github/ameerthehacker/kubelive?style=flat-square" />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" />
  </a>
  <a href="https://jestjs.io/">
    <img alt="jest" src="https://img.shields.io/badge/tested%20with-jest-blue?style=flat-square" />
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square" />
  </a>
</p>

<p align="center">
  <strong>kubectl</strong> tool reinvented to be more reactive and interactive
</p>
<p align="center">
  <img alt="Demo" src="https://github.com/ameerthehacker/project-assets/blob/master/kubelive/screenshots/kubelive-gif-hq.gif?raw=true" />
</p>

## Motivation

I felt that the output from **kubectl get pod -w** is very cluttered and it is a pain in my ass to understand which pod is running, which pod is exactly terminating so I built **kubelive** which updates the status of the pods in realtime without cluttering the terminal

## Requirements

- node v10 or higher

## Installation

```sh
npm install -g kubelive
```

## Available commands

- List the pods in the cluster

```sh
kubelive get pods
```

- List the services in the cluster

```sh
kubelive get services
```

- List the replication controllers in the cluster

```sh
kubelive get replicationcontrollers
```

- List the nodes in the cluster

```sh
kubelive get nodes
```

- List resources from a different context

```sh
kubelive get <resource> --context <name>
```

- List the pods in the cluster in a jiffy

```sh
kubelive
```

- Get help on all available commands

```sh
kubelive help
```

- Get the current kubelive version

```sh
kubelive --version
```

## Actions

- You can use the :arrow_left: and :arrow_right: keys to switch between available namespaces

- You can use the :arrow_up: and :arrow_down: keys to select a pod

- You can press the **D** key to delete the selected pod

- You can press the **C** key to copy the name of the selected pod

- You can press the **Q** key to quit the app

## What others say

<img width="500px" src="https://raw.githubusercontent.com/ameerthehacker/project-assets/master/kubelive/screenshots/twitter-2.png" alt="twitter-2" />
<img width="500px" src="https://raw.githubusercontent.com/ameerthehacker/project-assets/master/kubelive/screenshots/twitter-1.png" alt="twitter-1" />

## Roadmap

- [x] Add support for pods
- [x] Add support por nodes, services, replication controllers
- [ ] Add support for ingress, deployments, replica sets
- [ ] Show live logs from pods
- [ ] Shell into a running pod
- [ ] Add support for filter by name flag
- [ ] Add support for refresh rate flag

Show your support by :star: the repo

## License

MIT © [Ameer Jhan](mailto:ameerjhanprof@gmail.com)

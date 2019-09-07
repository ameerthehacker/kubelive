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
  <a href="https://codeclimate.com/github/ameerthehacker/kubelive/maintainability">
    <img alt="code-climate-maintainability" src="https://img.shields.io/codeclimate/maintainability-percentage/ameerthehacker/kubelive?style=flat-square" />
  </a>
  <a href="https://codeclimate.com/github/ameerthehacker/kubelive/maintainability">
    <img alt="code-climate-issues" src="https://img.shields.io/codeclimate/issues/ameerthehacker/kubelive?style=flat-square" />
  </a>
</p>

<p align="center">
  Kubernetes command line tool to provide live data about the cluster and it's resources
</p>
<p align="center">
  <img alt="Demo" src="https://github.com/ameerthehacker/project-assets/blob/master/kubelive/screenshots/kubelive-demo-static-hq.png?raw=true" />
</p>

## Motivation

I felt that the output from **kubectl get pod -w** is very cluttered and it is a pain in my ass to understand which pod is running, which pod is exactly terminating so I built **kubelive** which updates the status of the pods in realtime without cluttering the terminal

## Installation

Make sure you have node installed and then run the command

```sh
npm install -g kubelive
```

## Available commands

Show list of pods in the clutser

```sh
kubelive get pods
```

As a shortcut you can also use

```sh
kubelive
```

## Actions

- You can use the :arrow_left: and :arrow_right: keys to switch between available namespaces

- You can use the :arrow_up: and :arrow_down: keys to select a pod

- You can press the **D** key to delete the selected pod

- You can press the **C** key to copy the name of the selected pod

Show your support by :star: the repo

## License

MIT © [Ameer Jhan](mailto:ameerjhanprof@gmail.com)

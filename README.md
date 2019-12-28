# controller theory playground

[![Conventional Commits][conventional-commits-image]][conventional-commits-url]
[![CircleCI][circleci-image]][circleci-url]
[![Coverage Status][coverage-image]][coverage-url]

> repository for experimenting with various aspects of contoller theory

## overview

source material from [Feedback Control for Computer Systems](https://www.amazon.com/Feedback-Control-Computer-Systems-Introducing/dp/1449361692)

## install

- `git clone git@github.com:csaxton171/controller-theory-playground.git`
- `nvm use`
- `yarn install`
- `yarn link`( enable `ctlr`)

## run

```bash
# for available commands
ctlr --help

# for available 'run' config options
ctlr run --help

# minimal run with defaults
ctlr run --set-point 5

# run with P & I controllers
ctlr run --set-point 10 --controllers PI

```

[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-url]: https://conventionalcommits.org/
[circleci-image]: https://circleci.com/gh/csaxton171/controller-theory-playground.svg?style=svg&circle-token=55f8d89625eab38101706cc6d65203715e082333
[circleci-url]: https://circleci.com/gh/csaxton171/controller-theory-playground
[coverage-image]: https://coveralls.io/repos/github/csaxton171/controller-theory-playground/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/csaxton171/controller-theory-playground?branch=master

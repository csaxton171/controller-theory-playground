# controller theory playground

[![Conventional Commits][conventional-commits-image]][conventional-commits-url]
[![CircleCI][circleci-image]][circleci-url]
[![Coverage Status][coverage-image]][coverage-url]

> repository for experimenting with various aspects of contoller theory

## overview

source material from [Feedback Control for Computer Systems](https://www.amazon.com/Feedback-Control-Computer-Systems-Introducing/dp/1449361692)

the solution product is a CLI that allows users to experiment with various configurations and controller composition.

at present the CLI supports a single command `run`

## solution terms

- **Plant** represents a collection of workers that will perform a single unit of work per iteration. A plant may be configured with a variable number of workers. when a worker completes all it's units of work - it is removed from the internal pool of workers within the Plant.

- **Worker** represents a entity able to perform units of work - via `cycle` method. each `cycle` decrements the workers units of work it has been allocated. when the worker has no more units of work to perform it is considered in a **completed** state

in controller theory terms, the Plant output signal is the number of workers - the controllers are responsible for maintaining an ideal number of workers (set point)

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

# CANS

This README documents the steps necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
# First Time Setup

Install Ruby 2.5.1 (Check the version specified in the .ruby-version file, in case this readme is stale).

Example instructions for `rbenv` installed through Homebrew on Mac:

```
brew update
brew upgrade rbenv
brew upgrade ruby-build
rbenv install 2.5.1
```

Install language-specific package dependencies

```
bundle install # Ruby gems
yarn install # Node modules
```

# Running the App

There are two primary ways of running the CANS app:

1. Running the CANS app and all dependencies locally using Docker, or...
2. Running only the CANS app and using an existing environment such as Preint as an API backend.

## Running with Preint

In order to run against Preint, create a `.env` file pointing to the CANS API and Perry in Preint:

```
AUTHENTICATION_ENABLED=true
CANS_API_BASE_URL=https://cansapi.preint.cwds.io
PERRY_BASE_URL=https://web.preint.cwds.io/perry
```

Then run Rails (`rails s`), Redis (`redis-server`), and the React server (`yarn start` or `./bin/webpack-dev-server`).

## Running everything locally with Docker

You will need a full .env file for this.
An example can be found in the [CWDS env-store repo](https://github.com/ca-cwds/env-store/blob/master/envs/cans/.env),
or ask another developer.

Once you have your .env file, run Redis and CANS API through Docker. This will also run API dependencies such as Perry.

```docker-compose up redis cans-api```

Then run Rails (`rails s`) and the React server (`yarn start` or `./bin/webpack-dev-server`).

## Linting and Tests

To run the React test suite with watcher:

```yarn test```

and a one-time run with coverage

```yarn test:coverage```

Other commands:

```
yarn test:rspec # runs Rspec unit tests
yarn test:acceptance # runs acceptance tests, requires app to be running
yarn test:a11y # runs accessibility tests, requires app to be running
yarn lint
```

# Questions

If you have any questions regarding the contents of this repository, please email the Office of Systems Integration at FOSS@osi.ca.gov.

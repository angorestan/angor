# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.0.1] - 2022-06-18

### Added

-   Refactor to multi packages

## [delta] - 2022-06-17

### Added

-   Winston for save logs and errors
-   Morgan for http logger
-   More tests

### Fixed

-   Moved setup from `src/index.ts` to `src/setup.ts`

## [gamma] - 2022-06-14

### Added

-   Upload management (Save in redis, delete from redis, prune unused files, etc.)

## [beta] - 2022-06-14

### Added

-   Traefik cert resolver to use secure protocol
-   Redirect http to https
-   Auth api and auth middleware for apis

### Fixed

-   Use extract project zip source function
-   Extract with correct paths in test helper/project

## [alpha] - 2022-06-11

### Added

-   Super not stable Angor

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.7.4 - 2025-06-11

### Added

- The check result badges displayed on `EntityScorecardsPage` and `EntityScorecardsCard` are now clickable buttons that open a "check result" drawer, similar to the in-app experience. This makes it possible to see a check result's related property and markdown-supported message.

## 0.7.3 - 2025-06-09

### Changed

- Converted the following components from `createRoutableExtension` to `createComponentExtension`. This makes them work with the wrapper based strategy described in `README.md`.
  - `EntityScorecardsPage`
  - `EntityTasksPage`

## 0.7.2 - 2025-06-04

### Changed

- Updated `README.md` to add a section about how to get entity identifiers based on the Backstage Software Catalog.

## 0.7.1 - 2025-06-04

### Changed

- Marked the following old components as deprecated. They have been causing confusion and we plan to rework them with a new architecture in the near future.
  - `EntityChangeFailureRateCard`
  - `EntityDeploymentFrequencyCard`
  - `EntityDORAMetricsContent`
  - `EntityDXDashboardContent`
  - `EntityLeadTimeCard`
  - `EntityOpenToDeployCard`
  - `EntityTimeToRecoveryCard`
  - `EntityTopContributorsTable`
- Updated `README.md` to only reference the new Service Cloud-based components and their setup instructions.

## 0.7.0 - 2025-05-28

Initial entry in `CHANGELOG.md`.

### Added

- New Service Cloud components:
  - `<EntityScorecardsPage />`
  - `<EntityTasksPage />`
  - `<EntityScorecardsCard />`
  - `<EntityTasksCard />`
  - Additional proxy configuration is needed when using these new components - see README.md for details

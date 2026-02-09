# Ecosystem Explorer Documentation

This directory contains documentation for the OpenTelemetry Ecosystem Explorer project. It includes guides, references,
and resources to help users understand and contribute to the project.

Also reference the [project wiki](https://github.com/open-telemetry/opentelemetry-ecosystem-explorer/wiki) for
additional information.

## Architecture Overview

- **[System Architecture](./architecture-overview.md)**: High-level overview of the three-component
  system and how they work together
- **[Watchers and Synchronizers](./watchers-synchronizers.md)**: Understanding the automation
  pipeline that keeps metadata up-to-date
- **[Registry Structure](./registry-structure.md)**: How metadata is organized and versioned in
  the ecosystem-registry
- **[Content-Addressed Storage](./content-addressed-storage.md)**: The storage pattern that
  enables efficient multi-version support
- **[Frontend Architecture](./frontend-architecture.md)**: Web application design, data access,
  and caching strategy

### Additional Resources

- [Project Wiki](https://github.com/open-telemetry/opentelemetry-ecosystem-explorer/wiki)
- [Project Proposal](https://github.com/open-telemetry/community/blob/main/projects/ecosystem-explorer.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

## Project Guiding Principles

- Leverage automation as much as possible
- Reduce burden/overhead on maintainers as much as possible
- Keep maintenance burden and operational overhead of the web application low
  - Avoid backend servers/databases and use static hosting/CDN where possible
- Prioritize responsiveness, accessibility and localization from the start

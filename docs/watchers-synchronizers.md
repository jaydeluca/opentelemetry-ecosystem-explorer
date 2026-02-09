# Watchers and Synchronizers

The automation pipeline that keeps the Ecosystem Explorer up-to-date with upstream
OpenTelemetry projects.

## Overview

Watchers and synchronizers are automation components in the `ecosystem-automation` directory
that handle the pipeline between source projects and the ecosystem registry. They run as
scheduled GitHub Actions or event-triggered workflows.

## Watchers

Watchers monitor upstream OpenTelemetry projects and extract metadata when changes occur.

### Core Responsibilities

Every watcher must fulfill five critical functions:

#### 1. Version Management

**Detect New Releases**: Monitor upstream projects for new version tags

- Check GitHub releases and tags via API
- Detect semantic version patterns (e.g., `v2.24.0`)
- Trigger extraction pipeline for new versions

**Generate Versioned Inventory**: Create historical record for each release

- Retrieve data from specific Git tags
- Extract metadata as it existed at that release
- Store with version identifier

**Maintain Snapshot Versions**: Track development branch for day-to-day monitoring (optional)

- Extract from `main` or default branch
- Mark as SNAPSHOT version (e.g., `v2.25.1-SNAPSHOT`)
- Update nightly or on-demand
- Represents "next version" or work-in-progress

#### 2. Schema Evolution

**Support Source Schema Changes**: Handle metadata format changes in upstream projects

- Detect when source projects update metadata structure
- Implement parsers for multiple schema versions
- Map old formats to current registry schema

**Support Registry Schema Changes**: Adapt to registry schema updates

- Transform source data to match latest registry schema
- Maintain backward compatibility when possible
- Document schema migrations

**Virtual Versioning**: When source lacks schema versions, implement internal tracking

- Detect structural changes in source metadata
- Infer schema version based on field presence/structure
- Map to appropriate registry schema version

#### 3. Change Detection

**Surface Schema Changes**: Alert maintainers to metadata structure changes

- Compare current extraction with previous version
- Identify new fields, removed fields, type changes
- Create GitHub issues automatically for review

**Data Quality Monitoring**: Detect incomplete or invalid metadata

- Validate required fields are present
- Check data types and formats
- Flag anomalies for human review

#### 4. Data Regeneration

**Backfill Historical Versions**: Populate registry with past releases

- Iterate through historical Git tags
- Extract metadata from each tag
- Generate versioned inventory for all releases

**Regenerate on Demand**: Rebuild registry data when needed

- Schema migrations may require regeneration
- Bug fixes in transformation logic
- Manual trigger via workflow dispatch

#### 5. Deterministic Output

**Consistent Ordering**: Ensure stable output to prevent spurious updates

- Sort arrays alphabetically or by defined order
- Use stable JSON serialization
- Avoid timestamp-based ordering where possible

**Reproducible Transformations**: Same input always produces same output

- Avoid random elements
- Use deterministic hashing
- No floating timestamps in content

### opentelemetry.io Documentation Sync

**Purpose**: Keep opentelemetry.io documentation in sync with registry data

**Process**:

1. Read latest registry data
2. Generate instrumentation pages using marker-based content replacement
3. Create pull request to opentelemetry.io repository

**Use Cases**:

- Generate instrumentation reference pages
- Update configuration option
- Maintain component listings

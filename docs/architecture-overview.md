# System Architecture Overview

The OpenTelemetry Ecosystem Explorer is built as a three-component system comprising the
`ecosystem-automation`, `ecosystem-registry`, and `ecosystem-explorer` components. Each component has a distinct role in
collecting, storing, and presenting metadata about OpenTelemetry ecosystem components.

## Component Responsibilities

### ecosystem-automation

**Purpose**: Automated data collection and transformation pipeline

**Key Functions**:

- Watch upstream projects for new releases and changes
- Extract metadata from source repositories
- Transform and normalize data to registry schema
- Generate content-addressed storage files
- Synchronize with opentelemetry.io documentation

**Technology**: Python (for GitHub API integration and data processing)

**Execution**: Scheduled GitHub Actions workflows

### ecosystem-registry

**Purpose**: Versioned, normalized metadata storage

**Key Functions**:

- Store historical metadata for all versions
- Enable content-addressed deduplication
- Provide stable, immutable data files
- Support multiple OpenTelemetry ecosystems (Java Agent, Collector, etc.)

**Technology**: File-based storage with content addressing

**Hosting**: Static files served via CDN

### ecosystem-explorer

**Purpose**: User-facing web application for browsing and exploring metadata

**Key Functions**:

- Browse instrumentations and collector components
- Search and filter by various criteria
- View detailed telemetry information
- Compare versions and see what changed
- Offline-capable with persistent caching

**Technology**: React + TypeScript + Vite

**Hosting**: Static site deployment

## Data Flow

1. **Upstream Changes**: New release tagged in opentelemetry-java-instrumentation or
   collector-contrib
2. **Detection**: Watcher detects new version via GitHub API or scheduled check
3. **Extraction**: Watcher checks out specific tag and extracts metadata files
4. **Transformation**: Data normalized to registry schema and content-addressed files generated
5. **Storage**: Transformed data written to ecosystem-registry with version manifest
6. **Distribution**: Static files deployed to CDN
7. **Access**: Web application fetches data on-demand with aggressive caching
8. **Persistence**: Browser caches data in IndexedDB for offline access

## Key Design Decisions

### Static Site Approach

**Why**: Eliminates operational overhead of running servers and databases

**Benefits**:

- Low maintenance burden
- High reliability (no servers to fail)
- Excellent performance via CDN
- Low cost (static hosting is cheap/free)

**Tradeoffs**:

- Updates require rebuild/redeploy
- No server-side processing or APIs
- All computation happens client-side

### Content-Addressed Storage

**Why**: Efficiently handle multi-version data with minimal duplication

**Benefits**:

- Automatic deduplication
- Immutable files enable aggressive caching
- Easy to identify what changed between versions
- Supports version comparison naturally

**How**: See [Content-Addressed Storage](./content-addressed-storage.md) for details

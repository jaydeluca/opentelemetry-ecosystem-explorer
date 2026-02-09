# Registry Structure

How raw metadata is organized and versioned in the ecosystem-registry.

## Overview

The ecosystem-registry is the source of truth for OpenTelemetry component metadata. It stores
raw, normalized metadata in aggregated YAML files, maintaining a complete historical record
across versions. This raw data is later transformed into the content-addressed JSON format
used by the web application.

## Directory Structure

```text
ecosystem-registry/
├── java/
│   └── javaagent/
│       ├── v2.24.0/
│       │   └── instrumentation.yaml      # All instrumentations for this version
│       └── v2.24.1-SNAPSHOT/
│           └── instrumentation.yaml
└── collector/
    ├── core/
    │   ├── v0.145.0/
    │   │   ├── receiver.yaml            # All core receivers
    │   │   ├── processor.yaml           # All core processors
    │   │   ├── exporter.yaml            # All core exporters
    │   │   ├── connector.yaml           # All core connectors
    │   │   └── extension.yaml           # All core extensions
    │   └── v0.145.1-SNAPSHOT/
    │       └── ...
    └── contrib/
        ├── v0.145.0/
        │   ├── receiver.yaml            # All contrib receivers
        │   ├── processor.yaml
        │   ├── exporter.yaml
        │   ├── connector.yaml
        │   └── extension.yaml
        └── v0.145.1-SNAPSHOT/
            └── ...
```

## Key Principles

### Aggregated YAML Files

The registry stores metadata in **aggregated YAML files**:

- One file contains all components of a type for a version
- Human-readable and git-friendly
- Easy to review in pull requests

### Version-Scoped Organization

Each version gets its own directory:

- Complete snapshot of metadata at that version
- Self-contained (everything needed for that version)
- Independent (changes don't affect other versions)
- Reproducible (can regenerate from upstream sources)

## Java Agent Structure

### Version Directory Layout

```text
java/
└── javaagent/
    └── {version}/
        └── instrumentation.yaml
```

**One aggregated file** per version containing all instrumentations.

### File Format

**Example**: `java/javaagent/v2.24.0/instrumentation.yaml`

```yaml
file_format: 0.1
libraries:
  - name: activej-http-6.0
    display_name: ActiveJ
    description: This instrumentation enables HTTP server spans and metrics...
    semantic_conventions:
      - HTTP_SERVER_SPANS
      - HTTP_SERVER_METRICS
    library_link: https://activej.io/
    source_path: instrumentation/activej-http-6.0
    minimum_java_version: 17
    scope:
      name: io.opentelemetry.activej-http-6.0
      schema_url: https://opentelemetry.io/schemas/1.37.0
    target_versions:
      javaagent:
        - "io.activej:activej-http:[6.0,)"
    configurations:
      - name: otel.instrumentation.http.known-methods
        description: Configures the instrumentation to recognize...
        type: list
        default: CONNECT,DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT,TRACE
    telemetry:
      - when: default
        metrics:
          - name: http.server.request.duration
            description: Duration of HTTP server requests
            type: HISTOGRAM
            unit: s
            attributes:
              - name: http.request.method
                type: STRING
              - name: http.response.status_code
                type: LONG
        spans:
          - span_kind: SERVER
            attributes:
              - name: http.request.method
                type: STRING
              - name: http.response.status_code
                type: LONG

  - name: aws-sdk-2.2
    display_name: AWS SDK 2.2
    # ... (next instrumentation)

  # ... (continues for all ~232 instrumentations)
```

**Key Features**:

- `libraries`: Array of all instrumentations
- Complete metadata for each instrumentation in a single file

## Collector Structure

### Distribution Directory Layout

```text
collector/
├── core/
│   └── {version}/
│       ├── receiver.yaml
│       ├── processor.yaml
│       ├── exporter.yaml
│       ├── connector.yaml
│       └── extension.yaml
└── contrib/
    └── {version}/
        ├── receiver.yaml
        ├── processor.yaml
        ├── exporter.yaml
        ├── connector.yaml
        └── extension.yaml
```

**One file per component type** per distribution per version.

### Component File Format

**Example**: `collector/contrib/v0.145.0/receiver.yaml`

```yaml
distribution: contrib
version: 0.145.0
repository: opentelemetry-collector-contrib
component_type: receiver
components:
  - name: activedirectorydsreceiver
    metadata:
      type: active_directory_ds
      status:
        class: receiver
        stability:
          beta:
            - metrics
        distributions:
          - contrib
        codeowners:
          active:
            - pjanotti
          seeking_new: true
        unsupported_platforms:
          - darwin
          - linux
      attributes:
        bind_type:
          description: The type of bind to the domain server
          type: string
          enum:
            - client
            - server
      # ... (more attributes)
      metrics:
        # ... (metric definitions)

  - name: aerospikereceiver
    metadata:
      # ... (next receiver)

  # ... (continues for all receivers in contrib)
```

**Key Features**:

- `distribution`: core or contrib
- `repository`: Source repository name
- `component_type`: receiver, processor, exporter, connector, or extension
- `components`: Array of all components of this type

## Version Types

### Release Versions

**Format**: Semantic version (e.g., `v2.24.0`, `v0.145.0`)

**Characteristics**:

- Immutable after creation
- Represents official release
- Complete metadata snapshot at that point in time
**Directory**: `{ecosystem}/{version}/` (no SNAPSHOT suffix)

### Snapshot Versions

**Format**: Semantic version with `-SNAPSHOT` suffix (e.g., `v2.24.1-SNAPSHOT`)

**Characteristics**:

- Extracted from default branch (`main`)
- Represents work-in-progress
- Shows upcoming changes before next release

**Directory**: `{ecosystem}/{version}-SNAPSHOT/`

**Update Frequency**: Typically nightly via scheduled GitHub Actions

# Explorer Database Builder

Automation tool for converting registry data into a content addressed database.

## Methodology

On a nightly basis, the tool regenerates data based on the latest registry entries.

Process:

The output file structure looks like:

```bash
ecosystem-explorer/
  public/
    data/
      javaagent/
        index.json            # Lightweight index for javaagent (browsing/search)
        versions.json         # List of available javaagent versions
        versions/
          2.24.0.json        # Version manifest: {component-id: content-hash}
          2.23.0.json
          ...
        components/
          akka-http-10.0-737fb17f9652.json
          aws-sdk-1.11-48c8b39bee75.json
          ...
        markdown/
          aws-sdk-1.11-48c8b39bee75.md    # Content-addressed READMEs
          ...

      collector/
        index.json            # Lightweight index for collector
        versions.json         # List of available collector versions
        versions/
          0.95.0.json
          0.94.0.json
          ...
        components/
          otlp-abc123def456.json
          prometheus-789ghi012jkl.json
          ...
        markdown/
          otlp-abc123def456.md
          ...
```

## Usage

From the repository root:

```bash
uv run explorer-db-builder
```

## Development

See the parent [ecosystem-automation README](../README.md) for setup and testing instructions.

### Running Tests

```bash
# From repository root
uv run pytest ecosystem-automation/explorer-db-builder/tests --cov=explorer_db_builder
```

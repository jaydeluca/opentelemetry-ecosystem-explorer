# Frontend Architecture

The React-based web application that provides an interactive interface for exploring
OpenTelemetry component metadata.

## Overview

The ecosystem-explorer is a static web application built with React, TypeScript, and Vite.
It consumes the content-addressed database and provides search, filtering, and comparison
capabilities with offline support through IndexedDB caching.

## Technology Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite (fast development and optimized production builds)
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library
- **Caching**: IndexedDB via `idb` library
- **Deployment**: Static site hosting (GitHub Pages, Cloudflare Pages, etc.)

### IndexedDB Cache

**Purpose**: Persistent storage across browser sessions

**Implementation**: Using `idb` library wrapper around IndexedDB API

**Database Structure**:

```text
├── Store: "metadata"            # Versions and manifests
└── Store: "instrumentations"    # Full instrumentation data
```

**Entry Format**:

```typescript
interface CacheEntry<T> {
  data: T;            // Actual data
  cachedAt: number;   // Timestamp (for future TTL)
}
```

**Characteristics**:

- Persists across sessions (~10-50ms access)
- Enables offline operation
- Gracefully degrades if unavailable

### Request Flow

```text
User requests component "aws-sdk-2.2" for version "2.24.0"
    ↓
Check IndexedDB cache
    ├─ HIT → Store in memory, return
    └─ MISS ↓
Check in-flight requests (deduplication)
    ├─ EXISTS → Wait for existing request
    └─ NEW ↓
Fetch from network
    ↓
Store in IndexedDB
    ↓
Return to caller
```

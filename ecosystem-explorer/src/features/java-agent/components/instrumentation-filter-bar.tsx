export interface FilterState {
  search: string;
  telemetry: Set<"spans" | "metrics">;
  target: Set<"javaagent" | "library">;
  semanticConventions: Set<string>;
}

interface InstrumentationFilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function InstrumentationFilterBar({
  filters,
  onFiltersChange,
}: InstrumentationFilterBarProps) {
  const toggleTelemetry = (type: "spans" | "metrics") => {
    const newTelemetry = new Set(filters.telemetry);
    if (newTelemetry.has(type)) {
      newTelemetry.delete(type);
    } else {
      newTelemetry.add(type);
    }
    onFiltersChange({ ...filters, telemetry: newTelemetry });
  };

  const toggleTarget = (type: "javaagent" | "library") => {
    const newTarget = new Set(filters.target);
    if (newTarget.has(type)) {
      newTarget.delete(type);
    } else {
      newTarget.add(type);
    }
    onFiltersChange({ ...filters, target: newTarget });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search instrumentations..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Telemetry</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleTelemetry("spans")}
              className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all font-medium ${
                filters.telemetry.has("spans")
                  ? "bg-blue-500/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "bg-background border-border hover:border-blue-500/50 hover:bg-blue-500/5"
              }`}
            >
              Spans
            </button>
            <button
              onClick={() => toggleTelemetry("metrics")}
              className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all font-medium ${
                filters.telemetry.has("metrics")
                  ? "bg-green-500/30 border-green-500 text-green-700 dark:text-green-300 shadow-sm"
                  : "bg-background border-border hover:border-green-500/50 hover:bg-green-500/5"
              }`}
            >
              Metrics
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Type</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleTarget("javaagent")}
              className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all font-medium ${
                filters.target.has("javaagent")
                  ? "bg-orange-500/30 border-orange-500 text-orange-700 dark:text-orange-300 shadow-sm"
                  : "bg-background border-border hover:border-orange-500/50 hover:bg-orange-500/5"
              }`}
            >
              Java Agent
            </button>
            <button
              onClick={() => toggleTarget("library")}
              className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all font-medium ${
                filters.target.has("library")
                  ? "bg-purple-500/30 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "bg-background border-border hover:border-purple-500/50 hover:bg-purple-500/5"
              }`}
            >
              Standalone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

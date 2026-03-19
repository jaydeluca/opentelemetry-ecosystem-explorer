/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState } from "react";
import type { InstrumentationData, Metric, Span } from "@/types/javaagent";

interface TelemetrySectionProps {
  instrumentation: InstrumentationData;
}

function MetricsList({ metrics }: { metrics: Metric[] }) {
  if (!metrics || metrics.length === 0) {
    return <p className="text-sm text-muted-foreground">No metrics available</p>;
  }

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="border-l-2 border-green-500/40 pl-4">
          <h5 className="font-semibold text-sm mb-1">{metric.name}</h5>
          <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted/50 border border-border">
              Type: <span className="ml-1 font-mono">{metric.type}</span>
            </span>
            {metric.unit && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted/50 border border-border">
                Unit: <span className="ml-1 font-mono">{metric.unit}</span>
              </span>
            )}
          </div>
          {metric.attributes && metric.attributes.length > 0 && (
            <div className="mt-2">
              <h6 className="text-xs font-medium text-muted-foreground mb-1">Attributes:</h6>
              <ul className="space-y-1">
                {metric.attributes.map((attr, attrIndex) => (
                  <li key={attrIndex} className="text-xs flex items-baseline">
                    <span className="font-mono text-foreground">{attr.name}</span>
                    <span className="mx-1 text-muted-foreground">:</span>
                    <span className="font-mono text-muted-foreground">{attr.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SpansList({ spans }: { spans: Span[] }) {
  if (!spans || spans.length === 0) {
    return <p className="text-sm text-muted-foreground">No spans available</p>;
  }

  return (
    <div className="space-y-4">
      {spans.map((span, index) => (
        <div key={index} className="border-l-2 border-blue-500/40 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <h5 className="font-semibold text-sm">Span</h5>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 border border-blue-500/30 text-blue-600">
              {span.span_kind}
            </span>
          </div>
          {span.attributes && span.attributes.length > 0 && (
            <div className="mt-2">
              <h6 className="text-xs font-medium text-muted-foreground mb-1">Attributes:</h6>
              <ul className="space-y-1">
                {span.attributes.map((attr, attrIndex) => (
                  <li key={attrIndex} className="text-xs flex items-baseline">
                    <span className="font-mono text-foreground">{attr.name}</span>
                    <span className="mx-1 text-muted-foreground">:</span>
                    <span className="font-mono text-muted-foreground">{attr.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TelemetrySection({ instrumentation }: TelemetrySectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!instrumentation.telemetry || instrumentation.telemetry.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <h3 className="text-lg font-semibold mb-3">Telemetry</h3>

      {/* Nested tabs for configuration options */}
      {instrumentation.telemetry.length > 1 && (
        <div className="border-b border-border mb-4">
          <div
            role="tablist"
            aria-label="Telemetry configuration options"
            className="flex gap-4 overflow-x-auto"
          >
            {instrumentation.telemetry.map((telemetry, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`telemetry-panel-${index}`}
                id={`telemetry-tab-${index}`}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === index
                    ? "border-b-2 border-primary bg-primary/5 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {telemetry.when || `Configuration ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Telemetry content */}
      {instrumentation.telemetry.map((telemetry, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`telemetry-panel-${index}`}
          aria-labelledby={`telemetry-tab-${index}`}
          hidden={activeTab !== index}
          className={activeTab === index ? "block" : "hidden"}
        >
          {instrumentation.telemetry?.length === 1 && telemetry.when && (
            <p className="text-sm text-muted-foreground mb-4">
              Configuration: <span className="font-medium">{telemetry.when}</span>
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics */}
            <div>
              <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-500/20 text-green-600 text-xs font-bold">
                  M
                </span>
                Metrics
              </h4>
              <MetricsList metrics={telemetry.metrics || []} />
            </div>

            {/* Spans */}
            <div>
              <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500/20 text-blue-600 text-xs font-bold">
                  S
                </span>
                Spans
              </h4>
              <SpansList spans={telemetry.spans || []} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

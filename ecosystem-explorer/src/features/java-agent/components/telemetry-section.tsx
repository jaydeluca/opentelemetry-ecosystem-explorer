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
import { SectionHeader } from "./section-header";
import { EmptyState } from "./empty-state";
import { ActivityIcon } from "@/components/icons/activity-icon";
import { BarChartIcon } from "@/components/icons/bar-chart-icon";
import { ZapIcon } from "@/components/icons/zap-icon";
import { RulerIcon } from "@/components/icons/ruler-icon";

interface TelemetrySectionProps {
  instrumentation: InstrumentationData;
}

function MetricsList({ metrics }: { metrics: Metric[] }) {
  if (!metrics || metrics.length === 0) {
    return <EmptyState message="No metrics available for this configuration" />;
  }

  return (
    <div className="space-y-3">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-lg border border-green-500/20 bg-card p-4 shadow-sm hover:shadow-md hover:border-green-500/40 transition-all"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h5 className="font-semibold text-sm text-foreground">{metric.name}</h5>
            <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              {metric.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
          {metric.unit && (
            <div className="flex items-center gap-2 mb-3">
              <RulerIcon className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Unit: <code className="font-mono text-foreground">{metric.unit}</code>
              </span>
            </div>
          )}
          {metric.attributes && metric.attributes.length > 0 && (
            <div>
              <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Attributes
              </h6>
              <ul className="space-y-1.5">
                {metric.attributes.map((attr, attrIndex) => (
                  <li key={attrIndex} className="text-xs flex items-baseline gap-2">
                    <span className="font-mono text-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                      {attr.name}
                    </span>
                    <span className="text-muted-foreground">:</span>
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
    return <EmptyState message="No spans available for this configuration" />;
  }

  return (
    <div className="space-y-3">
      {spans.map((span, index) => (
        <div
          key={index}
          className="rounded-lg border border-blue-500/20 bg-card p-4 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded bg-blue-500/10">
              <ZapIcon className="h-4 w-4 text-blue-400" />
            </div>
            <h5 className="font-semibold text-sm text-foreground">Span</h5>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {span.span_kind}
            </span>
          </div>
          {span.attributes && span.attributes.length > 0 && (
            <div>
              <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Attributes
              </h6>
              <ul className="space-y-1.5">
                {span.attributes.map((attr, attrIndex) => (
                  <li key={attrIndex} className="text-xs flex items-baseline gap-2">
                    <span className="font-mono text-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                      {attr.name}
                    </span>
                    <span className="text-muted-foreground">:</span>
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
    <section className="space-y-4">
      <SectionHeader icon={<ActivityIcon className="h-5 w-5" />} title="Telemetry" />

      {/* Configuration tabs */}
      {instrumentation.telemetry.length > 1 && (
        <div className="bg-surface/50 rounded-lg border border-border p-1">
          <div
            role="tablist"
            aria-label="Telemetry configuration options"
            className="flex gap-1 overflow-x-auto"
          >
            {instrumentation.telemetry.map((telemetry, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`telemetry-panel-${index}`}
                id={`telemetry-tab-${index}`}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-all ${
                  activeTab === index
                    ? "shadow-md bg-background text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                }`}
              >
                {telemetry.when || `Configuration ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Telemetry content */}
      {instrumentation.telemetry.map((telemetry, index) => {
        const metricsCount = telemetry.metrics?.length || 0;
        const spansCount = telemetry.spans?.length || 0;

        return (
          <div
            key={index}
            role="tabpanel"
            id={`telemetry-panel-${index}`}
            aria-labelledby={`telemetry-tab-${index}`}
            hidden={activeTab !== index}
            className={activeTab === index ? "block" : "hidden"}
          >
            {instrumentation.telemetry?.length === 1 && telemetry.when && (
              <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">
                  Configuration:{" "}
                  <span className="font-medium text-foreground">{telemetry.when}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Metrics Column */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/20">
                  <BarChartIcon className="h-5 w-5 text-green-400" />
                  <h4 className="text-base font-semibold text-foreground">Metrics</h4>
                  <span className="ml-auto text-sm font-medium text-green-400">{metricsCount}</span>
                </div>
                <MetricsList metrics={telemetry.metrics || []} />
              </div>

              {/* Spans Column */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/20">
                  <ZapIcon className="h-5 w-5 text-blue-400" />
                  <h4 className="text-base font-semibold text-foreground">Spans</h4>
                  <span className="ml-auto text-sm font-medium text-blue-400">{spansCount}</span>
                </div>
                <SpansList spans={telemetry.spans || []} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

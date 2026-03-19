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
import type { ReactNode } from "react";

interface InfoFeatureCardProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export function InfoFeatureCard({ icon, label, children }: InfoFeatureCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-md hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded bg-primary/10">{icon}</div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

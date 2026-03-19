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
import { ExternalLink } from "lucide-react";

interface LinkCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  description: string;
}

export function LinkCard({ href, icon, label, description }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-surface transition-all shadow-sm hover:shadow-md"
      aria-label={`${label}: ${description}`}
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
}

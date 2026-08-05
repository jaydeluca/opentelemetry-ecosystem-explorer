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

/*
 * Minimal i18next backend that fetches locale JSON from the static
 * public/locales tree. Replaces i18next-http-backend, whose configurable
 * surface (custom request functions, XHR fallback, reload intervals, missing-key
 * POSTs, multi-namespace loads) is unused here — the app only ever needs one
 * GET per (language, namespace).
 *
 * i18next accepts a plain object module as long as it carries `type: "backend"`,
 * so no class or prototype constructor is needed for a single i18n instance.
 */
import type { BackendModule, ReadCallback, ResourceKey } from "i18next";

/** Mirrors the `loadPath` previously passed to i18next-http-backend. */
const LOAD_PATH = "/locales/{{lng}}/{{ns}}.json";

/**
 * Builds the request URL for one (language, namespace) pair.
 *
 * Both values are percent-encoded rather than interpolated raw. `language` can
 * originate from user-controlled input (the `?lng=` query parameter, or a
 * localStorage value written by an earlier visit), so encoding is what keeps a
 * value like `../../secret` from escaping the locales directory. Namespaces are
 * compile-time constants, but are encoded too so the rule holds for both slots.
 */
function buildUrl(language: string, namespace: string): string {
  return LOAD_PATH.replace("{{lng}}", encodeURIComponent(language)).replace(
    "{{ns}}",
    encodeURIComponent(namespace)
  );
}

/**
 * The second callback argument is i18next's retry flag: `true` asks it to try
 * the same resource again later. Retry only on failures that a later attempt
 * could plausibly resolve — network errors and 5xx. A 4xx means the file is
 * genuinely absent, and a parse failure means it is present but malformed;
 * retrying either just burns requests.
 */
async function loadResource(url: string, callback: ReadCallback): Promise<void> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    callback(error as Error, true);
    return;
  }

  if (!response.ok) {
    const retry = response.status >= 500;
    callback(new Error(`failed loading ${url}; status code: ${response.status}`), retry);
    return;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    callback(new Error(`failed parsing ${url} to json`), false);
    return;
  }

  callback(null, data as ResourceKey);
}

export const httpBackend: BackendModule = {
  type: "backend",

  // Options come from module constants rather than i18next's `backend` config
  // block, so there is nothing to wire up here.
  init() {},

  read(language, namespace, callback) {
    void loadResource(buildUrl(language, namespace), callback);
  },
};

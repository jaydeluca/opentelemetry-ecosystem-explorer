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
 * Minimal i18next language detector. Replaces i18next-browser-languagedetector.
 *
 * That package ships eight detection sources (querystring, cookie, localStorage,
 * sessionStorage, navigator, htmlTag, path, subdomain, hash); this keeps the
 * three the app actually uses and drops the rest:
 *
 * - cookie / sessionStorage — the app sets neither.
 * - htmlTag — index.html hardcodes `lang="en"`, and config.ts overwrites the
 *   attribute on every languageChanged, so as a *source* it can only ever echo
 *   back `fallbackLng`.
 * - path / subdomain / hash — off by default upstream; the app has no
 *   locale-prefixed routes.
 *
 * The localStorage key is deliberately unchanged (`i18nextLng`), so a visitor
 * who picked a language before this swap keeps that selection afterwards.
 */
import type { LanguageDetectorModule } from "i18next";

/** Upstream default for `lookupLocalStorage`. Changing this would silently reset every existing visitor's language. */
const STORAGE_KEY = "i18nextLng";

/** Upstream default for `lookupQuerystring`. */
const QUERY_PARAM = "lng";

/**
 * i18next's pseudo-language for debugging translation keys. Caching it would
 * strand the user in debug mode across reloads, so it is never persisted —
 * matching upstream's `excludeCacheFor` default.
 */
const NEVER_CACHED = ["cimode"];

/**
 * Loose BCP-47 shape: a primary subtag plus optional hyphenated subtags.
 *
 * Candidates reach this from the query string and localStorage, so they are
 * untrusted. Upstream screens them with a blocklist of XSS-looking patterns; an
 * allowlist of what a language tag may contain is both shorter and strictly
 * tighter. i18next's own `supportedLngs` filtering is the real gate on which
 * languages activate — this only keeps obvious junk out of the candidate list.
 */
const LANGUAGE_TAG = /^[a-z]{2,8}(-[a-z0-9]{1,8})*$/i;

function fromQueryString(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? undefined;
}

/**
 * Reading localStorage throws — not returns null — when storage is disabled
 * (Safari private browsing, hardened browser settings), which would otherwise
 * take down i18n init entirely.
 */
function fromLocalStorage(): string | undefined {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** `navigator.languages` is ordered by user preference; `language` is the single top choice. */
function fromNavigator(): string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return [...navigator.languages];
  return navigator.language ? [navigator.language] : [];
}

export const languageDetector: LanguageDetectorModule = {
  type: "languageDetector",

  /*
   * Returns every candidate in priority order rather than a single language.
   * i18next (>= 19.5) resolves the list against `supportedLngs` and `load`,
   * which is what lets a browser advertising `en-GB` match the `en` bundle.
   */
  detect(): string[] {
    return [fromQueryString(), fromLocalStorage(), ...fromNavigator()].filter(
      (candidate): candidate is string => candidate !== undefined && LANGUAGE_TAG.test(candidate)
    );
  },

  cacheUserLanguage(language: string): void {
    if (NEVER_CACHED.includes(language)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Persisting the choice is best-effort; the app still works for this session.
    }
  },
};

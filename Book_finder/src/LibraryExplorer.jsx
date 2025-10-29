import React, { useEffect, useMemo, useState } from "react";
import BookTile from "./components/BookTile.jsx";
import { useDebounce } from "./useDebounce.js";

const API_URL = "https://openlibrary.org/search.json";

export default function LibraryExplorer() {
  // search & filters
  const [searchType, setSearchType] = useState("smart"); // smart | title | author | subject | isbn
  const [query, setQuery] = useState("harry potter");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [language, setLanguage] = useState("");
  const [onlyEbooks, setOnlyEbooks] = useState(false);

  // pagination
  const perPage = 20;
  const [page, setPage] = useState(1);

  // data state
  const [results, setResults] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const apiUrl = useMemo(() => {
    const u = new URL(API_URL);
    const p = u.searchParams;

    if (searchType === "smart") p.set("q", debouncedQuery || "");
    else p.set(searchType, debouncedQuery || "");

    if (yearStart) p.set("first_publish_year", `${yearStart}-${yearEnd || ""}`);
    if (language) p.set("language", language.toLowerCase());
    if (onlyEbooks) p.set("has_fulltext", "true");

    p.set("page", String(page));
    p.set("limit", String(perPage));
    return u.toString();
  }, [searchType, debouncedQuery, yearStart, yearEnd, language, onlyEbooks, page]);

  useEffect(() => {
    let ignore = false;
    async function fetchBooks() {
      setIsLoading(true);
      setFetchError("");
      try {
        const res = await fetch(apiUrl, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (ignore) return;
        setResults(data.docs || []);
        setTotalFound(data.numFound || 0);
      } catch (err) {
        if (!ignore) {
          setFetchError(err.message || "Something went wrong");
          setResults([]);
          setTotalFound(0);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    fetchBooks();
    return () => {
      ignore = true;
    };
  }, [apiUrl]);

  useEffect(() => setPage(1), [searchType, debouncedQuery, yearStart, yearEnd, language, onlyEbooks]);

  const totalPages = Math.max(1, Math.ceil(totalFound / perPage));

  return (
    <div className="library-wrapper">
      <header className="library-header">
        <div className="brand-mark" aria-hidden />
        <div>
          <h1 className="app-title">Library Explorer</h1>
          <p className="app-subtitle">Find books by title, author, subject or ISBN — beautifully fast.</p>
        </div>
      </header>

      <section className="search-panel" aria-label="Search controls">
        <div className="filter-tabs" role="tablist" aria-label="Search mode">
          {["smart", "title", "author", "subject", "isbn"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={searchType === t}
              className={`filter-tab${searchType === t ? " active" : ""}`}
              onClick={() => setSearchType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="search-controls">
          <input
            className="field-input"
            placeholder={
              searchType === "smart"
                ? "Try: murakami kafka on the shore"
                : searchType === "title"
                ? "Title e.g. The Pragmatic Programmer"
                : searchType === "author"
                ? "Author e.g. Ursula K. Le Guin"
                : searchType === "subject"
                ? "Subject e.g. fantasy, history"
                : "ISBN e.g. 9780135957059"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search input"
          />
          <button className="primary-btn" onClick={() => setPage(1)} aria-label="Search">
            Search
          </button>
        </div>

        <div className="extra-filters">
          <input
            className="field-input"
            placeholder="Year from"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value.replace(/[^0-9]/g, ""))}
          />
          <input
            className="field-input"
            placeholder="Year to"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value.replace(/[^0-9]/g, ""))}
          />
          <input
            className="field-input"
            placeholder="Language (en, fr, es...)"
            value={language}
            onChange={(e) => setLanguage(e.target.value.slice(0, 3))}
          />
          <label className="field-input" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={onlyEbooks} onChange={(e) => setOnlyEbooks(e.target.checked)} />
            ebooks only
          </label>
        </div>
      </section>

      {isLoading && <div className="loading-state">Loading…</div>}
      {fetchError && (
        <div className="alert" role="alert">
          Error: {fetchError}
        </div>
      )}
      {!isLoading && !fetchError && results.length === 0 && (
        <div className="notice">No results. Try a broader query or different filters.</div>
      )}

      {!isLoading && !fetchError && results.length > 0 && (
        <>
          <div className="pager">
            <button className="pager-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Prev page">
              ← Prev
            </button>
            <span className="pager-info">
              Page {page} / {totalPages} • {totalFound.toLocaleString()} results
            </span>
            <button className="pager-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              Next →
            </button>
          </div>

          <div className="result-grid" role="list" aria-label="Search results">
            {results.map((b) => (
              <BookTile key={(b.key ?? "") + (b.cover_i ?? "")} data={b} />
            ))}
          </div>

          <div className="pager">
            <button className="pager-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span className="pager-info">Page {page} / {totalPages}</span>
            <button className="pager-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import React from "react";

const coverUrl = (cover_i) =>
  cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : "https://covers.openlibrary.org/b/id/240727-M.jpg";

export default function BookTile({ data }) {
  const title = data.title ?? "Untitled";
  const author = (data.author_name && data.author_name.join(", ")) || "Unknown author";
  const firstYear = data.first_publish_year ? String(data.first_publish_year) : null;
  const lang = data.language?.[0]?.toUpperCase();
  const pages = data.number_of_pages_median;
  const workKey = data.key; // e.g. "/works/OL12345W"
  const openLibUrl = workKey ? `https://openlibrary.org${workKey}` : undefined;

  return (
    <article className="book-tile" aria-label={title}>
      <img className="book-cover" src={coverUrl(data.cover_i)} alt={title} loading="lazy" />
      <div className="tile-meta">
        <div className="tile-title">{title}</div>
        <div className="tile-author">{author}</div>
        <div className="tile-tags">
          {firstYear && (
            <span className="tile-tag" title="First publish year">
              {firstYear}
            </span>
          )}
          {lang && (
            <span className="tile-tag" title="Primary language">
              {lang}
            </span>
          )}
          {pages && (
            <span className="tile-tag" title="Median pages">
              {pages}p
            </span>
          )}
          {data.ebook_access && <span className="tile-tag">ebook</span>}
        </div>
      </div>
      <div className="tile-footer">
        <span className="pager-info">{data.edition_count} editions</span>
        {openLibUrl && (
          <a className="book-link" href={openLibUrl} target="_blank" rel="noreferrer">
            Open Library →
          </a>
        )}
      </div>
    </article>
  );
}

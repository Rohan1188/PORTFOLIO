
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function Blog() {
  const SITE = useSite();
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(SITE.blog.map((b) => b.category)))],
    []
  );
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const posts = SITE.blog.filter((b) => {
    const matchesCategory = category === "All" || b.category === category;
    const haystack = `${b.title} ${b.desc} ${b.tags.join(" ")}`.toLowerCase();
    const matchesQuery = query.trim() === "" || haystack.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="blog" className="py-28 md:py-36" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <RevealOnScroll className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <>
            <div className="max-w-xl">
              <SectionHeading label="Blog" title="From the blog." />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search posts…"
              className="!w-full md:!w-52"
            />
          </>
        </RevealOnScroll>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              data-cursor
              className={`filter-chip ${category === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length ? (
            posts.map((b, i) => (
              <RevealOnScroll key={b.title} delay={(i % 3) * 0.06}>
                <article className="card p-6 h-full">
                  <div
                    className="flex items-center gap-3 mb-4 font-mono text-[11px]"
                    style={{ color: "var(--text-faint)" }}
                  >
                    <span>{b.date}</span>
                    <span>·</span>
                    <span>{b.readTime} read</span>
                  </div>
                  <span className="tag mb-3 inline-block">{b.category}</span>
                  <h3 className="font-display text-lg mb-2 leading-snug font-semibold">{b.title}</h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                    {b.desc}
                  </p>
                  <Link to={`/blog/${b.slug}`} className="text-sm font-medium" style={{ color: "var(--crimson)" }} data-cursor>
                    Read More →
                  </Link>
                </article>
              </RevealOnScroll>
            ))
          ) : (
            <p className="col-span-full text-sm" style={{ color: "var(--text-faint)" }}>
              No posts match your search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

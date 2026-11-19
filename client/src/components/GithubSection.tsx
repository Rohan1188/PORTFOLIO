
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

type GithubData = {
  ok: boolean;
  user?: { public_repos: number; followers: number; public_gists: number };
  repos?: { name: string; html_url: string; language: string | null; stargazers_count: number }[];
};

export default function GithubSection() {
  const SITE = useSite();
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/github?user=${SITE.githubUsername}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData({ ok: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="py-28 md:py-36">
      <div className="container-x">
        <RevealOnScroll className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-start">
          <>
            <div>
              <SectionHeading compact label="On GitHub" title="Mostly green squares." />
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                Live stats fetched server-side from the GitHub API for{" "}
                <span className="font-mono text-sm">@{SITE.githubUsername}</span>. If the request fails,
                placeholder dashes are shown instead — this section never fabricates numbers.
              </p>
              <a
                href={`https://github.com/${SITE.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                data-cursor
              >
                View GitHub Profile →
              </a>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card p-5 text-center">
                  <p className="font-display text-2xl font-semibold">
                    {data?.ok ? data.user?.public_repos : "—"}
                  </p>
                  <p className="font-mono text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                    repositories
                  </p>
                </div>
                <div className="card p-5 text-center">
                  <p className="font-display text-2xl font-semibold">
                    {data?.ok ? data.user?.followers : "—"}
                  </p>
                </div>
                <div className="card p-5 text-center">
                  <p className="font-display text-2xl font-semibold">
                    {data?.ok ? data.user?.public_gists : "—"}
                  </p>
                  <p className="font-mono text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                    gists
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data?.ok && data.repos && data.repos.length > 0 ? (
                  data.repos.map((r) => (
                    <a
                      key={r.name}
                      href={r.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card p-4 flex items-center justify-between"
                      data-cursor
                    >
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                          {r.language || "multiple languages"}
                        </p>
                      </div>
                      <span
                        className="font-mono text-xs flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Star size={12} /> {r.stargazers_count}
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="card p-5">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {data === null
                        ? "Loading live GitHub activity…"
                        : "Live GitHub data couldn't be loaded right now (rate limit or network issue). Set a real username in SITE.githubUsername to show live activity here."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        </RevealOnScroll>
      </div>
    </section>
  );
}

import type { CollectionEntry } from "astro:content";

type BlogEntry = CollectionEntry<"blog">;

export function compareBlogEntriesByPubDate(a: BlogEntry, b: BlogEntry) {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

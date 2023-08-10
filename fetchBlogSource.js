import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import stream from "stream";
import url from "url";
import util from "util";

dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const asyncPipeline = util.promisify(stream.pipeline);

const CONFIG = {
  posts: {
    url: `${process.env.BLOG_SRC_URL}/posts`,
    dirname: "/src/content/blog",
    isPost: true,
  },
  images: {
    url: `${process.env.BLOG_SRC_URL}/assets/images`,
    dirname: "/public/images/blog",
  },
};

/** @param {string} url */
async function fetchFromGitHub(url) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });

    if (res.ok) return res;
    throw new Error(`Failed to fetch from ${url} with status ${res.status}`);
  } catch (e) {
    console.error("fetchFromGitHub", e);
    throw e;
  }
}

/**
 * @param {Response} res
 * @param {string} dirPath
 * @param {string} filename
 */
async function writeBlogPost(res, dirPath, filename) {
  const [date, updatedFilename] = filename.split("_");
  const filePath = path.join(dirPath, updatedFilename);
  const pubDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  try {
    const text = await res.text();
    const [firstLine, ...lines] = text.split("\n");
    const pubDateLine = `pubDate: "${pubDate}"`;
    const updatedText = [firstLine, pubDateLine, ...lines].join("\n");
    fs.promises.writeFile(filePath, updatedText);
  } catch (e) {
    console.error("writeBlogPost", e);
  }
}

/**
 * @param {Response} res
 * @param {string} dirPath
 * @param {string} filename
 */
async function writeBlogFile(res, dirPath, filename) {
  const filePath = path.join(dirPath, filename);
  asyncPipeline(res.body, fs.createWriteStream(filePath));
}

/** @param {{ url: string, dirname: string }} config */
async function fetchBlogSource(config) {
  const dirPath = path.join(__dirname, config.dirname);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  try {
    const res = await fetchFromGitHub(config.url);
    const files = await res.json();
    for (const file of files) {
      const res = await fetchFromGitHub(file.download_url);
      if (config.isPost) writeBlogPost(res, dirPath, file.name);
      else writeBlogFile(res, dirPath, file.name);
    }
  } catch (e) {
    console.error("fetchBlogSource", e);
    process.exit(1);
  }
}

console.log("Fetch blog source...");
Object.values(CONFIG).map(fetchBlogSource);

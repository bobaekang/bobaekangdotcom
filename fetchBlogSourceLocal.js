import fs from "fs"
import path from "path"
import url from "url"

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  posts: {
    sourceDir: "../blog-src/posts",
    targetDir: "/src/content/blog",
    isPost: true,
  },
  images: {
    sourceDir: "../blog-src/assets/images",
    targetDir: "/public/images/blog",
  },
}

/**
 * @param {string} dirPath
 * @param {string} filename
 */
async function writeBlogPost(sourcePath, dirPath, filename) {
  const [date, updatedFilename] = filename.split("_")
  const filePath = path.join(dirPath, updatedFilename)
  const pubDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
  try {
    const text = await fs.promises.readFile(sourcePath, "utf8")
    const [firstLine, ...lines] = text.split("\n")
    const pubDateLine = `pubDate: "${pubDate}Z-06:00"` // use central time zone
    const updatedText = [firstLine, pubDateLine, ...lines].join("\n")
    await fs.promises.writeFile(filePath, updatedText)
  } catch (e) {
    console.error("writeBlogPost", e)
  }
}

/**
 * @param {string} sourcePath
 * @param {string} dirPath
 * @param {string} filename
 */
async function writeBlogFile(sourcePath, dirPath, filename) {
  const filePath = path.join(dirPath, filename)
  await fs.promises.copyFile(sourcePath, filePath)
}

/** @param {{ sourceDir: string, targetDir: string }} config */
async function fetchBlogSourceLocal(config) {
  const sourcePath = path.resolve(__dirname, config.sourceDir)
  const targetPath = path.join(__dirname, config.targetDir)

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source directory does not exist: ${sourcePath}`)
    return
  }

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  try {
    const files = await fs.promises.readdir(sourcePath)
    for (const file of files) {
      const fullPath = path.join(sourcePath, file)
      const stat = await fs.promises.stat(fullPath)

      if (stat.isFile()) {
        if (config.isPost) {
          await writeBlogPost(fullPath, targetPath, file)
        } else {
          await writeBlogFile(fullPath, targetPath, file)
        }
      }
    }
  } catch (e) {
    console.error("fetchBlogSourceLocal", e)
    process.exit(1)
  }
}

console.log("Fetch blog source from local...")
Object.values(CONFIG).map(fetchBlogSourceLocal)

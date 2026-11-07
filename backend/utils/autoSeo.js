/**
 * autoSeo.js
 * Automatically generates seoTitle and seoDescription if the editor
 * left them blank. This guarantees no page ever ships with the generic
 * homepage meta tags as a fallback.
 */

const SITE_NAME = "Rahbars";
const YEAR = new Date().getFullYear();

function truncate(str, maxLen) {
  if (!str) return "";
  const stripped = str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.length > maxLen
    ? stripped.slice(0, maxLen - 1).trim() + "…"
    : stripped;
}

/**
 * Generate an SEO-optimised title for a blog post.
 * Priority: manual seoTitle → auto from title
 */
function generateBlogSeoTitle(blog) {
  if (blog.seoTitle && blog.seoTitle.trim()) return blog.seoTitle.trim();
  return truncate(`${blog.title} | ${SITE_NAME} ${YEAR}`, 70);
}

/**
 * Generate an SEO-optimised description for a blog post.
 * Priority: manual seoDescription → excerpt → first 160 chars of content
 */
function generateBlogSeoDescription(blog) {
  if (blog.seoDescription && blog.seoDescription.trim()) return blog.seoDescription.trim();
  const source =
    blog.excerpt ||
    (blog.content ? blog.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "");
  return truncate(source, 160);
}

/**
 * Generate an SEO-optimised title for a university.
 * Priority: manual seoTitle → auto from name + city
 */
function generateUniSeoTitle(uni) {
  if (uni.seoTitle && uni.seoTitle.trim()) return uni.seoTitle.trim();
  const city = uni.city ? ` ${uni.city}` : "";
  return truncate(`${uni.name}${city} Admissions ${YEAR} — Merit, Fee & Programs | ${SITE_NAME}`, 70);
}

/**
 * Generate an SEO-optimised description for a university.
 * Priority: manual seoDescription → auto from university data
 */
function generateUniSeoDescription(uni) {
  if (uni.seoDescription && uni.seoDescription.trim()) return uni.seoDescription.trim();
  const depts = (uni.departments || []).length;
  const city = uni.city || "Pakistan";
  const type = uni.type === "government" ? "Government" : "Private";
  return truncate(
    `${type} university in ${city} with ${depts}+ programs. Check ${uni.name} admission ${YEAR}: fee structure, merit list, entry test, and deadlines. Apply smarter with ${SITE_NAME}.`,
    160
  );
}

module.exports = {
  generateBlogSeoTitle,
  generateBlogSeoDescription,
  generateUniSeoTitle,
  generateUniSeoDescription,
};

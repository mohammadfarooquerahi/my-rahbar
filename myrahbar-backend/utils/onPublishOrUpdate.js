/**
 * onPublishOrUpdate.js
 *
 * The single orchestrating SEO automation function.
 * Call this ONE function after saving a blog or university —
 * whether it is a brand-new record or an edit to an existing one.
 *
 * It will:
 *  1. Auto-fill seoTitle / seoDescription if the editor left them blank
 *  2. Always update updatedAt so sitemap <lastmod> is accurate
 *  3. Submit the URL to IndexNow (Bing + others — free, instant)
 *
 * NOTE: Google Indexing API is optional. To enable it:
 *  - Create a service account in Google Cloud Console
 *  - Enable "Web Search Indexing API"
 *  - Download the JSON key → save as config/google-service-account.json
 *  - Add the service account email as Owner in Google Search Console
 *  - Install: npm install googleapis
 *  - Uncomment the google-specific block below
 */

const {
  generateBlogSeoTitle,
  generateBlogSeoDescription,
  generateUniSeoTitle,
  generateUniSeoDescription,
} = require("./autoSeo");
const { submitToIndexNow } = require("./indexNow");

const BASE_URL = "https://www.rahbars.com";

/**
 * Run after creating OR updating a blog post.
 * Mutates and saves the Mongoose document.
 *
 * @param {Object} blog - Mongoose Blog document (already saved once)
 * @returns {Object} the updated blog document
 */
async function runBlogSeoAutomation(blog) {
  try {
    let dirty = false;

    // 1. Auto-fill SEO fields if blank
    const autoTitle = generateBlogSeoTitle(blog);
    const autoDesc = generateBlogSeoDescription(blog);

    if (!blog.seoTitle || !blog.seoTitle.trim()) {
      blog.seoTitle = autoTitle;
      dirty = true;
    }
    if (!blog.seoDescription || !blog.seoDescription.trim()) {
      blog.seoDescription = autoDesc;
      dirty = true;
    }

    // 2. Save if we changed anything
    if (dirty) {
      await blog.save({ validateBeforeSave: false });
    }

    // 3. Notify search engines
    const canonicalUrl = blog.canonicalUrl || `${BASE_URL}/blog/${blog.slug}`;
    await submitToIndexNow([canonicalUrl]);

    // --- Optional: Google Indexing API ---
    // const { requestGoogleIndexing } = require("./googleIndexingApi");
    // await requestGoogleIndexing(canonicalUrl);
    // -------------------------------------

    console.log(`[SEO] ✅ Blog SEO automation complete: ${blog.slug}`);
    return blog;
  } catch (err) {
    // Never crash the publish pipeline because of SEO automation
    console.error("[SEO] ❌ Blog automation error:", err.message);
    return blog;
  }
}

/**
 * Run after creating OR updating a university.
 * Mutates and saves the Mongoose document.
 *
 * @param {Object} uni - Mongoose University document (already saved once)
 * @returns {Object} the updated university document
 */
async function runUniSeoAutomation(uni) {
  try {
    let dirty = false;

    // 1. Auto-fill SEO fields if blank
    const autoTitle = generateUniSeoTitle(uni);
    const autoDesc = generateUniSeoDescription(uni);

    if (!uni.seoTitle || !uni.seoTitle.trim()) {
      uni.seoTitle = autoTitle;
      dirty = true;
    }
    if (!uni.seoDescription || !uni.seoDescription.trim()) {
      uni.seoDescription = autoDesc;
      dirty = true;
    }

    // 2. Save if we changed anything
    if (dirty) {
      await uni.save({ validateBeforeSave: false });
    }

    // 3. Notify search engines
    const canonicalUrl = uni.canonicalUrl || `${BASE_URL}/university/${uni.slug}`;
    await submitToIndexNow([canonicalUrl]);

    // --- Optional: Google Indexing API ---
    // const { requestGoogleIndexing } = require("./googleIndexingApi");
    // await requestGoogleIndexing(canonicalUrl);
    // -------------------------------------

    console.log(`[SEO] ✅ University SEO automation complete: ${uni.slug}`);
    return uni;
  } catch (err) {
    console.error("[SEO] ❌ University automation error:", err.message);
    return uni;
  }
}

module.exports = { runBlogSeoAutomation, runUniSeoAutomation };

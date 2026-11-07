import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const indexHtmlPath = path.join(distDir, "index.html");

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function injectMetadata(baseHtml, { title, description, canonicalUrl, ogType = "website", schemaJson, bodyHtml }) {
  let html = baseHtml;

  // Title
  if (html.includes("<title>")) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  } else {
    html = html.replace("</head>", `  <title>${escapeHtml(title)}</title>\n</head>`);
  }

  // Description
  const metaDesc = `<meta name="description" content="${escapeHtml(description)}" />`;
  if (/name="description"/i.test(html)) {
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, metaDesc);
  } else {
    html = html.replace("</head>", `  ${metaDesc}\n</head>`);
  }

  // Canonical
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (/rel="canonical"/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, canonicalTag);
  } else {
    html = html.replace("</head>", `  ${canonicalTag}\n</head>`);
  }

  // OpenGraph & Twitter
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  // Schema.org JSON-LD
  if (schemaJson) {
    const schemaTag = `\n  <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>\n`;
    html = html.replace("</head>", `${schemaTag}</head>`);
  }

  // Body inside <div id="root">
  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  return html;
}

function buildUniversityBody(uni) {
  const depts = Array.isArray(uni.departments) ? uni.departments : [];
  return `
<header style="background:#0F172A;color:#fff;padding:14px 20px;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:space-between;">
  <a href="/" style="color:#fff;text-decoration:none;font-weight:800;font-size:18px;">🎓 Rahbars</a>
  <nav style="display:flex;gap:16px;font-size:14px;">
    <a href="/find-university" style="color:#94A3B8;text-decoration:none;">Find Universities</a>
    <a href="/merit-calculator" style="color:#94A3B8;text-decoration:none;">Merit Calculator</a>
    <a href="/blog" style="color:#94A3B8;text-decoration:none;">Guides</a>
  </nav>
</header>
<main style="max-width:1100px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;color:#1E293B;">
  <nav style="font-size:13px;color:#64748B;margin-bottom:16px;">
    <a href="/" style="color:#2563EB;text-decoration:none;">Home</a> &gt;
    <a href="/find-university" style="color:#2563EB;text-decoration:none;">Universities</a> &gt;
    <span>${escapeHtml(uni.name)}</span>
  </nav>
  <div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px;">
      <span style="background:#EFF6FF;color:#1D4ED8;font-size:12px;font-weight:700;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">${escapeHtml(uni.type || 'University')}</span>
      <span style="background:#F1F5F9;color:#475569;font-size:12px;font-weight:600;padding:4px 10px;border-radius:9999px;">📍 ${escapeHtml(uni.city || 'Pakistan')}</span>
      ${uni.established ? `<span style="background:#F1F5F9;color:#475569;font-size:12px;font-weight:600;padding:4px 10px;border-radius:9999px;">Est. ${escapeHtml(uni.established)}</span>` : ''}
      <span style="background:${uni.admissionOpen ? '#ECFDF5;color:#047857' : '#FEF2F2;color:#B91C1C'};font-size:12px;font-weight:700;padding:4px 10px;border-radius:9999px;">
        ${uni.admissionOpen ? '● Admissions Open 2026' : '○ Admissions Closed'}
      </span>
    </div>
    <h1 style="font-size:28px;font-weight:800;color:#0F172A;margin:0 0 12px 0;">
      ${escapeHtml(uni.name)} ${uni.shortName ? `(${escapeHtml(uni.shortName)})` : ''}
    </h1>
    <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 16px 0;">
      ${escapeHtml(uni.description || `${uni.name} is a renowned higher education institution in ${uni.city || 'Pakistan'}. Check below for 2026 admission eligibility, fee structure, closing merit, and departments.`)}
    </p>
    ${uni.website ? `<p style="font-size:14px;"><a href="${escapeHtml(uni.website)}" target="_blank" rel="noopener noreferrer" style="color:#2563EB;font-weight:600;text-decoration:none;">Visit Official University Website ↗</a></p>` : ''}
  </div>

  <section style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;margin-bottom:24px;">
    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
      <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 12px 0;">Admission & Eligibility 2026</h2>
      <p style="font-size:14px;color:#475569;line-height:1.6;">${escapeHtml(uni.eligibilityCriteria || 'Intermediate / FSc / A-Level with minimum required marks as per HEC / University criteria.')}</p>
      ${uni.testRequired ? `<p style="font-size:14px;color:#475569;margin-top:8px;"><strong>Entry Test:</strong> ${escapeHtml(uni.testRequired)} (${escapeHtml(uni.admissionTestType || 'Entry Test')})</p>` : ''}
      ${uni.admissionDeadline ? `<p style="font-size:14px;color:#DC2626;margin-top:8px;font-weight:600;">Deadline: ${escapeHtml(uni.admissionDeadline)}</p>` : ''}
    </div>
    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
      <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 12px 0;">Fee & Facilities</h2>
      ${uni.admissionFee ? `<p style="font-size:14px;color:#475569;"><strong>Admission Fee:</strong> PKR ${escapeHtml(uni.admissionFee)}</p>` : ''}
      <p style="font-size:14px;color:#475569;"><strong>Hostel Accommodation:</strong> ${uni.hostelAvailable ? 'Available' : 'Not available'}</p>
      ${uni.hostelFee ? `<p style="font-size:14px;color:#475569;"><strong>Hostel Fee:</strong> PKR ${escapeHtml(uni.hostelFee)}</p>` : ''}
      ${uni.scholarships ? `<p style="font-size:14px;color:#059669;margin-top:8px;"><strong>Scholarships:</strong> ${escapeHtml(uni.scholarships)}</p>` : ''}
    </div>
  </section>

  ${depts.length > 0 ? `
  <section style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:20px;margin-bottom:24px;">
    <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin:0 0 16px 0;">Departments & Degrees Offered</h2>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left;">
        <thead>
          <tr style="background:#F8FAFC;border-bottom:2px solid #E2E8F0;">
            <th style="padding:10px 14px;color:#475569;">Program / Department</th>
            <th style="padding:10px 14px;color:#475569;">Field</th>
            <th style="padding:10px 14px;color:#475569;">Semester Fee</th>
            <th style="padding:10px 14px;color:#475569;">Closing Merit</th>
          </tr>
        </thead>
        <tbody>
          ${depts.map(d => `
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:10px 14px;font-weight:600;color:#1E293B;">${escapeHtml(d.name)}</td>
              <td style="padding:10px 14px;color:#64748B;">${escapeHtml(d.category || 'General')}</td>
              <td style="padding:10px 14px;color:#1E293B;">${d.semesterFee ? `PKR ${escapeHtml(d.semesterFee.toLocaleString())}` : 'Contact Uni'}</td>
              <td style="padding:10px 14px;color:#047857;font-weight:600;">
                ${Array.isArray(d.lastMerit) && d.lastMerit.length > 0 ? `${escapeHtml(d.lastMerit[0].closing)}% (${escapeHtml(d.lastMerit[0].year || '2024')})` : 'N/A'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </section>
  ` : ''}

  <div style="background:linear-gradient(135deg, #1E3A8A, #3B82F6);color:#fff;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
    <h3 style="font-size:20px;font-weight:800;margin:0 0 8px 0;">Calculate Your Admission Chances at ${escapeHtml(uni.shortName || uni.name)}</h3>
    <p style="font-size:14px;color:#DBEAFE;margin:0 0 16px 0;">Use the free Rahbars aggregate calculator to compute your exact merit score based on Matric, FSc, and entry test marks.</p>
    <a href="/merit-calculator" style="display:inline-block;background:#fff;color:#1D4ED8;font-weight:700;font-size:14px;padding:10px 24px;border-radius:10px;text-decoration:none;">Open Merit Calculator →</a>
  </div>
</main>
<footer style="background:#0F172A;color:#94A3B8;padding:24px 20px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;text-align:center;">
  <p>© 2026 Rahbars. Empowering students across Pakistan with transparent university admissions, merit analysis, and guidance.</p>
  <p><a href="/privacy" style="color:#94A3B8;margin-right:12px;">Privacy Policy</a> <a href="/terms" style="color:#94A3B8;margin-right:12px;">Terms of Service</a> <a href="/contact" style="color:#94A3B8;">Contact Us</a></p>
</footer>
`;
}

function buildBlogBody(blog) {
  const faqs = Array.isArray(blog.faqs) ? blog.faqs : [];
  return `
<header style="background:#0F172A;color:#fff;padding:14px 20px;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:space-between;">
  <a href="/" style="color:#fff;text-decoration:none;font-weight:800;font-size:18px;">🎓 Rahbars</a>
  <nav style="display:flex;gap:16px;font-size:14px;">
    <a href="/find-university" style="color:#94A3B8;text-decoration:none;">Find Universities</a>
    <a href="/merit-calculator" style="color:#94A3B8;text-decoration:none;">Merit Calculator</a>
    <a href="/blog" style="color:#94A3B8;text-decoration:none;">All Blogs</a>
  </nav>
</header>
<main style="max-width:860px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;color:#1E293B;">
  <nav style="font-size:13px;color:#64748B;margin-bottom:16px;">
    <a href="/" style="color:#2563EB;text-decoration:none;">Home</a> &gt;
    <a href="/blog" style="color:#2563EB;text-decoration:none;">Blog</a> &gt;
    <span>${escapeHtml(blog.title)}</span>
  </nav>
  <article>
    <div style="margin-bottom:16px;">
      <span style="background:#EFF6FF;color:#1D4ED8;font-size:12px;font-weight:700;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">${escapeHtml(blog.category || 'Admission Guide')}</span>
      <span style="color:#64748B;font-size:13px;margin-left:12px;">${escapeHtml(blog.readTime || 5)} min read</span>
    </div>
    <h1 style="font-size:32px;font-weight:800;color:#0F172A;line-height:1.25;margin:0 0 16px 0;">${escapeHtml(blog.title)}</h1>
    ${blog.excerpt ? `
    <p style="font-size:17px;color:#475569;line-height:1.6;font-style:italic;margin:0 0 24px 0;border-left:4px solid #3B82F6;padding-left:16px;">
      ${escapeHtml(blog.excerpt)}
    </p>` : ''}
    <div style="font-size:16px;line-height:1.8;color:#334155;margin-bottom:32px;">
      ${blog.content || ''}
    </div>
    ${faqs.length > 0 ? `
    <section style="margin-top:36px;padding:24px;background:#F8FAFC;border-radius:16px;border:1px solid #E2E8F0;">
      <h2 style="font-size:22px;font-weight:800;color:#0F172A;margin:0 0 16px 0;">Frequently Asked Questions</h2>
      ${faqs.map(faq => `
        <div style="margin-bottom:16px;">
          <h3 style="font-size:16px;font-weight:700;color:#1E293B;margin:0 0 6px 0;">Q: ${escapeHtml(faq.question)}</h3>
          <p style="font-size:15px;color:#475569;margin:0;line-height:1.6;">${escapeHtml(faq.answer)}</p>
        </div>
      `).join('')}
    </section>
    ` : ''}
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:20px;text-align:center;margin-top:32px;">
      <h3 style="font-size:18px;font-weight:700;color:#1E3A8A;margin:0 0 8px 0;">Ready to apply to Pakistani universities?</h3>
      <p style="font-size:14px;color:#3B82F6;margin:0 0 16px 0;">Use Rahbars to check aggregate formulas, find universities by city, and download past papers.</p>
      <a href="/find-university" style="display:inline-block;background:#2563EB;color:#fff;font-weight:700;font-size:14px;padding:10px 20px;border-radius:10px;text-decoration:none;margin-right:10px;">Explore Universities</a>
      <a href="/merit-calculator" style="display:inline-block;background:#fff;color:#2563EB;border:1px solid #2563EB;font-weight:700;font-size:14px;padding:10px 20px;border-radius:10px;text-decoration:none;">Merit Calculator</a>
    </div>
  </article>
</main>
<footer style="background:#0F172A;color:#94A3B8;padding:24px 20px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;text-align:center;margin-top:40px;">
  <p>© 2026 Rahbars. Pakistan's trusted education guidance and admission intelligence platform.</p>
</footer>
`;
}

async function prerender() {
  console.log("[prerender] Starting static page generation...");

  if (!fs.existsSync(indexHtmlPath)) {
    console.error("[prerender] Error: dist/index.html not found! Run vite build first.");
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // 1. Fetch all universities
  let universities = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://myrahbar-backend.onrender.com/api/universities?limit=100", { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      universities = Array.isArray(data) ? data : (data.universities || []);
    }
  } catch (err) {
    console.warn("[prerender] Backend fetch for universities failed:", err.message);
  }

  // 2. Fetch all blogs
  let blogs = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://myrahbar-backend.onrender.com/api/blogs?limit=100", { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      blogs = Array.isArray(data) ? data : (data.blogs || []);
    }
  } catch (err) {
    console.warn("[prerender] Backend fetch for blogs failed:", err.message);
  }

  console.log(`[prerender] Fetched ${universities.length} universities and ${blogs.length} blogs.`);

  // 3. Generate pages for universities
  let uniCount = 0;
  for (const uni of universities) {
    if (!uni.slug) continue;
    const uniDir = path.join(distDir, "university", uni.slug);
    fs.mkdirSync(uniDir, { recursive: true });

    const title = `${uni.name} - Admission, Merit, Fee 2026 | Rahbars`;
    const description = `Explore ${uni.name} (${uni.city || 'Pakistan'}). Check 2026 admission deadlines, eligibility criteria, fee structure, closing merit, and departments.`;
    const canonicalUrl = `https://www.rahbars.com/university/${uni.slug}`;
    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": uni.name,
      "alternateName": uni.shortName || uni.name,
      "url": canonicalUrl,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": uni.city || "Pakistan",
        "addressCountry": "PK"
      },
      "description": uni.description || `Admission, merit criteria, and fee details for ${uni.name}.`
    };

    const pageHtml = injectMetadata(baseHtml, {
      title,
      description,
      canonicalUrl,
      schemaJson,
      bodyHtml: buildUniversityBody(uni)
    });

    fs.writeFileSync(path.join(uniDir, "index.html"), pageHtml, "utf-8");
    uniCount++;
  }
  console.log(`[prerender] Successfully generated ${uniCount} university static pages!`);

  // 4. Generate pages for blogs
  let blogCount = 0;
  for (const blog of blogs) {
    if (!blog.slug) continue;
    const blogDir = path.join(distDir, "blog", blog.slug);
    fs.mkdirSync(blogDir, { recursive: true });

    const title = `${blog.seoTitle || blog.title} | Rahbars`;
    const description = blog.seoDescription || blog.excerpt || blog.title;
    const canonicalUrl = `https://www.rahbars.com/blog/${blog.slug}`;
    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.seoTitle || blog.title,
      "description": blog.seoDescription || blog.excerpt || "",
      "url": canonicalUrl,
      "datePublished": blog.createdAt || new Date().toISOString(),
      "dateModified": blog.updatedAt || blog.createdAt || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Rahbars Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Rahbars",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rahbars.com/og-image.png"
        }
      }
    };

    const pageHtml = injectMetadata(baseHtml, {
      title,
      description,
      canonicalUrl,
      schemaJson,
      bodyHtml: buildBlogBody(blog)
    });

    fs.writeFileSync(path.join(blogDir, "index.html"), pageHtml, "utf-8");
    blogCount++;
  }
  console.log(`[prerender] Successfully generated ${blogCount} blog static pages!`);

  // 5. Generate core static pages
  const corePages = [
    {
      route: "search",
      title: "Search Universities in Pakistan 2026 | Rahbars",
      description: "Search 40+ top Pakistani universities by city, discipline, fee, and merit closing score.",
    },
    {
      route: "merit-calculator",
      title: "Aggregate & Merit Calculator 2026 | Rahbars",
      description: "Calculate your university aggregate percentage for NUST, FAST, MDCAT, NED, UET, and all Pakistani universities accurately.",
    },
    {
      route: "compare",
      title: "Compare Universities in Pakistan Side by Side | Rahbars",
      description: "Compare universities by fees, ranking, location, facilities, and departments to make the best choice.",
    },
    {
      route: "find-university",
      title: "Smart University Matcher & Finder | Rahbars",
      description: "Find the best universities matching your marks, budget, and preferred career path in Pakistan.",
    },
    {
      route: "blog",
      title: "Pakistani University Admissions & Career Guides 2026 | Rahbars Blog",
      description: "Read expert admission guides, aggregate formulas, entry test tips, and university reviews in Pakistan.",
    },
    {
      route: "past-papers",
      title: "Download Past Papers & Entry Test Solutions | Rahbars",
      description: "Free download past papers and sample tests for Pakistani university entry tests including NTS, ECAT, MDCAT, and FAST.",
    },
    {
      route: "document-tools",
      title: "Student Document Tools & PDF Utilities | Rahbars",
      description: "Free document tools for Pakistani students: compress documents, convert images to PDF, and organize admission files.",
    },
    {
      route: "counseling",
      title: "Expert Career Counseling & Mentorship | Rahbars",
      description: "Get personalized guidance from top university students and educational mentors in Pakistan.",
    },
    {
      route: "about",
      title: "About Rahbars — Pakistan's #1 Admission Guidance Platform",
      description: "Learn how Rahbars is empowering students across Pakistan with transparent university admissions and merit data.",
    },
    {
      route: "contact",
      title: "Contact Rahbars | Get Admission Support",
      description: "Have questions about universities in Pakistan? Get in touch with the Rahbars team.",
    },
    {
      route: "privacy",
      title: "Privacy Policy | Rahbars",
      description: "Read the Privacy Policy of Rahbars and how we protect student data.",
    },
    {
      route: "terms",
      title: "Terms of Service | Rahbars",
      description: "Read the Terms of Service for using the Rahbars educational platform.",
    },
  ];

  for (const page of corePages) {
    const pageDir = path.join(distDir, page.route);
    fs.mkdirSync(pageDir, { recursive: true });
    const pageHtml = injectMetadata(baseHtml, {
      title: page.title,
      description: page.description,
      canonicalUrl: `https://www.rahbars.com/${page.route}`,
    });
    fs.writeFileSync(path.join(pageDir, "index.html"), pageHtml, "utf-8");
  }
  console.log(`[prerender] Generated ${corePages.length} core static pages.`);
  console.log(`[prerender] Done! Total pre-rendered pages: ${uniCount + blogCount + corePages.length}`);
}

prerender();

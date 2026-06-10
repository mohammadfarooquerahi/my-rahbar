const Blog = require("../models/Blog");
const User = require("../models/User");
const slugify = require("slugify");

// ─── GET /api/blogs ─────────────────────────────────────────────────────────
const getBlogs = async (req, res) => {
  const { category, search, page = 1, limit = 12, status } = req.query;

  // Admins can see drafts too, public only sees published
  const query = {};
  if (req.user?.role === "admin" && status) {
    query.status = status;
  } else {
    query.status = "published";
  }

  if (category && category !== "All") query.category = category;
  if (search) {
    query.$or = [
      { title:    { $regex: search, $options: "i" } },
      { excerpt:  { $regex: search, $options: "i" } },
      { tags:     { $regex: search, $options: "i" } },
      { keywords: { $regex: search, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Blog.countDocuments(query);

  res.json({ blogs, totalPages: Math.ceil(total / limit), currentPage: Number(page), total });
};

// ─── GET /api/blogs/:slug ────────────────────────────────────────────────────
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  blog.views += 1;
  await blog.save({ validateBeforeSave: false });

  // Related blogs (same category, exclude current)
  const related = await Blog.find({
    category: blog.category,
    status: "published",
    _id: { $ne: blog._id },
  }).select("title slug excerpt category coverColor readTime createdAt").limit(3);

  res.json({ blog, related });
};

// ─── POST /api/blogs (Admin only) ───────────────────────────────────────────
const createBlog = async (req, res) => {
  const { title, content, excerpt, category, tags, status, seoTitle, seoDescription, keywords, readTime, coverColor, faqs } = req.body;
  const featuredImage = req.file ? `/uploads/blogs/${req.file.filename}` : undefined;

  if (!title || !content || !category) {
    return res.status(400).json({ message: "Title, content and category are required." });
  }

  let slug = slugify(title, { lower: true, strict: true });
  const existing = await Blog.findOne({ slug });
  if (existing) slug = slug + "-" + Date.now();

  let parsedFaqs = [];
  if (faqs) {
    try { parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs; } catch {}
  }

  const blog = await Blog.create({
    title, slug, content,
    excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
    category,
    tags: tags ? (typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags) : [],
    keywords: keywords ? (typeof keywords === "string" ? keywords.split(",").map(k => k.trim()) : keywords) : [],
    status: status || "draft",
    author: req.user._id,
    featuredImage,
    seoTitle: seoTitle || title.substring(0, 70),
    seoDescription: seoDescription || (excerpt || "").substring(0, 160),
    readTime: readTime || Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(" ").length / 200)),
    coverColor: coverColor || "#EFF6FF",
    faqs: parsedFaqs,
  });

  res.status(201).json({ blog, _id: blog._id });
};

// ─── PUT /api/blogs/:id (Admin only) ────────────────────────────────────────
const updateBlog = async (req, res) => {
  const { title, content, excerpt, category, tags, status, seoTitle, seoDescription, keywords, readTime, coverColor } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (title) { blog.title = title; blog.slug = slugify(title, { lower: true, strict: true }); }
  if (content) blog.content = content;
  if (excerpt) blog.excerpt = excerpt;
  if (category) blog.category = category;
  if (tags !== undefined) blog.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
  if (keywords !== undefined) blog.keywords = typeof keywords === "string" ? keywords.split(",").map(k => k.trim()) : keywords;
  if (status) blog.status = status;
  if (seoTitle) blog.seoTitle = seoTitle;
  if (seoDescription) blog.seoDescription = seoDescription;
  if (readTime) blog.readTime = Number(readTime);
  if (coverColor) blog.coverColor = coverColor;
  if (req.file) blog.featuredImage = `/uploads/blogs/${req.file.filename}`;

  await blog.save();
  res.json(blog);
};

// ─── DELETE /api/blogs/:id (Admin only) ─────────────────────────────────────
const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json({ message: "Blog deleted successfully" });
};

// ─── POST /api/blogs/seed (Admin only) ──────────────────────────────────────
const seedBlogs = async (req, res) => {
  const adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) return res.status(404).json({ message: "No admin user found to assign blogs" });

  const BLOGS = [
    {
      title: "How to Calculate Your Aggregate for University Admission in Pakistan",
      category: "Merit & Aggregate",
      coverColor: "#EFF6FF",
      tags: ["aggregate formula", "merit calculator", "admission 2025"],
      keywords: ["aggregate formula pakistan", "how to calculate aggregate", "university merit formula", "MDCAT aggregate", "FSc matric aggregate"],
      readTime: 6,
      seoTitle: "How to Calculate Aggregate for University Admission Pakistan 2025",
      seoDescription: "Step-by-step guide to calculate aggregate percentage for Pakistani universities. Learn merit formulas for medical, engineering, and general programs.",
      excerpt: "Learn exactly how to calculate your aggregate percentage for university admissions in Pakistan — with formulas for MDCAT, engineering, and general programs.",
      content: `<h2>What is an Aggregate Percentage?</h2>
<p>In Pakistan, university admissions are based on an <strong>aggregate percentage</strong> — a weighted combination of your Matric marks, FSc marks, and entry test score. Each university sets its own formula.</p>

<h2>General Aggregate Formula</h2>
<p>The most common formula used by public universities in Pakistan is:</p>
<ul>
  <li><strong>Matric:</strong> 10%</li>
  <li><strong>FSc (Intermediate):</strong> 40%</li>
  <li><strong>Entry Test (MDCAT/ECAT/NTS):</strong> 50%</li>
</ul>
<p><em>Example: If you scored 80% in Matric, 85% in FSc, and 75% in MDCAT:</em></p>
<p><code>Aggregate = (80 × 0.10) + (85 × 0.40) + (75 × 0.50) = 8 + 34 + 37.5 = <strong>79.5%</strong></code></p>

<h2>University-Specific Formulas</h2>
<p><strong>Dow University of Health Sciences (DUHS):</strong> Matric 10% + FSc 40% + MDCAT 50%</p>
<p><strong>NED University:</strong> Matric 10% + FSc 40% + ECAT 50%</p>
<p><strong>University of Karachi (KU):</strong> Matric 20% + FSc 50% + NTS 30%</p>
<p><strong>FAST-NUCES:</strong> 100% based on their own NAT/NU entry test</p>

<h2>How to Use Rahbars Aggregate Calculator</h2>
<p>Visit the <a href="/merit-calculator">Aggregate Calculator</a> on Rahbars.com. Select your university, enter your Matric %, FSc %, and entry test score — your aggregate is calculated instantly with the correct formula.</p>

<h2>Tips to Improve Your Aggregate</h2>
<ol>
  <li>Focus heavily on your FSc marks — they carry 40% weight in most formulas</li>
  <li>Practice past papers for entry tests — 50% weight makes them crucial</li>
  <li>Use Rahbars to find which university your current aggregate qualifies for</li>
</ol>

<p><strong>Conclusion:</strong> Understanding your aggregate formula is the first step to a successful university admission. Use Rahbars to calculate and compare your chances across all Pakistani universities — for free.</p>`
    },
    {
      title: "MDCAT 2025 Complete Guide — Dates, Syllabus and How to Prepare",
      category: "Entry Tests",
      coverColor: "#FFF1F2",
      tags: ["MDCAT 2025", "PMC", "medical entry test", "MBBS admission"],
      keywords: ["MDCAT 2025 date", "MDCAT syllabus 2025", "how to prepare for MDCAT", "PMC entry test guide", "MDCAT pakistan"],
      readTime: 8,
      seoTitle: "MDCAT 2025 Complete Guide — Dates, Syllabus, Preparation Tips",
      seoDescription: "Complete MDCAT 2025 guide for Pakistan — exam dates, official syllabus, smart preparation strategies, and top resources to score above 160.",
      excerpt: "Complete MDCAT 2025 guide covering PMC exam dates, official syllabus topics, and proven preparation strategies to help you score 160+ and secure MBBS admission.",
      content: `<h2>What is MDCAT?</h2>
<p>MDCAT (Medical and Dental College Admission Test) is the national entry test conducted by the <strong>Pakistan Medical Commission (PMC)</strong> for admission into MBBS, BDS, and other medical programs in Pakistan.</p>

<h2>MDCAT 2025 Key Dates</h2>
<ul>
  <li><strong>Registration Opens:</strong> July 2025</li>
  <li><strong>Last Date to Apply:</strong> August 2025</li>
  <li><strong>Exam Date:</strong> September 2025</li>
  <li><strong>Result Announcement:</strong> Within 2 weeks of exam</li>
</ul>
<p><em>Note: Dates are announced by PMC officially. Check <strong>pmc.gov.pk</strong> for updates.</em></p>

<h2>MDCAT Syllabus 2025</h2>
<p>The MDCAT paper has <strong>200 MCQs</strong> covering:</p>
<ul>
  <li><strong>Biology:</strong> 68 questions (34%)</li>
  <li><strong>Chemistry:</strong> 56 questions (28%)</li>
  <li><strong>Physics:</strong> 44 questions (22%)</li>
  <li><strong>English:</strong> 18 questions (9%)</li>
  <li><strong>Logical Reasoning:</strong> 14 questions (7%)</li>
</ul>

<h2>Smart Preparation Strategy</h2>
<ol>
  <li><strong>Start early (6 months):</strong> Begin after FSc Part 1 exams</li>
  <li><strong>Past papers:</strong> Solve at least 5 years of PMC past papers</li>
  <li><strong>Topic-wise revision:</strong> Focus on high-weightage biology chapters</li>
  <li><strong>Mock tests:</strong> Practice full 3.5-hour paper under exam conditions</li>
  <li><strong>English:</strong> Read editorial sections of newspapers daily</li>
</ol>

<h2>Minimum Score for MBBS Admission</h2>
<p>A score of <strong>150+ out of 200</strong> is typically needed for government medical colleges. Top colleges like DUHS, AIMC, and KEMU require 165+.</p>

<p><strong>Use Rahbars</strong> to check the last merit of any medical university and see if your projected aggregate qualifies.</p>`
    },
    {
      title: "Top 10 Government Medical Colleges in Pakistan 2025",
      category: "University Reviews",
      coverColor: "#F0FDF4",
      tags: ["medical colleges", "MBBS admission", "government universities"],
      keywords: ["top medical colleges pakistan 2025", "best government medical universities", "MBBS colleges pakistan ranking", "public medical colleges"],
      readTime: 7,
      seoTitle: "Top 10 Government Medical Colleges in Pakistan 2025",
      seoDescription: "Ranking of the best government medical colleges in Pakistan for 2025. Compare merit, fee, location and facilities for MBBS admission.",
      excerpt: "Discover the top 10 government medical colleges in Pakistan for 2025, with details on merit, fee structure, location, and why they're the best choice for MBBS students.",
      content: `<h2>Why Choose Government Medical Colleges?</h2>
<p>Government medical colleges in Pakistan offer <strong>HEC-recognized MBBS degrees</strong> at a fraction of the cost of private colleges. Semester fees range from <strong>PKR 15,000–80,000</strong>, making them accessible to talented students from all backgrounds.</p>

<h2>Top 10 Government Medical Colleges</h2>

<h3>1. King Edward Medical University (KEMU) — Lahore</h3>
<p>Pakistan's oldest and most prestigious medical institution. KEMU has produced thousands of doctors over 150 years. <strong>Merit: 90%+</strong></p>

<h3>2. Dow University of Health Sciences (DUHS) — Karachi</h3>
<p>Largest medical university in Karachi with state-of-the-art facilities. Multiple campuses and hospitals. <strong>Merit: 87%+</strong></p>

<h3>3. Allama Iqbal Medical College (AIMC) — Lahore</h3>
<p>Affiliated with Jinnah Hospital, AIMC is among Punjab's top medical institutions. <strong>Merit: 88%+</strong></p>

<h3>4. Rawalpindi Medical University (RMU) — Rawalpindi</h3>
<p>Excellent faculty and research opportunities near Islamabad. <strong>Merit: 85%+</strong></p>

<h3>5. Khyber Medical College — Peshawar</h3>
<p>KPK's premier medical institution with strong clinical training. <strong>Merit: 84%+</strong></p>

<h3>6. Services Institute of Medical Sciences (SIMS) — Lahore</h3>
<p>Affiliated with Services Hospital, strong in clinical rotations. <strong>Merit: 86%+</strong></p>

<h3>7. Bolan Medical College — Quetta</h3>
<p>Only public medical college in Balochistan. Merit criteria more accessible. <strong>Merit: 78%+</strong></p>

<h3>8. Nishtar Medical University — Multan</h3>
<p>Southern Punjab's top medical institution with excellent faculty. <strong>Merit: 83%+</strong></p>

<h3>9. Liaquat University of Medical and Health Sciences (LUMHS) — Jamshoro</h3>
<p>Sindh's premier public medical university outside Karachi. <strong>Merit: 81%+</strong></p>

<h3>10. Fatima Jinnah Medical University (FJMU) — Lahore</h3>
<p>Women's medical university with excellent reputation and facilities. <strong>Merit: 87%+</strong></p>

<h2>Compare All Medical Universities</h2>
<p>Use the <a href="/compare">Rahbars Compare Tool</a> to side-by-side compare fees, merit, and facilities of any two universities.</p>`
    },
    {
      title: "NED University Admission 2025 — Merit, Fee Structure and Programs",
      category: "University Reviews",
      coverColor: "#FFF7ED",
      tags: ["NED University", "engineering admission", "Karachi universities"],
      keywords: ["NED university admission 2025", "NED merit 2025", "NED fee structure", "engineering admission karachi", "NED programs"],
      readTime: 6,
      seoTitle: "NED University Admission 2025 — Merit, Fee, Programs Guide",
      seoDescription: "Complete NED University Karachi admission 2025 guide — ECAT requirement, department-wise merit, fee structure, and how to apply.",
      excerpt: "Everything you need to know about NED University Karachi admission 2025: ECAT requirement, merit per department, fee structure, and step-by-step application process.",
      content: `<h2>About NED University</h2>
<p><strong>NED University of Engineering and Technology</strong> is Karachi's premier engineering university, established in 1922. It is HEC recognized and offers programs in Engineering, Computing, Architecture, and Management.</p>

<h2>Admission Requirements 2025</h2>
<ul>
  <li><strong>Qualification:</strong> FSc Pre-Engineering with minimum 60%</li>
  <li><strong>Entry Test:</strong> ECAT (Engineering College Admission Test) — mandatory</li>
  <li><strong>Aggregate Formula:</strong> Matric 10% + FSc 40% + ECAT 50%</li>
</ul>

<h2>Popular Programs & Last Merit</h2>
<table>
  <tr><th>Department</th><th>Last Merit (2024)</th><th>Seats</th></tr>
  <tr><td>Computer Science</td><td>82.5%</td><td>120</td></tr>
  <tr><td>Software Engineering</td><td>80.2%</td><td>80</td></tr>
  <tr><td>Electrical Engineering</td><td>78.4%</td><td>100</td></tr>
  <tr><td>Civil Engineering</td><td>75.6%</td><td>100</td></tr>
  <tr><td>Mechanical Engineering</td><td>76.8%</td><td>100</td></tr>
  <tr><td>Architecture</td><td>72.3%</td><td>60</td></tr>
</table>

<h2>Fee Structure 2025</h2>
<p>NED is a <strong>government university</strong> with very affordable fees:</p>
<ul>
  <li>Semester Fee: <strong>PKR 25,000 – 45,000</strong></li>
  <li>Admission Fee: <strong>PKR 10,000</strong></li>
</ul>

<h2>How to Apply</h2>
<ol>
  <li>Register on <strong>ned.edu.pk</strong> portal</li>
  <li>Apply for ECAT via University of Engineering & Technology</li>
  <li>Submit aggregate form after ECAT result</li>
  <li>Merit list announced within 2 weeks of deadline</li>
</ol>

<p><strong>Calculate your NED aggregate</strong> right now using <a href="/merit-calculator?uni=ned-university">Rahbars Merit Calculator</a>.</p>`
    },
    {
      title: "FAST-NUCES Admission 2025 — Programs, Merit and How to Apply",
      category: "University Reviews",
      coverColor: "#F5F3FF",
      tags: ["FAST university", "NUCES", "CS admission", "NAT test"],
      keywords: ["FAST university admission 2025", "FAST NUCES merit", "NAT test FAST", "NUCES Karachi admission", "FAST CS program"],
      readTime: 7,
      seoTitle: "FAST-NUCES Admission 2025 — Programs, Merit & Application Guide",
      seoDescription: "Complete guide to FAST-NUCES university admission 2025. Learn about NAT test, NU test, campus-wise merit, fee structure, and application process.",
      excerpt: "Complete FAST-NUCES admission guide for 2025 — covering NAT/NU entry test, all campus details, department-wise merit lists, scholarships, and application steps.",
      content: `<h2>About FAST-NUCES</h2>
<p><strong>FAST National University of Computer and Emerging Sciences (NUCES)</strong> is Pakistan's top technology university. It has campuses in Karachi, Lahore, Islamabad, Peshawar, and Chiniot-Faisalabad.</p>

<h2>Admission Requirements 2025</h2>
<ul>
  <li>FSc Pre-Engineering or Pre-Medical (for CS/Bioinformatics)</li>
  <li>Entry Test: <strong>NU Test</strong> (own test) or <strong>NAT-IE</strong></li>
  <li>Admission based 100% on FAST's own test score</li>
</ul>

<h2>Programs Offered</h2>
<ul>
  <li>BS Computer Science (CS)</li>
  <li>BS Software Engineering (SE)</li>
  <li>BS Artificial Intelligence (AI)</li>
  <li>BS Data Science</li>
  <li>BS Electrical Engineering</li>
  <li>BS Business Administration (BBA)</li>
</ul>

<h2>Merit & Fee (Karachi Campus 2024)</h2>
<p>FAST does not release traditional merit %. Selection is based purely on NU test performance:</p>
<ul>
  <li>CS — Test Score: <strong>80th percentile+</strong></li>
  <li>Semester Fee: <strong>PKR 75,000 – 95,000</strong></li>
  <li>Merit scholarships available for top scorers</li>
</ul>

<h2>FAST Scholarship Options</h2>
<ul>
  <li><strong>100% Fee Waiver:</strong> Top 3 students per batch</li>
  <li><strong>50% Fee Waiver:</strong> Students with 90th percentile+ score</li>
  <li><strong>Need-Based:</strong> Application via Student Financial Aid Office</li>
</ul>

<h2>How to Apply</h2>
<ol>
  <li>Register at <strong>admission.nu.edu.pk</strong></li>
  <li>Select campus and program</li>
  <li>Appear for NU test (online or in-person)</li>
  <li>Results and merit within 2 weeks</li>
</ol>`
    },
    {
      title: "How to Get a Scholarship in Pakistani Universities — Complete Guide 2025",
      category: "Scholarships",
      coverColor: "#FEFCE8",
      tags: ["scholarship", "HEC", "financial aid", "free education"],
      keywords: ["university scholarship pakistan 2025", "HEC scholarship apply", "need based scholarship", "merit scholarship pakistan", "free university pakistan"],
      readTime: 8,
      seoTitle: "How to Get a Scholarship in Pakistani Universities 2025 — Full Guide",
      seoDescription: "Complete guide to getting university scholarships in Pakistan 2025. Learn about HEC, government, and university-specific scholarships with application steps.",
      excerpt: "Discover how to get scholarships at Pakistani universities in 2025 — from HEC need-based aid to university merit awards, with step-by-step application guides.",
      content: `<h2>Types of Scholarships in Pakistan</h2>
<p>Pakistani students can access scholarships from multiple sources. Here's a complete breakdown:</p>

<h3>1. HEC Need-Based Scholarship</h3>
<p>The <strong>Higher Education Commission (HEC)</strong> offers need-based scholarships to students at all public universities. Coverage: Full or partial tuition fee waiver.</p>
<p><strong>Eligibility:</strong> Family income below PKR 45,000/month, admitted to HEC-recognized university.</p>
<p><strong>Apply at:</strong> hec.gov.pk/scholarships</p>

<h3>2. Prime Minister's Laptop Scheme</h3>
<p>Free laptops for top-performing students at public universities. Apply through your university's focal person.</p>

<h3>3. PEEF Scholarship (Punjab)</h3>
<p>Punjab Educational Endowment Fund offers scholarships to Punjab students in public universities.</p>

<h3>4. Ehsaas Undergraduate Scholarship</h3>
<p>Pakistan's largest scholarship program — 50,000 students per year. Income-based, covers full tuition + stipend.</p>

<h3>5. University Merit Scholarships</h3>
<p>Most universities offer automatic scholarships to students who score in the top 3–5% of their batch:</p>
<ul>
  <li>FAST: 100% waiver for rank 1–3</li>
  <li>Habib University: Full scholarship for exceptional students</li>
  <li>LUMS: National Outreach Program (NOP)</li>
</ul>

<h2>How to Apply (Step by Step)</h2>
<ol>
  <li>Get admission offer letter from university</li>
  <li>Collect income certificate from NADRA or local government</li>
  <li>Prepare domicile certificate</li>
  <li>Submit online application on HEC portal</li>
  <li>Attach: Matric/FSc marks, admission letter, income proof, B-form/CNIC</li>
  <li>Follow up with university scholarship office</li>
</ol>

<h2>Key Deadlines</h2>
<p>Most scholarships have September–October deadlines. Apply within 30 days of getting admission. Don't delay!</p>

<p><strong>Tip:</strong> Apply to multiple scholarships simultaneously — you can receive only one, but applying to all increases your chances.</p>`
    },
    {
      title: "Complete Guide to Software Engineering Admission in Pakistan 2025",
      category: "Admission Guide",
      coverColor: "#F0F9FF",
      tags: ["software engineering", "CS admission", "programming", "IT universities"],
      keywords: ["software engineering universities pakistan", "SE admission 2025", "best CS universities karachi", "software engineering merit pakistan"],
      readTime: 7,
      seoTitle: "Software Engineering Admission Pakistan 2025 — Best Universities Guide",
      seoDescription: "Top universities for software engineering in Pakistan 2025 with merit, fee, and programs. Complete admission guide for SE aspirants.",
      excerpt: "Complete guide to software engineering admission in Pakistan for 2025 — top universities, merit lists, entry test requirements, and career scope.",
      content: `<h2>Why Software Engineering in Pakistan?</h2>
<p>Pakistan's IT exports reached <strong>$2.6 billion in 2024</strong> and are growing rapidly. Software engineers are among the highest-paid professionals with excellent remote work and freelancing opportunities.</p>

<h2>Top SE Universities in Pakistan</h2>

<h3>Government Universities</h3>
<ul>
  <li><strong>NED University:</strong> Best for Karachi — Merit 80%+, Fee PKR 25,000/sem</li>
  <li><strong>FAST-NUCES:</strong> Best overall — merit-based, Fee PKR 90,000/sem</li>
  <li><strong>NUST:</strong> Islamabad's top — NET test required, Fee PKR 50,000/sem</li>
  <li><strong>UET Lahore:</strong> Punjab's best engineering — ECAT required</li>
</ul>

<h3>Private Universities</h3>
<ul>
  <li><strong>Habib University:</strong> Karachi — unique liberal arts approach, scholarship-heavy</li>
  <li><strong>IBA Karachi:</strong> Computing & Information Systems — strong industry links</li>
  <li><strong>Bahria University:</strong> Multiple campuses, moderate fees</li>
</ul>

<h2>Entry Test Requirements</h2>
<ul>
  <li>ECAT — for most government engineering universities</li>
  <li>NU Test / NAT-IE — for FAST-NUCES</li>
  <li>NET — for NUST</li>
  <li>Own test — for IBA, Habib</li>
</ul>

<h2>Career Scope After SE Degree</h2>
<ul>
  <li>Starting salary: <strong>PKR 60,000–120,000/month</strong></li>
  <li>Senior developer: <strong>PKR 200,000–500,000+</strong></li>
  <li>Freelance (Upwork/Fiverr): $20–80/hour</li>
  <li>International jobs: UAE, UK, Canada demand Pakistani developers</li>
</ul>`
    },
    {
      title: "University Admission Documents Checklist — What You Need in Pakistan",
      category: "Admission Guide",
      coverColor: "#FFF7ED",
      tags: ["admission documents", "checklist", "university application"],
      keywords: ["university admission documents pakistan", "what documents needed for admission", "admission checklist 2025", "university application requirements pakistan"],
      readTime: 5,
      seoTitle: "University Admission Documents Checklist Pakistan 2025",
      seoDescription: "Complete checklist of documents required for university admission in Pakistan 2025. Never miss a document with this comprehensive guide.",
      excerpt: "Never get rejected for missing documents. Here's the complete checklist of documents required for university admission in Pakistan 2025 — with tips to prepare each one.",
      content: `<h2>Why Documents Matter</h2>
<p>Every year, hundreds of students lose admission seats because of <strong>missing or incorrect documents</strong>. This checklist ensures you're fully prepared before the deadline.</p>

<h2>Standard Documents Required (All Universities)</h2>
<ol>
  <li>✅ <strong>Matric Certificate + Detailed Marks Sheet (DMC)</strong></li>
  <li>✅ <strong>FSc/A-Level Certificate + DMC</strong></li>
  <li>✅ <strong>Entry Test Score Card</strong> (MDCAT/ECAT/NAT etc.)</li>
  <li>✅ <strong>National ID Card (CNIC)</strong> — or B-Form if under 18</li>
  <li>✅ <strong>Domicile Certificate</strong> — must match province of university</li>
  <li>✅ <strong>Passport-size photographs</strong> — usually 4–6 copies</li>
  <li>✅ <strong>Character Certificate</strong> — from previous school/college</li>
  <li>✅ <strong>Migration Certificate</strong> — if switching province/board</li>
</ol>

<h2>For Medical Colleges (Additional)</h2>
<ul>
  <li>PMC Registration Form</li>
  <li>MDCAT Result Card with roll number</li>
  <li>Affidavit (for some provinces)</li>
</ul>

<h2>For Scholarship Applications (Additional)</h2>
<ul>
  <li>Income Certificate (from Union Council or NADRA)</li>
  <li>Utility Bills (electricity/gas — last 3 months)</li>
  <li>Property ownership documents (if applicable)</li>
</ul>

<h2>Document Preparation Tips</h2>
<ol>
  <li><strong>Compress document scans</strong> to meet upload size limits — use <a href="/document-tools">Rahbars Document Compressor</a></li>
  <li>Make <strong>10 photocopies</strong> of everything — you'll need them at multiple offices</li>
  <li>Get documents <strong>attested by a Gazetted Officer</strong> (usually required)</li>
  <li>Carry originals to the university — they verify on the day of admission</li>
</ol>

<p><strong>Pro tip:</strong> Create a folder (physical + digital) with all documents ready 2 weeks before admission date.</p>`
    },
    {
      title: "NUST Admission 2025 — NET Test, Aggregate Formula and All Programs",
      category: "University Reviews",
      coverColor: "#F0F4FF",
      tags: ["NUST", "NET test", "engineering admission", "Islamabad universities"],
      keywords: ["NUST admission 2025", "NET test NUST", "NUST aggregate formula", "NUST Islamabad programs", "best engineering university pakistan"],
      readTime: 7,
      seoTitle: "NUST Admission 2025 — NET Test Guide, Aggregate Formula & Programs",
      seoDescription: "Complete NUST Islamabad admission guide for 2025. Learn about the NET entry test, aggregate calculation, program-wise merit, and fee structure.",
      excerpt: "Everything about NUST Islamabad admission 2025 — the NET test format, aggregate formula, program-wise merit lists, scholarship options, and how to apply.",
      content: `<h2>About NUST</h2>
<p><strong>National University of Sciences and Technology (NUST)</strong> consistently ranks as Pakistan's #1 engineering university. Located in Islamabad (H-12 sector), it has world-class labs, research centers, and industry partnerships.</p>

<h2>NUST NET Entry Test 2025</h2>
<p>NUST conducts its own entry test called <strong>NET (NUST Entry Test)</strong>. It is held 3 times a year:</p>
<ul>
  <li>NET-1: February/March</li>
  <li>NET-2: June/July</li>
  <li>NET-3: August/September</li>
</ul>
<p>The <strong>best score</strong> from all attempts is used for admission.</p>

<h2>NET Test Format</h2>
<ul>
  <li>Total Questions: 200</li>
  <li>Subjects: Mathematics (80), Physics (60), Chemistry (60), English (20), Intelligence (20) — for engineering</li>
  <li>Duration: 3 hours</li>
  <li>No negative marking</li>
</ul>

<h2>Aggregate Formula</h2>
<p>NUST aggregate = Matric 10% + FSc 15% + NET 75%</p>
<p>This means <strong>75% weight</strong> is on your NET score — focus there!</p>

<h2>Top Programs (Last Merit 2024)</h2>
<ul>
  <li><strong>Computer Engineering:</strong> 87%</li>
  <li><strong>Electrical Engineering:</strong> 84%</li>
  <li><strong>Software Engineering:</strong> 86%</li>
  <li><strong>Mechanical Engineering:</strong> 81%</li>
  <li><strong>Civil Engineering:</strong> 78%</li>
  <li><strong>Aerospace Engineering:</strong> 82%</li>
</ul>

<h2>Fee Structure</h2>
<ul>
  <li>Semester Fee: PKR 55,000–75,000</li>
  <li>Hostel: Available on campus</li>
  <li>Need-based and merit scholarships available</li>
</ul>`
    },
    {
      title: "University of Karachi (KU) Admission 2025 — Complete Guide",
      category: "University Reviews",
      coverColor: "#FDF2F8",
      tags: ["KU admission", "Karachi University", "arts sciences admission"],
      keywords: ["karachi university admission 2025", "KU merit 2025", "university of karachi programs", "KU fee structure", "NTS admission karachi"],
      readTime: 6,
      seoTitle: "University of Karachi Admission 2025 — KU Complete Admission Guide",
      seoDescription: "Complete University of Karachi (KU) admission guide 2025. Programs, merit criteria, NTS test requirement, fee structure and step-by-step application process.",
      excerpt: "Complete guide to University of Karachi (KU) admission 2025 covering all programs, NTS entry test requirement, merit criteria, and application process.",
      content: `<h2>About University of Karachi</h2>
<p>The <strong>University of Karachi (KU)</strong>, established in 1951, is one of Pakistan's largest public universities. It offers programs in Arts, Sciences, Commerce, Law, Pharmacy, Engineering, and more across 60+ departments.</p>

<h2>Admission Requirements 2025</h2>
<ul>
  <li>Minimum 45–60% marks in intermediate (varies by program)</li>
  <li><strong>NTS-GAT</strong> or university's own test (varies by department)</li>
  <li>Domicile of Sindh required for provincial seats</li>
</ul>

<h2>Aggregate Formula</h2>
<p>Matric 20% + FSc 50% + NTS/Admission Test 30%</p>

<h2>Popular Programs (2025)</h2>
<ul>
  <li>BS Computer Science — Merit: 72%</li>
  <li>B.Com / BBA — Merit: 65%</li>
  <li>MBBS (affiliated colleges) — Merit: 85%+</li>
  <li>Pharm-D — Merit: 76%</li>
  <li>BS Chemistry/Physics/Biology — Merit: 60%</li>
  <li>LLB (Law) — Merit: 63%</li>
</ul>

<h2>Fee Structure</h2>
<p>KU is known for extremely affordable education:</p>
<ul>
  <li>Annual Fee: PKR 15,000–35,000 (depends on program)</li>
  <li>One of the most affordable universities in Pakistan</li>
</ul>

<h2>How to Apply</h2>
<ol>
  <li>Visit <strong>uok.edu.pk</strong> admission portal</li>
  <li>Fill online form with your details</li>
  <li>Pay admission fee via challan</li>
  <li>Upload required documents</li>
  <li>Submit NTS test form separately</li>
</ol>`
    },
    {
      title: "ECAT 2025 Complete Guide — Engineering Entry Test in Pakistan",
      category: "Entry Tests",
      coverColor: "#F0FDF4",
      tags: ["ECAT", "engineering entry test", "UET admission", "engineering universities"],
      keywords: ["ECAT 2025 guide", "engineering college admission test pakistan", "ECAT syllabus 2025", "UET admission ECAT", "ECAT preparation"],
      readTime: 6,
      seoTitle: "ECAT 2025 Complete Guide — Engineering Entry Test Pakistan",
      seoDescription: "Complete ECAT 2025 preparation guide for Pakistan. Exam pattern, syllabus, how to register, preparation tips, and which universities accept ECAT.",
      excerpt: "Everything you need to know about ECAT 2025 — who conducts it, syllabus, exam format, how to register, and how it affects your engineering admission aggregate.",
      content: `<h2>What is ECAT?</h2>
<p><strong>ECAT (Engineering College Admission Test)</strong> is an entry test conducted by the <strong>University of Engineering and Technology (UET) Lahore</strong> for admission to engineering universities across Pakistan.</p>

<h2>Who Accepts ECAT?</h2>
<ul>
  <li>NED University (Karachi)</li>
  <li>UET Lahore and its affiliated colleges</li>
  <li>Mehran UET (Jamshoro)</li>
  <li>Dawood University of Engineering (Karachi)</li>
  <li>Many other engineering colleges in Punjab and Sindh</li>
</ul>

<h2>ECAT 2025 Exam Format</h2>
<ul>
  <li>Total Marks: <strong>400</strong></li>
  <li>Mathematics: 100 marks</li>
  <li>Physics: 100 marks</li>
  <li>Chemistry: 100 marks</li>
  <li>English: 100 marks</li>
  <li>Duration: 2 hours</li>
  <li>Format: MCQs</li>
</ul>

<h2>How to Register</h2>
<ol>
  <li>Visit <strong>ecat.uet.edu.pk</strong></li>
  <li>Create account with your matric & FSc roll numbers</li>
  <li>Pay fee via bank challan (approximately PKR 1,200)</li>
  <li>Select your preferred test center</li>
  <li>Download admit card 1 week before exam</li>
</ol>

<h2>Preparation Strategy</h2>
<ul>
  <li>Focus on FSc textbook — 80% of questions come from syllabus</li>
  <li>Solve 5+ years of ECAT past papers</li>
  <li>Mathematics: practice calculus, algebra, and geometry</li>
  <li>Physics: focus on mechanics, optics, and electricity</li>
  <li>Score 280+ for competitive programs</li>
</ul>`
    },
    {
      title: "How Closing Merit Works in Pakistani Universities — Merit Lists Explained",
      category: "Merit & Aggregate",
      coverColor: "#EFF6FF",
      tags: ["closing merit", "merit list", "aggregate", "admission chances"],
      keywords: ["closing merit pakistan universities", "how merit list works", "what is closing merit", "university merit list explained", "last merit 2024"],
      readTime: 5,
      seoTitle: "How Closing Merit Works in Pakistan Universities — Merit Lists Explained",
      seoDescription: "Understand how closing merit and merit lists work in Pakistani universities. Learn what last merit means and how to predict your chances.",
      excerpt: "Confused about closing merit and merit lists? This guide explains exactly how Pakistani university merit lists work and how to use last year's merit to predict your admission chances.",
      content: `<h2>What is Closing Merit?</h2>
<p><strong>Closing merit</strong> (also called "last merit") is the aggregate percentage of the <em>last student</em> admitted in any given program at a university in a particular academic year. If your aggregate is at or above this number, you qualify.</p>

<h2>How Merit Lists are Generated</h2>
<ol>
  <li>University collects all applications with aggregate scores</li>
  <li>Candidates are ranked from highest to lowest aggregate</li>
  <li>Top N students (based on seats available) receive admission offers</li>
  <li>The Nth student's aggregate = Closing Merit</li>
</ol>

<h2>First, Second, and Third Merit Lists</h2>
<p>Universities typically issue <strong>3 merit lists</strong>:</p>
<ul>
  <li><strong>1st Merit List:</strong> Initial offers to top candidates</li>
  <li><strong>2nd Merit List:</strong> For seats vacated by students who didn't join</li>
  <li><strong>3rd Merit List:</strong> Final seats after further withdrawals</li>
</ul>
<p>Closing merit usually <strong>decreases from 1st to 3rd</strong> list — giving late applicants a chance.</p>

<h2>Can I Predict My Chances?</h2>
<p>Yes! Use last year's closing merit as a guide:</p>
<ul>
  <li>Your aggregate > Last merit by 3%+ → <strong>Very likely admitted (1st list)</strong></li>
  <li>Your aggregate = Last merit ± 2% → <strong>Possible (2nd–3rd list)</strong></li>
  <li>Your aggregate < Last merit by 3%+ → <strong>Unlikely this year</strong></li>
</ul>

<h2>Check with Rahbars</h2>
<p>Use the <a href="/merit-calculator">Rahbars Merit Calculator</a> — select your university and department, enter your marks, and instantly see if you're likely, borderline, or unlikely to be admitted based on last year's closing merit.</p>`
    },
    {
      title: "Habib University Admission 2025 — Programs, Scholarship and Merit",
      category: "University Reviews",
      coverColor: "#FDF2F8",
      tags: ["Habib University", "liberal arts", "Karachi private university"],
      keywords: ["Habib University admission 2025", "Habib University Karachi", "liberal arts university pakistan", "Habib University scholarship", "Habib University programs"],
      readTime: 6,
      seoTitle: "Habib University Admission 2025 — Programs, Scholarship & Merit",
      seoDescription: "Complete Habib University Karachi admission guide 2025. Programs, scholarship availability, merit criteria, fee structure, and how to apply.",
      excerpt: "Habib University Karachi admission guide 2025 — Pakistan's first liberal arts university. Explore programs, generous scholarship options, and holistic admission criteria.",
      content: `<h2>About Habib University</h2>
<p><strong>Habib University</strong>, established in 2014, is Pakistan's first liberal arts and sciences university. Located in Karachi, it offers a unique interdisciplinary education model that sets it apart from traditional universities.</p>

<h2>Programs Offered</h2>
<ul>
  <li>BS Computer Science</li>
  <li>BS Electrical Engineering</li>
  <li>BS Social Development and Policy</li>
  <li>BA/BS Liberal Arts (DSSE - Science Stream, AHSS - Arts Stream)</li>
</ul>

<h2>Admission Process</h2>
<p>Habib uses a <strong>holistic admission process</strong> — not just grades:</p>
<ol>
  <li>Online application form</li>
  <li>Habib Aptitude Test (HAT) — English, Mathematics, Critical Thinking</li>
  <li>Personal essay / Statement of Purpose</li>
  <li>Interview (shortlisted candidates)</li>
  <li>Final decision based on all above</li>
</ol>

<h2>Scholarship Opportunities</h2>
<p>Habib is known for generous financial aid — over <strong>60% of students receive some form of aid:</strong></p>
<ul>
  <li><strong>Yohsin Scholarship:</strong> 100% tuition + living stipend for top students</li>
  <li><strong>Merit Scholarship:</strong> 30–75% tuition waiver</li>
  <li><strong>Need-Based Aid:</strong> Assessed via family income verification</li>
</ul>

<h2>Fee Structure 2025</h2>
<ul>
  <li>Semester Fee: PKR 200,000+ (before scholarship)</li>
  <li>After scholarship: many students pay PKR 0–50,000/semester</li>
</ul>

<h2>Is Habib Right for You?</h2>
<p>Habib is ideal if you want: small class sizes, research opportunities, interdisciplinary thinking, and a unique educational experience. If you're simply seeking the cheapest engineering degree, look elsewhere.</p>`
    },
    {
      title: "DPT vs MBBS in Pakistan — Which Should You Choose?",
      category: "Career Guide",
      coverColor: "#F0FDF4",
      tags: ["DPT", "MBBS", "career choice", "medical careers"],
      keywords: ["DPT vs MBBS pakistan", "physiotherapy vs medicine pakistan", "DPT salary pakistan", "MBBS duration pakistan", "which is better DPT MBBS"],
      readTime: 7,
      seoTitle: "DPT vs MBBS Pakistan 2025 — Which Career is Better for You?",
      seoDescription: "Comprehensive comparison of DPT and MBBS in Pakistan. Compare duration, cost, career scope, salary, and which is the right choice for your future.",
      excerpt: "Confused between DPT and MBBS? This detailed comparison covers duration, admission difficulty, fees, job market, and salary outlook to help you make the right career choice.",
      content: `<h2>Quick Comparison</h2>
<table>
  <tr><th>Factor</th><th>MBBS</th><th>DPT (Physiotherapy)</th></tr>
  <tr><td>Duration</td><td>5 years + 1 year house job</td><td>5 years</td></tr>
  <tr><td>MDCAT Required</td><td>Yes (mandatory)</td><td>Yes</td></tr>
  <tr><td>Avg Merit</td><td>85%+ (govt)</td><td>70–75%</td></tr>
  <tr><td>Govt Fee/Year</td><td>PKR 80,000–150,000</td><td>PKR 30,000–60,000</td></tr>
  <tr><td>Private Fee/Year</td><td>PKR 800,000–1,500,000</td><td>PKR 200,000–400,000</td></tr>
  <tr><td>Starting Salary</td><td>PKR 60,000–100,000</td><td>PKR 40,000–70,000</td></tr>
  <tr><td>Senior Salary</td><td>PKR 300,000+</td><td>PKR 150,000–250,000</td></tr>
</table>

<h2>Why Choose MBBS?</h2>
<ul>
  <li>Higher earning potential in long term</li>
  <li>More career pathways — specialization, research, academia</li>
  <li>High social status and job security</li>
  <li>Opportunity to work internationally</li>
</ul>

<h2>Why Choose DPT?</h2>
<ul>
  <li>Lower merit requirement — more accessible</li>
  <li>Much lower cost (especially important for families)</li>
  <li>Growing demand with sports culture and aging population</li>
  <li>Private practice is very lucrative — PKR 2,000–5,000/session</li>
  <li>Less physically and mentally demanding than MBBS</li>
</ul>

<h2>Career Opportunities for DPT</h2>
<p>Physiotherapy is <strong>one of the fastest-growing healthcare fields</strong> in Pakistan and globally. DPT graduates can work in:</p>
<ul>
  <li>Hospitals and clinics</li>
  <li>Sports rehabilitation centers</li>
  <li>Private practice</li>
  <li>Abroad — Middle East, UK, Canada actively hire Pakistani physiotherapists</li>
</ul>

<h2>Our Recommendation</h2>
<p>If you can get into government MBBS — go for it. If not, DPT is an excellent, rewarding career with great scope. Don't take a private MBBS loan of PKR 5M+ unless you have a solid financial plan.</p>`
    },
    {
      title: "Top Private Engineering Universities in Karachi 2025 — Ranked",
      category: "University Reviews",
      coverColor: "#F5F3FF",
      tags: ["private engineering universities", "Karachi", "engineering admission"],
      keywords: ["private engineering universities karachi", "best private engineering colleges karachi 2025", "engineering university ranking karachi", "private BE programs karachi"],
      readTime: 6,
      seoTitle: "Top Private Engineering Universities in Karachi 2025 — Ranked & Compared",
      seoDescription: "Ranking of top private engineering universities in Karachi 2025. Compare fee, merit, programs, accreditation, and career outcomes.",
      excerpt: "Comprehensive ranking of Karachi's top private engineering universities for 2025, comparing fee structure, accreditation, programs, and career outcomes.",
      content: `<h2>Why Consider Private Engineering?</h2>
<p>Not everyone gets into NED or NUST. Private engineering universities in Karachi offer <strong>PEC-accredited programs</strong>, industry links, and good placement — if you choose the right one.</p>

<h2>Ranking: Top Private Engineering Universities in Karachi</h2>

<h3>1. Habib University</h3>
<p>🏆 Best private engineering experience. Small batches, project-based learning, strong industry links. Programs: CS, EE. Generous scholarships available.</p>

<h3>2. IBA Karachi — Faculty of Computer Sciences</h3>
<p>Top computing programs with excellent industry placement. Less traditional engineering, more CS/IT focused.</p>

<h3>3. Aga Khan University (AKU)</h3>
<p>Medical-focused but has strong science programs. Known for research excellence and international standards.</p>

<h3>4. Bahria University Karachi</h3>
<p>Multiple engineering programs, moderate fees. PEC accredited. Good for students who need affordable private option.</p>

<h3>5. Hamdard University</h3>
<p>Strong in Engineering and Health Sciences. Affordable fees, good campus facilities.</p>

<h3>6. Sir Syed University (SSUET)</h3>
<p>Long-established, affordable private engineering university. Named after Sir Syed Ahmed Khan. Good for CS, EE, Civil.</p>

<h3>7. Indus University</h3>
<p>Architecture and Design focused. Best choice for Interior Design, Architecture programs.</p>

<h2>What to Look For</h2>
<ul>
  <li>✅ PEC Accreditation (mandatory for engineering)</li>
  <li>✅ HEC Recognized</li>
  <li>✅ Industry Partnerships & Internship Placements</li>
  <li>✅ Alumni Network Quality</li>
  <li>✅ Lab & Research Facilities</li>
</ul>`
    },
    {
      title: "LUMS Admission 2025 — Scholarship, SAT Scores and Requirements",
      category: "University Reviews",
      coverColor: "#FEFCE8",
      tags: ["LUMS", "Lahore University", "SAT", "business school"],
      keywords: ["LUMS admission 2025", "LUMS scholarship", "LUMS SAT requirement", "LUMS fee structure", "LUMS NOP program"],
      readTime: 7,
      seoTitle: "LUMS Admission 2025 — SAT Requirements, NOP Scholarship & Guide",
      seoDescription: "Complete LUMS Lahore admission guide 2025. Learn about SAT requirements, NOP scholarship for deserving students, programs, and how to apply.",
      excerpt: "Complete LUMS University Lahore admission guide for 2025 — SAT scores, NOP scholarship program, all undergraduate programs, and step-by-step application process.",
      content: `<h2>About LUMS</h2>
<p><strong>Lahore University of Management Sciences (LUMS)</strong> is Pakistan's most prestigious private university, consistently ranked among Asia's top universities. It's known for excellence in Business, Law, Computer Science, and Social Sciences.</p>

<h2>Programs Offered</h2>
<ul>
  <li>BS Computer Science (School of Science & Engineering)</li>
  <li>BS Electrical Engineering</li>
  <li>BBA/BS Accounting & Finance (Suleman Dawood School)</li>
  <li>BS Economics</li>
  <li>BS Law</li>
  <li>BS Social Sciences</li>
  <li>BSBA (Business Administration)</li>
</ul>

<h2>Admission Requirements</h2>
<ul>
  <li>A-Levels or FSc with strong grades</li>
  <li><strong>SAT (optional but highly recommended)</strong> — 1300+ for competitive programs</li>
  <li>LUMS Own Test (LAT) if no SAT</li>
  <li>Personal essays and extracurricular profile</li>
</ul>

<h2>National Outreach Program (NOP)</h2>
<p>LUMS NOP is one of Pakistan's most generous scholarship programs:</p>
<ul>
  <li>Full scholarship (tuition + housing + meals + books)</li>
  <li>For students from families earning less than PKR 45,000/month</li>
  <li>Highly competitive — 200–300 seats nationally</li>
  <li>Apply via LUMS website in January–February</li>
</ul>

<h2>Regular Fee Structure</h2>
<ul>
  <li>Semester Fee: PKR 300,000–380,000</li>
  <li>4-year total: PKR 2.4M–3M (before financial aid)</li>
  <li>Merit scholarships available: 25–75% fee waiver</li>
</ul>

<h2>Is LUMS Worth the Cost?</h2>
<p>LUMS graduates consistently command <strong>top salaries</strong> in Pakistan and internationally. MNC starting packages: PKR 150,000–250,000/month. For NOP scholars — it's 100% worth it.</p>`
    },
    {
      title: "Gap Year After FSc in Pakistan — Options, Risks and What To Do",
      category: "Career Guide",
      coverColor: "#FFF7ED",
      tags: ["gap year", "FSc", "re-attempt MDCAT", "career planning"],
      keywords: ["gap year after FSc pakistan", "what to do after FSc if not admitted", "retake MDCAT gap year", "FSc gap year options pakistan"],
      readTime: 6,
      seoTitle: "Gap Year After FSc in Pakistan — Options, Risks & Smart Strategies",
      seoDescription: "Should you take a gap year after FSc in Pakistan? Explore all options — retaking entry tests, overseas studies, short courses, and how to use the year productively.",
      excerpt: "Didn't get into your desired university after FSc? Here's a complete guide to gap year options in Pakistan — from retaking MDCAT to online certifications and overseas study.",
      content: `<h2>Is a Gap Year Normal in Pakistan?</h2>
<p>Yes — thousands of Pakistani students take a gap year each year. It's completely acceptable and often the <strong>smartest decision</strong> if done productively. Many DUHS, NUST, and LUMS students spent a year improving before finally getting in.</p>

<h2>Why Students Take a Gap Year</h2>
<ul>
  <li>Didn't get the desired university or program</li>
  <li>Entry test score wasn't competitive enough</li>
  <li>Want to retake MDCAT/ECAT with better preparation</li>
  <li>Waiting for a specific university's admission cycle</li>
  <li>Need time to figure out career direction</li>
</ul>

<h2>Productive Gap Year Options</h2>

<h3>1. Retake Entry Tests</h3>
<p>Most students use the gap year to retake MDCAT or ECAT. With a full year of preparation, most students improve their score by <strong>15–30 points</strong>.</p>

<h3>2. Short Courses & Certifications</h3>
<ul>
  <li>Coursera / edX online courses (CS, Data Science, Business)</li>
  <li>Google IT Support Certificate</li>
  <li>Programming bootcamps</li>
  <li>Freelancing (Fiverr, Upwork) — earn while you prepare</li>
</ul>

<h3>3. Foundation Programs</h3>
<p>Some students do A-Levels after FSc to improve their profile for LUMS, AKU, or overseas applications.</p>

<h3>4. Consider Alternate Programs</h3>
<p>If you didn't get MBBS, consider DPT, Pharm-D, BS Nutrition, or Biotechnology — all have excellent scope.</p>

<h2>How to Explain a Gap Year</h2>
<p>Be honest in future applications and interviews. Universities understand gap years. Just explain what you did productively during that time.</p>

<p><strong>Tip:</strong> Use <a href="/find-university">Rahbars University Finder</a> to discover programs you might not have considered — there are excellent opportunities beyond the obvious choices.</p>`
    },
    {
      title: "Pharm-D Admission 2025 — Universities, Merit and Career Scope",
      category: "Admission Guide",
      coverColor: "#F0FDF4",
      tags: ["Pharm-D", "pharmacy admission", "pharmaceutical sciences"],
      keywords: ["PharmD admission pakistan 2025", "pharmacy universities pakistan", "Pharm-D merit 2025", "pharmaceutical sciences admission", "pharmacist salary pakistan"],
      readTime: 6,
      seoTitle: "Pharm-D Admission Pakistan 2025 — Universities, Merit & Career Guide",
      seoDescription: "Complete Pharm-D admission guide for Pakistan 2025. Top pharmacy universities, merit requirements, program duration, fee structure, and pharmacist career scope.",
      excerpt: "Complete Pharm-D admission guide for 2025 — top universities in Karachi and across Pakistan, merit requirements, 5-year program breakdown, and excellent career prospects.",
      content: `<h2>What is Pharm-D?</h2>
<p><strong>Doctor of Pharmacy (Pharm-D)</strong> is a 5-year professional degree in Pakistan. Graduates are registered as pharmacists and can work in hospitals, pharmaceutical companies, regulatory agencies, and academia.</p>

<h2>Top Pharm-D Universities in Pakistan</h2>

<h3>Government Universities</h3>
<ul>
  <li><strong>University of Karachi (Pharmacy Dept.):</strong> Merit 76%</li>
  <li><strong>University of the Punjab, Lahore:</strong> Merit 78%</li>
  <li><strong>Quaid-i-Azam University, Islamabad:</strong> Merit 75%</li>
  <li><strong>Dow University (DUHS):</strong> Merit 74%</li>
</ul>

<h3>Private Universities</h3>
<ul>
  <li>Aga Khan University (highly competitive)</li>
  <li>Hamdard University (affordable, good reputation)</li>
  <li>Ziauddin University</li>
  <li>SZABMU (Islamabad)</li>
</ul>

<h2>Admission Requirements</h2>
<ul>
  <li>FSc Pre-Medical with minimum 60% marks</li>
  <li>MDCAT score (for most universities)</li>
  <li>Aggregate: Matric 10% + FSc 40% + MDCAT 50%</li>
</ul>

<h2>Career Scope for Pharm-D in 2025</h2>
<ul>
  <li><strong>Hospital Pharmacist:</strong> PKR 50,000–100,000/month</li>
  <li><strong>Pharmaceutical Industry:</strong> PKR 60,000–150,000/month (Medical Rep, QA, Production)</li>
  <li><strong>Regulatory Affairs (DRAP):</strong> Government sector jobs</li>
  <li><strong>Abroad:</strong> USA, Canada, UK have growing demand for Pakistani pharmacists</li>
  <li><strong>Own Pharmacy:</strong> Very profitable — monthly profit PKR 200,000–500,000</li>
</ul>

<h2>Pharm-D vs MBBS vs DPT</h2>
<p>Pharm-D is an excellent middle ground: easier to get in than MBBS, better career scope than many other science programs, and very lucrative in private practice.</p>`
    },
    {
      title: "HEC Need-Based Scholarship — Step-by-Step Application Guide 2025",
      category: "Scholarships",
      coverColor: "#FEFCE8",
      tags: ["HEC scholarship", "need-based aid", "free university education"],
      keywords: ["HEC need based scholarship application 2025", "how to apply HEC scholarship", "HEC scholarship documents", "free education pakistan HEC"],
      readTime: 7,
      seoTitle: "HEC Need-Based Scholarship Application Guide 2025 — Step by Step",
      seoDescription: "How to apply for HEC Need-Based Scholarship in Pakistan 2025. Step-by-step guide with required documents, eligibility criteria, and insider tips.",
      excerpt: "Step-by-step guide to applying for the HEC Need-Based Scholarship 2025 — eligibility criteria, required documents, application process, and tips to maximize your chances.",
      content: `<h2>About HEC Need-Based Scholarship</h2>
<p>The <strong>Higher Education Commission (HEC)</strong> offers need-based scholarships to deserving students at all public sector universities in Pakistan. This is the most widely available scholarship in the country.</p>

<h2>Eligibility Criteria</h2>
<ul>
  <li>Enrolled in a public sector university (HEC recognized)</li>
  <li>Family monthly income: <strong>less than PKR 45,000</strong></li>
  <li>First year or ongoing students (renewable annually)</li>
  <li>No full scholarship from any other source</li>
  <li>Minimum CGPA maintained (varies by university)</li>
</ul>

<h2>What the Scholarship Covers</h2>
<ul>
  <li>Full or partial tuition fee waiver (up to 100%)</li>
  <li>Some programs include stipend (PKR 3,000–5,000/month)</li>
</ul>

<h2>Required Documents</h2>
<ol>
  <li>✅ Completed HEC online application form</li>
  <li>✅ Family income certificate (from Union Council or NADRA)</li>
  <li>✅ CNIC of student + both parents</li>
  <li>✅ Recent utility bills (3 months)</li>
  <li>✅ Property/house ownership document or rental agreement</li>
  <li>✅ Matric + FSc mark sheets</li>
  <li>✅ Admission offer letter from university</li>
  <li>✅ 2 passport-size photographs</li>
</ol>

<h2>Application Process</h2>
<ol>
  <li>Go to <strong>hec.gov.pk → Scholarships → Need-Based</strong></li>
  <li>Create student account with CNIC</li>
  <li>Fill form carefully — every field must match your documents</li>
  <li>Upload scanned copies of all documents</li>
  <li>Submit to your university scholarship coordinator</li>
  <li>University verifies and forwards to HEC</li>
  <li>Result announced in 4–6 weeks</li>
</ol>

<h2>Tips to Maximize Approval Chances</h2>
<ul>
  <li>Apply in the <strong>first week</strong> — there are limited seats</li>
  <li>Make sure income certificate is notarized or signed by UC chairman</li>
  <li>Get documents compressed to correct size — use <a href="/document-tools">Rahbars Document Compressor</a></li>
  <li>Follow up with your university's student affairs office regularly</li>
</ul>`
    },
    {
      title: "Arts Students University Admission Guide — Pakistan 2025",
      category: "Admission Guide",
      coverColor: "#FFF1F2",
      tags: ["arts students", "humanities", "commerce admission", "FA FSc Arts"],
      keywords: ["university admission after FA pakistan", "arts students university options", "humanities programs pakistan 2025", "after FA which university", "FA students admission guide"],
      readTime: 6,
      seoTitle: "University Admission for Arts Students in Pakistan 2025 — Full Guide",
      seoDescription: "Complete university admission guide for FA and FSc Arts students in Pakistan 2025. Discover programs, universities, career options, and how to apply.",
      excerpt: "FA/FSc Arts students guide to university admission in Pakistan 2025 — best programs, universities, career paths, and how to secure admission without science background.",
      content: `<h2>You Have More Options Than You Think</h2>
<p>Many FA and Arts students believe their university options are limited. This couldn't be more wrong. Arts students can pursue <strong>exciting, well-paying careers</strong> through multiple programs.</p>

<h2>Programs Available to FA/FSc Arts Students</h2>

<h3>Business & Commerce</h3>
<ul>
  <li>BBA — Bachelor of Business Administration (Best for career)</li>
  <li>B.Com — Bachelor of Commerce</li>
  <li>BS Accounting & Finance</li>
  <li>BS Economics</li>
</ul>

<h3>Social Sciences</h3>
<ul>
  <li>BS Psychology — High demand, great career</li>
  <li>BS Political Science</li>
  <li>BS Sociology</li>
  <li>BS Mass Communication / Media Studies</li>
</ul>

<h3>Law</h3>
<ul>
  <li>LLB (5-year) — After FA directly</li>
  <li>LLB (3-year) — After any graduation</li>
</ul>

<h3>IT (If you have Maths)</h3>
<ul>
  <li>BS Information Technology — Many universities accept FSc Arts with Math</li>
  <li>BBA (IT) programs</li>
</ul>

<h3>Creative Fields</h3>
<ul>
  <li>BS Fine Arts / Visual Arts</li>
  <li>BS Interior Design</li>
  <li>BS Fashion Design</li>
</ul>

<h2>Top Universities for Arts Programs</h2>
<ul>
  <li><strong>IBA Karachi</strong> — BBA, BS Accounting (very competitive)</li>
  <li><strong>University of Karachi</strong> — All arts programs</li>
  <li><strong>LUMS</strong> — Humanities, Social Sciences, Law</li>
  <li><strong>Aga Khan University (AKU-IED)</strong> — Education programs</li>
</ul>

<h2>Career Scope for Arts Graduates</h2>
<p>Business (BBA/MBA): PKR 60,000–200,000/month in MNCs. Law: PKR 80,000–300,000/month after 5 years. Psychology: growing demand in corporate HR and mental health.</p>

<p>Use <a href="/find-university">Rahbars Smart University Finder</a> to discover programs that match your FA grades and interests.</p>`
    },
  ];

  // Delete existing seeded blogs (to avoid duplicates)
  await Blog.deleteMany({ tags: { $in: ["aggregate formula", "MDCAT 2025", "medical colleges", "NED University", "FAST university", "scholarship", "software engineering", "admission documents", "NUST", "KU admission", "ECAT", "closing merit", "Habib University", "DPT", "private engineering universities", "LUMS", "gap year", "Pharm-D", "HEC scholarship", "arts students"] } });

  const created = [];
  for (const b of BLOGS) {
    const slug = slugify(b.title, { lower: true, strict: true });
    const existing = await Blog.findOne({ slug });
    if (!existing) {
      const blog = await Blog.create({
        ...b,
        slug,
        author: adminUser._id,
        status: "published",
        readTime: b.readTime || 5,
      });
      created.push(blog.title);
    }
  }

  res.json({ message: `Seeded ${created.length} blogs`, blogs: created });
};

// ─── GET /api/blogs/trending-topics ─────────────────────────────────────────
const getTrendingTopics = async (req, res) => {
  // Curated trending Pakistani education topics (updated for 2025)
  const topics = [
    { title: "MDCAT 2025 Registration Dates and Complete Guide", category: "Entry Tests", hot: true },
    { title: "ECAT 2025 Engineering Entry Test — Everything You Need", category: "Entry Tests", hot: true },
    { title: "NUST Merit 2025 — Closing Merit List for All Departments", category: "Merit & Aggregate", hot: true },
    { title: "FAST University CS Admission 2025 — Eligibility, Dates and Merit", category: "University Reviews", hot: false },
    { title: "How to Apply for HEC Scholarship 2025 — Step by Step", category: "Scholarships", hot: true },
    { title: "Top 10 Medical Colleges in Pakistan 2025 — Rankings and Merit", category: "University Reviews", hot: false },
    { title: "Dow University MBBS Admission 2025 — Merit, Fee and Eligibility", category: "University Reviews", hot: true },
    { title: "Aggregate Formula for NED University 2025 — Calculate Now", category: "Merit & Aggregate", hot: false },
    { title: "LUMS Admission 2025 — NCA Test, Fee and Departments", category: "University Reviews", hot: false },
    { title: "Best Software Engineering Universities in Pakistan 2025", category: "University Reviews", hot: true },
    { title: "AGA Khan Medical College Admission 2025 — Complete Guide", category: "University Reviews", hot: false },
    { title: "Gap Year After FSc in Pakistan — What To Do Next", category: "Admission Guide", hot: false },
    { title: "Pharm-D Admission 2025 in Pakistan — Universities and Merit", category: "Admission Guide", hot: false },
    { title: "UHS MBBS Merit List 2025 — How to Check and What to Expect", category: "Merit & Aggregate", hot: true },
    { title: "Documents Required for University Admission in Pakistan 2025", category: "Admission Guide", hot: false },
    { title: "PIEAS Admission 2025 — Nuclear Engineering Merit and Test", category: "Entry Tests", hot: false },
    { title: "COMSATS University Admission 2025 — All Campuses and Merit", category: "University Reviews", hot: false },
    { title: "BDS Admission 2025 Pakistan — Complete Universities List", category: "Admission Guide", hot: true },
    { title: "How to Prepare for NUMS Entry Test 2025 — Army Medical College", category: "Entry Tests", hot: false },
    { title: "DPT Admission 2025 Pakistan — Fee, Merit and Top Universities", category: "Admission Guide", hot: false },
  ];
  res.json({ topics });
};

// ─── POST /api/blogs/ai-generate ────────────────────────────────────────────
const aiGenerateBlog = async (req, res) => {
  const { title, category, keywords, additionalContext } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const Groq = require("groq-sdk");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert Pakistani educational content writer for Rahbars.com — Pakistan's #1 free university admission guide.

Write a comprehensive, SEO-optimized blog article with the following details:
- Title: "${title}"
- Category: "${category || "Admission Guide"}"
- Target keywords: ${keywords || title}
${additionalContext ? `- Additional context: ${additionalContext}` : ""}

IMPORTANT REQUIREMENTS:
1. Write in English (professional but easy to understand for Pakistani FSc students)
2. Article length: 1500-2000 words minimum
3. Cover ALL subtopics thoroughly (dates, eligibility, merit, fee, process, tips)
4. Include internal links like: <a href="/merit-calculator">Rahbars Aggregate Calculator</a> and <a href="/find-university">Smart University Finder</a>
5. Use proper HTML formatting: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <table> where appropriate
6. Add a "Key Takeaways" section at the top as a <ul> list
7. End with a strong conclusion encouraging students to use Rahbars tools
8. Make the content factually accurate for Pakistan 2025

Return ONLY a valid JSON object with these exact fields (absolutely no markdown, no code blocks, no extra text outside the JSON):
{
  "content": "<full HTML article content here>",
  "excerpt": "One compelling sentence summary (max 160 chars)",
  "seoTitle": "SEO optimized title (max 60 chars)",
  "seoDescription": "Meta description (max 155 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "readTime": 8,
  "faqs": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"},
    {"question": "FAQ question 4?", "answer": "Detailed answer 4"},
    {"question": "FAQ question 5?", "answer": "Detailed answer 5"}
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });

  let text = completion.choices[0]?.message?.content?.trim() || "";

  // Strip markdown code blocks if present
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  // Extract JSON if there's extra text around it
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) text = jsonMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return res.status(500).json({ message: "AI response parsing failed. Please try again.", raw: text.substring(0, 300) });
  }

  res.json({
    success: true,
    generated: {
      title,
      category: category || "Admission Guide",
      ...parsed
    }
  });
};

// ─── PUT /api/blogs/:id/approve ──────────────────────────────────────────────
const approveBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  blog.status = "published";
  await blog.save();
  res.json({ message: "Blog approved and published!", blog });
};

// ─── PUT /api/blogs/:id/reject ───────────────────────────────────────────────
const rejectBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  blog.status = "draft";
  await blog.save();
  res.json({ message: "Blog moved back to draft", blog });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, seedBlogs, getTrendingTopics, aiGenerateBlog, approveBlog, rejectBlog };


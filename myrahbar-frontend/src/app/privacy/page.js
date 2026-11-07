export const metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of Rahbars and how we protect student data.",
  alternates: { canonical: "https://www.rahbars.com/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated:</strong> November 2026</p>
      <p>Rahbars (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website <a href="https://www.rahbars.com">www.rahbars.com</a>. This page informs you of our policies regarding the collection, use, and disclosure of personal information.</p>
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Account Information:</strong> Name, email, and password when you register</li>
        <li><strong>Usage Data:</strong> Pages visited, features used, browser type</li>
        <li><strong>Academic Data:</strong> Marks and preferences entered in calculators (stored locally)</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our services</li>
        <li>To personalize university recommendations</li>
        <li>To send important admission deadline alerts</li>
        <li>To improve our platform based on usage patterns</li>
      </ul>
      <h2>Data Security</h2>
      <p>We implement industry-standard security measures. Your data is encrypted in transit and at rest.</p>
      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:farooqrahi828@gmail.com">farooqrahi828@gmail.com</a>.</p>
    </div>
  );
}

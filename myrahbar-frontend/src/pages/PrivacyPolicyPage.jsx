import { Helmet } from "react-helmet-async";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Rahbars</title>
        <meta name="description" content="Privacy Policy for Rahbars." />
      </Helmet>

      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>
            Privacy Policy
          </h1>
          <p className="text-slate-600">Last updated: June 4, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none prose-headings:font-sora prose-headings:font-bold prose-p:text-slate-600">
          <p>
            At Rahbars, accessible from rahbars.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Rahbars and how we use it.
          </p>

          <h2>Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
          <p>
            When you register for an Account, we may ask for your contact information, including items such as name, email address, and academic details for calculating merits and providing personalized recommendations.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails regarding university deadlines and alerts</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2>Log Files</h2>
          <p>
            Rahbars follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2>Cookies and Web Beacons</h2>
          <p>
            Like any other website, Rahbars uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at rahbarsofficial@gmail.com.
          </p>
        </article>
      </div>
    </>
  );
}
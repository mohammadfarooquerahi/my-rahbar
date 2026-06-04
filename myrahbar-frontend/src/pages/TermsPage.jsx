import { Helmet } from "react-helmet-async";

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | MyRahbar</title>
        <meta name="description" content="Terms and Conditions for using MyRahbar." />
      </Helmet>

      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>
            Terms & Conditions
          </h1>
          <p className="text-slate-600">Last updated: June 4, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none prose-headings:font-sora prose-headings:font-bold prose-p:text-slate-600">
          <p>
            Welcome to MyRahbar! These terms and conditions outline the rules and regulations for the use of MyRahbar's Website, located at myrahbar.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use MyRahbar if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2>Cookies</h2>
          <p>
            We employ the use of cookies. By accessing MyRahbar, you agreed to use cookies in agreement with the MyRahbar's Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
          </p>

          <h2>License</h2>
          <p>
            Unless otherwise stated, MyRahbar and/or its licensors own the intellectual property rights for all material on MyRahbar. All intellectual property rights are reserved. You may access this from MyRahbar for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from MyRahbar</li>
            <li>Sell, rent or sub-license material from MyRahbar</li>
            <li>Reproduce, duplicate or copy material from MyRahbar</li>
            <li>Redistribute content from MyRahbar</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on MyRahbar's website could include technical, typographical, or photographic errors. MyRahbar does not warrant that any of the materials on its website are accurate, complete or current. MyRahbar may make changes to the materials contained on its website at any time without notice. However MyRahbar does not make any commitment to update the materials. Merit calculations and admission chances provided are estimates based on historical data and do not guarantee admission.
          </p>

          <h2>Modifications</h2>
          <p>
            MyRahbar may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </article>
      </div>
    </>
  );
}
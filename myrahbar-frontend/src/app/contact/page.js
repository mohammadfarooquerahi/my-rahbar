import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Rahbars | University Admission Support & Inquiries",
  description: "Have questions about university admissions, eligibility, entry tests, or merit in Pakistan? Send us a message or chat with our counselors on WhatsApp.",
  alternates: { canonical: "https://www.rahbars.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}

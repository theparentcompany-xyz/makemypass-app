import Theme from "../../../components/Theme/Theme";
import styles from "./TermsConditions.module.css";

const TermsConditions = () => {
  return (
    <Theme>
      <div className={styles.contentContainer}>
        <h2>Terms of Service for MakeMyPass</h2>

        <h4>1. Introduction</h4>
        <p>
          Welcome to MakeMyPass (the "Service"), operated by [Your Company Name]
          (referred to as "us", "we", or "our"). Our website is available at
          <a href="http://makemypass.com">makemypass.com</a>. This Terms of
          Service agreement governs your use of our Service.
        </p>

        <h4>2. Use of Service</h4>
        <p>
          MakeMyPass is a platform designed for creating and managing events.
          Users can register for events, and event creators can access and share
          registrant data with authorized personnel.
        </p>

        <h4>3. Account Registration</h4>
        <p>
          To use certain features of the Service, you must register for an
          account. You agree to provide accurate, current, and complete
          information during the registration process and to update such
          information to keep it accurate, current, and complete.
        </p>

        <h4>4. Privacy and Data Protection</h4>
        <p>
          We are committed to protecting the privacy of our users. Our
          <a href="[Link to Privacy Policy]">Privacy Policy</a>, available on
          our website, explains how we collect, use, and disclose information
          about our users.
        </p>

        <h4>5. User Conduct</h4>
        <p>
          You agree not to use the Service for any unlawful purpose or in any
          way that interrupts, damages, or impairs the service. You agree not to
          attempt to gain unauthorized access to any part of the Service or to
          any other accounts, computer systems, or networks connected to the
          Service.
        </p>

        <h4>6. Content Ownership and Intellectual Property</h4>
        <p>
          You retain all your ownership rights to the content you submit, post,
          or display on or through the Service. By submitting content, you grant
          us a worldwide, non-exclusive, royalty-free license to use, copy,
          reproduce, process, adapt, modify, publish, transmit, display, and
          distribute such content in any and all media or distribution methods.
        </p>

        <h4>7. Termination</h4>
        <p>
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach the Terms.
        </p>

        <h4>8. Disclaimers and Limitations of Liability</h4>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do
          not warrant the accuracy, completeness, or usefulness of this service.
          In no event shall we be liable for any damages arising out of the use
          or inability to use the Service.
        </p>

        <h4>9. Changes to Terms</h4>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. We will provide at least [number] days'
          notice prior to any new terms taking effect.
        </p>

        <h4>10. Contact Us</h4>
        <p>
          If you have any questions about these Terms, please contact us at
          makemypass.com@gmail.com.
        </p>
      </div>
    </Theme>
  );
};

export default TermsConditions;

import Theme from "../../../components/Theme/Theme";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Theme>
        <div className={styles.contentContainer}>
          <h2>Privacy Policy for MakeMyPass</h2>

          <h4>1. Introduction</h4>
          <p>
            This Privacy Policy explains how [Your Company Name], operating the
            website makemypass.com (referred to as "us", "we", or "our"),
            collects, uses, and discloses information about you when you use our
            Service, MakeMyPass.
          </p>

          <h4>2. Information Collection</h4>
          <p>
            We collect information you provide directly to us when you create an
            account, fill out a form, sign up for an event, or otherwise
            communicate with us. This information may include your name, email
            address, phone number, and any other information you choose to
            provide.
          </p>

          <h4>3. Information Use</h4>
          <p>
            The information we collect is used to provide, maintain, and improve
            our Service, to communicate with you, to monitor and analyze trends,
            usage, and activities in connection with our Service, and for other
            marketing purposes.
          </p>

          <h4>4. Information Sharing and Disclosure</h4>
          <p>
            We may share personal information with vendors, consultants, and
            other service providers who need access to such information to carry
            out work on our behalf. We may also share information in response to
            a request for information if we believe disclosure is in accordance
            with, or required by, any applicable law, regulation, or legal
            process.
          </p>

          <h4>5. Data Security</h4>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, unauthorized access, disclosure,
            alteration, and destruction.
          </p>

          <h4>6. International Transfers</h4>
          <p>
            Your information, including personal data, may be transferred to —
            and maintained on — computers located outside of your state,
            province, country, or other governmental jurisdiction where the data
            protection laws may differ from those of your jurisdiction.
          </p>

          <h4>7. Your Choices</h4>
          <p>
            You may update, amend, or delete your account information at any
            time by logging into your account and adjusting your profile
            settings.
          </p>

          <h4>8. Changes to this Privacy Policy</h4>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h4>9. Contact Us</h4>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at makemypass.com@gmail.com.
          </p>
        </div>
      </Theme>
    </>
  );
};

export default PrivacyPolicy;

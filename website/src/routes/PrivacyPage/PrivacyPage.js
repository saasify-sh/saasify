import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { NavHeader, NavFooter, ScrollToTopOnMount } from 'components'

import styles from './styles.module.css'

export class PrivacyPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'privacy-page', theme.light)}>
        <NavHeader fixed />

        <div className={theme(styles, 'privacy-page-body')}>
          <ScrollToTopOnMount />

          <h1>Privacy Policy</h1>

          <p className={theme(styles, 'last-modified')}>
            Last Modified: February 13, 2020
          </p>

          <p>
            <strong>
              <u>Introduction</u>
            </strong>
          </p>
          <p>
            At Saasify Inc. (<strong>“Company”</strong> or
            <strong>&nbsp;“We”</strong>), We respect your privacy and are
            committed to protecting it through our compliance with this policy.
          </p>
          <p>
            This policy describes the types of information we may collect from
            you or that you may provide when you visit the website saasify.sh
            (our “<strong>Website</strong>”) and our practices for collecting,
            using, maintaining, protecting, and disclosing that information.
          </p>
          <p>This policy applies to information we collect:</p>
          <ul>
            <li>On this Website.</li>
            <li>
              In email, text, and other electronic messages between you and this
              Website.
            </li>
            <li>
              Through mobile and desktop applications you download from this
              Website, which provide dedicated non-browser-based interaction
              between you and this Website.
            </li>
            <li>
              When you interact with our advertising and applications on
              third-party websites and services, if those applications or
              advertising include links to this policy.
            </li>
            <li>It does not apply to information collected by:</li>
            <li>
              us offline or through any other means, including on any other
              website operated by Company or any third party (including our
              affiliates and subsidiaries); or
            </li>
            <li>
              any third party (including our affiliates and subsidiaries),
              including through any application or content (including
              advertising) that may link to or be accessible from or on the
              Website.
            </li>
          </ul>
          <p>
            Please read this policy carefully to understand our policies and
            practices regarding your information and how we will treat it. If
            you do not agree with our policies and practices, your choice is not
            to use our Website. By accessing or using this Website, you agree to
            this privacy policy. This policy may change from time to time (see
            Changes to Our Privacy Policy). Your continued use of this Website
            after we make changes is deemed to be acceptance of those changes,
            so please check the policy periodically for updates.
          </p>
          <p>
            <strong>
              <u>Children Under the Age of 13</u>
            </strong>
          </p>
          <p>
            Our Website is not intended for children under 13 years of age. No
            one under age 13 may provide any information to or on the Website.
            We do not knowingly collect personal information from children under
            13. If you are under 13, do not use or provide any information on
            this Website or on or through any of its features/register on the
            Website, make any purchases through the Website, use any of the
            interactive or public comment features of this Website or provide
            any information about yourself to us, including your name, address,
            telephone number, email address, or any screen name or user name you
            may use. If we learn we have collected or received personal
            information from a child under 13 without verification of parental
            consent, we will delete that information. If you believe we might
            have any information from or about a child under 13, please contact
            us at <u>support@saasify.sh</u>.
          </p>
          <p>
            <strong>
              <u>Information We Collect About You and How We Collect It</u>
            </strong>
          </p>
          <p>
            We collect several types of information from and about users of our
            Website, including information:
          </p>
          <ul>
            <li>
              by which you may be personally identified, such as name, postal
              address, e-mail address, telephone number (“
              <strong>personal information</strong>”);
            </li>
            <li>
              about your internet connection, the equipment you use to access
              our Website and usage details.
            </li>
          </ul>
          <p>We collect this information:</p>
          <ul>
            <li>Directly from you when you provide it to us.</li>
            <li>
              As you navigate through the site. Information collected
              automatically may include usage details, IP addresses, and
              information collected through cookies.
            </li>
            <li>From third parties, for example, our business partners.</li>
          </ul>
          <p>
            <strong>
              <u>Information You Provide to Us</u>
            </strong>
            .&nbsp; The information we collect on or through our Website may
            include:
          </p>
          <ul>
            <li>
              Information that you provide by filling in forms on our Website.
              This includes information provided at the time of registering to
              use our Website, subscribing to our service, posting material, or
              requesting further services. We may also ask you for information
              when you enter a contest or promotion sponsored by us, and when
              you report a problem with our Website.
            </li>
            <li>
              Records and copies of your correspondence (including email
              addresses), if you contact us.
            </li>
            <li>
              Your responses to surveys that we might ask you to complete for
              research purposes.
            </li>
            <li>
              Details of transactions you carry out through our Website and of
              the fulfillment of your orders. You may be required to provide
              financial information before placing an order through our Website.
            </li>
            <li>Your search queries on the Website.</li>
          </ul>
          <p>
            You also may provide information to be published or displayed
            (hereinafter, “<strong>posted</strong>”) on public areas of the
            Website, or transmitted to other users of the Website or third
            parties (collectively, “<strong>User Contributions</strong>”). Your
            User Contributions are posted on and transmitted to others at your
            own risk. &nbsp;Although we limit access to certain pages, please be
            aware that no security measures are perfect or impenetrable.
            Additionally, we cannot control the actions of other users of the
            Website with whom you may choose to share your User Contributions.
            Therefore, we cannot and do not guarantee that your User
            Contributions will not be viewed by unauthorized persons.
          </p>
          <p>
            <strong>
              <u>
                Information We Collect Through Automatic Data Collection
                Technologies
              </u>
            </strong>
            .&nbsp; As you navigate through and interact with our Website, we
            may use automatic data collection technologies to collect certain
            information about your equipment, browsing actions, and patterns,
            including:
          </p>
          <ul>
            <li>
              Details of your visits to our Website, including traffic data,
              location data, logs, and other communication data and the
              resources that you access and use on the Website.
            </li>
            <li>
              Information about your computer and internet connection, including
              your IP address, operating system, and browser type.
            </li>
          </ul>
          <p>
            The information we collect automatically may include personal
            information, or we may maintain it or associate it with personal
            information we collect in other ways or receive from third parties.
            It helps us to improve our Website and to deliver a better and more
            personalized service, including by enabling us to:
          </p>
          <ul>
            <li>Estimate our audience size and usage patterns.</li>
            <li>
              Store information about your preferences, allowing us to customize
              our Website according to your individual interests.
            </li>
            <li>Speed up your searches.</li>
            <li>Recognize you when you return to our Website.</li>
          </ul>
          <p>
            The technologies we use for this automatic data collection may
            include:
          </p>
          <ul>
            <li>
              <strong>Cookies (or browser cookies).</strong> A cookie is a small
              file placed on the hard drive of your computer. You may refuse to
              accept browser cookies by activating the appropriate setting on
              your browser. However, if you select this setting you may be
              unable to access certain parts of our Website. Unless you have
              adjusted your browser setting so that it will refuse cookies, our
              system will issue cookies when you direct your browser to our
              Website.
            </li>
            <li>
              <strong>Flash Cookies.</strong> Certain features of our Website
              may use local stored objects (or Flash cookies) to collect and
              store information about your preferences and navigation to, from,
              and on our Website. Flash cookies are not managed by the same
              browser settings as are used for browser cookies.
            </li>
            <li>
              <strong>Web Beacons.</strong> Pages of our Website and our e-mails
              may contain small electronic files known as web beacons (also
              referred to as clear gifs, pixel tags, and single-pixel gifs) that
              permit the Company, for example, to count users who have visited
              those pages or [opened an email] and for other related website
              statistics (for example, recording the popularity of certain
              website content and verifying system and server integrity).
            </li>
          </ul>
          <p>
            We do not collect personal information automatically, but we may tie
            this information to personal information about you that we collect
            from other sources or you provide to us.
          </p>
          <p>
            <strong>
              <u>Third-Party Use of Cookies and Other Tracking Technologies.</u>
            </strong>
          </p>
          <p>
            Some content or applications, including advertisements, on the
            Website are served by third-parties, including advertisers, ad
            networks and servers, content providers, and application providers.
            These third parties may use cookies alone or in conjunction with web
            beacons or other tracking technologies to collect information about
            you when you use our website. The information they collect may be
            associated with your personal information or they may collect
            information, including personal information, about your online
            activities over time and across different websites and other online
            services. They may use this information to provide you with
            interest-based (behavioral) advertising or other targeted content.
          </p>
          <p>
            We do not control these third parties’ tracking technologies or how
            they may be used. If you have any questions about an advertisement
            or other targeted content, you should contact the responsible
            provider directly.
          </p>
          <p>
            <strong>
              <u>How We Use Your Information</u>
            </strong>
          </p>
          <p>
            We use information that we collect about you or that you provide to
            us, including any personal information:
          </p>
          <ul>
            <li>To present our Website and its contents to you.</li>
            <li>
              To provide you with information, products, or services that you
              request from us.
            </li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>
              To provide you with notices about your account/subscription,
              including expiration and renewal notices.
            </li>
            <li>
              To carry out our obligations and enforce our rights arising from
              any contracts entered into between you and us, including for
              billing and collection.
            </li>
            <li>
              To notify you about changes to our Website or any products or
              services we offer or provide though it.
            </li>
            <li>
              To allow you to participate in interactive features on our
              Website.
            </li>
            <li>
              In any other way we may describe when you provide the information.
            </li>
            <li>For any other purpose with your consent.</li>
          </ul>
          <p>
            <strong>
              <u>Disclosure of Your Information</u>
            </strong>
          </p>
          <p>
            We may disclose aggregated information about our users, and
            information that does not identify any individual, without
            restriction.
          </p>
          <p>
            We may disclose personal information that we collect or you provide
            as described in this privacy policy:
          </p>
          <ul>
            <li>To our affiliates.</li>
            <li>
              To contractors, service providers, and other third parties we use
              to support our business and who are bound by contractual
              obligations to keep personal information confidential and use it
              only for the purposes for which we disclose it to them.
            </li>
            <li>
              To a buyer or other successor in the event of a merger,
              divestiture, restructuring, reorganization, dissolution, or other
              sale or transfer of some or all of Saasify’s assets, whether as a
              going concern or as part of bankruptcy, liquidation, or similar
              proceeding, in which personal information held by Saasify about
              our Website users is among the assets transferred.
            </li>
            <li>
              To fulfill the purpose for which you provide it. For example, if
              you give us an email address to use the “email a friend” feature
              of our Website, we will transmit the contents of that email and
              your email address to the recipients.
            </li>
            <li>
              For any other purpose disclosed by us when you provide the
              information.
            </li>
            <li>With your consent.</li>
            <li>We may also disclose your personal information:</li>
            <li>
              To comply with any court order, law, or legal process, including
              to respond to any government or regulatory request.
            </li>
            <li>
              To enforce or apply our <a href='/terms'>terms of use</a>&nbsp;and
              other agreements, including for billing and collection purposes.
            </li>
            <li>
              If we believe disclosure is necessary or appropriate to protect
              the rights, property, or safety of Saasify, our customers, or
              others. This includes exchanging information with other companies
              and organizations for the purposes of fraud protection and credit
              risk reduction.
            </li>
          </ul>
          <p>
            <strong>
              <u>Accessing and Correcting Your Information</u>
            </strong>
          </p>
          <p>
            You can review and change your personal information by logging into
            the Website and visiting your account profile page.
          </p>
          <p>
            You may also send us an email at <u>info@saasify.sh</u> to request
            access to, correct or delete any personal information that you have
            provided to us. We cannot delete your personal information except by
            also deleting your user account. We may not accommodate a request to
            change information if we believe the change would violate any law or
            legal requirement or cause the information to be incorrect.
          </p>
          <p>
            If you delete your User Contributions from the Website, copies of
            your User Contributions may remain viewable in cached and archived
            pages, or might have been copied or stored by other Website users.
            Proper access and use of information provided on the Website,
            including User Contributions, is governed by our terms of use&nbsp;
            <a href='/terms'>terms of use</a>.
          </p>
          <p>
            <strong>
              <u>Your California Privacy Rights</u>
            </strong>
          </p>
          <p>
            California Civil Code Section § 1798.83 permits users of our Website
            that are California residents to request certain information
            regarding our disclosure of personal information to third parties
            for their direct marketing purposes.&nbsp; To make such a request,
            please send an email to <u>support@saasify.sh</u> or write us at:
            110 Livingston Street, #3J, Brooklyn, NY 11201
          </p>
          <p>
            <strong>
              <u>Data Security</u>
            </strong>
          </p>
          <p>
            We have implemented measures designed to secure your personal
            information from accidental loss and from unauthorized access, use,
            alteration, and disclosure. All information you provide to us is
            stored on our secure servers behind firewalls. Any payment
            transactions will be encrypted using SSL technology.
          </p>
          <p>
            The safety and security of your information also depends on you.
            Where we have given you (or where you have chosen) a password for
            access to certain parts of our Website, you are responsible for
            keeping this password confidential. We ask you not to share your
            password with anyone. We urge you to be careful about giving out
            information in public areas of the Website like message boards. The
            information you share in public areas may be viewed by any user of
            the Website.
          </p>
          <p>
            Unfortunately, the transmission of information via the internet is
            not completely secure. Although we do our best to protect your
            personal information, we cannot guarantee the security of your
            personal information transmitted to our Website. Any transmission of
            personal information is at your own risk. We are not responsible for
            circumvention of any privacy settings or security measures contained
            on the Website.
          </p>
          <p>
            <strong>
              <u>Changes to Our Privacy Policy</u>
            </strong>
          </p>
          <p>
            It is our policy to post any changes we make to our privacy policy
            on this page. If we make material changes to how we treat our users’
            personal information, we will provide updated notice on
            webpage.&nbsp; The date the privacy policy was last revised is
            identified at the top of the page. You are responsible for
            periodically visiting our Website and this privacy policy to check
            for any changes.
          </p>
          <p>
            <strong>
              <u>Contact Information</u>
            </strong>
          </p>
          <p>
            To ask questions or comment about this privacy policy and our
            privacy practices, contact us at info@saasify.sh.
          </p>
        </div>

        <NavFooter />
      </div>
    )
  }
}

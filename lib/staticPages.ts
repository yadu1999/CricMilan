export interface StaticPageData {
  title: string;
  metaDescription: string;
  content: string;
}

export const STATIC_PAGES: Record<string, StaticPageData> = {
  about: {
    title: 'About Us',
    metaDescription: 'Learn about CricMilan.in, our mission, editorial team, and passion for delivering instant, verified cricket updates.',
    content: `
      <p>Welcome to <strong>CricMilan.in</strong>, your premier destination for up-to-the-minute cricket updates, analysis, and breaking news from India and around the globe.</p>
      <p>Established with the vision of offering cricket enthusiasts a fast, responsive, and clutter-free platform, CricMilan brings you comprehensive coverage ranging from national tournaments to international series, trending headlines, and engaging cricket stories.</p>
      <h2>Our Mission</h2>
      <p>We aim to deliver news accurately and quickly. Our team of contributors and editors works round the clock to ensure you never miss a match highlight, a statistical milestone, or critical sports reports.</p>
      <p>Thank you for choosing CricMilan as your trusted cricket source!</p>
    `
  },
  contact: {
    title: 'Contact Us',
    metaDescription: 'Get in touch with the editorial team, press office, or business partnerships at CricMilan.in.',
    content: `
      <p>We would love to hear from you! If you have any feedback, questions, or business inquiries, please reach out to us using the details below.</p>
      <h2>Get in Touch</h2>
      <p><strong>Email:</strong> cricmilan@gmail.com</p>
      <p><strong>Address:</strong> Patna, india, 800001</p>
      <h2>Work With Us</h2>
      <p>If you are a passionate sports writer or an analyst who wants to contribute articles to CricMilan, send us your sample drafts at our official email.</p>
    `
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    metaDescription: 'Read the official Privacy Policy and cookie disclaimer for CricMilan.in visitors and readers.',
    content: `
      <p>At CricMilan.in, accessible from cricmilan.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CricMilan and how we use it.</p>
      <h2>Log Files</h2>
      <p>CricMilan follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
      <h2>Cookies and Web Beacons</h2>
      <p>Like any other website, CricMilan uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
      <h2>Google DoubleClick DART Cookie</h2>
      <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.</p>
    `
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    metaDescription: 'Official Terms of Service and Conditions governing the use of CricMilan.in.',
    content: `
      <p>Welcome to CricMilan.in!</p>
      <p>These terms and conditions outline the rules and regulations for the use of CricMilan's Website, located at cricmilan.in.</p>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use CricMilan if you do not agree to take all of the terms and conditions stated on this page.</p>
      <h2>Cookies</h2>
      <p>We employ the use of cookies. By accessing CricMilan, you agreed to use cookies in agreement with the CricMilan's Privacy Policy.</p>
      <h2>License</h2>
      <p>Unless otherwise stated, CricMilan and/or its licensors own the intellectual property rights for all material on CricMilan. All intellectual property rights are reserved. You may access this from CricMilan for your own personal use subjected to restrictions set in these terms and conditions.</p>
    `
  },
  disclaimer: {
    title: 'Disclaimer',
    metaDescription: 'Legal disclaimer and accuracy statement for news, statistics and editorial commentary on CricMilan.in.',
    content: `
      <p>All the information on this website - cricmilan.in - is published in good faith and for general information purpose only. CricMilan does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website, is strictly at your own risk.</p>
      <h2>Consent</h2>
      <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>
      <h2>Updates</h2>
      <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
    `
  }
};

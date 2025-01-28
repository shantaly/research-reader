import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing and using Research Reader, you agree to be bound by these Terms of Service
          and our Privacy Policy. If you disagree with any part of these terms, you may not
          access or use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p className="mb-4">
          Research Reader is a platform that allows users to upload, read, and analyze PDF documents.
          We provide tools for document management, analysis, and collaboration while maintaining
          the security and privacy of your content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
        <p className="mb-4">To use our service, you must:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Be at least 16 years old</li>
          <li>Register for an account with valid information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Promptly notify us of any unauthorized access</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
        <p className="mb-4">You agree not to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Upload any illegal or unauthorized content</li>
          <li>Violate any intellectual property rights</li>
          <li>Attempt to breach or circumvent our security measures</li>
          <li>Use the service for any unlawful purpose</li>
          <li>Share your account credentials with others</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Content and Copyright</h2>
        <p className="mb-4">
          You retain all rights to the content you upload to Research Reader. By uploading
          content, you grant us a license to store, process, and display your content for
          the purpose of providing our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account for violations of these
          terms or for any other reason at our discretion. You may also terminate your
          account at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Disclaimers and Limitations</h2>
        <p className="mb-4">
          Our service is provided "as is" without warranties of any kind. We are not
          responsible for any damages or losses resulting from your use of the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. We will notify users
          of any material changes via email or through our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
        <p className="mb-4">
          For any questions about these Terms of Service, please contact us at:
          <strong> mayanksingh@advicehub.ai</strong>
        </p>
      </section>

      <footer className="text-sm text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
} 
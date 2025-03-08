import { Footer } from "@/pages/Login";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const TermsOfService = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">Savy</Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Savy. These Terms of Service ("Terms") govern your access to and use of the Savy application and services. By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>"Service"</strong> refers to the Savy application.</li>
              <li><strong>"User"</strong> refers to the individual accessing or using the Service.</li>
              <li><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Savy.</li>
              <li><strong>"Content"</strong> refers to text, images, or other information that can be posted, uploaded, linked to, or otherwise made available through the Service.</li>
              <li><strong>"Card Information"</strong> refers to bank card details that users choose to store in the Service.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Service Scope</h2>
            <p className="mb-4">
              Savy provides a platform for users to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Store and manage bank card information</li>
              <li>Receive notifications about promotions relevant to stored cards</li>
              <li>View and filter promotions by various criteria</li>
            </ul>
            <p>
              The Company reserves the right to modify or discontinue, temporarily or permanently, the Service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. User Obligations</h2>
            <p className="mb-4">
              By using our Service, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information when creating an account</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not attempt to probe, scan, or test the vulnerability of the Service</li>
              <li>Not interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Payment Terms</h2>
            <p>
              Savy is currently offered as a free service. Should we introduce premium features or subscription plans in the future, we will update these Terms to include relevant payment terms and conditions. Any such changes will be communicated to users in advance.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Data Protection</h2>
            <p className="mb-4">
              Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.
            </p>
            <p>
              We take the security of your Card Information seriously and implement appropriate technical and organizational measures to protect it. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. IP Ownership</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Warranties</h2>
            <p className="mb-4">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Company makes no warranties, expressed or implied, and hereby disclaims all warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            <p>
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The Service will function uninterrupted, secure, or available at any particular time or location</li>
              <li>Any errors or defects will be corrected</li>
              <li>The Service is free of viruses or other harmful components</li>
              <li>The results of using the Service will meet your requirements</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Law and Disputes</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
            <p className="mb-4">
              Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
            </p>
            <p>
              We encourage you to contact us first to try to resolve any disputes amicably.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Term Amendment</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService; 
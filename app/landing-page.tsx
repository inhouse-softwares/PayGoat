"use client";

import Link from "next/link";
import { ThemeToggle } from "./components/theme-toggle";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--page-bg)" }}>
      {/* Navigation */}
      <nav className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="PayGoat Logo" width={40} height={40} />
              <span className="text-xl font-bold text-[var(--foreground)]">Paygoat</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
            Streamline Your Payment Collections with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PayGoat
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl">
            A modern, multi-instance payment collection platform powered by Paystack. 
            Manage unlimited payment instances, track collections, and generate instant receipts—all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-base font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Everything You Need to Collect Payments
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Built for schools, businesses, and organizations that need flexible payment management
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Multi-Instance Management</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Create unlimited payment instances for different departments, events, or purposes. Each with custom fields and payment types.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Paystack Integration</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Secure payment processing with automatic revenue splitting through Paystack subaccounts. Support for cards and bank transfers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Instant Receipt Generation</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Automatically generate professional PDF receipts for every payment. Download or print with a single click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Role-Based Access Control</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Create operator accounts for staff members with limited access to specific payment instances. Admins have full control.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Real-Time Analytics</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Track collections across all instances with comprehensive dashboards. View totals, trends, and payment history at a glance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Flexible Configuration</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Customize form fields, payment types, amounts, and revenue split percentages for each instance. Adapt to any use case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Get started in minutes with our simple setup process
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Create Payment Instances</h3>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Set up payment instances for different purposes—school fees, event tickets, product sales, or donations. Configure payment types and custom fields.
              </p>
            </div>

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Assign Operators</h3>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Create operator accounts for your team members. Each operator gets secure access to their assigned payment instance.
              </p>
            </div>

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Collect & Track</h3>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Start collecting payments instantly. Track all transactions in real-time, generate receipts, and monitor performance from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                  Why Choose PayGoat?
                </h2>
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Secure & Reliable</h3>
                      <p className="mt-1 text-[var(--muted-foreground)]">
                        Built on Paystack's robust infrastructure with enterprise-grade security and 99.9% uptime.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Automated Split Payments</h3>
                      <p className="mt-1 text-[var(--muted-foreground)]">
                        Automatically distribute revenue to multiple accounts with configurable split percentages.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">No Setup Fees</h3>
                      <p className="mt-1 text-[var(--muted-foreground)]">
                        Free to set up and use. Only pay standard Paystack transaction fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Mobile Responsive</h3>
                      <p className="mt-1 text-[var(--muted-foreground)]">
                        Works seamlessly on desktop, tablet, and mobile devices. Collect payments anywhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-6 border border-transparent dark:border-blue-900/50">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Collections</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">₦45,789,200</p>
                    <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">+24% from last month</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-transparent dark:border-gray-700/50">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-transparent dark:border-gray-700/50">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Instances</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-6 text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your dashboard preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Ready to Streamline Your Payments?
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Join organizations already using PayGoat to manage their payment collections efficiently.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            >
              Get Started Now
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg font-bold text-white">
                  P
                </div>
                <span className="text-xl font-bold text-[var(--foreground)]">PayGoat</span>
              </div>
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                Modern payment collection platform for schools, businesses, and organizations.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>Multi-Instance Management</li>
                <li>Paystack Integration</li>
                <li>Receipt Generation</li>
                <li>Real-Time Analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Support</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <Link href="/login" className="hover:text-[var(--foreground)] transition">
                    Sign In
                  </Link>
                </li>
                <li>Documentation</li>
                <li>API Reference</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted-foreground)]">
            <p>&copy; {new Date().getFullYear()} PayGoat. All rights reserved. Powered by Paystack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

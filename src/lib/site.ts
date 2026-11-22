/** Single source of truth for verified public company details and site copy. */

export const SITE = {
  name: "Codistack",
  email: "Infollix.dev@gmail.com",
  phoneDisplay: "+91 96183 32897",
  phoneTel: "+919618332897",
  whatsapp: "https://wa.me/919618332897",
  // The production domain is not confirmed yet. Set NEXT_PUBLIC_SITE_URL once it is.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",
  hasConfirmedDomain: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export type NavItem = { label: string; href: string; id: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Products", href: "/#products", id: "products" },
  { label: "Early Access", href: "/early-access", id: "early-access" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export type IconName =
  | "globe"
  | "browser"
  | "mobile"
  | "cube"
  | "layers"
  | "spark"
  | "flow";

export const SERVICES_LIST: {
  id: string;
  index: string;
  title: string;
  icon: IconName;
  solves: string;
  body: string;
  tags: string[];
  formValue: string;
}[] = [
  {
    id: "website",
    index: "01",
    title: "Website Development",
    icon: "globe",
    solves: "Your business has no site, or the one it has is slow and dated.",
    body: "Fast, responsive company websites with clear structure, solid SEO foundations, and contact flows that actually reach you, built so you can understand and own them.",
    tags: ["Business sites", "Landing pages", "SEO-ready"],
    formValue: "Website Development",
  },
  {
    id: "web-app",
    index: "02",
    title: "Web Application Development",
    icon: "browser",
    solves: "A process lives in spreadsheets and chat threads and keeps breaking.",
    body: "Browser-based tools with logins, roles, databases, and dashboards: portals, booking systems, internal tools, and customer-facing platforms.",
    tags: ["Portals", "Dashboards", "Role-based access"],
    formValue: "Web Application Development",
  },
  {
    id: "mobile",
    index: "03",
    title: "Mobile Applications",
    icon: "mobile",
    solves: "Your customers or staff need something that works in their pocket.",
    body: "Android and iOS apps designed around real mobile use: unreliable networks, small screens, one-handed flows. Built against a proper backend, not a demo.",
    tags: ["Android", "iOS", "Backend-connected"],
    formValue: "Mobile Application",
  },
  {
    id: "custom",
    index: "04",
    title: "Custom Business Software",
    icon: "cube",
    solves: "Off-the-shelf software forces your business to bend around it.",
    body: "Billing, inventory, scheduling, or operations software shaped around how your business actually runs: the same engineering mindset behind our own products.",
    tags: ["Billing", "Inventory", "Operations"],
    formValue: "Custom Business Software",
  },
  {
    id: "saas",
    index: "05",
    title: "SaaS Development",
    icon: "layers",
    solves: "You have a product idea but need the architecture to carry it.",
    body: "Multi-tenant architecture, authentication, subscription-ready foundations, and admin tooling: the structural decisions that are costly to fix later.",
    tags: ["Multi-tenant", "Auth & roles", "Scalable core"],
    formValue: "SaaS Platform Development",
  },
  {
    id: "ai",
    index: "06",
    title: "AI Software Solutions",
    icon: "spark",
    solves: "You want AI in your workflow without it becoming a gimmick.",
    body: "Practical AI features such as document handling, assistants, and smart search, integrated into real software with honest scoping about what AI can and cannot do.",
    tags: ["Assistants", "Document workflows", "Smart search"],
    formValue: "AI Software Solution",
  },
  {
    id: "automation",
    index: "07",
    title: "Automation & Integrations",
    icon: "flow",
    solves: "Your team repeats the same manual steps between tools every day.",
    body: "Connect the tools you already use, automate invoices, notifications, and reports, and remove the copy-paste work that quietly eats hours.",
    tags: ["APIs", "Messaging", "Reporting"],
    formValue: "Automation & Integrations",
  },
];

export const PRODUCT_CAPABILITIES: { title: string; note: string }[] = [
  { title: "POS Billing", note: "Fast counter billing" },
  { title: "Inventory & Stock", note: "Stock levels and alerts" },
  { title: "Products & Barcodes", note: "Catalogue management" },
  { title: "Customers & Khata", note: "Credit tracking" },
  { title: "Sales Records", note: "Transaction history" },
  { title: "Staff Management", note: "Roles and permissions" },
  { title: "Attendance & Payroll", note: "Team operations" },
  { title: "Dashboards & Reports", note: "Business insights" },
  { title: "Tax Invoicing", note: "PDF invoice generation" },
  { title: "WhatsApp Sharing", note: "Send invoices to customers" },
  { title: "Business Data Separation", note: "Multi-tenant design" },
  { title: "Offline Billing & Sync", note: "Bill without a connection" },
];

export const PLANNED_PRICING = [
  { name: "Basic", price: "₹149" },
  { name: "Standard", price: "₹299" },
  { name: "Premium", price: "₹499" },
] as const;

export const ROADMAP = [
  {
    n: "01",
    title: "CODISTACK",
    state: "Current",
    body: "Establish the technology brand and the development capability to build software properly: for clients and for ourselves.",
  },
  {
    n: "02",
    title: "BILLINGHACKS",
    state: "In development",
    body: "Develop, test, improve, and stabilize the first proprietary SaaS product with beta users.",
  },
  {
    n: "03",
    title: "REAL-WORLD ADOPTION",
    state: "Planned",
    body: "Grow a sustainable customer base and let real shop-floor feedback decide what gets improved next.",
  },
  {
    n: "04",
    title: "FUTURE INTELLIGENCE",
    state: "Future ambition",
    body: "Expand into AI agents and intelligent software products, once the foundation is stable. Not available today.",
  },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Codistack?",
    a: "Codistack is an independent technology brand focused on building modern digital solutions, scalable business software, SaaS platforms, and intelligent technologies. It is an emerging brand under development and is not yet a registered company.",
  },
  {
    q: "Does Codistack develop custom websites and applications?",
    a: "Yes. Codistack accepts paid project inquiries for websites, web applications, mobile applications, custom business software, SaaS platforms, AI-related software, and business automation.",
  },
  {
    q: "What is BILLINGHACKS Business OS?",
    a: "BILLINGHACKS Business OS is Codistack's first proprietary product: multi-tenant retail business management software covering billing, inventory, customer credit, staff, and reporting. BILLINGHACKS is a product by Codistack, not a separate company.",
  },
  {
    q: "Is BILLINGHACKS currently available?",
    a: "Not yet. BILLINGHACKS is under development and some capabilities are still being completed or verified. A beta waiting list is open so interested businesses can be contacted when beta access becomes available.",
  },
  {
    q: "How do I join the BILLINGHACKS beta waiting list?",
    a: "Use the Early Access page and submit your name, email, and consent. Phone, business name, and business category are optional. Joining the list does not guarantee immediate access.",
  },
  {
    q: "Can I request custom software development?",
    a: "Yes. Use the project inquiry form in the Contact section, or message us directly by email or WhatsApp. Project inquiries are handled separately from the BILLINGHACKS waiting list.",
  },
  {
    q: "Does joining early access require payment?",
    a: "No. Joining the waiting list is free and does not create a paid subscription. BILLINGHACKS has intended plan prices, but there is no checkout and no subscription available at this time.",
  },
];

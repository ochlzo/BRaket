export const categoryOptions = [
  { label: "Web Development", emoji: "💻" },
  { label: "Graphic Design", emoji: "🎨" },
  { label: "Photography", emoji: "📷" },
  { label: "Video Editing", emoji: "🎬" },
  { label: "UI/UX Design", emoji: "🖥️" },
  { label: "Content Writing", emoji: "✍️" },
  { label: "Social Media Management", emoji: "📱" },
  { label: "Other", emoji: "📦" },
];

export const skillSuggestions: Record<string, string[]> = {
  "Content Writing": [
    "Blog Posts",
    "Copywriting",
    "SEO Writing",
    "Academic Writing",
    "Social Media Copy",
    "Scriptwriting",
    "Technical Writing",
    "Creative Writing",
  ],
  "Graphic Design": [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Canva",
    "Logo Design",
    "Branding",
    "Poster Design",
    "Social Media Graphics",
    "Print Design",
  ],
  Other: [
    "Research",
    "Data Entry",
    "Translation",
    "Tutoring",
    "Virtual Assistance",
  ],
  Photography: [
    "Portrait",
    "Product",
    "Event",
    "Editing",
    "Lightroom",
    "Studio",
    "Outdoor",
    "Drone Photography",
  ],
  "Social Media Management": [
    "Instagram",
    "Facebook",
    "TikTok",
    "Content Strategy",
    "Analytics",
    "Community Management",
    "Paid Ads",
    "Content Calendar",
  ],
  "UI/UX Design": [
    "Figma",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Design Systems",
    "Mobile Design",
    "Web Design",
    "Interaction Design",
  ],
  "Video Editing": [
    "Adobe Premiere",
    "After Effects",
    "CapCut",
    "Motion Graphics",
    "Color Grading",
    "Short-Form Content",
    "Reels/TikTok",
    "Documentary",
  ],
  "Web Development": [
    "HTML/CSS",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "WordPress",
    "PHP",
    "Responsive Design",
  ],
};

export const budgetRanges = [
  "Under ₱500",
  "₱500 – ₱1,000",
  "₱1,000 – ₱3,000",
  "₱3,000 – ₱5,000",
  "₱5,000 – ₱10,000",
  "₱10,000+",
  "Open / Negotiable",
];

export const timelineOptions = [
  "ASAP (1 – 3 days)",
  "Within 1 week",
  "1 – 2 weeks",
  "2 – 4 weeks",
  "1 – 2 months",
  "Flexible / No rush",
];

export const urgencyLevels = [
  {
    color:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)] border-[color:var(--tone-green-base)]/30",
    desc: "No rush, flexible deadline",
    label: "Low",
    value: "low",
  },
  {
    color:
      "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)] border-[color:var(--tone-amber-base)]/30",
    desc: "Standard turnaround",
    label: "Medium",
    value: "medium",
  },
  {
    color:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)] border-[color:var(--tone-orange-base)]/30",
    desc: "Time-sensitive, need it soon",
    label: "High",
    value: "high",
  },
  {
    color:
      "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)] border-[color:var(--tone-red-base)]/30",
    desc: "Needed ASAP, willing to pay rush fee",
    label: "Urgent",
    value: "urgent",
  },
];

export const processSteps = [
  {
    desc: "Describe what you need, set your budget and timeline, and publish.",
    emoji: "📝",
    num: "01",
    title: "Post your project",
  },
  {
    desc: "Qualified BU students review your project and send tailored proposals.",
    emoji: "💬",
    num: "02",
    title: "Get proposals",
  },
  {
    desc: "Pick your favorite, collaborate directly, and receive quality work.",
    emoji: "🤝",
    num: "03",
    title: "Choose & collaborate",
  },
];

export const benefitCards = [
  {
    desc: "Every talent is a real Bicol University student with a reviewed portfolio.",
    gradient:
      "from-[color:var(--brand-orange)]/10 to-[color:var(--brand-orange-light)]/10",
    icon: "🎓",
    title: "Verified BU Students",
  },
  {
    desc: "Quality work at rates that respect both your budget and the student's value.",
    gradient: "from-[color:var(--tone-green-soft)] to-[color:var(--tone-teal-soft)]",
    icon: "💸",
    title: "Student-Friendly Rates",
  },
  {
    desc: "Motivated students eager to build their portfolios deliver results quickly.",
    gradient:
      "from-[color:var(--tone-amber-soft)] to-[color:var(--tone-orange-soft)]",
    icon: "⚡",
    title: "Fast Turnaround",
  },
  {
    desc: "Transparent milestones and handoff processes protect both parties.",
    gradient: "from-[color:var(--tone-sky-soft)] to-[color:var(--tone-indigo-soft)]",
    icon: "🛡️",
    title: "Secure Commissions",
  },
  {
    desc: "Work directly with talents — no middlemen, no hidden fees, just results.",
    gradient: "from-[color:var(--tone-pink-soft)] to-[color:var(--tone-purple-soft)]",
    icon: "🤝",
    title: "Direct Collaboration",
  },
  {
    desc: "Support local student talent and help build the next generation of creators.",
    gradient:
      "from-[color:var(--tone-orange-soft)] to-[color:var(--tone-amber-soft)]",
    icon: "🌟",
    title: "Community Impact",
  },
];

export const profile = {
  name: 'Vansh Narula',
  role: 'Full Stack Developer',
  company: 'Bexo.ai',
  companyPlace: 'Mohali',
  location: 'Ambala City, India',
  coords: '30.38° N, 76.78° E',
  email: 'narulavansh430@gmail.com',
  phone: '+91 70820 86751',
  phoneHref: 'tel:+917082086751',
  linkedin: 'https://www.linkedin.com/in/vansh-narula',
  linkedinLabel: 'in/vansh-narula',
  resume: '/Vansh_Narula_Resume.pdf',
};

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const aboutFacts = [
  { k: 'Based in', v: 'Ambala City, India' },
  { k: 'Currently', v: 'Full Stack Developer, Bexo.ai' },
  { k: 'Studied', v: 'B.Tech, AI & Data Science' },
  { k: 'Focus', v: 'MERN · AWS · Payments · Queues' },
];

export const stats = [
  { value: 2, pad: 2, label: 'Production platforms built end-to-end and live' },
  { value: 3, pad: 2, label: 'Tiers of role-based access in a multi-tenant LMS' },
  { value: 8.37, decimals: 2, label: 'CGPA — B.Tech in AI & Data Science' },
  { value: 3, pad: 2, suffix: 'mo', label: 'From intern to full-time at Bexo.ai' },
];

export const projects = [
  {
    slug: 'australian-academy-lms',
    index: '01',
    title: 'Australian Academy LMS',
    kind: 'Learning Management System',
    tagline:
      'A multi-tenant test platform with three tiers of access, online payments and automated grammar evaluation.',
    description:
      'A MERN learning platform where a Super Admin runs the question banks and institutes, institutes run their own students, and students take mock and practice tests.',
    links: [
      { label: 'ptecore.australianacademy.in', href: 'https://ptecore.australianacademy.in' },
      { label: 'pteacademic.australianacademy.in', href: 'https://pteacademic.australianacademy.in' },
    ],
    tags: ['MERN', 'RBAC', 'Razorpay', 'AWS EC2', 'AWS S3', 'Docker'],
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Razorpay', 'AWS EC2', 'AWS S3', 'Docker'],
    visual: 'rbac',
    overview:
      'One platform serving many institutes at once. A three-tier role system — Super Admin, Institute (Block) Admin and Student — keeps every layer scoped to what belongs to it, while the Super Admin controls the shared question banks and decides who gets which test.',
    highlights: [
      {
        title: 'Three-tier role-based access',
        body: 'Super Admin, Institute (Block) Admin and Student roles, each scoped to exactly what it should see and manage.',
      },
      {
        title: 'Question banks & test assignment',
        body: 'Super Admins upload mock and practice question banks, onboard institutes, and assign tests to an institute or directly to individual students.',
      },
      {
        title: 'Multi-tenant institutes',
        body: 'Institute Admins add their own students and assign practice or mock tests — a test-assignment hierarchy that scales one institute at a time.',
      },
      {
        title: 'Razorpay payments + webhooks',
        body: 'Checkout runs through Razorpay, with webhook handling so payment status updates in real time.',
      },
      {
        title: 'Deployed on AWS',
        body: 'The application runs on AWS EC2, with AWS S3 handling media and file storage.',
      },
      {
        title: 'Self-hosted grammar engine',
        body: 'An open-source grammar-checking service, self-hosted in Docker on the same EC2 instance and wired into the platform for automated grammar evaluation.',
      },
    ],
    flows: [
      { label: 'Core', steps: ['React client', 'Express API', 'MongoDB'] },
      { label: 'Payments', steps: ['Razorpay checkout', 'Webhook', 'Live payment status'] },
      { label: 'Media', steps: ['Uploads', 'Express API', 'AWS S3'] },
      { label: 'Grammar', steps: ['Student answer', 'Grammar service · Docker on EC2', 'Automated evaluation'] },
    ],
  },
  {
    slug: 'launch-your-life',
    index: '02',
    title: 'Launch Your Life',
    kind: 'Coaching & accountability platform',
    tagline:
      'Coaches see every user’s daily and weekly progress in one place — and the reminders send themselves.',
    description:
      'A MERN coaching platform with Coach and User roles, activity tracking, Twilio reminders, group broadcasts and Redis-backed job queues.',
    links: [{ label: 'app.masterthelaunch.com', href: 'https://app.masterthelaunch.com' }],
    tags: ['MERN', 'Twilio', 'Redis queues', 'Dashboards'],
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redis', 'Twilio'],
    visual: 'activity',
    overview:
      'A coaching and accountability platform built around two roles: Coaches and Users. Users log their daily and weekly activity; coaches get a single dashboard to follow progress across everyone assigned to them — plus the tools to nudge them along.',
    highlights: [
      {
        title: 'Daily & weekly tracking',
        body: 'Users log daily and weekly activity, building a running record of their progress.',
      },
      {
        title: 'Coach dashboard',
        body: 'Coaches monitor progress across all of their assigned users from a single view.',
      },
      {
        title: 'Automated Twilio reminders',
        body: 'Coaches send automated reminders through Twilio, so users stay on track without manual follow-ups.',
      },
      {
        title: 'Groups & broadcasts',
        body: 'Group management to organise users and broadcast messages — like meeting links — to an entire group at once.',
      },
      {
        title: 'Redis job queues',
        body: 'Reminders and messages run through Redis-backed job queues, making delivery more reliable and easier to scale.',
      },
    ],
    flows: [
      { label: 'Core', steps: ['React client', 'Express API', 'MongoDB'] },
      { label: 'Reminders', steps: ['Coach schedules', 'Redis queue', 'Twilio SMS', 'User'] },
      { label: 'Broadcast', steps: ['Group message', 'Redis queue', 'Every member'] },
    ],
  },
];

export const experience = [
  {
    period: 'Aug 2026 — Present',
    role: 'Full Stack Developer',
    org: 'Bexo.ai',
    place: 'Mohali',
    current: true,
    points: [
      'Moved from intern to a full-time role after a 3-month internship, contributing to production MERN applications.',
      'Work across the stack on feature development, API design and deployment for client and internal projects.',
    ],
  },
  {
    period: 'May 2026 — Aug 2026',
    role: 'Full Stack Developer Intern',
    org: 'Bexo.ai',
    place: 'Mohali',
    points: [
      'Built and shipped features with the MERN stack under production timelines, on real client codebases.',
      'Collaborated on API integrations, bug fixes and deployment workflows — which led to a full-time offer.',
    ],
  },
  {
    period: 'Jan 2026 — Jun 2026',
    role: 'MERN Stack Training',
    org: 'Solitaire Infosys',
    place: 'Mohali',
    points: [
      'Structured training across MongoDB, Express.js, React.js and Node.js, covering the full application lifecycle.',
      'Left in month five after landing a stipend-based internship at Bexo.ai; certificate of completion held.',
    ],
  },
  {
    period: '2022 — 2026',
    role: 'B.Tech, Artificial Intelligence & Data Science',
    org: 'Chandigarh Engineering College, CGC Landran',
    place: 'CGPA 8.37',
    points: [],
  },
];

export const certifications = [
  { title: 'SQL for Data Science', by: 'University of California, Davis · Coursera' },
  { title: 'Data Structures & Algorithms', by: 'CodeHelp by Love Babbar' },
];

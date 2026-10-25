/**
 * Feed Service for Maavah Live
 * Curates and manages social updates and official Facebook embeds for:
 * 1. Maavah Council (https://www.facebook.com/LaamuMaavahCouncil)
 * 2. Maavashu School (https://www.facebook.com/MaavashuSchool)
 * 3. Maavashu Health Center (https://www.facebook.com/MaavashuHealthCentr)
 */

const SOURCES = {
  council: {
    id: 'council',
    name: 'Maavah Council',
    dhivehiName: 'ލ. މާވަށު ކައުންސިލް އިދާރާ',
    handle: '@LaamuMaavahCouncil',
    url: 'https://www.facebook.com/LaamuMaavahCouncil',
    category: 'Local Government & Civic Administration',
    badge: 'Official Council',
    phone: '+960 6800718',
    email: 'info@maavah.gov.mv',
    location: 'Violetu magu, Maavah, Laamu Atoll, Maldives',
    color: '#101014',
    accent: '#2d81ff'
  },
  school: {
    id: 'school',
    name: 'Maavashu School',
    dhivehiName: 'މާވަށު ސްކޫލް',
    handle: '@MaavashuSchool',
    url: 'https://www.facebook.com/MaavashuSchool',
    category: 'Public Education & Youth Academy',
    badge: 'Education',
    phone: '+960 6800010',
    email: 'admin@maavashuschool.edu.mv',
    location: 'Roashanee Magu, Maavah',
    color: '#0d5c3a',
    accent: '#107c41'
  },
  health: {
    id: 'health',
    name: 'Maavashu Health Center',
    dhivehiName: 'މާވަށު ސިއްޙީ މަރުކަޒު',
    handle: '@MaavashuHealthCentr',
    url: 'https://www.facebook.com/MaavashuHealthCentr',
    category: 'Healthcare & 24/7 Emergency Clinic',
    badge: 'Healthcare',
    phone: '+960 6800035',
    email: 'maavah.healthcenter@grh.gov.mv',
    location: 'L. Maavah',
    color: '#b3261e',
    accent: '#d93025'
  }
};

const POSTS = [
  // Health Center Announcements
  {
    id: 'hc-01',
    sourceId: 'health',
    sourceName: 'Maavashu Health Center',
    sourceHandle: '@MaavashuHealthCentr',
    sourceUrl: 'https://www.facebook.com/MaavashuHealthCentr',
    timestamp: '2026-10-16T08:30:00Z',
    timeAgo: '2 hours ago',
    isPinned: true,
    category: 'Visiting Specialist Clinic',
    title: 'Consultant Pediatrician & Gynecologist Visit Scheduled This Weekend',
    dhivehiSnippet: 'ކުޑަކުދިންގެ ޚާއްސަ ޑޮކްޓަރާއި އަންހެނުންގެ ޚާއްސަ ޑޮކްޓަރުގެ ކްލިނިކް މި ހަފްތާ ބަންދުގައި މާވަށު ސިއްޙީ މަރުކަޒުގައި ކުރިއަށްދާނެއެވެ.',
    content: 'We are pleased to inform the residents of Maavah that a Consultant Pediatrician and a Consultant Gynecologist from Gan Regional Hospital will be conducting specialist outpatient consultations at Maavashu Health Center on Friday and Saturday.\n\nTokens will be issued from the Health Center reception desk starting from Thursday 08:30 AM. Please bring your National ID card and previous medical records when visiting.',
    tags: ['Specialist Clinic', 'Gan Regional Hospital', 'Pediatrics', 'Tokens'],
    likes: 84,
    comments: 19,
    shares: 26,
    badgeType: 'urgent',
    bannerGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    iconType: 'stethoscope'
  },
  // Maavah Council Announcements
  {
    id: 'mc-01',
    sourceId: 'council',
    sourceName: 'Maavah Council',
    sourceHandle: '@LaamuMaavahCouncil',
    sourceUrl: 'https://www.facebook.com/LaamuMaavahCouncil',
    timestamp: '2026-10-15T16:45:00Z',
    timeAgo: 'Yesterday at 4:45 PM',
    isPinned: true,
    category: 'Public Works & Maritime',
    title: 'Harbor Basin Deepening & Southern Breakwater Revitalization Consultation',
    dhivehiSnippet: 'މާވަށު ބަނދަރު ފުންކުރުމާއި ދެކުނު ފަރާތު ބޭރުތޮށި މަރާމާތު ކުރުމުގެ މަޝްރޫޢާ ގުޅޭގޮތުން ރައްޔިތުންގެ ޚިޔާލު ހޯދުމުގެ ބައްދަލުވުން.',
    content: 'The Secretariat of the Maavah Council cordially invites all boat captains, fishermen, and respected citizens of Maavah to a public consultation session regarding the upcoming Harbor Basin Deepening and Southern Breakwater Revitalization project.\n\nDate: Saturday evening, 8:30 PM\nVenue: Maavah Council Secretariat Hall\nYour inputs and feedback regarding vessel navigation channels and moorings are invaluable for this key island infrastructure development.',
    tags: ['Harbor Works', 'Infrastructure', 'Public Consultation', 'Navigation'],
    likes: 112,
    comments: 34,
    shares: 41,
    badgeType: 'official',
    bannerGradient: 'linear-gradient(135deg, #f0f7ff 0%, #e0effe 100%)',
    iconType: 'anchor'
  },
  // Maavashu School Updates
  {
    id: 'ms-01',
    sourceId: 'school',
    sourceName: 'Maavashu School',
    sourceHandle: '@MaavashuSchool',
    sourceUrl: 'https://www.facebook.com/MaavashuSchool',
    timestamp: '2026-10-15T11:15:00Z',
    timeAgo: 'Yesterday at 11:15 AM',
    isPinned: false,
    category: 'Academic Excellence',
    title: 'Grade 10 Cambridge IGCSE & SSC Mock Examination Orientation',
    dhivehiSnippet: 'ގްރޭޑް 10 ގެ ދަރިވަރުންގެ މޮކް އިމްތިޙާނުގެ ތައްޔާރީތަކާއި ސްޓަޑީ ކޭމްޕް ފެށުން.',
    content: 'Warm congratulations to our Grade 10 students and faculty on completing the initial intensive phase of the Cambridge IGCSE syllabus! The official Mock Examinations will commence next week.\n\nSpecial night study camps and peer coaching groups have been scheduled in the multi-purpose hall. We express our gratitude to parents for their unwavering support and encouragement towards our youth.',
    tags: ['IGCSE', 'SSC', 'Grade 10', 'Mock Exams', 'Study Camp'],
    likes: 96,
    comments: 15,
    shares: 18,
    badgeType: 'education',
    bannerGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    iconType: 'academic'
  },
  // Maavah Council
  {
    id: 'mc-02',
    sourceId: 'council',
    sourceName: 'Maavah Council',
    sourceHandle: '@LaamuMaavahCouncil',
    sourceUrl: 'https://www.facebook.com/LaamuMaavahCouncil',
    timestamp: '2026-10-14T09:00:00Z',
    timeAgo: '2 days ago',
    isPinned: false,
    category: 'Environment & Waste Management',
    title: 'Island-Wide Green Cleanliness Drive & Plastic Waste Segregation Guidelines',
    dhivehiSnippet: 'މާވަށު ސާފުތާހިރުކަން ދެމެހެއްޓުމާއި ޕްލާސްޓިކް ކުނި ވަކިކޮށް އުކާލުމުގެ އައު އުސޫލު ތަންފީޒުކުރުން.',
    content: 'Under the "Clean Maavah, Beautiful Atoll" initiative, Maavah Council has instituted new municipal waste collection days. Organic green waste, metals, and household plastics must be placed in segregated bins at designated community pickup zones.\n\nCollection Schedule:\n- Monday & Wednesday: Organic kitchen waste\n- Saturday: Plastics, tins, and recyclables\nTogether, let us safeguard our pristine beaches and turquoise lagoon.',
    tags: ['Waste Management', 'Green Island', 'Beach Cleanup', 'Civic Responsibility'],
    likes: 145,
    comments: 28,
    shares: 53,
    badgeType: 'official',
    bannerGradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    iconType: 'leaf'
  },
  // Health Center Notice
  {
    id: 'hc-02',
    sourceId: 'health',
    sourceName: 'Maavashu Health Center',
    sourceHandle: '@MaavashuHealthCentr',
    sourceUrl: 'https://www.facebook.com/MaavashuHealthCentr',
    timestamp: '2026-10-13T14:20:00Z',
    timeAgo: '3 days ago',
    isPinned: false,
    category: 'Public Health Advisory',
    title: 'Monsoon Seasonal Alert: Prevent Mosquito Breeding & Dengue Awareness',
    dhivehiSnippet: 'ވިއްސާރަ މޫސުމާ ގުޅިގެން މަދިރި އުފެދޭ ތަންތަން ނައްތާލުމާއި ޑެންގީ ހުމުން ރައްކާތެރިވުމުގެ އިރުޝާދު.',
    content: 'Due to intermittent monsoonal showers across Laamu Atoll, residents are strongly urged to inspect outdoor compounds, discarded coconut shells, boat hulls, and plant pots to eliminate standing water.\n\nHealth center public health teams will carry out routine thermal fogging around residential quarters this evening between 05:30 PM and 06:30 PM. In case of high fever, body aches, or persistent vomiting, consult the on-duty medical officer immediately.',
    tags: ['Dengue Alert', 'Monsoon Health', 'Mosquito Fogging', 'Prevention'],
    likes: 72,
    comments: 8,
    shares: 33,
    badgeType: 'health',
    bannerGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    iconType: 'shield'
  },
  // Maavashu School Sports
  {
    id: 'ms-02',
    sourceId: 'school',
    sourceName: 'Maavashu School',
    sourceHandle: '@MaavashuSchool',
    sourceUrl: 'https://www.facebook.com/MaavashuSchool',
    timestamp: '2026-10-12T17:00:00Z',
    timeAgo: '4 days ago',
    isPinned: false,
    category: 'Sports & Student Life',
    title: 'Maavashu School Inter-House Athletics Championship 2026 Announced',
    dhivehiSnippet: 'މާވަށު ސްކޫލުގެ އަހަރީ ކުޅިވަރު މުބާރާތް އަންނަ މަހު ބޭއްވުމަށް ހަމަޖެހިއްޖެއެވެ.',
    content: 'Get ready for thrilling track and field action! The Maavashu School Inter-House Athletics Championship 2026 will take place next month at the island sports ground.\n\nHouse captains and sports mentors have commenced trials for sprint relays, long jump, shot put, and traditional Maldivian bashi/football fixtures. Parents are welcome to attend training sessions every evening from 4:30 PM.',
    tags: ['Athletics Meet', 'Student Sports', 'Inter-House', 'Youth'],
    likes: 128,
    comments: 22,
    shares: 39,
    badgeType: 'education',
    bannerGradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    iconType: 'trophy'
  },
  // Maavah Council - Social & Community
  {
    id: 'mc-03',
    sourceId: 'council',
    sourceName: 'Maavah Council',
    sourceHandle: '@LaamuMaavahCouncil',
    sourceUrl: 'https://www.facebook.com/LaamuMaavahCouncil',
    timestamp: '2026-10-11T13:40:00Z',
    timeAgo: '5 days ago',
    isPinned: false,
    category: 'Community Services',
    title: 'Application Window Opened for Maavah Youth Entrepreneurship & Skills Grant',
    dhivehiSnippet: 'ޒުވާނުންގެ ވިޔަފާރިތަކާއި ހުނަރުވެރިކަން ކުރިއެރުވުމަށް ކައުންސިލުން ދޫކުރާ އެހީއަށް އެދުމުގެ ފުރުސަތު ހުޅުވާލުން.',
    content: 'The Secretariat of Maavah Council is pleased to open application submissions for the 2026 Maavah Youth Entrepreneurship Grant. Financial assistance up to MVR 25,000 will be awarded to eligible youth initiatives in eco-tourism, handicrafts, fisheries value-addition, and digital freelance skills.\n\nApplication forms can be downloaded from the council portal or collected from the reception desk during government working hours.',
    tags: ['Youth Grant', 'Entrepreneurship', 'Local Economy', 'Council Initiative'],
    likes: 167,
    comments: 42,
    shares: 61,
    badgeType: 'official',
    bannerGradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    iconType: 'briefcase'
  },
  // Health Center Immunization
  {
    id: 'hc-03',
    sourceId: 'health',
    sourceName: 'Maavashu Health Center',
    sourceHandle: '@MaavashuHealthCentr',
    sourceUrl: 'https://www.facebook.com/MaavashuHealthCentr',
    timestamp: '2026-10-10T10:00:00Z',
    timeAgo: '6 days ago',
    isPinned: false,
    category: 'Immunization Clinic',
    title: 'Routine Childhood Vaccination and Infant Health Checkup Session',
    dhivehiSnippet: 'ކުޑަކުދިންނަށް ޖަހާ ވެކްސިން އަދި ތުއްތު ކުދިންގެ ބަރުދަން ބެލުމުގެ ސެޝަން.',
    content: 'The regular weekly Childhood Vaccination Clinic will be held every Tuesday from 08:30 AM to 12:00 PM at Maavashu Health Center.\n\nParents of newborns and toddlers are requested to bring the official Child Health Record book. Our community health officers will also be conducting growth monitoring and nutritional counseling.',
    tags: ['Vaccination', 'Infant Care', 'Child Health', 'Preventive Care'],
    likes: 65,
    comments: 5,
    shares: 14,
    badgeType: 'health',
    bannerGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    iconType: 'baby'
  }
];

function getFeeds(source = 'all', searchQuery = '') {
  let list = POSTS;
  if (source && source !== 'all') {
    list = list.filter(p => p.sourceId === source);
  }
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }
  return list;
}

function getSourceInfo(sourceId) {
  return SOURCES[sourceId] || null;
}

function getAllSources() {
  return SOURCES;
}

module.exports = {
  getFeeds,
  getSourceInfo,
  getAllSources,
  SOURCES
};

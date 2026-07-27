export const initialUsers = [
  {
    _id: "usr_student_1",
    name: "Alex Morgan",
    email: "alex.student@university.edu",
    password: "$2a$10$X8O.U4gU9C.xKk4zF.0qEO5b0H3Z3vP0yQ5n6G7h8i9j0k1l2m3n4", // hashed "password123"
    role: "student",
    department: "Computer Science",
    studentId: "CS-2024-0891",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    phone: "+1 (555) 234-5678",
    bio: "CS sophomore interested in Artificial Intelligence and Web Development.",
    favorites: ["res_room_101", "res_lab_302"],
    joinedClubs: ["club_code_craft", "club_robotics"],
    joinedEvents: ["evt_hackathon_2026", "evt_ai_workshop"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "usr_clubadmin_1",
    name: "Sarah Chen",
    email: "sarah.admin@university.edu",
    password: "$2a$10$X8O.U4gU9C.xKk4zF.0qEO5b0H3Z3vP0yQ5n6G7h8i9j0k1l2m3n4",
    role: "club_admin",
    department: "Electrical Engineering",
    studentId: "EE-2023-0412",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    phone: "+1 (555) 876-5432",
    bio: "President of CodeCraft Society. Passionate about robotics and tech workshops.",
    favorites: ["res_hall_a"],
    joinedClubs: ["club_code_craft"],
    joinedEvents: ["evt_hackathon_2026"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "usr_superadmin_1",
    name: "Prof. Robert Vance",
    email: "admin@university.edu",
    password: "$2a$10$X8O.U4gU9C.xKk4zF.0qEO5b0H3Z3vP0yQ5n6G7h8i9j0k1l2m3n4",
    role: "super_admin",
    department: "University Administration",
    studentId: "ADM-001",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    phone: "+1 (555) 100-2000",
    bio: "Head of Campus Resource Coordination and Academic Operations.",
    favorites: [],
    joinedClubs: [],
    joinedEvents: [],
    createdAt: new Date().toISOString()
  }
];

export const initialResources = [
  {
    _id: "res_room_101",
    name: "Quiet Study Pod 101",
    type: "Study Rooms",
    building: "Main Library - 2nd Floor",
    capacity: 6,
    description: "Sound-insulated quiet group study pod equipped with 55-inch interactive display, whiteboards, HDMI connectivity, and dual power outlets.",
    amenities: ["Whiteboard", "TV Screen", "Wi-Fi", "Power Outlets", "Air Conditioning"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 14,
    openingTime: "08:00",
    closingTime: "22:00",
    slotDurationMinutes: 60
  },
  {
    _id: "res_lab_302",
    name: "Advanced GPU Computing Lab",
    type: "Computer Labs",
    building: "Turing Science Complex - Room 302",
    capacity: 35,
    description: "High-performance computing lab with 30 workstations running RTX GPUs, MATLAB, PyTorch, Docker, and dual 4K monitors.",
    amenities: ["High-Spec PCs", "Projector", "Gigabit LAN", "Air Conditioning", "Printing"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 22,
    openingTime: "09:00",
    closingTime: "21:00",
    slotDurationMinutes: 120
  },
  {
    _id: "res_seat_l4",
    name: "Library Silent Zone Seat L-42",
    type: "Library Seats",
    building: "Central Library - 4th Floor Silent Zone",
    capacity: 1,
    description: "Private single study cubicle with ergonomic chair, LED desk reading lamp, privacy screen, and fast Wi-Fi.",
    amenities: ["Ergonomic Chair", "Desk Lamp", "Power Outlet", "Silent Area"],
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.6,
    reviewsCount: 8,
    openingTime: "07:00",
    closingTime: "23:00",
    slotDurationMinutes: 120
  },
  {
    _id: "res_hall_a",
    name: "Grand Auditorium Hall A",
    type: "Auditorium",
    building: "Student Activity Center",
    capacity: 300,
    description: "State-of-the-art multi-tier auditorium suitable for guest lectures, university summits, cultural performances, and hackathons.",
    amenities: ["Surround Sound", "Dual HD Projectors", "Stage Lighting", "Stage Mics", "VIP Seating"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.95,
    reviewsCount: 31,
    openingTime: "08:00",
    closingTime: "22:00",
    slotDurationMinutes: 180
  },
  {
    _id: "res_court_b",
    name: "Indoor Basketball Court B",
    type: "Sports Facilities",
    building: "University Sports Complex",
    capacity: 20,
    description: "Full-size hardwood basketball court featuring electronic scoreboard, bleacher seating for spectators, and locker room access.",
    amenities: ["Hardwood Floor", "Scoreboard", "Locker Rooms", "Water Fountain", "Equipment Rental"],
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 19,
    openingTime: "06:00",
    closingTime: "22:00",
    slotDurationMinutes: 60
  },
  {
    _id: "res_seminar_2",
    name: "Executive Seminar Room 2",
    type: "Seminar Halls",
    building: "Business & Management Wing",
    capacity: 50,
    description: "Tiered seating seminar hall with wireless presentation podium, video conferencing system, and acoustically treated walls.",
    amenities: ["Video Conferencing", "Wireless Mic", "Podium", "HD Screen", "Air Conditioning"],
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    rating: 4.85,
    reviewsCount: 11,
    openingTime: "08:00",
    closingTime: "20:00",
    slotDurationMinutes: 120
  }
];

export const initialClubs = [
  {
    _id: "club_code_craft",
    name: "CodeCraft Developer Society",
    category: "Technology",
    description: "A student-driven software development, competitive programming, and open-source contribution club.",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    leaderId: "usr_clubadmin_1",
    leaderName: "Sarah Chen",
    members: [
      { userId: "usr_clubadmin_1", name: "Sarah Chen", role: "President", status: "approved" },
      { userId: "usr_student_1", name: "Alex Morgan", role: "Member", status: "approved" }
    ],
    pendingRequests: [],
    createdDate: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    _id: "club_robotics",
    name: "Autonomous Robotics Guild",
    category: "Engineering",
    description: "Designing, building, and programming intelligent autonomous rovers, drones, and AI systems.",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
    leaderId: "usr_clubadmin_1",
    leaderName: "Sarah Chen",
    members: [
      { userId: "usr_student_1", name: "Alex Morgan", role: "Member", status: "approved" }
    ],
    pendingRequests: [],
    createdDate: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

export const initialEvents = [
  {
    _id: "evt_hackathon_2026",
    title: "CampusHack 2026: AI & Sustainability",
    description: "24-Hour Annual University Hackathon bringing together programmers, designers, and innovators to build impactful real-world solutions.",
    clubId: "club_code_craft",
    clubName: "CodeCraft Developer Society",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    venue: "Grand Auditorium Hall A",
    capacity: 200,
    registeredCount: 45,
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    registrationDeadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    participants: ["usr_student_1", "usr_clubadmin_1"],
    status: "Upcoming"
  },
  {
    _id: "evt_ai_workshop",
    title: "Hands-on Deep Learning & LLM Fine-Tuning",
    description: "Interactive workshop exploring transformer architectures, prompt engineering, and fine-tuning open-weights AI models on GPU clusters.",
    clubId: "club_code_craft",
    clubName: "CodeCraft Developer Society",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    venue: "Advanced GPU Computing Lab (Room 302)",
    capacity: 30,
    registeredCount: 28,
    eventDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    registrationDeadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    participants: ["usr_student_1"],
    status: "Upcoming"
  }
];

export const initialAnnouncements = [
  {
    _id: "anc_library_extended",
    title: "Extended Central Library Hours for Midterm Week",
    content: "The Central Library and 4th Floor Silent Study Pods will remain open 24/7 starting this Monday through Friday to support mid-term preparation.",
    priority: "High",
    targetAudience: "All Students",
    author: "University Administration",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 10 * 86400000).toISOString()
  },
  {
    _id: "anc_sports_maintenance",
    title: "Indoor Sports Complex Annual Floor Refinishing",
    content: "Basketball Court A and Badminton Courts will be briefly closed for hardwood varnish maintenance this coming Saturday from 06:00 to 14:00.",
    priority: "Medium",
    targetAudience: "Students & Staff",
    author: "Sports Committee",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 4 * 86400000).toISOString()
  }
];

export const initialBookings = [
  {
    _id: "bk_1001",
    userId: "usr_student_1",
    userName: "Alex Morgan",
    userEmail: "alex.student@university.edu",
    resourceId: "res_room_101",
    resourceName: "Quiet Study Pod 101",
    resourceType: "Study Rooms",
    building: "Main Library - 2nd Floor",
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:00",
    purpose: "Group project meeting for CS201 Machine Learning project.",
    status: "Approved",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    _id: "bk_1002",
    userId: "usr_student_1",
    userName: "Alex Morgan",
    userEmail: "alex.student@university.edu",
    resourceId: "res_lab_302",
    resourceName: "Advanced GPU Computing Lab",
    resourceType: "Computer Labs",
    building: "Turing Science Complex - Room 302",
    bookingDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Model training session for deep neural net research.",
    status: "Approved",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  }
];

export const initialReviews = [
  {
    _id: "rev_101",
    resourceId: "res_room_101",
    userId: "usr_student_1",
    userName: "Alex Morgan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    comment: "Excellent study pod! The TV screen connected seamlessly via HDMI and the noise isolation is top notch.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

export const initialNotifications = [
  {
    _id: "notif_1",
    userId: "usr_student_1",
    title: "Booking Approved",
    message: "Your booking request for Quiet Study Pod 101 has been approved.",
    type: "booking",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    _id: "notif_2",
    userId: "usr_student_1",
    title: "New Club Event",
    message: "CodeCraft Developer Society published CampusHack 2026. Register now!",
    type: "event",
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

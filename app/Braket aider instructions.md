# BRaket MVP - Development Instructions for Aider AI

## CRITICAL: FOLLOW EXISTING PROJECT STANDARDS

**BEFORE STARTING ANY WORK:**

1. **READ `agents.md` COMPLETELY** - Contains all project-specific coding standards and best practices
2. **REVIEW ALL `.md` FILES** in project root - Style guides, component patterns, naming conventions
3. **EXAMINE EXISTING COMPONENT STRUCTURE** - Match established patterns for consistency

---

## PROJECT OVERVIEW

**Platform Name:** BRaket  
**Type:** Dual-sided marketplace connecting clients with talented professionals  
**MVP Scope:** Core booking UI functionality only (pure UI, no database integration yet)  
**Tech Stack:**
- Frontend: React 18+ with TypeScript
- Styling: Tailwind CSS
- Routing: React Router v6
- State Management: React Context API + Hooks

---

## PROJECT FOLDER STRUCTURE

FOLLOW FOLDER STRUCTURE BASED ON THE PROJECT AND AGENT.MDS

---

## MVP PAGES (13 Total)

### PUBLIC PAGES

#### 1. Landing Page
**Path:** `src/pages/public/LandingPage.tsx`

**Sections:**
- Header with logo, "Browse Talent" link, "Sign In" / "Sign Up" buttons
- Hero section with headline, value proposition, two CTAs
- Featured categories grid (6 categories)
- "How It Works" section (3 steps)
- Footer with basic links

**User Actions:**
- "Find Talent" → `/browse`
- "Become a Talent" → `/signup` (with role=talent)
- Category card → `/browse?category=X`

---

#### 2. Browse Talents/Services
**Path:** `src/pages/public/BrowsePage.tsx`

**Layout:**
- Search bar (top)
- Filters sidebar: Category dropdown, Price range slider
- Results grid (3-4 per row on desktop)
- Sorting: Relevance, Price (low/high), Rating

**Talent Card displays:**
- Profile picture
- Name
- Headline
- Hourly rate
- Top 3 skills (badges)
- "View Profile" button

**User Actions:**
- Search by keyword
- Filter by category
- Adjust price range
- Click card → talent profile

---

#### 3. Talent Public Profile
**Path:** `src/pages/public/TalentProfilePage.tsx`  
**URL:** `/talent/:username`

**Sections:**
- Header: Avatar, name, headline, rate, availability badge, "Book Service" button
- About section: Bio text
- Skills section: All skills with proficiency levels
- Services grid: Service cards with "Book This" buttons

**User Actions:**
- Click "Book Service" → `/book/:serviceId`
- View skills and services

---

### AUTHENTICATION PAGES

#### 4. Sign Up Page
**Path:** `src/pages/auth/SignUpPage.tsx`

**Form:**
- Email (required, validation)
- Password (required, min 8 chars)
- Confirm Password (required, must match)
- Role selection (radio buttons):
  - "Hire talent"
  - "Offer services"
- Terms & Conditions checkbox (required)

**Validation:**
- Email format valid
- Passwords match
- Role selected

**User Actions:**
- Submit form → account created, role-based redirect
- "Already have account?" → login page

---

#### 5. Login Page
**Path:** `src/pages/auth/LoginPage.tsx`

**Form:**
- Email (required)
- Password (required)

**Validation:**
- Credentials checked
- Show user-friendly errors

**User Actions:**
- Submit → redirected based on role (client or talent dashboard)
- "Don't have account?" → signup page

---

#### 6. Talent Onboarding
**Path:** `src/pages/auth/OnboardingPage.tsx`

**Form (single page):**

**Section 1: Basic Information**
- Username (required, unique)
- First name (required)
- Last name (required)
- Headline (required)
- Bio (required, 150-500 chars)

**Section 2: Rates**
- Min hourly rate (required, $1+)
- Max hourly rate (required, > min)

**Section 3: Skills**
- Multi-select skills (3-10 required)
- Proficiency level per skill (beginner/intermediate/expert)

**Validation:**
- All required fields
- Username unique
- Max > min
- 3+ skills selected

**User Actions:**
- Submit → `/dashboard/talent/services/new`

---

### CLIENT PAGES

#### 7. Client Dashboard
**Path:** `src/pages/client/ClientDashboard.tsx`

**Layout:** DashboardLayout (client sidebar)

**Content:**
- Welcome message
- "Browse Talent" CTA button
- "Your Active Bookings" section
- Empty state if no bookings

**User Actions:**
- Click "Browse Talent" → `/browse`
- Click booking card → booking detail
- Sidebar navigation

---

#### 8. My Bookings (Client)
**Path:** `src/pages/client/MyBookingsClient.tsx`

**Layout:** DashboardLayout with tabs

**Tabs:** All, Pending, Active, Completed

**Booking Card:**
- Talent avatar, name, headline
- Service title
- Client's request message
- Status badge
- Date requested
- Action buttons (based on status)

**Actions:**
- Pending: "Cancel Request"
- Active: "Mark Complete"
- Completed: Static display

**User Actions:**
- Switch tabs → filter bookings
- Cancel/complete actions

---

#### 9. Booking Request Page
**Path:** `src/pages/client/BookingRequestPage.tsx`  
**URL:** `/book/:serviceId`

**Layout:**
- Service summary (read-only): title, talent, price
- Booking form

**Form:**
- Project details (required, textarea)
- Budget (optional)
- Additional notes (optional)

**Validation:**
- Project details required

**User Actions:**
- Submit → booking created, redirect to `/dashboard/client/bookings`
- Cancel → back to previous page

---

### TALENT PAGES

#### 10. Talent Dashboard
**Path:** `src/pages/talent/TalentDashboard.tsx`

**Layout:** DashboardLayout (talent sidebar)

**Content:**
- Quick stats cards: Active Bookings, Pending Requests, Total Services
- New Booking Requests section

**Booking Request Card:**
- Client avatar, name
- Service requested
- Project details
- Date
- "Accept" / "Decline" buttons

**User Actions:**
- Accept/Decline requests
- Navigate via sidebar

---

#### 11. My Services
**Path:** `src/pages/talent/MyServices.tsx`

**Layout:** DashboardLayout with "Create New Service" button (top right)

**Service Card:**
- Title
- Description (truncated)
- Category badge
- Price
- Status badge
- Edit / Delete buttons

**Empty state:** "No services yet" + CTA button

**User Actions:**
- Click "Create New" → `/dashboard/talent/services/new`
- Edit/Delete service
- View all services

---

#### 12. Create Service
**Path:** `src/pages/talent/CreateServicePage.tsx`

**Form:**
- Service Title (required)
- Description (required, 150-1000 chars)
- Category (required, dropdown)
- Price (required, $1+)

**Submit buttons:**
- "Save as Draft"
- "Publish Service"

**Validation:**
- All required fields
- Description length
- Price > 0

**User Actions:**
- Publish/Draft → `/dashboard/talent/services`
- Cancel → services list

---

#### 13. My Bookings (Talent)
**Path:** `src/pages/talent/MyBookingsTalent.tsx`

**Layout:** DashboardLayout with tabs

**Tabs:** New Requests, Active, Completed

**Booking Card:**
- Client avatar, name
- Service title
- Project details
- Status
- Date
- Action buttons

**Actions:**
- New: Accept / Decline
- Active: Mark Complete
- Completed: Static

**User Actions:**
- Switch tabs → filter
- Accept/Decline/Complete

---

### SHARED PAGE

#### 14. Settings
**Path:** `src/pages/shared/SettingsPage.tsx`

**Layout:** DashboardLayout with 2 tabs

**Profile Tab:**
- Username, First Name, Last Name, Bio (all roles)
- Headline, Min Rate, Max Rate (talent only)
- "Save Changes" button

**Account Tab:**
- Current Password
- New Password
- Confirm New Password
- "Update Password" button

**Validation:**
- Username unique
- Password requirements

**User Actions:**
- Update profile
- Change password

---

## ROUTING STRUCTURE

**Public Routes:**
```
/                    → Landing Page
/browse              → Browse Talents
/talent/:username    → Talent Profile
/signup              → Sign Up
/login               → Login
```

**Protected Routes (talent):**
```
/onboarding/talent               → Onboarding
/dashboard/talent                → Dashboard
/dashboard/talent/services       → My Services
/dashboard/talent/services/new   → Create Service
/dashboard/talent/bookings       → My Bookings
```

**Protected Routes (client):**
```
/dashboard/client                → Dashboard
/dashboard/client/bookings       → My Bookings
/book/:serviceId                 → Booking Request
```

**Shared Protected:**
```
/settings            → Settings
```

**Route Guards:**
- `ProtectedRoute` - Checks authentication, redirects to `/login`
- `RoleRoute` - Checks role, redirects to correct dashboard

---

## REUSABLE COMPONENTS

### Common (`src/components/common/`)

- **Button** - Props: variant, size, fullWidth, to (link support)
- **Input** - Props: label, error, type, placeholder, required
- **Badge** - Props: children, variant (success/warning/danger)
- **Avatar** - Props: src, alt, size (sm/md/lg/xl)
- **Card** - Props: children, className

### Forms (`src/components/forms/`)

- SignUpForm
- LoginForm
- ServiceForm (create/edit)
- BookingForm
- OnboardingForm

### Cards (`src/components/cards/`)

- **TalentCard** - Browse page display
- **ServiceCard** - Services list display
- **BookingCard** - Booking display (dual-mode: client/talent)

### Layout (`src/components/layout/`)

- **Header** - Logo, nav links, auth buttons (sticky)
- **Footer** - Links, copyright (minimal)
- **DashboardLayout** - Sidebar + main content (role-aware)
- **Sidebar** - Nav items (role-specific)
- **PublicLayout** - Header + content + Footer

### Auth (`src/components/auth/`)

- **ProtectedRoute** - Auth check wrapper
- **RoleRoute** - Role check wrapper

---

## CONTEXT PROVIDERS

### AuthContext (`src/contexts/AuthContext.tsx`)

**Provides:**
- `user` object (current auth user or null)
- `loading` boolean
- `signOut()` function

### UserContext (`src/contexts/UserContext.tsx`)

**Provides:**
- `profile` object (with role)
- `loading` boolean
- `refetch()` function

---

## CUSTOM HOOKS

- **useAuth** - Access auth context
- **useUser** - Access user profile context
- **useBookings** - Fetch bookings (client/talent modes)
- **useServices** - Fetch/manage services (CRUD operations)

---

## UTILITY FUNCTIONS (`src/lib/utils.ts`)

```typescript
cn()                 // Combine Tailwind classes
formatDate()         // Format date strings
formatCurrency()     // Format as currency ($XX.XX)
truncate()          // Truncate text with ellipsis
getStatusVariant()  // Map status to badge variant
```

---

## TYPESCRIPT TYPES (`src/types/`)

Define strict interfaces for all data structures:
- AuthUser
- StateProfile
- TalentProfile
- ClientProfile
- Skill
- TalentSkill
- Category
- ServiceListing
- Booking
- Commission

Export from central index for easy importing.

---

## BUILD ORDER (4 Weeks)

### Week 1: Foundation & Layout
1. Setup project structure, dependencies, TypeScript
2. Configure Tailwind CSS
3. Build all common components (Button, Input, Avatar, Badge, Card)
4. Create context providers (AuthContext, UserContext)
5. Build auth guard components (ProtectedRoute, RoleRoute)
6. Build layout components (Header, Footer, DashboardLayout, Sidebar)
7. Setup routing structure
8. Static Landing Page mockup

### Week 2: Authentication UI
1. Sign Up page
2. Login page
3. Onboarding page (all sections)
4. Skills selector component
5. Form validation logic
6. Test auth flow end-to-end

### Week 3: Talent Pages
1. Create Service page
2. My Services page (list view)
3. Talent Dashboard
4. My Bookings (Talent)
5. Test talent workflow

### Week 4: Client Pages & Polish
1. Browse Talents page with filters
2. Talent Public Profile
3. Booking Request page
4. Client Dashboard
5. My Bookings (Client)
6. Settings page (both roles)
7. Polish UI, mobile responsiveness
8. Add loading states and empty states
9. Final testing and refinements

---

## CODE QUALITY STANDARDS

- ✅ Use functional components with hooks only
- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use strict TypeScript (no `any` types)
- ✅ Follow consistent naming conventions
- ✅ Semantic HTML with accessibility
- ✅ Handle all edge cases (empty states, loading, errors)
- ✅ Mobile responsive throughout
- ✅ Add comments for complex logic

---

## TESTING CHECKLIST

### Client User Flow
- [ ] Sign up as client
- [ ] Browse talents with filters
- [ ] View talent profile
- [ ] Request booking
- [ ] View pending booking
- [ ] Accept booking (when implemented)
- [ ] Mark complete
- [ ] Update settings

### Talent User Flow
- [ ] Sign up as talent
- [ ] Complete onboarding
- [ ] Create service
- [ ] View services list
- [ ] See booking requests on dashboard
- [ ] Accept/Decline booking
- [ ] Mark booking complete
- [ ] Update settings

### General
- [ ] Auth persists on page refresh
- [ ] Protected routes redirect to login
- [ ] Role routes redirect correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Forms validate correctly
- [ ] Loading states display
- [ ] Empty states display

---

## SUCCESS CRITERIA

MVP UI is complete when:
- ✅ All 13 pages built and functional
- ✅ Users can sign up for both roles
- ✅ Talents can create profiles and services
- ✅ Clients can browse and request bookings
- ✅ All CRUD operations work
- ✅ No breaking bugs
- ✅ Fully mobile responsive
- ✅ All testing checklist items pass

---

## IMPORTANT REMINDERS

1. **Follow existing standards** - Check `agents.md` and project docs
2. **UI-only focus** - No database implementation yet
3. **Keep homepage intact** - Don't modify landing page structure
4. **Build incrementally** - Follow week-by-week order
5. **Test as you go** - Verify each page before next
6. **Mobile first** - Test responsiveness throughout
7. **TypeScript strictly** - Use proper types, avoid `any`

---

## FINAL NOTES

- Read `agents.md` before starting
- Follow folder structure exactly
- Match existing component patterns
- Keep UI pure (state-based, no API calls yet)
- Test navigation flows frequently
- Refer back to this document for reference

Good luck! 🚀
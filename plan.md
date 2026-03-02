# Kreativibe – Frontend-Only Rebuild Plan

Rebuild Kreativibe as a pure frontend Next.js app that delegates all data, auth, and file operations to a dedicated backend via API calls.

---

## Full Codebase Summary

### What Kreativibe Does
A **two-sided content marketplace** for the Kenyan market. Content creators sell branded content; businesses/brands discover and buy it. Admins oversee KYC verification, user management, and platform settings.

### User Roles
| Role | Description |
|---|---|
| `CREATIVE` | Creator who uploads & sells content posts |
| `BRAND` | Business that browses marketplace & runs campaigns |
| `ADMIN` | Platform operator with full control |
| `SUPPORT` | (Reserved, no UI yet) |

---

## Complete Page & Feature Inventory

### Public Pages
- **`/`** — Landing page: hero, stats, CTA buttons
- **`/marketplace`** — Browse creator posts with filters (niche, price, platform, followers, availability) + search. Currently uses mock data.
- **`/auth/login`** — Email/password login + Google OAuth
- **`/auth/signup`** — Role-tabbed signup form (Creator / Brand), password rules, country select
- **`/auth/forgot-password`** — Send reset link
- **`/auth/reset-password`** — Reset password with token
- **`/auth/new-verification`** — Email verification landing

### Creator Dashboard (`/dashboard/creative`)
| Page | What it does |
|---|---|
| `/` (overview) | Stats cards (earnings, gigs, profile views, success rate), recent projects list, wallet transaction history |
| `/posts` | Grid/list view of own posts, search by title/brand/description, filter by status, create/delete |
| `/posts/new` | Multi-field form: title, brand, category, format, platforms, price, media upload, cover image upload |
| `/onboarding` | **3-step KYC wizard** (details below) |
| `/brands` | Browse available brand profiles |
| `/portfolio` | Creator's own portfolio |
| `/profile` | Edit own profile |

**KYC Wizard Steps:**
1. **Identity** — Upload ID front + back → OCR auto-fills name, national ID, DOB; manually enter phone, city
2. **Tax** — Upload KRA certificate → OCR auto-fills KRA PIN, effective date, tax obligation
3. **Social presence** — Instagram + TikTok (mandatory with follower count), YouTube, Facebook, X, Behance (optional); terms acceptance

### Brand Dashboard (`/dashboard/brand`)
| Page | What it does |
|---|---|
| `/` (overview) | Stats (campaigns, reach, engagement, budget), active campaigns list, top creators panel |
| `/onboarding` | **4-step brand profile wizard** |
| `/profile` | View/edit brand profile |
| `/campaigns` | Campaign management |
| `/analytics` | Analytics dashboard |

**Brand Profile Wizard Steps:**
1. Brand name, industry category, description
2. Address, city, country, website, phone, contact email
3. Logo upload, cover image upload, terms acceptance
4. Social media links (all optional)

### Admin Dashboard (`/dashboard/admin`)
| Page | What it does |
|---|---|
| `/` (overview) | Platform stats, 30-day growth chart, quick action buttons |
| `/creators` | Table: all creators with KYC status, IPRS status, KRA status, active/deactivated badge, join date; activate/deactivate action |
| `/verify/[id]` | Individual KYC review: see creator details (ID, KRA PIN, location, IPRS/KRA results), approve/reject with admin comments |
| `/brands` | Brand management table |
| `/transactions` | Financial transactions list |
| `/analytics` | Platform reports |
| `/settings` | Currency, tax rate, payout methods; add/remove countries with per-country currency & tax |
| `/settings/notifications` | Manage notification templates (SMS & email) |
| `/users` | Full user management |

---

## What Exists Now vs. What Needs to Change

### Current Backend Coupling (to remove)
| File | Used For | Replace With |
|---|---|---|
| `src/auth.ts` | NextAuth config, Prisma adapter | JWT auth context |
| `src/actions/register.ts` | Create user in DB, send verification email | `POST /auth/register` |
| `src/actions/auth-reset.ts` | Password reset tokens | `POST /auth/forgot-password`, `POST /auth/reset-password` |
| `src/actions/new-verification.ts` | Email verification | `POST /auth/verify-email` |
| `src/actions/kyc.ts` | Save KYC data, run IPRS/KRA check, send SMS | `POST /kyc/submit` |
| `src/actions/onboarding.ts` | Older onboarding flow (wallet creation) | Covered by kyc/submit |
| `src/actions/post.ts` | Create/read/update/delete posts | Posts API service |
| `src/actions/brand.ts` | Brand profile CRUD | Brand API service |
| `src/actions/admin.ts` | Get creators, approve/reject KYC | Admin API service |
| `src/actions/admin-settings.ts` | System settings, countries | Admin settings API |
| `src/actions/profile.ts` | Profile updates | Profile API service |
| `src/actions/upload.ts` / `upload-file.ts` | Firebase Admin file upload | Backend upload endpoint or client Firebase SDK |
| `src/actions/ocr-action.ts` | OCR via Tesseract/Gemini | `POST /ocr` (backend handles) |
| `src/actions/notifications.ts` | Notification template CRUD | Admin notifications API |
| `src/lib/prisma.ts` | DB client | Remove |
| `src/lib/firebase-admin.ts` | Firebase Admin SDK | Remove |
| `src/lib/firebase-storage.ts` | Firebase Admin storage | Remove |
| `src/lib/firebase-upload.ts` | Firebase Admin uploads | Remove |
| `src/lib/gemini-ocr.ts` | Gemini OCR | Remove |
| `src/lib/ocr.ts` | Tesseract OCR | Remove |
| `src/lib/mail.ts` | Email sending | Backend handles |
| `src/lib/sms.ts` | SMS sending | Backend handles |
| `src/lib/tokens.ts` | Token generation | Backend handles |
| `src/lib/templates.ts` | Notification template processor | Backend handles |

### Keep As-Is
- All `src/components/` UI files (zero backend coupling in most)
- `src/lib/constants.ts` (refactor: remove Prisma enum imports)
- `src/lib/utils.ts`
- `src/lib/mockMarketplaceData.ts` (temporarily, swap for API)
- `src/lib/firebase.ts` (client SDK, used for direct uploads if needed)
- All CSS / design system files
- `src/app/globals.css`, `tailwind.config.js`
- `public/` directory

### Already Partially Migrated
- **Dashboard layout** (`src/app/dashboard/layout.tsx`) — already uses mock session via `sessionStorage`
- **Login form** — already simulates login with `sessionStorage.setItem('mockLoggedIn', 'true')`
- **Signup form** — already shows fake success toast (no actual DB call)
- **Marketplace page** — already uses `mockCreatorPosts` (no DB call)

---

## Frontend-Only Architecture

```
src/
├── lib/
│   ├── api-client.ts         ← Centralized axios client with JWT interceptors (exists)
│   └── constants.ts          ← Refactored (remove Prisma imports)
├── services/
│   ├── auth.service.ts       ← login, register, logout, refresh, forgot/reset password
│   ├── kyc.service.ts        ← submitKyc, getKycStatus
│   ├── post.service.ts       ← createPost, getPosts, deletePost, updatePostStatus
│   ├── profile.service.ts    ← getProfile, updateProfile, uploadAvatar
│   ├── brand.service.ts      ← getBrandProfile, submitBrandProfile, getAllBrands
│   ├── admin.service.ts      ← getCreators, approveKyc, rejectKyc, toggleUser
│   ├── admin-settings.service.ts ← getSettings, updateSettings, addCountry
│   ├── marketplace.service.ts ← getPosts, filterPosts, searchCreators
│   └── upload.service.ts     ← uploadFile (to backend or Firebase client)
├── contexts/
│   └── AuthContext.tsx        ← JWT auth state: user, role, isOnboarded, login, logout
├── hooks/
│   ├── useAuth.ts            ← Auth context consumer hook
│   ├── usePosts.ts           ← Posts data fetching & mutations
│   └── useProfile.ts         ← Profile data with loading states
├── types/
│   ├── auth.types.ts         ← User, Session, Role types
│   ├── post.types.ts         ← Post, PostStatus, PostFormat, Platform
│   ├── profile.types.ts      ← CreatorProfile, BrandProfile
│   └── api.types.ts          ← ApiResponse<T>, ApiError
└── app/
    └── (all existing pages — refactored to use services)
```

---

## Implementation Steps

### Step 1 – Foundation
1. Install `axios` (if not already), remove unused backend packages from `package.json`
2. `src/lib/api-client.ts` — centralized client with JWT attach + refresh logic *(already created)*
3. `src/types/` — define all TypeScript types for API responses (replacing Prisma types)
4. `src/contexts/AuthContext.tsx` — holds `user`, `role`, `isOnboarded`; reads token from localStorage; exposes `login()`, `logout()`, `refresh()`
5. Update `src/app/layout.tsx` to wrap with `AuthProvider`

### Step 2 – Auth Services & Pages
1. `src/services/auth.service.ts`
   - `login(email, password)` → `POST /auth/login` → store tokens
   - `register(name, email, password, role, countryId)` → `POST /auth/register`
   - `forgotPassword(email)` → `POST /auth/forgot-password`
   - `resetPassword(token, password)` → `POST /auth/reset-password`
   - `verifyEmail(token)` → `POST /auth/verify-email`
2. Update `LoginForm.tsx` to call `auth.service.login()` + redirect by role
3. Update `SignupForm.tsx` to call `auth.service.register()`
4. Update `ForgotPasswordForm`, `ResetPasswordForm`
5. Replace `mockLoggedIn` sessionStorage with real JWT from AuthContext
6. Route guards: middleware or per-page redirect using `useAuth()`

### Step 3 – Dashboard Layout & Navigation
1. Update `src/app/dashboard/layout.tsx` to read user from `AuthContext` instead of mock object
2. `SideMenu` and `DashboardHeader` already take `role` as prop — just pass from real context

### Step 4 – Creator Features
1. `src/services/post.service.ts` — CRUD for posts
2. Update `/dashboard/creative/page.tsx` — fetch earnings/transactions from `GET /creator/dashboard`
3. Update `/dashboard/creative/posts/page.tsx` — fetch from `GET /posts?creatorId=...&status=...&query=...`
4. Update `/dashboard/creative/posts/new/page.tsx` + `CreatePostForm` — `POST /posts`
5. `src/services/kyc.service.ts`
6. Update `KycForm.tsx`:
   - File uploads → `POST /upload` (receive back URL) or direct Firebase client
   - OCR → `POST /ocr` with file, receive extracted fields
   - Submit → `POST /kyc/submit`

### Step 5 – Brand Features
1. `src/services/brand.service.ts`
2. Update `/dashboard/brand/page.tsx` — `GET /brand/dashboard`
3. Update `BrandProfileWizard.tsx`:
   - Image uploads → same upload service as creator
   - Submit → `POST /brand/profile`
4. Update brand profile page

### Step 6 – Marketplace
1. `src/services/marketplace.service.ts` — `GET /marketplace/posts` with filter params
2. Update `/marketplace/page.tsx` — replace `mockCreatorPosts` with API call
3. Engage actions (like/message) → API calls

### Step 7 – Admin Features
1. `src/services/admin.service.ts`
2. Update `/dashboard/admin/creators/page.tsx` → `GET /admin/creators`
3. Update `/dashboard/admin/verify/[id]/page.tsx` + `VerificationForm` → `PATCH /admin/kyc/:userId`
4. Update `/dashboard/admin/settings/page.tsx` → settings & country management APIs
5. Update notifications template management

### Step 8 – Cleanup
1. Delete `src/actions/` directory entirely
2. Delete `src/auth.ts`
3. Delete `src/lib/prisma.ts`, `firebase-admin.ts`, `firebase-storage.ts`, `firebase-upload.ts`, `gemini-ocr.ts`, `ocr.ts`, `mail.ts`, `sms.ts`, `tokens.ts`, `templates.ts`
4. Remove from `package.json`: `@auth/prisma-adapter`, `next-auth`, `@prisma/client`, `prisma`, `bcryptjs`, `firebase-admin`, `tesseract.js`, `pdf-parse`, `@google/generative-ai`
5. Refactor `src/lib/constants.ts` to remove `import { Platform } from "@prisma/client"` — define types locally

---

## API Contract Expected From Backend

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | `{email, password}` → `{accessToken, refreshToken, user}` |
| POST | `/auth/register` | `{name, email, password, role, countryId}` → `{message}` |
| POST | `/auth/refresh` | `{refreshToken}` → `{accessToken, refreshToken}` |
| POST | `/auth/forgot-password` | `{email}` |
| POST | `/auth/reset-password` | `{token, password}` |
| POST | `/auth/verify-email` | `{token}` |
| GET | `/auth/me` | Returns current user |
| POST | `/upload` | `multipart/form-data` → `{url}` |
| POST | `/ocr` | `multipart + type` → `{data: {name, idNumber, ...}}` |
| POST | `/kyc/submit` | KYC form data → `{success}` |
| GET | `/creator/dashboard` | Stats + recent transactions |
| GET | `/posts` | `?creatorId&status&query` |
| POST | `/posts` | Create post |
| DELETE | `/posts/:id` | Delete post |
| PATCH | `/posts/:id/status` | Update post status |
| GET | `/brand/profile` | Get own brand profile |
| POST | `/brand/profile` | Create/update brand profile |
| GET | `/marketplace/posts` | `?niche&price&platform&followers&status&query` |
| GET | `/admin/creators` | All creators with KYC info |
| GET | `/admin/creators/:id` | Single creator detail |
| PATCH | `/admin/kyc/:userId` | `{status, adminComments}` → approve/reject |
| PATCH | `/admin/users/:id/toggle` | Activate/deactivate user |
| GET | `/admin/settings` | System settings + countries |
| PATCH | `/admin/settings` | Update system settings |
| POST | `/admin/countries` | Add country |
| DELETE | `/admin/countries/:id` | Remove country |
| GET | `/admin/notifications` | Notification templates |
| POST | `/admin/notifications` | Create template |
| PATCH | `/admin/notifications/:id` | Update template |

---

## Environment Variables (Frontend Only)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FIREBASE_API_KEY=...         # only if using client-side Firebase uploads
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## What to Keep vs. Delete

### Keep (no changes needed)
- All `src/components/` files *(mostly self-contained UI)*
- `src/app/globals.css`, `tailwind.config.js`, `postcss.config.js`
- `src/app/layout.tsx` *(small update: wrap with AuthProvider)*
- `src/app/page.tsx` *(homepage, pure UI)*
- `src/lib/utils.ts`, `src/lib/constants.ts` *(small refactor)*
- `public/` assets

### Delete After Migration
- `src/auth.ts`
- `src/actions/` *(all 14 files)*
- `src/lib/prisma.ts`
- `src/lib/firebase-admin.ts`
- `src/lib/firebase-storage.ts`
- `src/lib/firebase-upload.ts`
- `src/lib/gemini-ocr.ts`
- `src/lib/ocr.ts`
- `src/lib/mail.ts`
- `src/lib/sms.ts`
- `src/lib/tokens.ts`
- `src/lib/templates.ts`
- `prisma/` directory
- `eng.traineddata` / `swa.traineddata` *(Tesseract model files)*
- `cors.json` *(Firebase CORS config)*

### Create New
- `src/lib/api-client.ts` *(already done)*
- `src/services/` *(8 service files)*
- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`, `usePosts.ts`, `useProfile.ts`
- `src/types/auth.types.ts`, `post.types.ts`, `profile.types.ts`, `api.types.ts`

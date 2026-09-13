# Security & Authentication Specifications

## 1. Password Policy & Hashing

- Algorithm: `bcrypt` (minimum 12 salt rounds) or `argon2id`.
- Never store raw passwords.
- Validation: Minimum 8 characters, at least 1 number and 1 uppercase letter.

## 2. Authentication Flow

- Providers: NextAuth / Auth.js with:
  - Credentials Provider (Email & Password Hash)
  - Google Provider (OAuth 2.0)
- Session Strategy: JWT with secure HTTP-only cookies, `SameSite=Lax`, and `Secure` flag enabled in production.

## 3. API & Data Protection

- Protected Routes: Use Next.js Middleware to block unauthorized access to `/api/user/*` and `/learn/*`.
- Rate Limiting: Apply Upstash/in-memory rate limiting to `/api/auth/*` (max 5 failed attempts per minute).
- Audio & Asset Delivery: Restrict static paths, sanitize inputs against Path Traversal vulnerabilities.

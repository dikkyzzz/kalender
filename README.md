# 📅 Progres Tracker - Multi-User Calendar App

Full-featured progress tracking application dengan calendar view, statistics, dan email verification system.

## ✨ Features

### Core Features
- 📅 **Interactive Calendar** - Visual progress tracking per tanggal
- 📝 **Rich Text Editor** - Add formatted notes dengan gambar
- 📊 **Statistics Dashboard** - Streak counter, monthly stats, progress charts
- 🔍 **Search & Filter** - Find progress by date, keywords, tags
- 📤 **Export** - Download progress as PDF/Excel

### Security Features (NEW!)
- 🔐 **Strong Password** - Min 8 chars, uppercase, lowercase, number
- ⏱️ **Rate Limiting** - Max 5 login attempts per 15 minutes
- 📧 **Email Verification** - WAJIB verify email sebelum login
- 🔒 **JWT Authentication** - Secure token-based auth
- 👤 **Multi-User** - Setiap user punya data terpisah

### User Management
- ✅ User registration dengan email verification
- ✅ Login/logout with JWT tokens
- ✅ Data isolation per user
- ✅ Beautiful email templates (verification + welcome)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier OK)
- Resend account untuk email (free: 3000 emails/month)

### Installation

1. **Clone & Install Dependencies**
```bash
git clone <repo-url>
cd kalender
npm install
cd client && npm install
```

2. **Setup Environment Variables**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
JWT_SECRET=your-random-secret-key-here

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=onboarding@resend.dev
APP_URL=http://localhost:3000
```

**Get Resend API Key:**
- Sign up: https://resend.com (FREE)
- Get API key from dashboard
- See `SETUP_EMAIL_SERVICE.md` for details

3. **Setup Database**

Open Supabase SQL Editor and run:
```sql
-- Copy all content from database_email_verification.sql
```

This will create:
- `users` table dengan email verification
- `verification_tokens` table
- `progress` table dengan user_id column
- Indexes for performance

4. **Run Development Server**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm start
```

5. **Test Application**

- Open http://localhost:3000
- Register dengan email ASLI
- Check inbox untuk verification email
- Verify email → Login → Start tracking!

## 📖 Documentation

### Essential Guides
- **SETUP_GUIDE.md** - Detailed setup instructions
- **SETUP_EMAIL_SERVICE.md** - Email verification setup (Resend)
- **SECURITY_FEATURES_COMPLETE.md** - Security implementation details
- **EMAIL_VERIFICATION_STRICT_MODE.md** - Email verification flow

### Database
- **database_email_verification.sql** - Full database schema & migration

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

Examples:
- ✅ `Password123`
- ✅ `MyPass2024`
- ❌ `password` (no uppercase/number)
- ❌ `Pass123` (< 8 chars)

### Rate Limiting
- Login/Register: Max 5 attempts per 15 minutes
- API: Max 30 requests per minute
- Automatic IP-based blocking

### Email Verification
- Verification link expires in 24 hours
- User MUST verify before login
- Beautiful HTML email templates
- Resend verification option

## 🎯 User Flow

### Registration
```
1. User fills registration form
2. Success banner appears (no popup!)
3. Verification email sent
4. Auto-redirect to login page (4 seconds)
```

### Email Verification
```
1. User opens verification email
2. Click "Verify Email Address" button
3. Success page with countdown timer
4. Auto-redirect to login (5 seconds)
5. Welcome email sent automatically
```

### Login
```
1. User enters username/password
2. If email NOT verified → Error + resend link
3. If email verified → Login success → Dashboard
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Supabase (PostgreSQL database)
- JWT authentication
- bcrypt password hashing
- Resend (email service)
- express-rate-limit (security)

### Frontend
- React 18
- React Router v6
- Context API (state management)
- CSS3 (custom styling)
- Axios (HTTP client)

## 📁 Project Structure

```
kalender/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth & Theme context
│   │   ├── pages/           # Login, Register, Dashboard, VerifyEmail
│   │   ├── services/        # API calls
│   │   └── utils/           # Helper functions
│   └── public/
├── server/                   # Express backend
│   ├── config/              # Supabase config
│   ├── middleware/          # Auth & rate limiter
│   ├── routes/              # API routes (auth, progress)
│   └── services/            # Email service
├── uploads/                  # User uploaded images
├── .env                      # Environment variables (DO NOT COMMIT!)
├── .env.example             # Environment template
└── database_email_verification.sql  # Database schema
```

## 🚀 Deployment

### Deploy to Railway.app (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Railway**
- Go to https://railway.app
- Connect GitHub repo
- Set environment variables
- Deploy!

3. **Update Environment Variables**
```env
APP_URL=https://your-app.railway.app
FROM_EMAIL=noreply@yourdomain.com (optional)
```

4. **Custom Domain** (Optional)
- Add domain in Railway settings
- Update DNS records
- Verify domain di Resend

### Other Platforms
- **Render.com** - Similar to Railway
- **Vercel** (Frontend) + Railway (Backend)
- **Heroku** - Classic option

## 🧪 Testing

### Manual Testing Checklist

**Registration Flow:**
- [ ] Register dengan password lemah → Should fail
- [ ] Register dengan password kuat → Should succeed
- [ ] Success banner muncul (no popup!)
- [ ] Email verification diterima
- [ ] Auto-redirect ke login

**Email Verification:**
- [ ] Click verification link
- [ ] Success message muncul (no flashing error!)
- [ ] Countdown timer works
- [ ] Welcome email diterima
- [ ] Auto-redirect ke login

**Login Flow:**
- [ ] Login tanpa verify → Error + resend link
- [ ] Login dengan verified email → Success
- [ ] Try 6x wrong password → Rate limited
- [ ] Wait 15 min → Can login again

**Multi-User:**
- [ ] Register 2 users berbeda
- [ ] User1 add progress
- [ ] Login as User2
- [ ] User2 TIDAK bisa lihat progress User1

## 📊 Database Schema

### users
```sql
- id (UUID, PK)
- username (TEXT, UNIQUE)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- email_verified (BOOLEAN)
- created_at (TIMESTAMP)
```

### progress
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- tanggal (DATE)
- catatan (TEXT)
- gambar (TEXT[])
- dibuat (TIMESTAMP)
- update (TIMESTAMP)
```

### verification_tokens
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- token (TEXT, UNIQUE)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## 🐛 Troubleshooting

### Email tidak terkirim
- Check RESEND_API_KEY di `.env`
- Verify API key di Resend dashboard
- Check server logs: "Verification email sent"
- Check Resend dashboard untuk delivery status

### Login failed after registration
- Pastikan email sudah diverify
- Check verification link di inbox (dan spam!)
- Try resend verification

### Rate limited
- Wait 15 minutes
- Or restart server (development only)

### Database error
- Run migration: `database_email_verification.sql`
- Check RLS disabled: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
- Verify Supabase credentials

## 📝 Environment Variables

### Required
```env
SUPABASE_URL=          # Supabase project URL
SUPABASE_KEY=          # Supabase anon key
JWT_SECRET=            # Random secret for JWT (32+ chars)
PORT=5000              # Backend port
```

### Email Service (Required for verification)
```env
RESEND_API_KEY=        # Resend API key
FROM_EMAIL=            # Sender email
APP_URL=               # Frontend URL (with http/https)
```

## 🎉 Features Roadmap

### Implemented ✅
- Multi-user authentication
- Email verification
- Strong password enforcement
- Rate limiting
- JWT tokens
- Data isolation
- Beautiful email templates

### Future Enhancements 💡
- Password reset via email
- 2FA (Two-Factor Authentication)
- Profile management
- Dark mode
- Mobile app
- Notifications
- Team/collaboration features

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📧 Support

Need help? Check documentation files:
- **SETUP_GUIDE.md** - Setup help
- **SETUP_EMAIL_SERVICE.md** - Email setup
- **SECURITY_FEATURES_COMPLETE.md** - Security details

## 🎊 Credits

Built with ❤️ using modern web technologies

- React for beautiful UI
- Supabase for reliable database
- Resend for professional emails
- Express for robust backend

---

**Ready to track your progress! 🚀**

Start with: `npm run dev`

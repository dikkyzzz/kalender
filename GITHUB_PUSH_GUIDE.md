# 🚀 Push to GitHub - Step by Step

## ⚠️ IMPORTANT: Security Checklist (WAJIB!)

Sebelum push, pastikan file-file sensitif **TIDAK** akan ke-upload:

### ✅ Already Protected (by .gitignore):
- `.env` - Environment variables (API keys, secrets)
- `node_modules/` - Dependencies
- `uploads/` - User uploaded files
- `client/build/` - Build files

### 🔍 Double Check:

```bash
# Check .gitignore content
cat .gitignore

# Should contain:
# .env
# node_modules/
# uploads/
# client/node_modules/
# client/build/
```

## 📋 Pre-Push Checklist

### Step 1: Remove Sensitive Data from .env

Pastikan `.env` hanya ada di lokal, JANGAN PUSH!

```bash
# Verify .env is ignored
git status
# .env should NOT appear in list
```

### Step 2: Clean Sensitive Info

Check these files untuk sensitive data:
- ✅ `.env.example` - Should only have placeholders
- ✅ `README.md` - No API keys/passwords
- ✅ Database files - No production data

### Step 3: Update .env.example

Make sure `.env.example` has NO real credentials:

```env
# .env.example (SAFE - has placeholders)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
PORT=5000
JWT_SECRET=change-this-to-random-secret-key-in-production

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key-here
FROM_EMAIL=onboarding@resend.dev
APP_URL=http://localhost:3000
```

## 🎯 Step-by-Step Push Process

### Step 1: Initialize Git (if not already)

```bash
cd E:\kalender
git init
```

### Step 2: Check Status

```bash
git status
```

**Verify:**
- ✅ `.env` is NOT listed (ignored)
- ✅ `node_modules/` is NOT listed (ignored)
- ✅ `uploads/` is NOT listed (ignored)

### Step 3: Add Files

```bash
# Add all files (respecting .gitignore)
git add .

# Or add specific files only
git add README.md
git add package.json
git add server/
git add client/
git add database_email_verification.sql
git add .env.example
git add .gitignore
```

### Step 4: Review What Will Be Committed

```bash
# See what's staged
git diff --cached

# List files to be committed
git diff --cached --name-only
```

**CRITICAL CHECK:**
- ❌ `.env` should NOT be in the list
- ❌ `node_modules/` should NOT be in the list
- ❌ `uploads/` should NOT be in the list
- ✅ `.env.example` should be in the list
- ✅ `.gitignore` should be in the list

### Step 5: Commit

```bash
git commit -m "Initial commit: Multi-user progress tracker with email verification

Features:
- User authentication with JWT
- Email verification (strict mode)
- Strong password enforcement
- Rate limiting
- Multi-user data isolation
- Beautiful email templates
- Calendar progress tracking
- Statistics dashboard

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"
```

### Step 6: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Name: `progres-tracker` (atau nama lain)
4. Description: "Multi-user progress tracker with calendar view"
5. Choose: **Private** (recommended) or Public
6. **DON'T** initialize with README (kita sudah punya)
7. Click "Create repository"

### Step 7: Add Remote & Push

```bash
# Add GitHub as remote (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Check remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔐 If Push Asks for Credentials

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`
4. Copy token (save it somewhere safe!)
5. Use token as password when pushing

### Option 2: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

Then change remote to SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

## ✅ After Push - Verify on GitHub

1. Go to your GitHub repo
2. Check these files are there:
   - ✅ README.md
   - ✅ package.json
   - ✅ .gitignore
   - ✅ .env.example
   - ✅ server/
   - ✅ client/

3. Check these files are NOT there:
   - ❌ .env (your actual env file)
   - ❌ node_modules/
   - ❌ uploads/

4. Click on `.env.example` and verify it has placeholders only (no real API keys)

## 🚨 Emergency: If You Pushed .env by Mistake

**DON'T PANIC!** Do this immediately:

```bash
# Remove .env from Git (but keep local)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from repository"

# Push the change
git push origin main
```

Then:
1. Go to GitHub repo → Settings → Secrets
2. Change ALL secrets that were exposed:
   - ⚠️ Change JWT_SECRET
   - ⚠️ Regenerate Resend API key
   - ⚠️ Regenerate Supabase keys (if exposed)

## 📝 .gitignore Reference

Your `.gitignore` should have:

```
# Dependencies
node_modules/
client/node_modules/

# Environment variables (SENSITIVE!)
.env

# User uploads (can be large)
uploads/

# Build files
client/build/
dist/

# OS files
.DS_Store
Thumbs.db

# IDE files (optional)
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

# Temp files
*.tmp
.cache/
```

## 🎯 Post-Push Setup for Collaborators

After pushing, others can clone:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install
cd client && npm install

# Create .env from example
cp .env.example .env

# Edit .env with real credentials
nano .env

# Run database migration in Supabase
# (Copy database_email_verification.sql to Supabase SQL Editor)

# Start development
npm run dev
```

## 🔄 Future Updates

When you make changes:

```bash
# See what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Add feature: [describe what you added]"

# Push to GitHub
git push origin main
```

## 📚 Git Commands Reference

```bash
# Status
git status                    # See what's changed

# Add files
git add .                     # Add all changes
git add file.js               # Add specific file

# Commit
git commit -m "message"       # Commit with message

# Push
git push origin main          # Push to GitHub

# Pull (get updates from GitHub)
git pull origin main          # Pull latest changes

# View history
git log --oneline             # See commit history

# Undo changes (careful!)
git checkout -- file.js       # Discard changes to file
git reset HEAD file.js        # Unstage file
```

## ⚠️ Common Mistakes to Avoid

1. ❌ **Don't push .env file** - Contains secrets!
2. ❌ **Don't push node_modules/** - Too large, not needed
3. ❌ **Don't commit API keys** in any file
4. ❌ **Don't commit passwords** in comments/docs
5. ✅ **Always check git status** before commit
6. ✅ **Always review .env.example** before push
7. ✅ **Use .gitignore** properly

## 🎊 You're Ready!

Follow the steps above and your code will be safely on GitHub!

**Remember:**
- ✅ Check .gitignore
- ✅ Verify .env is NOT staged
- ✅ Review files before commit
- ✅ Use descriptive commit messages
- ✅ Double-check on GitHub after push

Happy coding! 🚀

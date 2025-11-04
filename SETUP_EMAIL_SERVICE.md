## Setup Email Verification dengan Resend

Email verification sudah diimplementasi! Sekarang tinggal setup API key.

### Step 1: Daftar Resend (GRATIS - 3000 emails/month)

1. Buka https://resend.com
2. Klik **Sign Up** (bisa pakai GitHub)
3. Setelah login, klik **API Keys** di sidebar
4. Klik **Create API Key**
5. Beri nama: `Progres Tracker`
6. Copy API key yang muncul (simpan baik-baik, hanya muncul sekali!)

### Step 2: Update File .env

Edit file `.env` Anda dan tambahkan:

```env
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
APP_URL=http://localhost:3000
```

**Notes:**
- `RESEND_API_KEY`: Paste API key dari step 1
- `FROM_EMAIL`: Untuk testing, pakai `onboarding@resend.dev` (default Resend)
- `APP_URL`: URL aplikasi Anda (localhost untuk development)

### Step 3: Run Database Migration

Buka Supabase SQL Editor dan run:

```sql
-- File: database_email_verification.sql
```

Copy SEMUA isi file `database_email_verification.sql` dan run di Supabase.

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm run server
```

### Step 5: Test Email Verification

1. Buka http://localhost:3000/register
2. Register dengan **email ASLI Anda** (biar bisa terima email)
3. Submit form
4. **Check email inbox Anda** (juga folder Spam!)
5. Klik link verification di email
6. Seharusnya redirect ke halaman sukses!

## Custom Domain Email (Optional - Untuk Production)

Jika mau pakai email Anda sendiri (contoh: noreply@yourdomain.com):

### 1. Verify Domain di Resend

1. Di Resend dashboard, klik **Domains**
2. Klik **Add Domain**
3. Input domain Anda (contoh: yourdomain.com)
4. Follow instruksi untuk add DNS records

### 2. Update .env

```env
FROM_EMAIL=noreply@yourdomain.com
```

## Testing Tips

### Test 1: Register + Verify
```
1. Register dengan email asli
2. Check inbox
3. Klik link verification
4. Login ulang
```

### Test 2: Expired Token
```
1. Register user
2. Tunggu 24+ jam (atau manual update expires_at di database)
3. Coba klik link verification
4. Should show "Token expired"
5. Request resend verification
```

### Test 3: Resend Verification
```
1. Register user
2. Jangan verify dulu
3. Di verification page, klik "Resend Verification Email"
4. Check inbox lagi
5. Klik link baru
```

## Troubleshooting

### Email tidak terkirim

**Check 1: API Key valid?**
```bash
# Test API key
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

**Check 2: Server logs**
```
Server terminal akan print:
- "Verification email sent: {...}"  ✅ Sukses
- "Failed to send verification email: ..." ❌ Error
```

**Check 3: Resend Dashboard**
- Buka https://resend.com/emails
- Lihat history email yang terkirim
- Check status: delivered / bounced / failed

### Email masuk Spam

Normal untuk email dari domain baru. Solusi:
1. Mark email sebagai "Not Spam"
2. Atau pakai custom domain yang sudah verified
3. Setup SPF, DKIM, DMARC records (Resend guide akan bantuin)

### Token invalid/expired

```sql
-- Check token di database
SELECT * FROM verification_tokens 
WHERE user_id = 'user-id-here';

-- Hapus token lama
DELETE FROM verification_tokens 
WHERE user_id = 'user-id-here';

-- Resend verification dari frontend
```

### User sudah register tapi belum verify

User tetap bisa login dan pakai aplikasi (mode lenient).

Jika mau strict mode (WAJIB verify sebelum login):
```javascript
// Di server/routes/auth.js, login route
// Uncomment/tambahkan:

if (!user.email_verified) {
  return res.status(403).json({
    success: false,
    message: 'Please verify your email before logging in'
  });
}
```

## Production Checklist

Sebelum deploy ke production:

- [ ] Daftar Resend dan verify API key
- [ ] Setup custom domain email (optional tapi recommended)
- [ ] Update APP_URL ke production URL (contoh: https://yourapp.com)
- [ ] Test email delivery
- [ ] Add SPF/DKIM/DMARC records untuk domain
- [ ] Monitor Resend dashboard untuk bounce/spam rate

## Email Customization

File email template ada di: `server/services/emailService.js`

Bisa customize:
- HTML template
- Subject line
- Sender name
- Button styling
- Footer text

## Rate Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day

Cukup untuk development dan small-scale production!

**Upgrade jika perlu:**
- Pro: $20/month = 50,000 emails
- Business: Custom pricing

## Next Steps

Setelah email verification running:
1. Test dengan beberapa email berbeda
2. Check spam folder
3. Monitor Resend dashboard
4. Consider upgrade jika > 3000 emails/month

Email verification sekarang AKTIF! 🎉

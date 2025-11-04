-- Migration: Add Email Verification Support
-- Run ini di Supabase SQL Editor

-- 1. Tambah kolom email_verified di tabel users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 2. Buat tabel verification_tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires_at ON verification_tokens(expires_at);

-- 4. Disable RLS untuk verification_tokens (same as users table)
ALTER TABLE verification_tokens DISABLE ROW LEVEL SECURITY;

-- 5. Function untuk cleanup expired tokens (optional tapi recommended)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Verify - Check apakah tabel sudah dibuat
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'verification_tokens') 
ORDER BY table_name, ordinal_position;

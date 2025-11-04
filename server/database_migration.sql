-- Migration SQL untuk setup multi-user
-- Jalankan ini di Supabase SQL Editor

-- 1. Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tambah kolom user_id di tabel progress (jika belum ada)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'progress' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE progress ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tanggal ON progress(tanggal);
CREATE INDEX IF NOT EXISTS idx_progress_user_tanggal ON progress(user_id, tanggal);

-- 4. DISABLE Row Level Security (RLS) untuk development
-- IMPORTANT: RLS akan blokir insert dari backend API
-- Untuk production, enable RLS dan setup proper policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress DISABLE ROW LEVEL SECURITY;

-- 5. Policies commented out karena RLS disabled
-- Uncomment dan enable RLS jika deploy to production

/*
-- Policy untuk users - user hanya bisa lihat/edit data sendiri
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy untuk progress - user hanya bisa akses progress sendiri
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (user_id::text = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own progress" ON progress
  FOR DELETE USING (user_id::text = auth.uid()::text);
*/

-- Storage bucket creation and policies for proofs
-- Run this in Supabase SQL Editor

-- Create proofs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to proofs bucket
CREATE POLICY "Public read access for proofs" ON storage.objects
FOR SELECT USING (bucket_id = 'proofs');

-- Policy: Allow authenticated users to insert files to proofs bucket
CREATE POLICY "Authenticated users can insert proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'proofs' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to update their own files in proofs bucket
CREATE POLICY "Users can update own proofs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own files in proofs bucket
CREATE POLICY "Users can delete own proofs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

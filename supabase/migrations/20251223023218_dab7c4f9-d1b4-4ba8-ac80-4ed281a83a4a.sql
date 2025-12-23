-- Make the videodecurso bucket public so videos can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'videodecurso';

-- Drop the previous policies since they won't work with Clerk auth
DROP POLICY IF EXISTS "Authenticated users can view course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can download course videos" ON storage.objects;

-- Create a public read policy for the bucket
CREATE POLICY "Anyone can view course videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videodecurso');
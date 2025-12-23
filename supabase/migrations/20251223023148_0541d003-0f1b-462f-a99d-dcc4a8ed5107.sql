-- Create policies for videodecurso bucket to allow authenticated users to access videos

-- Allow authenticated users to view/list files in the videodecurso bucket
CREATE POLICY "Authenticated users can view course videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'videodecurso');

-- Allow authenticated users to download files from the videodecurso bucket
CREATE POLICY "Authenticated users can download course videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'videodecurso');
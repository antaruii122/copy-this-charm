-- Add thumbnail_url column to course_videos table
ALTER TABLE public.course_videos 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.course_videos.thumbnail_url IS 'URL to the video thumbnail image stored in Supabase Storage';

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  price TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_videos table to link videos to courses
CREATE TABLE public.course_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Everyone can view published courses
CREATE POLICY "Anyone can view courses"
ON public.courses
FOR SELECT
USING (true);

-- Enable RLS on course_videos
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view course videos (access control is at app level via Clerk)
CREATE POLICY "Anyone can view course videos"
ON public.course_videos
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_course_videos_course_id ON public.course_videos(course_id);
CREATE INDEX idx_courses_slug ON public.courses(slug);

-- Add trigger for updated_at on courses
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
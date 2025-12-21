-- Create admin_emails table to store authorized blog admins
CREATE TABLE public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only allow reading admin emails (no public write access)
CREATE POLICY "Anyone can check admin status" 
ON public.admin_emails 
FOR SELECT 
USING (true);

-- Create index for email lookups
CREATE INDEX idx_admin_emails_email ON public.admin_emails(email);
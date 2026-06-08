-- ============================================================
-- Compassionate Action – Volunteer Schema Updates
-- ============================================================

-- 1. Add is_admin to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Create volunteers table
CREATE TABLE IF NOT EXISTS public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier text NOT NULL, -- 'Unit', 'Ward', 'LGA', 'State', 'National', 'Continental', 'International'
  status text NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  payment_status text NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid'
  photo_url text,
  is_executive boolean DEFAULT false,
  location_context jsonb, -- e.g., {"state": "Lagos", "lga": "Ikeja", "ward": "Ward 1"}
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(profile_id) -- A user can only have one volunteer application/role active
);

-- Enable RLS on volunteers
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own volunteer applications, and Admins can see all.
-- Wait, we also need the public to see "Approved" volunteers for the landing page album.
CREATE POLICY "Public can view approved volunteers" ON public.volunteers FOR SELECT USING (status = 'Approved');
CREATE POLICY "Users can view their own volunteer application" ON public.volunteers FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Admins can view all volunteers" ON public.volunteers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Policy: Users can insert their own volunteer application
CREATE POLICY "Users can insert their own volunteer application" ON public.volunteers FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Policy: Users can update their own application if it's not approved yet, Admins can update any
CREATE POLICY "Users can update own pending application" ON public.volunteers FOR UPDATE USING (auth.uid() = profile_id AND status = 'Pending');
CREATE POLICY "Admins can update any volunteer" ON public.volunteers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Policy: Admins can delete
CREATE POLICY "Admins can delete any volunteer" ON public.volunteers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 3. Set up Storage Bucket for Volunteer Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('volunteer_photos', 'volunteer_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for Storage (Assuming storage.objects is already RLS-enabled by Supabase)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'volunteer_photos');

CREATE POLICY "Users can upload their own photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'volunteer_photos' AND auth.uid() = owner
);

CREATE POLICY "Users can update their own photos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'volunteer_photos' AND auth.uid() = owner
);

CREATE POLICY "Admins can manage any photo" ON storage.objects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

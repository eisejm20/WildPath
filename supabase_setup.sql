-- WildPath Database Setup
-- Run this in your Supabase SQL editor

-- Operator applications (before approval)
CREATE TABLE operator_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  years_operating TEXT,
  experience_types TEXT[],
  destinations TEXT,
  min_price INTEGER,
  max_price INTEGER,
  group_size_min INTEGER,
  group_size_max INTEGER,
  bio TEXT,
  why_wildpath TEXT,
  website TEXT,
  safariBookings_url TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approved operators (public profiles)
CREATE TABLE operators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT NOT NULL,
  destinations TEXT,
  bio TEXT,
  experience_types TEXT[],
  min_price INTEGER,
  max_price INTEGER,
  group_size_min INTEGER,
  group_size_max INTEGER,
  website TEXT,
  badge TEXT DEFAULT 'Hidden Gem',
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Traveler enquiries
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES operators(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  dates TEXT,
  guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'new',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE operator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read approved operators
CREATE POLICY "Public operators are viewable by everyone"
  ON operators FOR SELECT
  USING (status = 'approved');

-- Anyone can submit an application
CREATE POLICY "Anyone can apply as operator"
  ON operator_applications FOR INSERT
  WITH CHECK (true);

-- Anyone can send an enquiry
CREATE POLICY "Anyone can send enquiry"
  ON enquiries FOR INSERT
  WITH CHECK (true);

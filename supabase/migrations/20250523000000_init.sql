-- 1. Reset (Optional: Only run these DROP commands if you need to wipe the DB and start fresh)
DROP TABLE IF EXISTS public.user_drop_statuses;
DROP TABLE IF EXISTS public.likes;
DROP TABLE IF EXISTS public.comments;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.drops;
DROP TABLE IF EXISTS public.profiles;

-- 2. Create Profiles Table (Links to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  handle TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT username_length CHECK (char_length(handle) >= 3)
);

-- 3. Create Drops Table (The content)
CREATE TABLE public.drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  layout TEXT DEFAULT 'classic', -- 'classic', 'zine', 'minimal'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Subscriptions Table (Who follows whom)
CREATE TABLE public.subscriptions (
  subscriber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  auto_print BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (subscriber_id, creator_id)
);

-- 5. Create Comments Table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Likes Table
CREATE TABLE public.likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, drop_id)
);

-- 7. Create User Drop Statuses (Tracks if a user printed/queued a specific drop)
CREATE TABLE public.user_drop_statuses (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('received', 'printed', 'queued')) DEFAULT 'received',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, drop_id)
);

-- 8. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_drop_statuses ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User update own
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Drops: Public read, Author create/update
CREATE POLICY "Drops are viewable by everyone." ON public.drops FOR SELECT USING (true);
CREATE POLICY "Users can insert their own drops." ON public.drops FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Subscriptions: Users view their own subs, create/delete own subs
CREATE POLICY "Users can view their own subscriptions." ON public.subscriptions FOR SELECT USING (auth.uid() = subscriber_id);
CREATE POLICY "Users can create their own subscriptions." ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Users can delete their own subscriptions." ON public.subscriptions FOR DELETE USING (auth.uid() = subscriber_id);

-- Comments: Public read, Author create
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments." ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Likes: Public read, User create/delete
CREATE POLICY "Likes are viewable by everyone." ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create likes." ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can delete likes." ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Statuses: Private to the user
CREATE POLICY "Users can view own statuses." ON public.user_drop_statuses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own statuses." ON public.user_drop_statuses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own statuses." ON public.user_drop_statuses FOR UPDATE USING (auth.uid() = user_id);

-- 9. Trigger to automatically create a Profile when a User signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, handle, name)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'handle', 
    new.raw_user_meta_data->>'name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Storage Buckets (Optional: If you want to support Avatar Uploads later)
insert into storage.buckets (id, name) values ('avatars', 'avatars');
create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar." on storage.objects for insert with check ( bucket_id = 'avatars' );

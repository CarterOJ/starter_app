CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS TRIGGER
language 'plpgsql'
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
language 'plpgsql'
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


CREATE TRIGGER create_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile();


CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);


CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);


CREATE POLICY "Users can delete their own profile"
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);


CREATE POLICY "Users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'avatars'
  AND owner = auth.uid()
);

CREATE POLICY "Users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'avatars'
  AND owner = auth.uid()
);

CREATE POLICY "Users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'avatars'
  AND owner = auth.uid()
);

CREATE POLICY "Users can view avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'avatars'
  AND owner = auth.uid()
);
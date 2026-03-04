drop policy "Users can update avatars" on "storage"."objects";


  create policy "Users can update avatars"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (owner = auth.uid())))
with check (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (owner = auth.uid())));




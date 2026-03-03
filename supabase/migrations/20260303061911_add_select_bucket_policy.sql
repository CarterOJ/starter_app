drop policy "Users can upload avatars" on "storage"."objects";


  create policy "Users can view avatars"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (owner = auth.uid())));



  create policy "Users can upload avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (owner = auth.uid())));




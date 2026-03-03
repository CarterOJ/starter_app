drop policy "Users can delete avatars" on "storage"."objects";


  create policy "Users can delete avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (owner = auth.uid())));




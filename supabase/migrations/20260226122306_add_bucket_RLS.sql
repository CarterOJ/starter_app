
  create policy "Users can delete their own avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND ((auth.uid())::text = (string_to_array(name, '/'::text))[2])));



  create policy "Users can upload their own avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND ((auth.uid())::text = (string_to_array(name, '/'::text))[2])));



  create policy "Users can view profiles bucket"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'profiles'::text));




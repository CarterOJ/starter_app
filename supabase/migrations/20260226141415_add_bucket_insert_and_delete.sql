drop policy "Users can update their own profile" on "public"."profiles";


  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));


drop policy "Debug: Allow all access to profiles for testing" on "storage"."objects";


  create policy "Users can delete avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text)));



  create policy "Users can upload avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = 'avatars'::text)));




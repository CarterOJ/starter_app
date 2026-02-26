drop policy "Debug: Allow all access to profiles for testing" on "storage"."objects";


  create policy "Debug: Allow all access to profiles for testing"
  on "storage"."objects"
  as permissive
  for all
  to public
using (true)
with check (true);




drop policy "Users can delete their own avatars" on "storage"."objects";

drop policy "Users can upload their own avatars" on "storage"."objects";

drop policy "Users can view profiles bucket" on "storage"."objects";


  create policy "Debug: Allow all access to profiles for testing"
  on "storage"."objects"
  as permissive
  for all
  to public;




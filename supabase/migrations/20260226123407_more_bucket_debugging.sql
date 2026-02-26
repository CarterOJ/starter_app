drop policy "Users can delete their own avatars" on "storage"."objects";

drop policy "Users can upload their own avatars" on "storage"."objects";

drop policy "Users can view profiles bucket" on "storage"."objects";


  create policy "Users can delete their own avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated;



  create policy "Users can upload their own avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated;



  create policy "Users can view profiles bucket"
  on "storage"."objects"
  as permissive
  for select
  to authenticated;




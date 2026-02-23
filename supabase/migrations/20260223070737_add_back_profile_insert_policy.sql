
  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check (((auth.uid() = id) OR (auth.role() = 'service_role'::text)));




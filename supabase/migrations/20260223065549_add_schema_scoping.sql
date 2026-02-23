drop policy "Users can insert their own profile" on "public"."profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$function$
;



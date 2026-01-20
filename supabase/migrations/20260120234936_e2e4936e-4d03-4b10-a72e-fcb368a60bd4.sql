-- Promote admin@mps.com.au to admin role
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@mps.com.au');
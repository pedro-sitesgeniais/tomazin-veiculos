-- Add update policy for admins (trigger already exists, columns and enum values were added)
DROP POLICY IF EXISTS "Admins can manage all evaluations" ON public.avaliacoes_veiculos;
DROP POLICY IF EXISTS "Admins can update evaluations" ON public.avaliacoes_veiculos;

CREATE POLICY "Admins can manage all evaluations" 
ON public.avaliacoes_veiculos 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
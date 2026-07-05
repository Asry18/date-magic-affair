CREATE TABLE public.responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  food TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.responses TO anon;
GRANT SELECT ON public.responses TO authenticated;
GRANT ALL ON public.responses TO service_role;

ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert responses"
  ON public.responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all responses"
  ON public.responses
  FOR SELECT
  TO authenticated
  USING (true);
CREATE TABLE public.disease_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT,
  crop_name TEXT,
  disease_name TEXT,
  severity TEXT,
  confidence TEXT,
  diagnosis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.disease_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagnoses"
  ON public.disease_diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diagnoses"
  ON public.disease_diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diagnoses"
  ON public.disease_diagnoses FOR DELETE
  USING (auth.uid() = user_id);
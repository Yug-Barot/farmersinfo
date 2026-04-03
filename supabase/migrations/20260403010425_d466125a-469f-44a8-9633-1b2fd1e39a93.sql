
CREATE TABLE public.yield_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop TEXT NOT NULL,
  area NUMERIC NOT NULL,
  soil_type TEXT NOT NULL,
  state TEXT NOT NULL,
  rainfall NUMERIC NOT NULL,
  predicted_yield NUMERIC NOT NULL,
  confidence INTEGER NOT NULL,
  msp_price NUMERIC NOT NULL,
  estimated_revenue NUMERIC NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.yield_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
ON public.yield_predictions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own predictions"
ON public.yield_predictions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions"
ON public.yield_predictions FOR DELETE
USING (auth.uid() = user_id);

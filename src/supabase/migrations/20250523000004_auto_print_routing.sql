-- Migration: Corrected Batch Routing
-- Ensures ALL drops are visible in Inbox immediately.
-- 'queued' status is reserved for auto-print candidates waiting for the batch gate.

CREATE OR REPLACE FUNCTION public.distribute_drop()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  SELECT 
    s.subscriber_id, 
    NEW.id,
    CASE 
      -- IF Auto-Print is ON AND user has a batch delay, mark as 'queued'
      WHEN s.auto_print = TRUE AND p.batch_mode != 'Instant' THEN 'queued'
      -- Otherwise (Manual print or Instant mode), mark as 'received'
      ELSE 'received'
    END
  FROM public.subscriptions s
  JOIN public.profiles p ON p.id = s.subscriber_id
  WHERE s.creator_id = NEW.author_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

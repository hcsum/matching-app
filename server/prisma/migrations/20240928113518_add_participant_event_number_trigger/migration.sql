-- CreateFunction
CREATE OR REPLACE FUNCTION next_event_number(matching_event_id UUID)
RETURNS INT AS $$
DECLARE
  next_number INT;
BEGIN
  SELECT COALESCE(MAX("eventNumber"), 0) + 1
  INTO next_number
  FROM "participant"
  WHERE "matchingEventId" = matching_event_id;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION set_event_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set eventNumber if it's not already set
  IF NEW."eventNumber" = 0 THEN
    NEW."eventNumber" := next_event_number(NEW."matchingEventId");
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger
CREATE TRIGGER participant_set_event_number
BEFORE INSERT ON "participant"
FOR EACH ROW
EXECUTE FUNCTION set_event_number();

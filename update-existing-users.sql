-- Update all existing users to have verified emails
-- This allows old users to login after the email verification update

UPDATE "User" 
SET "emailVerified" = true 
WHERE "createdAt" < NOW();

-- Check the results
SELECT id, email, "emailVerified", "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC 
LIMIT 10;

BEGIN;

UPDATE articles
SET seo_description = 'Plan your HubSpot CRM implementation with a practical checklist for CRM architecture, data migration, integrations, testing, training and go-live.'
WHERE slug = 'prepare-for-hubspot-crm-implementation';

COMMIT;

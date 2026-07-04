-- Allow the server-side revalidate endpoint to read and advance the changed-content cursor.
grant usage on schema es to service_role;
grant select, update on table es.revalidation_state to service_role;

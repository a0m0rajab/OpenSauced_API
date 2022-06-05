-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.repos
(
  -- Static columns
  id bigint NOT NULL,
  user_id bigint NOT NULL REFERENCES public.users (id),
  issues bigint NOT NULL DEFAULT 0,
  stars bigint NOT NULL DEFAULT 0,
  watchers bigint NOT NULL DEFAULT 0,
  subscribers bigint NOT NULL DEFAULT 0,
  is_fork boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  pushed_at timestamp without time zone DEFAULT now(),
  last_fetched_contributors_at timestamp without time zone DEFAULT to_timestamp(0),

  -- Elastic columns
  name character varying(255) COLLATE pg_catalog."default",
  full_name character varying(255) COLLATE pg_catalog."default",
  description text COLLATE pg_catalog."default",
  language character varying(64) COLLATE pg_catalog."default",
  license character varying(64) COLLATE pg_catalog."default",
  url character varying(255) COLLATE pg_catalog."default",

  CONSTRAINT user_stars_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.repos
    OWNER to postgres;

GRANT ALL ON TABLE public.repos TO anon;

GRANT ALL ON TABLE public.repos TO authenticated;

GRANT ALL ON TABLE public.repos TO postgres;

GRANT ALL ON TABLE public.repos TO service_role;

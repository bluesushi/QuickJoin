CREATE TABLE public.users (
    email character varying NOT NULL,
    password character varying NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    confirmation_code character varying NOT NULL,
    user_id integer NOT NULL,
    forgot_code character varying
);

-- The source for user ids
CREATE SEQUENCE public.user_id_gen
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_id_gen OWNED BY public.users.user_id;

CREATE TABLE public.user_links (
    user_id integer NOT NULL,
    url character varying NOT NULL,
    name character varying,
    "time" character varying,
    meeting_id smallint NOT NULL
);

-- Table for user sessions to be stored
-- These commands come from the express-session
-- github page so that they work with the express-session
-- npm package
CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

-- Generate user ids with the sequence that was created
ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.user_id_gen'::regclass);

-- Users are differentiated by their emails
ALTER TABLE ONLY public.users
    ADD CONSTRAINT must_be_different UNIQUE (email);

-- Command from express-session github
ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);

-- Make sure confirmation keys are unique as well
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_confirmation_code_key UNIQUE (confirmation_code);

-- Make user id a primary key
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

-- Command from express-session github
CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);

-- This constrainst makes sure when adding a new
-- user link that the individual exists first. 
-- Delete cascade ensures that when a user deletes their
-- account their links are automatically purged as well
ALTER TABLE ONLY public.user_links
    ADD CONSTRAINT user_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

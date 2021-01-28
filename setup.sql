--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 12.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: tulayatay-turhan
--

CREATE TABLE public.users (
    email character varying NOT NULL,
    password character varying NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    confirmation_code character varying NOT NULL,
    user_id integer NOT NULL,
    forgot_code character varying
);


ALTER TABLE public.users OWNER TO "tulayatay-turhan";

--
-- Name: user_id_gen; Type: SEQUENCE; Schema: public; Owner: tulayatay-turhan
--

CREATE SEQUENCE public.user_id_gen
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_gen OWNER TO "tulayatay-turhan";

--
-- Name: user_id_gen; Type: SEQUENCE OWNED BY; Schema: public; Owner: tulayatay-turhan
--

ALTER SEQUENCE public.user_id_gen OWNED BY public.users.user_id;


--
-- Name: user_links; Type: TABLE; Schema: public; Owner: tulayatay-turhan
--

CREATE TABLE public.user_links (
    user_id integer NOT NULL,
    url character varying NOT NULL,
    name character varying,
    "time" character varying,
    meeting_id smallint NOT NULL
);


ALTER TABLE public.user_links OWNER TO "tulayatay-turhan";

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: tulayatay-turhan
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO "tulayatay-turhan";

--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.user_id_gen'::regclass);


--
-- Data for Name: user_links; Type: TABLE DATA; Schema: public; Owner: tulayatay-turhan
--

COPY public.user_links (user_id, url, name, "time", meeting_id) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: tulayatay-turhan
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tulayatay-turhan
--

COPY public.users (email, password, confirmed, confirmation_code, user_id, forgot_code) FROM stdin;
\.


--
-- Name: user_id_gen; Type: SEQUENCE SET; Schema: public; Owner: tulayatay-turhan
--

SELECT pg_catalog.setval('public.user_id_gen', 6, true);


--
-- Name: users must_be_different; Type: CONSTRAINT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT must_be_different UNIQUE (email);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_confirmation_code_key; Type: CONSTRAINT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_confirmation_code_key UNIQUE (confirmation_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: tulayatay-turhan
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- Name: user_links user_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tulayatay-turhan
--

ALTER TABLE ONLY public.user_links
    ADD CONSTRAINT user_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


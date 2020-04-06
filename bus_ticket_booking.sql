--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.19
-- Dumped by pg_dump version 9.5.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: bus_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_info (
    registration_number character varying(20) NOT NULL,
    model character varying(20),
    seats integer NOT NULL,
    base_city character varying(20) NOT NULL,
    route text[]
);


ALTER TABLE public.bus_info OWNER TO postgres;

--
-- Name: ticket_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_logs (
    id integer NOT NULL,
    from_city character varying(20) NOT NULL,
    to_city character varying(20) NOT NULL,
    booking_date date DEFAULT ('now'::text)::date,
    booking_time time without time zone DEFAULT ('now'::text)::time with time zone,
    traveller_id integer,
    seat_number integer NOT NULL,
    ticket_status character varying(20),
    trip_code character varying(20),
    cancel_date date,
    cancel_time time without time zone
);


ALTER TABLE public.ticket_logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.ticket_logs.id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    trip_code character varying(20) NOT NULL,
    from_city character varying(20) NOT NULL,
    to_city character varying(20) NOT NULL,
    booked_seats integer[],
    stops text[],
    registration_number character varying(20),
    driver_id integer,
    trip_date character varying(20) NOT NULL
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(20),
    phone character varying(15) NOT NULL,
    type character varying(20) NOT NULL,
    password character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20200321135546-create-users.js
20200321141550-create-bus-info.js
20200321142539-create-trips.js
20200322083217-create-users.js
20200322083254-create-bus-info.js
20200322083813-create-trips.js
20200322084106-create-logs.js
\.


--
-- Data for Name: bus_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bus_info (registration_number, model, seats, base_city, route) FROM stdin;
MH-20-X-1234	Mercedes	40	Pune	{pune,bangalore}
\.


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 19, true);


--
-- Data for Name: ticket_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_logs (id, from_city, to_city, booking_date, booking_time, traveller_id, seat_number, ticket_status, trip_code, cancel_date, cancel_time) FROM stdin;
11	source	destination	2020-04-05	22:42:57.279907	15	2	confirmed	20191202sode	\N	\N
12	source	destination	2020-04-05	22:43:03.567844	15	3	confirmed	20191202sode	\N	\N
14	source	destination	2020-04-05	22:43:12.352167	15	5	confirmed	20191202sode	\N	\N
13	source	destination	2020-04-05	22:43:08.895113	15	4	cancelled	20191202sode	2020-04-05	22:43:42.776971
15	source	destination	2020-04-05	22:48:30.559651	15	3	cancelled	20191202sode	2020-04-05	22:50:46.864535
16	source	destination	2020-04-05	22:51:02.162215	15	4	confirmed	20191202sode	\N	\N
17	source	destination	2020-04-05	22:51:11.721435	15	6	confirmed	20191202sode	\N	\N
18	source	destination	2020-04-05	22:51:15.480609	15	7	confirmed	20191202sode	\N	\N
10	source	destination	2020-04-05	22:42:47.853159	15	1	cancelled	20191202sode	2020-04-05	22:51:41.002258
19	source	destination	2020-04-05	22:51:47.304757	15	1	confirmed	20191202sode	\N	\N
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (trip_code, from_city, to_city, booked_seats, stops, registration_number, driver_id, trip_date) FROM stdin;
20191202sode	source	destination	{1,2,3,4,5,6,7}	{source,destination}	\N	\N	02-12-2019
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, phone, type, password) FROM stdin;
1	admin	admin@bus.com	100	admin	admin@123
2	traveller1	traveller1@bus.com	12345	traveller	\N
14	tr2	tr2@bus.com	123456	traveller	\N
15	travel	tr3@bus.com	123	traveller	\N
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 15, true);


--
-- Name: SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: bus_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_info
    ADD CONSTRAINT bus_info_pkey PRIMARY KEY (registration_number);


--
-- Name: logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_code);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: driver_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT driver_id FOREIGN KEY (driver_id) REFERENCES public.users(user_id);


--
-- Name: driver_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_logs
    ADD CONSTRAINT driver_id FOREIGN KEY (traveller_id) REFERENCES public.users(user_id);


--
-- Name: registration_number; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT registration_number FOREIGN KEY (registration_number) REFERENCES public.bus_info(registration_number);


--
-- Name: trip_code; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_logs
    ADD CONSTRAINT trip_code FOREIGN KEY (trip_code) REFERENCES public.trips(trip_code);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

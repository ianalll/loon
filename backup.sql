--
-- PostgreSQL database dump
--

\restrict 3qPk1Xjq0kFj4eQItcT1drAWDvDDlyCnzgEj7po8IY07kG4eJKAcuZfAoTorc5V

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-27 15:09:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 224 (class 1259 OID 16452)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    size character varying(10)
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16451)
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 223
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- TOC entry 232 (class 1259 OID 16545)
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16544)
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.collections_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 231
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- TOC entry 230 (class 1259 OID 16516)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16515)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 229
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- TOC entry 228 (class 1259 OID 16496)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price_at_time numeric(10,2) NOT NULL,
    size character varying(10),
    color character varying(50)
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16495)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 226 (class 1259 OID 16474)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    order_number character varying(50) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'processing'::character varying,
    delivery_address text,
    delivery_phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    shipping_city character varying(100),
    shipping_street character varying(200),
    shipping_house character varying(20),
    shipping_apartment character varying(20),
    shipping_postal_code character varying(20),
    recipient_name character varying(100),
    recipient_phone character varying(20),
    shipping_entrance character varying(20),
    shipping_floor character varying(20)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16473)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 234 (class 1259 OID 16566)
-- Name: product_sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sizes (
    id integer NOT NULL,
    product_id integer,
    size character varying(10) NOT NULL,
    quantity integer DEFAULT 0
);


ALTER TABLE public.product_sizes OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16565)
-- Name: product_sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_sizes_id_seq OWNER TO postgres;

--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 233
-- Name: product_sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_sizes_id_seq OWNED BY public.product_sizes.id;


--
-- TOC entry 222 (class 1259 OID 16434)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    color character varying(50),
    description text,
    image_url text,
    is_new boolean DEFAULT false,
    is_sale boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    created_by integer,
    is_promotion boolean DEFAULT false,
    collection_id integer,
    in_stock boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16433)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 16417)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    address text,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16416)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4794 (class 2604 OID 16455)
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 16548)
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- TOC entry 4802 (class 2604 OID 16519)
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16499)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 16477)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 16569)
-- Name: product_sizes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes ALTER COLUMN id SET DEFAULT nextval('public.product_sizes_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 16437)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 16420)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5002 (class 0 OID 16452)
-- Dependencies: 224
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, product_id, quantity, added_at, size) FROM stdin;
\.


--
-- TOC entry 5010 (class 0 OID 16545)
-- Dependencies: 232
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collections (id, name, description, created_at, updated_at) FROM stdin;
1	Аврора	\N	2026-04-15 20:01:35.846162	2026-04-15 20:01:35.846162
2	Весенний бриз	\N	2026-04-15 20:01:35.846162	2026-04-15 20:01:35.846162
3	Осенний вальс	\N	2026-04-15 20:01:35.846162	2026-04-15 20:01:35.846162
4	Зимняя сказка	\N	2026-04-15 20:01:35.846162	2026-04-15 20:01:35.846162
\.


--
-- TOC entry 5008 (class 0 OID 16516)
-- Dependencies: 230
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, product_id, added_at) FROM stdin;
2	1	7	2026-04-16 16:25:09.635378
4	4	6	2026-04-16 17:54:20.48713
5	4	3	2026-04-16 17:54:23.645498
6	1	3	2026-04-16 20:18:51.864891
7	4	15	2026-04-26 19:47:29.926239
\.


--
-- TOC entry 5006 (class 0 OID 16496)
-- Dependencies: 228
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price_at_time, size, color) FROM stdin;
1	1	6	2	12990.00	L	\N
5	4	7	1	4989.00	M	\N
8	7	7	1	4989.00	M	\N
9	8	15	1	3014.00	M	\N
10	9	6	1	12990.00	S	\N
\.


--
-- TOC entry 5004 (class 0 OID 16474)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, order_number, total_amount, status, delivery_address, delivery_phone, created_at, updated_at, shipping_city, shipping_street, shipping_house, shipping_apartment, shipping_postal_code, recipient_name, recipient_phone, shipping_entrance, shipping_floor) FROM stdin;
4	4	ORD-1776336631563-796	4989.00	delivered	Москва, ул. Рязанова, 1, кв.12	890753255678	2026-04-16 18:50:31.560449	2026-04-16 18:51:27.21669	Москва	ул. Рязанова	1	12	101000	МАМА	890753255678	\N	\N
1	4	ORD-1776332887859-660	25980.00	cancelled	Москва, ул. Рязанова, 1, кв.32	89086532686	2026-04-16 17:48:07.856623	2026-04-16 19:25:17.98717	Москва	ул. Рязанова	1	32	101000	яя	89086532686	\N	\N
7	4	ORD-1777093044933-71	4989.00	cancelled	Москва, ул. Рязанова, 1, кв.32	+7 (908) 651-14-85	2026-04-25 12:57:24.936667	2026-04-25 12:58:13.233804	Москва	ул. Рязанова	1	32	101000	Аня	+7 (908) 651-14-85	4	4
8	4	ORD-1777204097725-940	3014.00	delivered	Москва, ул. Рязанова, 1, кв.32	+7 (908) 651-14-85	2026-04-26 19:48:17.719826	2026-04-26 19:50:06.636585	Москва	ул. Рязанова	1	32	101000	Аня	+7 (908) 651-14-85	4	4
9	1	ORD-1777204390554-154	12990.00	cancelled	Москва, ул. Рязанова, 1, кв.32	+7 (908) 651-14-84	2026-04-26 19:53:10.551444	2026-04-26 19:53:24.344424	Москва	ул. Рязанова	1	32	101000	Яна Бойченко	+7 (908) 651-14-84	4	4
\.


--
-- TOC entry 5012 (class 0 OID 16566)
-- Dependencies: 234
-- Data for Name: product_sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sizes (id, product_id, size, quantity) FROM stdin;
4	5	L	0
5	4	M	0
25	14	XL	30
28	15	L	20
33	16	L	11
21	7	M	6
26	15	M	4
22	6	S	2
\.


--
-- TOC entry 5000 (class 0 OID 16434)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, category, price, color, description, image_url, is_new, is_sale, created_at, updated_at, is_active, created_by, is_promotion, collection_id, in_stock) FROM stdin;
3	Брючный костюм	костюм	18500.00	графит	Современный брючный костюм	http://localhost:5000/uploads/products/1776251046929-722257113.png	f	t	2026-04-15 16:20:44.891783	2026-04-24 18:34:44.56661	t	\N	f	2	t
15	Вечерние платье	платье	3014.00	черный		http://localhost:5000/uploads/products/1777028406032-214056981.png	f	f	2026-04-24 19:00:56.881946	2026-04-24 19:11:10.163381	t	1	t	\N	t
14	Классический костюм	костюм	20000.00	коричневый		http://localhost:5000/uploads/products/1777028272068-779585401.png	t	f	2026-04-24 18:59:33.243487	2026-04-24 19:11:16.545057	t	1	f	3	t
16	Деловой костюм с юбкой	костюм	9210.00	синий		http://localhost:5000/uploads/products/1777028523991-968182567.png	t	f	2026-04-24 19:04:11.660209	2026-04-24 19:24:48.34209	t	1	f	\N	t
5	Брюки со стрелкой	штаны	6990.00	тёмно-синий	Классические брюки со стрелками		f	f	2026-04-15 16:20:44.891783	2026-04-16 14:39:17.041957	f	\N	f	\N	t
4	Платье-футляр	платье	8990.00	чёрный	Элегантное платье-футляр		t	f	2026-04-15 16:20:44.891783	2026-04-16 14:39:20.58428	f	\N	f	\N	t
6	Жакет двубортный	жакет	12990.00	бордо	Стильный двубортный жакет	http://localhost:5000/uploads/products/1776321233593-406578961.jpg	f	t	2026-04-15 16:20:44.891783	2026-04-24 17:33:10.228925	t	\N	f	3	t
7	Блузка шелковая	блузка	4989.00	молочный	Нежная шелковая блузка	http://localhost:5000/uploads/products/1776321161511-731116513.jpg	f	f	2026-04-15 16:20:44.891783	2026-04-24 17:33:21.922671	t	\N	t	2	t
\.


--
-- TOC entry 4998 (class 0 OID 16417)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, phone, address, role, created_at, updated_at) FROM stdin;
4	yana.boychenko@mail.ru	$2b$10$DZVYnJY2K1iSh6e6jeYS3./HN8T01zAMtboJCbi1563R4EAumyyma	Аня	\N	+7 (908) 651-14-85	\N	user	2026-04-15 20:27:31.99509	2026-04-16 19:31:12.336047
1	yana.boychenko.2005z@mail.ru	$2b$10$hl63DJOhoodXvE/uWVHVJ.ByVUfkJyISLoYgiAGq299sSNUwf9bDm	Яна	Бойченко	+7 (908) 651-14-84	\N	admin	2026-04-15 17:24:53.95367	2026-04-24 17:19:38.780886
\.


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 223
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 18, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 231
-- Name: collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.collections_id_seq', 5, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 229
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 7, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 10, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 9, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 233
-- Name: product_sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sizes_id_seq', 33, true);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 16, true);


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4816 (class 2606 OID 16460)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16462)
-- Name: cart cart_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 4830 (class 2606 OID 16558)
-- Name: collections collections_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_name_key UNIQUE (name);


--
-- TOC entry 4832 (class 2606 OID 16556)
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16523)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16525)
-- Name: favorites favorites_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 4824 (class 2606 OID 16504)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 16489)
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- TOC entry 4822 (class 2606 OID 16487)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16574)
-- Name: product_sizes product_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16576)
-- Name: product_sizes product_sizes_product_id_size_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_product_id_size_key UNIQUE (product_id, size);


--
-- TOC entry 4814 (class 2606 OID 16450)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4838 (class 2606 OID 16604)
-- Name: product_sizes unique_product_size; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT unique_product_size UNIQUE (product_id, size);


--
-- TOC entry 4810 (class 2606 OID 16432)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4812 (class 2606 OID 16430)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4841 (class 2606 OID 16468)
-- Name: cart cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4842 (class 2606 OID 16463)
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4846 (class 2606 OID 16531)
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 16526)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4848 (class 2606 OID 16598)
-- Name: product_sizes fk_product_sizes_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 16505)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4845 (class 2606 OID 16510)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 16490)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 16577)
-- Name: product_sizes product_sizes_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4839 (class 2606 OID 16559)
-- Name: products products_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE SET NULL;


--
-- TOC entry 4840 (class 2606 OID 16538)
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- Completed on 2026-04-27 15:09:49

--
-- PostgreSQL database dump complete
--

\unrestrict 3qPk1Xjq0kFj4eQItcT1drAWDvDDlyCnzgEj7po8IY07kG4eJKAcuZfAoTorc5V


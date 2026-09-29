-- Up Migration


CREATE TABLE public.contracts (
    id  SERIAL NOT NULL,
    user_id integer NOT NULL,
    contract_month date NOT NULL,
    file_key character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE public.shift_assignments (
    id  SERIAL NOT NULL,
    shift_id integer NOT NULL,
    user_id integer NOT NULL,
    hourly_rate numeric(10,2) NOT NULL,
    actual_start_time time without time zone,
    actual_end_time time without time zone,
    requested_at timestamp without time zone,
    no_show boolean DEFAULT false NOT NULL,
    CONSTRAINT no_show_matches_times CHECK ((no_show = ((actual_start_time IS NULL) AND (actual_end_time IS NULL))))
);





CREATE TABLE public.shift_requests (
    id  SERIAL NOT NULL,
    shift_id integer NOT NULL,
    user_id integer NOT NULL,
    hourly_rate numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);







CREATE TABLE public.shift_types (
    id  SERIAL NOT NULL,
    shift_name character varying(55) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);









CREATE TABLE public.shifts (
    id SERIAL NOT NULL,
    date date NOT NULL,
    shift_type_id integer NOT NULL,
    scheduled_start_time time without time zone NOT NULL,
    scheduled_end_time time without time zone NOT NULL
);







CREATE TABLE public.users (
    id SERIAL NOT NULL,
    username character varying(55) NOT NULL,
    password_hash character varying(124) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_role character varying(55) NOT NULL,
    email character varying(55),
    phone character varying(55),
    default_hourly_rate numeric(10,2) DEFAULT 6.56 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    must_change_password boolean DEFAULT true NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date NOT NULL
);


ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_user_id_contract_month_key UNIQUE (user_id, contract_month);




ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_shift_id_user_id_key UNIQUE (shift_id, user_id);



ALTER TABLE ONLY public.shift_requests
    ADD CONSTRAINT shift_requests_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.shift_requests
    ADD CONSTRAINT shift_requests_shift_id_user_id_key UNIQUE (shift_id, user_id);




ALTER TABLE ONLY public.shift_types
    ADD CONSTRAINT shift_types_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_date_shift_type_id_key UNIQUE (date, shift_type_id);




ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);



ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);




ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id);



ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);




ALTER TABLE ONLY public.shift_requests
    ADD CONSTRAINT shift_requests_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id);




ALTER TABLE ONLY public.shift_requests
    ADD CONSTRAINT shift_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);




ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_shift_type_id_fkey FOREIGN KEY (shift_type_id) REFERENCES public.shift_types(id);





-- Down Migration


DROP TABLE public.contracts;
DROP TABLE public.shift_assignments;
DROP TABLE public.shift_requests;
DROP TABLE public.shifts;
DROP TABLE public.users;
DROP TABLE public.shift_types;
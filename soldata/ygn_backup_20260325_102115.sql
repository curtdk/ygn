--
-- PostgreSQL database dump
--

\restrict rNYnqKuYGSH670NeZxjKKJtbeWl8uGtlUJbv2ST4UPt8axsN0i6wkEEZ8nOpr8Q

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)

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

--
-- Name: claim_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.claim_reason_enum AS ENUM (
    'missing_item',
    'wrong_item',
    'production_failure',
    'other'
);


ALTER TYPE public.claim_reason_enum OWNER TO postgres;

--
-- Name: order_claim_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_claim_type_enum AS ENUM (
    'refund',
    'replace'
);


ALTER TYPE public.order_claim_type_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'completed',
    'draft',
    'archived',
    'canceled',
    'requires_action'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'partially_received',
    'canceled'
);


ALTER TYPE public.return_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_holder (
    id text NOT NULL,
    provider_id text NOT NULL,
    external_id text NOT NULL,
    email text,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.account_holder OWNER TO postgres;

--
-- Name: api_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_key (
    id text NOT NULL,
    token text NOT NULL,
    salt text NOT NULL,
    redacted text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    last_used_at timestamp with time zone,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_by text,
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_type_check CHECK ((type = ANY (ARRAY['publishable'::text, 'secret'::text])))
);


ALTER TABLE public.api_key OWNER TO postgres;

--
-- Name: application_method_buy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_buy_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_buy_rules OWNER TO postgres;

--
-- Name: application_method_target_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_target_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_target_rules OWNER TO postgres;

--
-- Name: auth_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_identity (
    id text NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.auth_identity OWNER TO postgres;

--
-- Name: capture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capture (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb
);


ALTER TABLE public.capture OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id text NOT NULL,
    region_id text,
    customer_id text,
    sales_channel_id text,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    locale text
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_address OWNER TO postgres;

--
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item (
    id text NOT NULL,
    cart_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    quantity integer NOT NULL,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    product_type_id text,
    is_custom_price boolean DEFAULT false NOT NULL,
    is_giftcard boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.cart_line_item OWNER TO postgres;

--
-- Name: cart_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_adjustment_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_line_item_adjustment OWNER TO postgres;

--
-- Name: cart_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text
);


ALTER TABLE public.cart_line_item_tax_line OWNER TO postgres;

--
-- Name: cart_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_payment_collection (
    cart_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_payment_collection OWNER TO postgres;

--
-- Name: cart_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_promotion (
    cart_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_promotion OWNER TO postgres;

--
-- Name: cart_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method (
    id text NOT NULL,
    cart_id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_shipping_method OWNER TO postgres;

--
-- Name: cart_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_adjustment OWNER TO postgres;

--
-- Name: cart_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_tax_line OWNER TO postgres;

--
-- Name: credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_line (
    id text NOT NULL,
    cart_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.credit_line OWNER TO postgres;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    code text NOT NULL,
    symbol text NOT NULL,
    symbol_native text NOT NULL,
    decimal_digits integer DEFAULT 0 NOT NULL,
    rounding numeric DEFAULT 0 NOT NULL,
    raw_rounding jsonb NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id text NOT NULL,
    company_name text,
    first_name text,
    last_name text,
    email text,
    phone text,
    has_account boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_account_holder (
    customer_id character varying(255) NOT NULL,
    account_holder_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_account_holder OWNER TO postgres;

--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_address (
    id text NOT NULL,
    customer_id text NOT NULL,
    address_name text,
    is_default_shipping boolean DEFAULT false NOT NULL,
    is_default_billing boolean DEFAULT false NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_address OWNER TO postgres;

--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group OWNER TO postgres;

--
-- Name: customer_group_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group_customer (
    id text NOT NULL,
    customer_id text NOT NULL,
    customer_group_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group_customer OWNER TO postgres;

--
-- Name: fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment (
    id text NOT NULL,
    location_id text NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text,
    shipping_option_id text,
    metadata jsonb,
    delivery_address_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    marked_shipped_by text,
    created_by text,
    requires_shipping boolean DEFAULT true NOT NULL
);


ALTER TABLE public.fulfillment OWNER TO postgres;

--
-- Name: fulfillment_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_address (
    id text NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_address OWNER TO postgres;

--
-- Name: fulfillment_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_item (
    id text NOT NULL,
    title text NOT NULL,
    sku text NOT NULL,
    barcode text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text,
    inventory_item_id text,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_item OWNER TO postgres;

--
-- Name: fulfillment_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_label (
    id text NOT NULL,
    tracking_number text NOT NULL,
    tracking_url text NOT NULL,
    label_url text NOT NULL,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_label OWNER TO postgres;

--
-- Name: fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_provider OWNER TO postgres;

--
-- Name: fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_set (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_set OWNER TO postgres;

--
-- Name: geo_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_zone (
    id text NOT NULL,
    type text DEFAULT 'country'::text NOT NULL,
    country_code text NOT NULL,
    province_code text,
    city text,
    service_zone_id text NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_type_check CHECK ((type = ANY (ARRAY['country'::text, 'province'::text, 'city'::text, 'zip'::text])))
);


ALTER TABLE public.geo_zone OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer DEFAULT 0 NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sku text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean DEFAULT true NOT NULL,
    description text,
    title text,
    thumbnail text,
    metadata jsonb
);


ALTER TABLE public.inventory_item OWNER TO postgres;

--
-- Name: inventory_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_level (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    inventory_item_id text NOT NULL,
    location_id text NOT NULL,
    stocked_quantity numeric DEFAULT 0 NOT NULL,
    reserved_quantity numeric DEFAULT 0 NOT NULL,
    incoming_quantity numeric DEFAULT 0 NOT NULL,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb
);


ALTER TABLE public.inventory_level OWNER TO postgres;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite (
    id text NOT NULL,
    email text NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invite OWNER TO postgres;

--
-- Name: link_module_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link_module_migrations (
    id integer NOT NULL,
    table_name character varying(255) NOT NULL,
    link_descriptor jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.link_module_migrations OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.link_module_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.link_module_migrations_id_seq OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.link_module_migrations_id_seq OWNED BY public.link_module_migrations.id;


--
-- Name: location_fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_provider (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_provider OWNER TO postgres;

--
-- Name: location_fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_set (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_set OWNER TO postgres;

--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id text NOT NULL,
    "to" text NOT NULL,
    channel text NOT NULL,
    template text,
    data jsonb,
    trigger_type text,
    resource_id text,
    resource_type text,
    receiver_id text,
    original_notification_id text,
    idempotency_key text,
    external_id text,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "from" text,
    provider_data jsonb,
    CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failure'::text])))
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_provider (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    channels text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notification_provider OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id text NOT NULL,
    region_id text,
    display_id integer,
    customer_id text,
    version integer DEFAULT 1 NOT NULL,
    sales_channel_id text,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    is_draft_order boolean DEFAULT false NOT NULL,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    custom_display_id text,
    locale text
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_address OWNER TO postgres;

--
-- Name: order_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_cart (
    order_id character varying(255) NOT NULL,
    cart_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_cart OWNER TO postgres;

--
-- Name: order_change; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    internal_note text,
    created_by text,
    requested_by text,
    requested_at timestamp with time zone,
    confirmed_by text,
    confirmed_at timestamp with time zone,
    declined_by text,
    declined_reason text,
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    change_type text,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text,
    carry_over_promotions boolean,
    CONSTRAINT order_change_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'declined'::text, 'requested'::text, 'pending'::text, 'canceled'::text])))
);


ALTER TABLE public.order_change OWNER TO postgres;

--
-- Name: order_change_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change_action (
    id text NOT NULL,
    order_id text,
    version integer,
    ordering bigint NOT NULL,
    order_change_id text,
    reference text,
    reference_id text,
    action text NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text,
    applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_change_action OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_change_action_ordering_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_change_action_ordering_seq OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_change_action_ordering_seq OWNED BY public.order_change_action.ordering;


--
-- Name: order_claim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    type public.order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_claim OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_claim_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_claim_display_id_seq OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_claim_display_id_seq OWNED BY public.order_claim.display_id;


--
-- Name: order_claim_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item (
    id text NOT NULL,
    claim_id text NOT NULL,
    item_id text NOT NULL,
    is_additional_item boolean DEFAULT false NOT NULL,
    reason public.claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item OWNER TO postgres;

--
-- Name: order_claim_item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item_image (
    id text NOT NULL,
    claim_item_id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item_image OWNER TO postgres;

--
-- Name: order_credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_credit_line (
    id text NOT NULL,
    order_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_credit_line OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_display_id_seq OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_display_id_seq OWNED BY public."order".display_id;


--
-- Name: order_exchange; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    no_notification boolean,
    allow_backorder boolean DEFAULT false NOT NULL,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_exchange OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_exchange_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_exchange_display_id_seq OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_exchange_display_id_seq OWNED BY public.order_exchange.display_id;


--
-- Name: order_exchange_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange_item (
    id text NOT NULL,
    exchange_id text NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_exchange_item OWNER TO postgres;

--
-- Name: order_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_fulfillment (
    order_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_fulfillment OWNER TO postgres;

--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    delivered_quantity numeric DEFAULT 0 NOT NULL,
    raw_delivered_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item (
    id text NOT NULL,
    totals_id text,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_price boolean DEFAULT false NOT NULL,
    product_type_id text,
    is_giftcard boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_line_item OWNER TO postgres;

--
-- Name: order_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_line_item_adjustment OWNER TO postgres;

--
-- Name: order_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_line_item_tax_line OWNER TO postgres;

--
-- Name: order_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_payment_collection (
    order_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_payment_collection OWNER TO postgres;

--
-- Name: order_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_promotion (
    order_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_promotion OWNER TO postgres;

--
-- Name: order_shipping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    shipping_method_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_shipping OWNER TO postgres;

--
-- Name: order_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method (
    id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_amount boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_shipping_method OWNER TO postgres;

--
-- Name: order_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_adjustment OWNER TO postgres;

--
-- Name: order_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_tax_line OWNER TO postgres;

--
-- Name: order_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_summary (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    totals jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_summary OWNER TO postgres;

--
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_transaction (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    reference text,
    reference_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_transaction OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    provider_id text CONSTRAINT payment_provider_id_not_null1 NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    payment_session_id text NOT NULL,
    metadata jsonb
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text DEFAULT 'not_paid'::text NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_collection_status_check CHECK ((status = ANY (ARRAY['not_paid'::text, 'awaiting'::text, 'authorized'::text, 'partially_authorized'::text, 'canceled'::text, 'failed'::text, 'partially_captured'::text, 'completed'::text])))
);


ALTER TABLE public.payment_collection OWNER TO postgres;

--
-- Name: payment_collection_payment_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection_payment_providers (
    payment_collection_id text CONSTRAINT payment_collection_payment_provi_payment_collection_id_not_null NOT NULL,
    payment_provider_id text CONSTRAINT payment_collection_payment_provide_payment_provider_id_not_null NOT NULL
);


ALTER TABLE public.payment_collection_payment_providers OWNER TO postgres;

--
-- Name: payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payment_provider OWNER TO postgres;

--
-- Name: payment_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_session (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    context jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    authorized_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_status_check CHECK ((status = ANY (ARRAY['authorized'::text, 'captured'::text, 'pending'::text, 'requires_more'::text, 'error'::text, 'canceled'::text])))
);


ALTER TABLE public.payment_session OWNER TO postgres;

--
-- Name: price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price (
    id text NOT NULL,
    title text,
    price_set_id text NOT NULL,
    currency_code text CONSTRAINT price_money_amount_id_not_null NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    price_list_id text,
    amount numeric NOT NULL,
    min_quantity numeric,
    max_quantity numeric,
    raw_min_quantity jsonb,
    raw_max_quantity jsonb
);


ALTER TABLE public.price OWNER TO postgres;

--
-- Name: price_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list (
    id text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text NOT NULL,
    description text NOT NULL,
    type text DEFAULT 'sale'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT price_list_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text]))),
    CONSTRAINT price_list_type_check CHECK ((type = ANY (ARRAY['sale'::text, 'override'::text])))
);


ALTER TABLE public.price_list OWNER TO postgres;

--
-- Name: price_list_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list_rule (
    id text NOT NULL,
    price_list_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.price_list_rule OWNER TO postgres;

--
-- Name: price_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_preference (
    id text NOT NULL,
    attribute text NOT NULL,
    value text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_preference OWNER TO postgres;

--
-- Name: price_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_rule (
    id text NOT NULL,
    value text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    price_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    attribute text DEFAULT ''::text NOT NULL,
    operator text DEFAULT 'eq'::text NOT NULL,
    CONSTRAINT price_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text])))
);


ALTER TABLE public.price_rule OWNER TO postgres;

--
-- Name: price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_set (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_set OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    subtitle text,
    description text,
    is_giftcard boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    thumbnail text,
    weight text,
    length text,
    height text,
    width text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    collection_id text,
    type_id text,
    discountable boolean DEFAULT true NOT NULL,
    external_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'proposed'::text, 'published'::text, 'rejected'::text])))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    handle text NOT NULL,
    mpath text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_internal boolean DEFAULT false NOT NULL,
    rank integer DEFAULT 0 NOT NULL,
    parent_category_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category_product (
    product_id text NOT NULL,
    product_category_id text NOT NULL
);


ALTER TABLE public.product_category_product OWNER TO postgres;

--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_collection (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_collection OWNER TO postgres;

--
-- Name: product_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option (
    id text NOT NULL,
    title text NOT NULL,
    product_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option OWNER TO postgres;

--
-- Name: product_option_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option_value (
    id text NOT NULL,
    value text NOT NULL,
    option_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option_value OWNER TO postgres;

--
-- Name: product_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales_channel (
    product_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_sales_channel OWNER TO postgres;

--
-- Name: product_shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_shipping_profile (
    product_id character varying(255) NOT NULL,
    shipping_profile_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_shipping_profile OWNER TO postgres;

--
-- Name: product_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tag (
    id text NOT NULL,
    value text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_tag OWNER TO postgres;

--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tags (
    product_id text NOT NULL,
    product_tag_id text NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

--
-- Name: product_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_type (
    id text NOT NULL,
    value text NOT NULL,
    metadata json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_type OWNER TO postgres;

--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    id text NOT NULL,
    title text NOT NULL,
    sku text,
    barcode text,
    ean text,
    upc text,
    allow_backorder boolean DEFAULT false NOT NULL,
    manage_inventory boolean DEFAULT true NOT NULL,
    hs_code text,
    origin_country text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    thumbnail text
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- Name: product_variant_inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_inventory_item (
    variant_id character varying(255) NOT NULL,
    inventory_item_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    required_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_inventory_item OWNER TO postgres;

--
-- Name: product_variant_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_option (
    variant_id text NOT NULL,
    option_value_id text NOT NULL
);


ALTER TABLE public.product_variant_option OWNER TO postgres;

--
-- Name: product_variant_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_price_set (
    variant_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_price_set OWNER TO postgres;

--
-- Name: product_variant_product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_product_image (
    id text NOT NULL,
    variant_id text NOT NULL,
    image_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_product_image OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id text NOT NULL,
    code text NOT NULL,
    campaign_id text,
    is_automatic boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    "limit" integer,
    used integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    CONSTRAINT promotion_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text]))),
    CONSTRAINT promotion_type_check CHECK ((type = ANY (ARRAY['standard'::text, 'buyget'::text])))
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: promotion_application_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_application_method (
    id text NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text NOT NULL,
    target_type text NOT NULL,
    allocation text,
    promotion_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    CONSTRAINT promotion_application_method_allocation_check CHECK ((allocation = ANY (ARRAY['each'::text, 'across'::text, 'once'::text]))),
    CONSTRAINT promotion_application_method_target_type_check CHECK ((target_type = ANY (ARRAY['order'::text, 'shipping_methods'::text, 'items'::text]))),
    CONSTRAINT promotion_application_method_type_check CHECK ((type = ANY (ARRAY['fixed'::text, 'percentage'::text])))
);


ALTER TABLE public.promotion_application_method OWNER TO postgres;

--
-- Name: promotion_campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    campaign_identifier text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign OWNER TO postgres;

--
-- Name: promotion_campaign_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget (
    id text NOT NULL,
    type text NOT NULL,
    campaign_id text NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric DEFAULT 0 NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    attribute text,
    CONSTRAINT promotion_campaign_budget_type_check CHECK ((type = ANY (ARRAY['spend'::text, 'usage'::text, 'use_by_attribute'::text, 'spend_by_attribute'::text])))
);


ALTER TABLE public.promotion_campaign_budget OWNER TO postgres;

--
-- Name: promotion_campaign_budget_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget_usage (
    id text NOT NULL,
    attribute_value text NOT NULL,
    used numeric DEFAULT 0 NOT NULL,
    budget_id text NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign_budget_usage OWNER TO postgres;

--
-- Name: promotion_promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_promotion_rule (
    promotion_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.promotion_promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule (
    id text NOT NULL,
    description text,
    attribute text NOT NULL,
    operator text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text, 'ne'::text, 'in'::text])))
);


ALTER TABLE public.promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule_value (
    id text NOT NULL,
    promotion_rule_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_rule_value OWNER TO postgres;

--
-- Name: provider_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_identity (
    id text NOT NULL,
    entity_id text NOT NULL,
    provider text NOT NULL,
    auth_identity_id text NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.provider_identity OWNER TO postgres;

--
-- Name: publishable_api_key_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishable_api_key_sales_channel (
    publishable_key_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.publishable_api_key_sales_channel OWNER TO postgres;

--
-- Name: refund; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb,
    refund_reason_id text,
    note text
);


ALTER TABLE public.refund OWNER TO postgres;

--
-- Name: refund_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_reason (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    code text NOT NULL
);


ALTER TABLE public.refund_reason OWNER TO postgres;

--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id text NOT NULL,
    name text NOT NULL,
    currency_code text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    automatic_taxes boolean DEFAULT true NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_country (
    iso_2 text NOT NULL,
    iso_3 text NOT NULL,
    num_code text NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    region_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_country OWNER TO postgres;

--
-- Name: region_payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_payment_provider (
    region_id character varying(255) NOT NULL,
    payment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_payment_provider OWNER TO postgres;

--
-- Name: reservation_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    line_item_id text,
    location_id text NOT NULL,
    quantity numeric NOT NULL,
    external_id text,
    description text,
    created_by text,
    metadata jsonb,
    inventory_item_id text NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb
);


ALTER TABLE public.reservation_item OWNER TO postgres;

--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id text NOT NULL,
    order_id text NOT NULL,
    claim_id text,
    exchange_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    status public.return_status_enum DEFAULT 'open'::public.return_status_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text,
    requested_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_display_id_seq OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_display_id_seq OWNED BY public.return.display_id;


--
-- Name: return_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_fulfillment (
    return_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_fulfillment OWNER TO postgres;

--
-- Name: return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_item (
    id text NOT NULL,
    return_id text NOT NULL,
    reason_id text,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric DEFAULT 0 NOT NULL,
    raw_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    damaged_quantity numeric DEFAULT 0 NOT NULL,
    raw_damaged_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL
);


ALTER TABLE public.return_item OWNER TO postgres;

--
-- Name: return_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_reason (
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL,
    description character varying,
    metadata jsonb,
    parent_return_reason_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_reason OWNER TO postgres;

--
-- Name: sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    is_disabled boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel OWNER TO postgres;

--
-- Name: sales_channel_stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel_stock_location (
    sales_channel_id character varying(255) NOT NULL,
    stock_location_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel_stock_location OWNER TO postgres;

--
-- Name: script_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script_migrations (
    id integer NOT NULL,
    script_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone
);


ALTER TABLE public.script_migrations OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.script_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.script_migrations_id_seq OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.script_migrations_id_seq OWNED BY public.script_migrations.id;


--
-- Name: service_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_zone (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    fulfillment_set_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.service_zone OWNER TO postgres;

--
-- Name: shipping_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option (
    id text NOT NULL,
    name text NOT NULL,
    price_type text DEFAULT 'flat'::text NOT NULL,
    service_zone_id text NOT NULL,
    shipping_profile_id text,
    provider_id text,
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_type_check CHECK ((price_type = ANY (ARRAY['calculated'::text, 'flat'::text])))
);


ALTER TABLE public.shipping_option OWNER TO postgres;

--
-- Name: shipping_option_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_price_set (
    shipping_option_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_price_set OWNER TO postgres;

--
-- Name: shipping_option_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_rule (
    id text NOT NULL,
    attribute text NOT NULL,
    operator text NOT NULL,
    value jsonb,
    shipping_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_operator_check CHECK ((operator = ANY (ARRAY['in'::text, 'eq'::text, 'ne'::text, 'gt'::text, 'gte'::text, 'lt'::text, 'lte'::text, 'nin'::text])))
);


ALTER TABLE public.shipping_option_rule OWNER TO postgres;

--
-- Name: shipping_option_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_type (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_type OWNER TO postgres;

--
-- Name: shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_profile (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_profile OWNER TO postgres;

--
-- Name: stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    address_id text,
    metadata jsonb
);


ALTER TABLE public.stock_location OWNER TO postgres;

--
-- Name: stock_location_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location_address (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address_1 text NOT NULL,
    address_2 text,
    company text,
    city text,
    country_code text NOT NULL,
    phone text,
    province text,
    postal_code text,
    metadata jsonb
);


ALTER TABLE public.stock_location_address OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text DEFAULT 'Medusa Store'::text NOT NULL,
    default_sales_channel_id text,
    default_region_id text,
    default_location_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_currency (
    id text NOT NULL,
    currency_code text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_currency OWNER TO postgres;

--
-- Name: store_locale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_locale (
    id text NOT NULL,
    locale_code text NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_locale OWNER TO postgres;

--
-- Name: tax_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_provider OWNER TO postgres;

--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate (
    id text NOT NULL,
    rate real,
    code text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_combinable boolean DEFAULT false NOT NULL,
    tax_region_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate OWNER TO postgres;

--
-- Name: tax_rate_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate_rule (
    id text NOT NULL,
    tax_rate_id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate_rule OWNER TO postgres;

--
-- Name: tax_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_region (
    id text NOT NULL,
    provider_id text,
    country_code text NOT NULL,
    province_code text,
    parent_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone,
    CONSTRAINT "CK_tax_region_country_top_level" CHECK (((parent_id IS NULL) OR (province_code IS NOT NULL))),
    CONSTRAINT "CK_tax_region_provider_top_level" CHECK (((parent_id IS NULL) OR (provider_id IS NULL)))
);


ALTER TABLE public.tax_region OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preference (
    id text NOT NULL,
    user_id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_preference OWNER TO postgres;

--
-- Name: user_rbac_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rbac_role (
    user_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_rbac_role OWNER TO postgres;

--
-- Name: user_video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_video (
    id text NOT NULL,
    user_id text NOT NULL,
    order_id text,
    product_id text NOT NULL,
    video_url text,
    thumbnail_url text,
    title text NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    materials_used jsonb NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT user_video_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text])))
);


ALTER TABLE public.user_video OWNER TO postgres;

--
-- Name: video_material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video_material (
    id text NOT NULL,
    product_id text NOT NULL,
    name text NOT NULL,
    material_key text NOT NULL,
    material_type text NOT NULL,
    default_url text NOT NULL,
    is_replaceable boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT video_material_material_type_check CHECK ((material_type = ANY (ARRAY['image'::text, 'audio'::text, 'background'::text, 'video'::text])))
);


ALTER TABLE public.video_material OWNER TO postgres;

--
-- Name: view_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.view_configuration (
    id text NOT NULL,
    entity text NOT NULL,
    name text,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.view_configuration OWNER TO postgres;

--
-- Name: workflow_execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_execution (
    id character varying NOT NULL,
    workflow_id character varying NOT NULL,
    transaction_id character varying NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text DEFAULT '01KGFMAM3T4HA83TRNNPQ28EGY'::text NOT NULL
);


ALTER TABLE public.workflow_execution OWNER TO postgres;

--
-- Name: link_module_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations ALTER COLUMN id SET DEFAULT nextval('public.link_module_migrations_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: order display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN display_id SET DEFAULT nextval('public.order_display_id_seq'::regclass);


--
-- Name: order_change_action ordering; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action ALTER COLUMN ordering SET DEFAULT nextval('public.order_change_action_ordering_seq'::regclass);


--
-- Name: order_claim display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim ALTER COLUMN display_id SET DEFAULT nextval('public.order_claim_display_id_seq'::regclass);


--
-- Name: order_exchange display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange ALTER COLUMN display_id SET DEFAULT nextval('public.order_exchange_display_id_seq'::regclass);


--
-- Name: return display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return ALTER COLUMN display_id SET DEFAULT nextval('public.return_display_id_seq'::regclass);


--
-- Name: script_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations ALTER COLUMN id SET DEFAULT nextval('public.script_migrations_id_seq'::regclass);


--
-- Data for Name: account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: api_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_key (id, token, salt, redacted, title, type, last_used_at, created_by, created_at, revoked_by, revoked_at, updated_at, deleted_at) FROM stdin;
apk_01KGFMBC71GJ369MRZA31WW4CP	pk_27e90a2b8c5d4cb6b678b2be59be8e3c3065414263f702a6086f3c12d283de61		pk_27e***e61	Default Publishable API Key	publishable	\N		2026-02-03 00:53:06.914+08	\N	\N	2026-02-03 00:53:06.914+08	\N
\.


--
-- Data for Name: application_method_buy_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_buy_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: application_method_target_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_target_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: auth_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_identity (id, app_metadata, created_at, updated_at, deleted_at) FROM stdin;
authid_01KGFMC7ADXX8K4R662GTBJ6D4	{"user_id": "user_01KGFMC77P8DBV995V91AFXEGF"}	2026-02-03 00:53:34.669+08	2026-02-03 00:53:34.677+08	\N
authid_01KGFPNC04E9RV44MCKCSE261T	{"user_id": "user_01KGFPNBXFXD85G7J29MWHVJSK"}	2026-02-03 01:33:31.525+08	2026-02-03 01:33:31.534+08	\N
authid_01KGFPQTN07TD1BH7AGPBCG7WF	{"user_id": "user_01KGFPQTJ4Z7WSFQ6P6ZJ2HEPW"}	2026-02-03 01:34:52.064+08	2026-02-03 01:34:52.072+08	\N
authid_01KH356FXJS90E4Q0SS9A9DPAC	{"customer_id": "cus_01KH356FYNGJPYFMYTXSKHXNRC"}	2026-02-10 14:53:06.866+08	2026-02-10 14:53:06.912+08	\N
authid_01KH6T90H3MNSWZK4EDY3YRQS7	{"customer_id": "cus_01KH6T90HXRF84TP9FTJWVZ91G"}	2026-02-12 00:59:12.803+08	2026-02-12 00:59:12.838+08	\N
\.


--
-- Data for Name: capture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capture (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata) FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, region_id, customer_id, sales_channel_id, email, currency_code, shipping_address_id, billing_address_id, metadata, created_at, updated_at, deleted_at, completed_at, locale) FROM stdin;
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item (id, cart_id, title, subtitle, thumbnail, quantity, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, product_type_id, is_custom_price, is_giftcard) FROM stdin;
\.


--
-- Data for Name: cart_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, item_id, is_tax_inclusive) FROM stdin;
\.


--
-- Data for Name: cart_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, item_id) FROM stdin;
\.


--
-- Data for Name: cart_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_payment_collection (cart_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_promotion (cart_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method (id, cart_id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (code, symbol, symbol_native, decimal_digits, rounding, raw_rounding, name, created_at, updated_at, deleted_at) FROM stdin;
usd	$	$	2	0	{"value": "0", "precision": 20}	US Dollar	2026-02-03 00:52:48.406+08	2026-02-03 00:52:48.406+08	\N
cad	CA$	$	2	0	{"value": "0", "precision": 20}	Canadian Dollar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
eur	€	€	2	0	{"value": "0", "precision": 20}	Euro	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
aed	AED	د.إ.‏	2	0	{"value": "0", "precision": 20}	United Arab Emirates Dirham	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
afn	Af	؋	0	0	{"value": "0", "precision": 20}	Afghan Afghani	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
all	ALL	Lek	0	0	{"value": "0", "precision": 20}	Albanian Lek	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
amd	AMD	դր.	0	0	{"value": "0", "precision": 20}	Armenian Dram	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
ars	AR$	$	2	0	{"value": "0", "precision": 20}	Argentine Peso	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
aud	AU$	$	2	0	{"value": "0", "precision": 20}	Australian Dollar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
azn	man.	ман.	2	0	{"value": "0", "precision": 20}	Azerbaijani Manat	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bam	KM	KM	2	0	{"value": "0", "precision": 20}	Bosnia-Herzegovina Convertible Mark	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bdt	Tk	৳	2	0	{"value": "0", "precision": 20}	Bangladeshi Taka	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bgn	BGN	лв.	2	0	{"value": "0", "precision": 20}	Bulgarian Lev	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bhd	BD	د.ب.‏	3	0	{"value": "0", "precision": 20}	Bahraini Dinar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bif	FBu	FBu	0	0	{"value": "0", "precision": 20}	Burundian Franc	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bnd	BN$	$	2	0	{"value": "0", "precision": 20}	Brunei Dollar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bob	Bs	Bs	2	0	{"value": "0", "precision": 20}	Bolivian Boliviano	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
brl	R$	R$	2	0	{"value": "0", "precision": 20}	Brazilian Real	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bwp	BWP	P	2	0	{"value": "0", "precision": 20}	Botswanan Pula	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
byn	Br	руб.	2	0	{"value": "0", "precision": 20}	Belarusian Ruble	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
bzd	BZ$	$	2	0	{"value": "0", "precision": 20}	Belize Dollar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
cdf	CDF	FrCD	2	0	{"value": "0", "precision": 20}	Congolese Franc	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
chf	CHF	CHF	2	0.05	{"value": "0.05", "precision": 20}	Swiss Franc	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
clp	CL$	$	0	0	{"value": "0", "precision": 20}	Chilean Peso	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
cny	CN¥	CN¥	2	0	{"value": "0", "precision": 20}	Chinese Yuan	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
cop	CO$	$	0	0	{"value": "0", "precision": 20}	Colombian Peso	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
crc	₡	₡	0	0	{"value": "0", "precision": 20}	Costa Rican Colón	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
cve	CV$	CV$	2	0	{"value": "0", "precision": 20}	Cape Verdean Escudo	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
czk	Kč	Kč	2	0	{"value": "0", "precision": 20}	Czech Republic Koruna	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
djf	Fdj	Fdj	0	0	{"value": "0", "precision": 20}	Djiboutian Franc	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
dkk	Dkr	kr	2	0	{"value": "0", "precision": 20}	Danish Krone	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
dop	RD$	RD$	2	0	{"value": "0", "precision": 20}	Dominican Peso	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
dzd	DA	د.ج.‏	2	0	{"value": "0", "precision": 20}	Algerian Dinar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
eek	Ekr	kr	2	0	{"value": "0", "precision": 20}	Estonian Kroon	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
egp	EGP	ج.م.‏	2	0	{"value": "0", "precision": 20}	Egyptian Pound	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
ern	Nfk	Nfk	2	0	{"value": "0", "precision": 20}	Eritrean Nakfa	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
etb	Br	Br	2	0	{"value": "0", "precision": 20}	Ethiopian Birr	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
gbp	£	£	2	0	{"value": "0", "precision": 20}	British Pound Sterling	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
gel	GEL	GEL	2	0	{"value": "0", "precision": 20}	Georgian Lari	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
ghs	GH₵	GH₵	2	0	{"value": "0", "precision": 20}	Ghanaian Cedi	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
gnf	FG	FG	0	0	{"value": "0", "precision": 20}	Guinean Franc	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
gtq	GTQ	Q	2	0	{"value": "0", "precision": 20}	Guatemalan Quetzal	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
hkd	HK$	$	2	0	{"value": "0", "precision": 20}	Hong Kong Dollar	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
hnl	HNL	L	2	0	{"value": "0", "precision": 20}	Honduran Lempira	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
hrk	kn	kn	2	0	{"value": "0", "precision": 20}	Croatian Kuna	2026-02-03 00:52:48.407+08	2026-02-03 00:52:48.407+08	\N
huf	Ft	Ft	0	0	{"value": "0", "precision": 20}	Hungarian Forint	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
idr	Rp	Rp	0	0	{"value": "0", "precision": 20}	Indonesian Rupiah	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
ils	₪	₪	2	0	{"value": "0", "precision": 20}	Israeli New Sheqel	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
inr	Rs	₹	2	0	{"value": "0", "precision": 20}	Indian Rupee	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
iqd	IQD	د.ع.‏	0	0	{"value": "0", "precision": 20}	Iraqi Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
irr	IRR	﷼	0	0	{"value": "0", "precision": 20}	Iranian Rial	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
isk	Ikr	kr	0	0	{"value": "0", "precision": 20}	Icelandic Króna	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
jmd	J$	$	2	0	{"value": "0", "precision": 20}	Jamaican Dollar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
jod	JD	د.أ.‏	3	0	{"value": "0", "precision": 20}	Jordanian Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
jpy	¥	￥	0	0	{"value": "0", "precision": 20}	Japanese Yen	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
kes	Ksh	Ksh	2	0	{"value": "0", "precision": 20}	Kenyan Shilling	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
khr	KHR	៛	2	0	{"value": "0", "precision": 20}	Cambodian Riel	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
kmf	CF	FC	0	0	{"value": "0", "precision": 20}	Comorian Franc	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
krw	₩	₩	0	0	{"value": "0", "precision": 20}	South Korean Won	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
kwd	KD	د.ك.‏	3	0	{"value": "0", "precision": 20}	Kuwaiti Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
kzt	KZT	тңг.	2	0	{"value": "0", "precision": 20}	Kazakhstani Tenge	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
lbp	LB£	ل.ل.‏	0	0	{"value": "0", "precision": 20}	Lebanese Pound	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
lkr	SLRs	SL Re	2	0	{"value": "0", "precision": 20}	Sri Lankan Rupee	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
ltl	Lt	Lt	2	0	{"value": "0", "precision": 20}	Lithuanian Litas	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
lvl	Ls	Ls	2	0	{"value": "0", "precision": 20}	Latvian Lats	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
lyd	LD	د.ل.‏	3	0	{"value": "0", "precision": 20}	Libyan Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mad	MAD	د.م.‏	2	0	{"value": "0", "precision": 20}	Moroccan Dirham	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mdl	MDL	MDL	2	0	{"value": "0", "precision": 20}	Moldovan Leu	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mga	MGA	MGA	0	0	{"value": "0", "precision": 20}	Malagasy Ariary	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mkd	MKD	MKD	2	0	{"value": "0", "precision": 20}	Macedonian Denar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mmk	MMK	K	0	0	{"value": "0", "precision": 20}	Myanma Kyat	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mnt	MNT	₮	0	0	{"value": "0", "precision": 20}	Mongolian Tugrig	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mop	MOP$	MOP$	2	0	{"value": "0", "precision": 20}	Macanese Pataca	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mur	MURs	MURs	0	0	{"value": "0", "precision": 20}	Mauritian Rupee	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mwk	K	K	2	0	{"value": "0", "precision": 20}	Malawian Kwacha	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mxn	MX$	$	2	0	{"value": "0", "precision": 20}	Mexican Peso	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
myr	RM	RM	2	0	{"value": "0", "precision": 20}	Malaysian Ringgit	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
mzn	MTn	MTn	2	0	{"value": "0", "precision": 20}	Mozambican Metical	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
nad	N$	N$	2	0	{"value": "0", "precision": 20}	Namibian Dollar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
ngn	₦	₦	2	0	{"value": "0", "precision": 20}	Nigerian Naira	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
nio	C$	C$	2	0	{"value": "0", "precision": 20}	Nicaraguan Córdoba	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
nok	Nkr	kr	2	0	{"value": "0", "precision": 20}	Norwegian Krone	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
npr	NPRs	नेरू	2	0	{"value": "0", "precision": 20}	Nepalese Rupee	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
nzd	NZ$	$	2	0	{"value": "0", "precision": 20}	New Zealand Dollar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
omr	OMR	ر.ع.‏	3	0	{"value": "0", "precision": 20}	Omani Rial	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
pab	B/.	B/.	2	0	{"value": "0", "precision": 20}	Panamanian Balboa	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
pen	S/.	S/.	2	0	{"value": "0", "precision": 20}	Peruvian Nuevo Sol	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
php	₱	₱	2	0	{"value": "0", "precision": 20}	Philippine Peso	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
pkr	PKRs	₨	0	0	{"value": "0", "precision": 20}	Pakistani Rupee	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
pln	zł	zł	2	0	{"value": "0", "precision": 20}	Polish Zloty	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
pyg	₲	₲	0	0	{"value": "0", "precision": 20}	Paraguayan Guarani	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
qar	QR	ر.ق.‏	2	0	{"value": "0", "precision": 20}	Qatari Rial	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
ron	RON	RON	2	0	{"value": "0", "precision": 20}	Romanian Leu	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
rsd	din.	дин.	0	0	{"value": "0", "precision": 20}	Serbian Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
rub	RUB	₽.	2	0	{"value": "0", "precision": 20}	Russian Ruble	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
rwf	RWF	FR	0	0	{"value": "0", "precision": 20}	Rwandan Franc	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
sar	SR	ر.س.‏	2	0	{"value": "0", "precision": 20}	Saudi Riyal	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
sdg	SDG	SDG	2	0	{"value": "0", "precision": 20}	Sudanese Pound	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
sek	Skr	kr	2	0	{"value": "0", "precision": 20}	Swedish Krona	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
sgd	S$	$	2	0	{"value": "0", "precision": 20}	Singapore Dollar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
sos	Ssh	Ssh	0	0	{"value": "0", "precision": 20}	Somali Shilling	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
syp	SY£	ل.س.‏	0	0	{"value": "0", "precision": 20}	Syrian Pound	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
thb	฿	฿	2	0	{"value": "0", "precision": 20}	Thai Baht	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
tnd	DT	د.ت.‏	3	0	{"value": "0", "precision": 20}	Tunisian Dinar	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
top	T$	T$	2	0	{"value": "0", "precision": 20}	Tongan Paʻanga	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
tjs	TJS	с.	2	0	{"value": "0", "precision": 20}	Tajikistani Somoni	2026-02-03 00:52:48.408+08	2026-02-03 00:52:48.408+08	\N
try	₺	₺	2	0	{"value": "0", "precision": 20}	Turkish Lira	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
ttd	TT$	$	2	0	{"value": "0", "precision": 20}	Trinidad and Tobago Dollar	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
twd	NT$	NT$	2	0	{"value": "0", "precision": 20}	New Taiwan Dollar	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
tzs	TSh	TSh	0	0	{"value": "0", "precision": 20}	Tanzanian Shilling	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
uah	₴	₴	2	0	{"value": "0", "precision": 20}	Ukrainian Hryvnia	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
ugx	USh	USh	0	0	{"value": "0", "precision": 20}	Ugandan Shilling	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
uyu	$U	$	2	0	{"value": "0", "precision": 20}	Uruguayan Peso	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
uzs	UZS	UZS	0	0	{"value": "0", "precision": 20}	Uzbekistan Som	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
vef	Bs.F.	Bs.F.	2	0	{"value": "0", "precision": 20}	Venezuelan Bolívar	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
vnd	₫	₫	0	0	{"value": "0", "precision": 20}	Vietnamese Dong	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
xaf	FCFA	FCFA	0	0	{"value": "0", "precision": 20}	CFA Franc BEAC	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
xof	CFA	CFA	0	0	{"value": "0", "precision": 20}	CFA Franc BCEAO	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
xpf	₣	₣	0	0	{"value": "0", "precision": 20}	CFP Franc	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
yer	YR	ر.ي.‏	0	0	{"value": "0", "precision": 20}	Yemeni Rial	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
zar	R	R	2	0	{"value": "0", "precision": 20}	South African Rand	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
zmk	ZK	ZK	0	0	{"value": "0", "precision": 20}	Zambian Kwacha	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
zwl	ZWL$	ZWL$	0	0	{"value": "0", "precision": 20}	Zimbabwean Dollar	2026-02-03 00:52:48.409+08	2026-02-03 00:52:48.409+08	\N
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, company_name, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at, deleted_at, created_by) FROM stdin;
cus_01KH356FYNGJPYFMYTXSKHXNRC	\N	tom	li	942233@qq.com	13938211265	t	\N	2026-02-10 14:53:06.902+08	2026-02-10 14:53:06.902+08	\N	\N
cus_01KH6T90HXRF84TP9FTJWVZ91G	\N	Ding	Curt	942233@gmail.com	13938211265	t	\N	2026-02-12 00:59:12.829+08	2026-02-12 00:59:12.829+08	\N	\N
\.


--
-- Data for Name: customer_account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_account_holder (customer_id, account_holder_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_address (id, customer_id, address_name, is_default_shipping, is_default_billing, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group (id, name, metadata, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group_customer (id, customer_id, customer_group_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment (id, location_id, packed_at, shipped_at, delivered_at, canceled_at, data, provider_id, shipping_option_id, metadata, delivery_address_id, created_at, updated_at, deleted_at, marked_shipped_by, created_by, requires_shipping) FROM stdin;
\.


--
-- Data for Name: fulfillment_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_address (id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_item (id, title, sku, barcode, quantity, raw_quantity, line_item_id, inventory_item_id, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_label (id, tracking_number, tracking_url, label_url, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
manual_manual	t	2026-02-03 00:52:48.444+08	2026-02-03 00:52:48.444+08	\N
\.


--
-- Data for Name: fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_set (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuset_01KGFN91W36RS5ZRTZ4H6N4B8Q	European Warehouse delivery	shipping	\N	2026-02-03 01:09:19.363+08	2026-02-03 01:09:19.363+08	\N
\.


--
-- Data for Name: geo_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_zone (id, type, country_code, province_code, city, service_zone_id, postal_expression, metadata, created_at, updated_at, deleted_at) FROM stdin;
fgz_01KGFN91W2VW6XCD1HBK2E7DTZ	country	gb	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.363+08	2026-02-03 01:09:19.363+08	\N
fgz_01KGFN91W2DQF5RFACX0X1BSVP	country	de	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
fgz_01KGFN91W2Z06BAH00PJ826BM7	country	dk	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
fgz_01KGFN91W2T67FJTS2Y5VGKC05	country	se	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
fgz_01KGFN91W3WK7W2BXFBZNH694J	country	fr	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
fgz_01KGFN91W3ZSRAKND1MPXCS67N	country	es	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
fgz_01KGFN91W3JPR7V7V5DHVEJBC5	country	it	\N	\N	serzo_01KGFN91W3KB89HPJ2KE670R0T	\N	\N	2026-02-03 01:09:19.364+08	2026-02-03 01:09:19.364+08	\N
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (id, url, metadata, created_at, updated_at, deleted_at, rank, product_id) FROM stdin;
oystg9	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDHJNGTZJA8C5Y383JCQHS.png	\N	2026-02-14 23:50:41.568+08	2026-02-14 23:50:41.568+08	\N	0	prod_01KH6T34TVVXGBD5AST7PZHGEQ
\.


--
-- Data for Name: inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_item (id, created_at, updated_at, deleted_at, sku, origin_country, hs_code, mid_code, material, weight, length, height, width, requires_shipping, description, title, thumbnail, metadata) FROM stdin;
iitem_01KGFN921NS0NXKJ0M3C8RH6NK	2026-02-03 01:09:19.544+08	2026-02-03 01:09:19.544+08	\N	SHIRT-S-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	S / Black	S / Black	\N	\N
iitem_01KGFN921PTBGFWRD34KBF9WNJ	2026-02-03 01:09:19.544+08	2026-02-03 01:09:19.544+08	\N	SHIRT-S-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	S / White	S / White	\N	\N
iitem_01KGFN921PVV34Q2S4Z9XP7GQ7	2026-02-03 01:09:19.544+08	2026-02-03 01:09:19.544+08	\N	SHIRT-M-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	M / Black	M / Black	\N	\N
iitem_01KGFN921P0886XVSNT85KQ3VA	2026-02-03 01:09:19.544+08	2026-02-03 01:09:19.544+08	\N	SHIRT-M-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	M / White	M / White	\N	\N
iitem_01KGFN921PA46Q48X7CWPJXQMK	2026-02-03 01:09:19.544+08	2026-02-03 01:09:19.544+08	\N	SHIRT-L-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	L / Black	L / Black	\N	\N
iitem_01KGFN921PPXEVSPKTPA0TCKA9	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHIRT-L-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	L / White	L / White	\N	\N
iitem_01KGFN921PC44HTW59ZF8XYCN5	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHIRT-XL-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	XL / Black	XL / Black	\N	\N
iitem_01KGFN921P992002WAF2HCC7SA	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHIRT-XL-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	XL / White	XL / White	\N	\N
iitem_01KGFN921Q2DMG989102ATGNSC	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATSHIRT-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KGFN921QGVPRQZW9HYKRRNXN	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATSHIRT-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KGFN921Q0X9A9X08QWXZZVDB	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATSHIRT-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KGFN921Q449M96BZTQ4E69KA	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATSHIRT-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
iitem_01KGFN921QPTE7QPVVA99EYKSC	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATPANTS-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KGFN921QS5NTM36YDMFGR9H8	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATPANTS-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KGFN921Q10SJ78CBB52XFH2A	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATPANTS-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KGFN921QJFE22EZ2PFESAMSS	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SWEATPANTS-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
iitem_01KGFN921Q8FRKB16E52FCNBZ7	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHORTS-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KGFN921RPXB4A0K59GGANGF3	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHORTS-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KGFN921RSEY6Z29S7NV1FZ4K	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHORTS-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KGFN921RK8J43V8DKTK7XPF5	2026-02-03 01:09:19.545+08	2026-02-03 01:09:19.545+08	\N	SHORTS-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
iitem_01KH6T34WRNPEBX88VRVCFFPE8	2026-02-12 00:56:00.664+08	2026-02-12 00:56:00.664+08	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	t	red	red	\N	\N
iitem_01KH6T34WRPWC9KRXZKH3JW2TB	2026-02-12 00:56:00.664+08	2026-02-12 00:56:00.664+08	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	t	bule	bule	\N	\N
\.


--
-- Data for Name: inventory_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_level (id, created_at, updated_at, deleted_at, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, metadata, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity) FROM stdin;
ilev_01KGFN924AYF9XKGABYBG9Y75B	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921NS0NXKJ0M3C8RH6NK	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924A5EKE7E914FWDJ7C2	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921P0886XVSNT85KQ3VA	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924A2QX5JBAJ2WBFMN80	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921P992002WAF2HCC7SA	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924AXGB5YT7WCSTV6S63	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921PA46Q48X7CWPJXQMK	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924A8X4KZQRQC933K97E	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921PC44HTW59ZF8XYCN5	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BAEX1N2AWWXS0GMHD	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921PPXEVSPKTPA0TCKA9	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BY3HSAWP7STSC67PR	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921PTBGFWRD34KBF9WNJ	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924B8JRNZX1TJ28N0F4X	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921PVV34Q2S4Z9XP7GQ7	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BVP6D4QX4NG7HA4C9	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921Q0X9A9X08QWXZZVDB	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BM6EVMMQ3G5766NP0	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921Q10SJ78CBB52XFH2A	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BTFTWWCM6VEVP5JBY	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921Q2DMG989102ATGNSC	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924B51KANAZ0BD83J1SV	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921Q449M96BZTQ4E69KA	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BPGA8X2K9MPW4VT6N	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921Q8FRKB16E52FCNBZ7	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BJX0NDFGC2WAZ294E	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921QGVPRQZW9HYKRRNXN	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924BCC826VR9Z19J0ZXP	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921QJFE22EZ2PFESAMSS	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924B0YZYP56VBBAFPABB	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921QPTE7QPVVA99EYKSC	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924CT4V3T9958TNTKSE4	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921QS5NTM36YDMFGR9H8	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924C8XN6BXXWENSHSF3A	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921RK8J43V8DKTK7XPF5	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924CD5EYKSZ3BFJCG9T9	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921RPXB4A0K59GGANGF3	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KGFN924C7E9ZWNT4H6D6EFRN	2026-02-03 01:09:19.628+08	2026-02-03 01:09:19.628+08	\N	iitem_01KGFN921RSEY6Z29S7NV1FZ4K	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite (id, email, accepted, token, expires_at, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: link_module_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link_module_migrations (id, table_name, link_descriptor, created_at) FROM stdin;
1	cart_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "cart", "fromModule": "cart"}	2026-02-03 00:52:46.876566
2	cart_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "cart", "fromModule": "cart"}	2026-02-03 00:52:46.882105
3	customer_account_holder	{"toModel": "account_holder", "toModule": "payment", "fromModel": "customer", "fromModule": "customer"}	2026-02-03 00:52:46.884742
4	location_fulfillment_provider	{"toModel": "fulfillment_provider", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-02-03 00:52:46.887063
5	location_fulfillment_set	{"toModel": "fulfillment_set", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-02-03 00:52:46.889415
6	order_cart	{"toModel": "cart", "toModule": "cart", "fromModel": "order", "fromModule": "order"}	2026-02-03 00:52:46.892108
7	order_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "order", "fromModule": "order"}	2026-02-03 00:52:46.894622
8	order_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "order", "fromModule": "order"}	2026-02-03 00:52:46.897749
9	order_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "order", "fromModule": "order"}	2026-02-03 00:52:46.900408
10	return_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "return", "fromModule": "order"}	2026-02-03 00:52:46.902868
11	product_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "product", "fromModule": "product"}	2026-02-03 00:52:46.905719
12	product_shipping_profile	{"toModel": "shipping_profile", "toModule": "fulfillment", "fromModel": "product", "fromModule": "product"}	2026-02-03 00:52:46.909182
13	product_variant_inventory_item	{"toModel": "inventory", "toModule": "inventory", "fromModel": "variant", "fromModule": "product"}	2026-02-03 00:52:46.912087
14	product_variant_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "variant", "fromModule": "product"}	2026-02-03 00:52:46.914946
15	publishable_api_key_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "api_key", "fromModule": "api_key"}	2026-02-03 00:52:46.917241
16	region_payment_provider	{"toModel": "payment_provider", "toModule": "payment", "fromModel": "region", "fromModule": "region"}	2026-02-03 00:52:46.920614
17	sales_channel_stock_location	{"toModel": "location", "toModule": "stock_location", "fromModel": "sales_channel", "fromModule": "sales_channel"}	2026-02-03 00:52:46.923651
18	shipping_option_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "shipping_option", "fromModule": "fulfillment"}	2026-02-03 00:52:46.926678
19	user_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "user", "fromModule": "user"}	2026-02-03 00:52:46.929655
\.


--
-- Data for Name: location_fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_provider (stock_location_id, fulfillment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KGFN91VBQVE4SVCYR4BEKGVG	manual_manual	locfp_01KGFN91VT08W3ETGSAYKF1VP3	2026-02-03 01:09:19.353899+08	2026-02-03 01:09:19.353899+08	\N
\.


--
-- Data for Name: location_fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_set (stock_location_id, fulfillment_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KGFN91VBQVE4SVCYR4BEKGVG	fuset_01KGFN91W36RS5ZRTZ4H6N4B8Q	locfs_01KGFN91WDBWFGQHPKGJRV10AE	2026-02-03 01:09:19.373188+08	2026-02-03 01:09:19.373188+08	\N
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20240307161216	2026-02-03 00:52:41.008521+08
2	Migration20241210073813	2026-02-03 00:52:41.008521+08
3	Migration20250106142624	2026-02-03 00:52:41.008521+08
4	Migration20250120110820	2026-02-03 00:52:41.008521+08
5	Migration20240307132720	2026-02-03 00:52:41.051619+08
6	Migration20240719123015	2026-02-03 00:52:41.051619+08
7	Migration20241213063611	2026-02-03 00:52:41.051619+08
8	Migration20251010131115	2026-02-03 00:52:41.051619+08
9	InitialSetup20240401153642	2026-02-03 00:52:41.097047+08
10	Migration20240601111544	2026-02-03 00:52:41.097047+08
11	Migration202408271511	2026-02-03 00:52:41.097047+08
12	Migration20241122120331	2026-02-03 00:52:41.097047+08
13	Migration20241125090957	2026-02-03 00:52:41.097047+08
14	Migration20250411073236	2026-02-03 00:52:41.097047+08
15	Migration20250516081326	2026-02-03 00:52:41.097047+08
16	Migration20250910154539	2026-02-03 00:52:41.097047+08
17	Migration20250911092221	2026-02-03 00:52:41.097047+08
18	Migration20250929204438	2026-02-03 00:52:41.097047+08
19	Migration20251008132218	2026-02-03 00:52:41.097047+08
20	Migration20251011090511	2026-02-03 00:52:41.097047+08
21	Migration20230929122253	2026-02-03 00:52:41.197068+08
22	Migration20240322094407	2026-02-03 00:52:41.197068+08
23	Migration20240322113359	2026-02-03 00:52:41.197068+08
24	Migration20240322120125	2026-02-03 00:52:41.197068+08
25	Migration20240626133555	2026-02-03 00:52:41.197068+08
26	Migration20240704094505	2026-02-03 00:52:41.197068+08
27	Migration20241127114534	2026-02-03 00:52:41.197068+08
28	Migration20241127223829	2026-02-03 00:52:41.197068+08
29	Migration20241128055359	2026-02-03 00:52:41.197068+08
30	Migration20241212190401	2026-02-03 00:52:41.197068+08
31	Migration20250408145122	2026-02-03 00:52:41.197068+08
32	Migration20250409122219	2026-02-03 00:52:41.197068+08
33	Migration20251009110625	2026-02-03 00:52:41.197068+08
34	Migration20251112192723	2026-02-03 00:52:41.197068+08
35	Migration20240227120221	2026-02-03 00:52:41.296588+08
36	Migration20240617102917	2026-02-03 00:52:41.296588+08
37	Migration20240624153824	2026-02-03 00:52:41.296588+08
38	Migration20241211061114	2026-02-03 00:52:41.296588+08
39	Migration20250113094144	2026-02-03 00:52:41.296588+08
40	Migration20250120110700	2026-02-03 00:52:41.296588+08
41	Migration20250226130616	2026-02-03 00:52:41.296588+08
42	Migration20250508081510	2026-02-03 00:52:41.296588+08
43	Migration20250828075407	2026-02-03 00:52:41.296588+08
44	Migration20250909083125	2026-02-03 00:52:41.296588+08
45	Migration20250916120552	2026-02-03 00:52:41.296588+08
46	Migration20250917143818	2026-02-03 00:52:41.296588+08
47	Migration20250919122137	2026-02-03 00:52:41.296588+08
48	Migration20251006000000	2026-02-03 00:52:41.296588+08
49	Migration20251015113934	2026-02-03 00:52:41.296588+08
50	Migration20251107050148	2026-02-03 00:52:41.296588+08
51	Migration20240124154000	2026-02-03 00:52:41.393316+08
52	Migration20240524123112	2026-02-03 00:52:41.393316+08
53	Migration20240602110946	2026-02-03 00:52:41.393316+08
54	Migration20241211074630	2026-02-03 00:52:41.393316+08
55	Migration20251010130829	2026-02-03 00:52:41.393316+08
56	Migration20240115152146	2026-02-03 00:52:41.432938+08
57	Migration20240222170223	2026-02-03 00:52:41.450265+08
58	Migration20240831125857	2026-02-03 00:52:41.450265+08
59	Migration20241106085918	2026-02-03 00:52:41.450265+08
60	Migration20241205095237	2026-02-03 00:52:41.450265+08
61	Migration20241216183049	2026-02-03 00:52:41.450265+08
62	Migration20241218091938	2026-02-03 00:52:41.450265+08
63	Migration20250120115059	2026-02-03 00:52:41.450265+08
64	Migration20250212131240	2026-02-03 00:52:41.450265+08
65	Migration20250326151602	2026-02-03 00:52:41.450265+08
66	Migration20250508081553	2026-02-03 00:52:41.450265+08
67	Migration20251017153909	2026-02-03 00:52:41.450265+08
68	Migration20251208130704	2026-02-03 00:52:41.450265+08
69	Migration20240205173216	2026-02-03 00:52:41.516919+08
70	Migration20240624200006	2026-02-03 00:52:41.516919+08
71	Migration20250120110744	2026-02-03 00:52:41.516919+08
72	InitialSetup20240221144943	2026-02-03 00:52:41.556982+08
73	Migration20240604080145	2026-02-03 00:52:41.556982+08
74	Migration20241205122700	2026-02-03 00:52:41.556982+08
75	Migration20251015123842	2026-02-03 00:52:41.556982+08
76	InitialSetup20240227075933	2026-02-03 00:52:41.586209+08
77	Migration20240621145944	2026-02-03 00:52:41.586209+08
78	Migration20241206083313	2026-02-03 00:52:41.586209+08
79	Migration20251202184737	2026-02-03 00:52:41.586209+08
80	Migration20251212161429	2026-02-03 00:52:41.586209+08
81	Migration20240227090331	2026-02-03 00:52:41.61709+08
82	Migration20240710135844	2026-02-03 00:52:41.61709+08
83	Migration20240924114005	2026-02-03 00:52:41.61709+08
84	Migration20241212052837	2026-02-03 00:52:41.61709+08
85	InitialSetup20240228133303	2026-02-03 00:52:41.659062+08
86	Migration20240624082354	2026-02-03 00:52:41.659062+08
87	Migration20240225134525	2026-02-03 00:52:41.678235+08
88	Migration20240806072619	2026-02-03 00:52:41.678235+08
89	Migration20241211151053	2026-02-03 00:52:41.678235+08
90	Migration20250115160517	2026-02-03 00:52:41.678235+08
91	Migration20250120110552	2026-02-03 00:52:41.678235+08
92	Migration20250123122334	2026-02-03 00:52:41.678235+08
93	Migration20250206105639	2026-02-03 00:52:41.678235+08
94	Migration20250207132723	2026-02-03 00:52:41.678235+08
95	Migration20250625084134	2026-02-03 00:52:41.678235+08
96	Migration20250924135437	2026-02-03 00:52:41.678235+08
97	Migration20250929124701	2026-02-03 00:52:41.678235+08
98	Migration20240219102530	2026-02-03 00:52:41.750148+08
99	Migration20240604100512	2026-02-03 00:52:41.750148+08
100	Migration20240715102100	2026-02-03 00:52:41.750148+08
101	Migration20240715174100	2026-02-03 00:52:41.750148+08
102	Migration20240716081800	2026-02-03 00:52:41.750148+08
103	Migration20240801085921	2026-02-03 00:52:41.750148+08
104	Migration20240821164505	2026-02-03 00:52:41.750148+08
105	Migration20240821170920	2026-02-03 00:52:41.750148+08
106	Migration20240827133639	2026-02-03 00:52:41.750148+08
107	Migration20240902195921	2026-02-03 00:52:41.750148+08
108	Migration20240913092514	2026-02-03 00:52:41.750148+08
109	Migration20240930122627	2026-02-03 00:52:41.750148+08
110	Migration20241014142943	2026-02-03 00:52:41.750148+08
111	Migration20241106085223	2026-02-03 00:52:41.750148+08
112	Migration20241129124827	2026-02-03 00:52:41.750148+08
113	Migration20241217162224	2026-02-03 00:52:41.750148+08
114	Migration20250326151554	2026-02-03 00:52:41.750148+08
115	Migration20250522181137	2026-02-03 00:52:41.750148+08
116	Migration20250702095353	2026-02-03 00:52:41.750148+08
117	Migration20250704120229	2026-02-03 00:52:41.750148+08
118	Migration20250910130000	2026-02-03 00:52:41.750148+08
119	Migration20251016160403	2026-02-03 00:52:41.750148+08
120	Migration20251016182939	2026-02-03 00:52:41.750148+08
121	Migration20251017155709	2026-02-03 00:52:41.750148+08
122	Migration20251114100559	2026-02-03 00:52:41.750148+08
123	Migration20251125164002	2026-02-03 00:52:41.750148+08
124	Migration20251210112909	2026-02-03 00:52:41.750148+08
125	Migration20251210112924	2026-02-03 00:52:41.750148+08
126	Migration20251225120947	2026-02-03 00:52:41.750148+08
127	Migration20250717162007	2026-02-03 00:52:41.9354+08
128	Migration20240205025928	2026-02-03 00:52:41.959764+08
129	Migration20240529080336	2026-02-03 00:52:41.959764+08
130	Migration20241202100304	2026-02-03 00:52:41.959764+08
131	Migration20240214033943	2026-02-03 00:52:42.008336+08
132	Migration20240703095850	2026-02-03 00:52:42.008336+08
133	Migration20241202103352	2026-02-03 00:52:42.008336+08
134	Migration20240311145700_InitialSetupMigration	2026-02-03 00:52:42.039987+08
135	Migration20240821170957	2026-02-03 00:52:42.039987+08
136	Migration20240917161003	2026-02-03 00:52:42.039987+08
137	Migration20241217110416	2026-02-03 00:52:42.039987+08
138	Migration20250113122235	2026-02-03 00:52:42.039987+08
139	Migration20250120115002	2026-02-03 00:52:42.039987+08
140	Migration20250822130931	2026-02-03 00:52:42.039987+08
141	Migration20250825132614	2026-02-03 00:52:42.039987+08
142	Migration20251114133146	2026-02-03 00:52:42.039987+08
143	Migration20240509083918_InitialSetupMigration	2026-02-03 00:52:42.137591+08
144	Migration20240628075401	2026-02-03 00:52:42.137591+08
145	Migration20240830094712	2026-02-03 00:52:42.137591+08
146	Migration20250120110514	2026-02-03 00:52:42.137591+08
147	Migration20251028172715	2026-02-03 00:52:42.137591+08
148	Migration20251121123942	2026-02-03 00:52:42.137591+08
149	Migration20251121150408	2026-02-03 00:52:42.137591+08
150	Migration20231228143900	2026-02-03 00:52:42.220587+08
151	Migration20241206101446	2026-02-03 00:52:42.220587+08
152	Migration20250128174331	2026-02-03 00:52:42.220587+08
153	Migration20250505092459	2026-02-03 00:52:42.220587+08
154	Migration20250819104213	2026-02-03 00:52:42.220587+08
155	Migration20250819110924	2026-02-03 00:52:42.220587+08
156	Migration20250908080305	2026-02-03 00:52:42.220587+08
157	Migration20260211171737	2026-02-12 01:17:44.634224+08
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "to", channel, template, data, trigger_type, resource_id, resource_type, receiver_id, original_notification_id, idempotency_key, external_id, provider_id, created_at, updated_at, deleted_at, status, "from", provider_data) FROM stdin;
\.


--
-- Data for Name: notification_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_provider (id, handle, name, is_enabled, channels, created_at, updated_at, deleted_at) FROM stdin;
local	local	local	t	{feed}	2026-02-03 00:52:48.443+08	2026-02-03 00:52:48.443+08	\N
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, is_draft_order, email, currency_code, shipping_address_id, billing_address_id, no_notification, metadata, created_at, updated_at, deleted_at, canceled_at, custom_display_id, locale) FROM stdin;
order_01KHFYF8WQ3X06BK07CTRYF1ZN	\N	1	cus_01KH6T90HXRF84TP9FTJWVZ91G	1	\N	pending	f	\N	cny	\N	\N	\N	{"type": "recharge", "credits": 100, "package_id": "basic", "payment_status": "pending"}	2026-02-15 14:05:42.167+08	2026-02-15 14:05:42.167+08	\N	\N	\N	\N
order_01KHFZYWXWCQYS766S589MF05E	\N	2	cus_01KH6T90HXRF84TP9FTJWVZ91G	1	\N	pending	f	\N	cny	\N	\N	\N	{"type": "video_generation", "price": 0, "product_id": "prod_01KH6T34TVVXGBD5AST7PZHGEQ", "materials_used": {"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace-pic1-01KHFZYTKD2ZYCDXX75WCPHJFG.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}, "payment_status": "paid"}	2026-02-15 14:31:42.781+08	2026-02-15 14:31:42.781+08	\N	\N	\N	\N
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_cart (order_id, cart_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_change; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change (id, order_id, version, description, status, internal_note, created_by, requested_by, requested_at, confirmed_by, confirmed_at, declined_by, declined_reason, metadata, declined_at, canceled_by, canceled_at, created_at, updated_at, change_type, deleted_at, return_id, claim_id, exchange_id, carry_over_promotions) FROM stdin;
\.


--
-- Data for Name: order_change_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change_action (id, order_id, version, ordering, order_change_id, reference, reference_id, action, details, amount, raw_amount, internal_note, applied, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_claim; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim (id, order_id, return_id, order_version, display_id, type, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_claim_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item (id, claim_id, item_id, is_additional_item, reason, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_claim_item_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item_image (id, claim_item_id, url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_credit_line (id, order_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_exchange; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange (id, order_id, return_id, order_version, display_id, no_notification, allow_backorder, difference_due, raw_difference_due, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_exchange_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange_item (id, exchange_id, item_id, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_fulfillment (order_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, order_id, version, item_id, quantity, raw_quantity, fulfilled_quantity, raw_fulfilled_quantity, shipped_quantity, raw_shipped_quantity, return_requested_quantity, raw_return_requested_quantity, return_received_quantity, raw_return_received_quantity, return_dismissed_quantity, raw_return_dismissed_quantity, written_off_quantity, raw_written_off_quantity, metadata, created_at, updated_at, deleted_at, delivered_quantity, raw_delivered_quantity, unit_price, raw_unit_price, compare_at_unit_price, raw_compare_at_unit_price) FROM stdin;
\.


--
-- Data for Name: order_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item (id, totals_id, title, subtitle, thumbnail, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, is_custom_price, product_type_id, is_giftcard) FROM stdin;
\.


--
-- Data for Name: order_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, item_id, deleted_at, is_tax_inclusive, version) FROM stdin;
\.


--
-- Data for Name: order_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, item_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_payment_collection (order_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_promotion (order_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping (id, order_id, version, shipping_method_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method (id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at, is_custom_amount) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_summary (id, order_id, version, totals, created_at, updated_at, deleted_at) FROM stdin;
ordsum_01KHFYF8WP9HHTV7DCW2ECH3CM	order_01KHFYF8WQ3X06BK07CTRYF1ZN	1	{"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 0, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 0, "original_order_total": 0, "raw_accounting_total": {"value": "0", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "0", "precision": 20}, "raw_original_order_total": {"value": "0", "precision": 20}}	2026-02-15 14:05:42.167+08	2026-02-15 14:05:42.167+08	\N
ordsum_01KHFZYWXWNADSG9TP4DY87EXN	order_01KHFZYWXWCQYS766S589MF05E	1	{"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 0, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 0, "original_order_total": 0, "raw_accounting_total": {"value": "0", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "0", "precision": 20}, "raw_original_order_total": {"value": "0", "precision": 20}}	2026-02-15 14:31:42.781+08	2026-02-15 14:31:42.781+08	\N
\.


--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (id, order_id, version, amount, raw_amount, currency_code, reference, reference_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, amount, raw_amount, currency_code, provider_id, data, created_at, updated_at, deleted_at, captured_at, canceled_at, payment_collection_id, payment_session_id, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection (id, currency_code, amount, raw_amount, authorized_amount, raw_authorized_amount, captured_amount, raw_captured_amount, refunded_amount, raw_refunded_amount, created_at, updated_at, deleted_at, completed_at, status, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection_payment_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection_payment_providers (payment_collection_id, payment_provider_id) FROM stdin;
\.


--
-- Data for Name: payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
pp_system_default	t	2026-02-03 00:52:48.442+08	2026-02-03 00:52:48.442+08	\N
\.


--
-- Data for Name: payment_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_session (id, currency_code, amount, raw_amount, provider_id, data, context, status, authorized_at, payment_collection_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price (id, title, price_set_id, currency_code, raw_amount, rules_count, created_at, updated_at, deleted_at, price_list_id, amount, min_quantity, max_quantity, raw_min_quantity, raw_max_quantity) FROM stdin;
price_01KGFN91XMSD089QA54RBE7FCG	\N	pset_01KGFN91XN1P3GSVJ11133E647	usd	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN91XMNQ25C2VS0B0Q24PK	\N	pset_01KGFN91XN1P3GSVJ11133E647	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN91XNEPR5GRA22YC8G47P	\N	pset_01KGFN91XN1P3GSVJ11133E647	eur	{"value": "10", "precision": 20}	1	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN91XNDB37JSEWV2CYQF7J	\N	pset_01KGFN91XPNZTX093K3KVHWWM7	usd	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN91XPPC6SGDD3BNM7PVV0	\N	pset_01KGFN91XPNZTX093K3KVHWWM7	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN91XP6PQQB9R2R1X0J3G9	\N	pset_01KGFN91XPNZTX093K3KVHWWM7	eur	{"value": "10", "precision": 20}	1	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922M1JFSSWAM7T4YA989	\N	pset_01KGFN922MBPA4JK5R2HSJBG52	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922MYA28X6E32ARE6J1E	\N	pset_01KGFN922MBPA4JK5R2HSJBG52	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922M13S4YBXVZWED910Q	\N	pset_01KGFN922M9RMQRQ6FHHH2PGGJ	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922MSY1VR4GSJ4M8TG7K	\N	pset_01KGFN922M9RMQRQ6FHHH2PGGJ	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922MTQ0CFXY6TF04HDBJ	\N	pset_01KGFN922N3FCJX67M1AFF04RB	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922NBK0MDS6KGAS37GDT	\N	pset_01KGFN922N3FCJX67M1AFF04RB	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922N8FCSREBJB8EBHSAY	\N	pset_01KGFN922N1XCQSQMZDT4S996Z	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922NMRT6ZS71AZZQ81PE	\N	pset_01KGFN922N1XCQSQMZDT4S996Z	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922NVVBAZ34SED2E8CD6	\N	pset_01KGFN922NQC8TH1PWPQC507AR	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922NY37TMYDN67DYPQ5A	\N	pset_01KGFN922NQC8TH1PWPQC507AR	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922NSS273TKTEVSWT4NS	\N	pset_01KGFN922PB9F7YZW102ETP8NQ	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922PEDRGY3QS0CD68YYK	\N	pset_01KGFN922PB9F7YZW102ETP8NQ	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922PMQ84CCGF7CFXARAJ	\N	pset_01KGFN922PDWBCCJHH80E4FYZ0	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922PYCJ2HCCTRTWPPHYB	\N	pset_01KGFN922PDWBCCJHH80E4FYZ0	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922PZRA4XRXEV9F4TBVM	\N	pset_01KGFN922P37HSP8E6G1Q48B3G	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922PWAH6Y76JDG9FY4MZ	\N	pset_01KGFN922P37HSP8E6G1Q48B3G	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922PSRVJZXYDQEFKTRMN	\N	pset_01KGFN922QTQFCQKBR4YSJKQW4	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922QR8XKGKQVSGC5V5B0	\N	pset_01KGFN922QTQFCQKBR4YSJKQW4	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922Q5PW4C2DY0DSX44J7	\N	pset_01KGFN922Q4R6WC7XGGYB9N1FG	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922Q7Y05WWZX0JX76XZF	\N	pset_01KGFN922Q4R6WC7XGGYB9N1FG	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922QXJ10E9Q066GHE76X	\N	pset_01KGFN922QYDZDYDJMPRT8BNF3	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922QG91W0FB9RG2F8MRC	\N	pset_01KGFN922QYDZDYDJMPRT8BNF3	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922QVKNWD8C9NTQBP7E7	\N	pset_01KGFN922Q50APFBTW60MGS757	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922Q966W20XNXW87745K	\N	pset_01KGFN922Q50APFBTW60MGS757	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922QJKXMV29Z35D1N7XH	\N	pset_01KGFN922R8X2CWS8P9MPE6QZQ	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922RA5CT9PN639CSYFWJ	\N	pset_01KGFN922R8X2CWS8P9MPE6QZQ	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922RWW3TSG1THKK852VD	\N	pset_01KGFN922R3PF89PNFWD61KCQM	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922R4SCWWBM8621BP0D2	\N	pset_01KGFN922R3PF89PNFWD61KCQM	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922R9XF3A9PSSDQEF67R	\N	pset_01KGFN922R90V036R7GZRMWSCF	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922RDMCC06MYVKJ5ER2M	\N	pset_01KGFN922R90V036R7GZRMWSCF	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922RKMMEWC23RSKP4NQB	\N	pset_01KGFN922R1RNSYXXM2M1VVFPT	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922RMJFKKGNC2PKVVJDB	\N	pset_01KGFN922R1RNSYXXM2M1VVFPT	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922RPXAF5NS54YV6XA86	\N	pset_01KGFN922SGN60RS6Z075NB845	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922SFJFNJ52X35NB17FA	\N	pset_01KGFN922SGN60RS6Z075NB845	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922S30BDY90SQS5SWPV4	\N	pset_01KGFN922SM938WEZ8DYQYW0CZ	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922SDAZ1WBAWZ19ZHHDM	\N	pset_01KGFN922SM938WEZ8DYQYW0CZ	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922S0X4KV8J7ZGR0JX3Y	\N	pset_01KGFN922SBWKW06VXBNBADGWQ	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922SWSS25FM11JR3HMFD	\N	pset_01KGFN922SBWKW06VXBNBADGWQ	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KGFN922SYDM8XXRZHG5TKYV7	\N	pset_01KGFN922SDCE77S5Y455XXA9H	eur	{"value": "10", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	10	\N	\N	\N	\N
price_01KGFN922S32VDV52NKQ0YANPR	\N	pset_01KGFN922SDCE77S5Y455XXA9H	usd	{"value": "15", "precision": 20}	0	2026-02-03 01:09:19.579+08	2026-02-03 01:09:19.579+08	\N	\N	15	\N	\N	\N	\N
price_01KH6T34XB2P6CTMNWAM3HVHX5	\N	pset_01KH6T34XBYJ9XF1Y97WWX6X4D	eur	{"value": "2", "precision": 20}	0	2026-02-12 00:56:00.684+08	2026-02-12 00:56:00.684+08	\N	\N	2	\N	\N	\N	\N
price_01KH6T34XBAZYHW2Z0CBE7XR0J	\N	pset_01KH6T34XBYJ9XF1Y97WWX6X4D	usd	{"value": "2", "precision": 20}	0	2026-02-12 00:56:00.685+08	2026-02-12 00:56:00.685+08	\N	\N	2	\N	\N	\N	\N
\.


--
-- Data for Name: price_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list (id, status, starts_at, ends_at, rules_count, title, description, type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price_list_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list_rule (id, price_list_id, created_at, updated_at, deleted_at, value, attribute) FROM stdin;
\.


--
-- Data for Name: price_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_preference (id, attribute, value, is_tax_inclusive, created_at, updated_at, deleted_at) FROM stdin;
prpref_01KGFMBC6QK64RT4X7SV41KCJ1	currency_code	eur	f	2026-02-03 00:53:06.903+08	2026-02-03 00:53:06.903+08	\N
prpref_01KGFN91TNDJ667PZCMW7V77MF	region_id	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	f	2026-02-03 01:09:19.317+08	2026-02-03 01:09:19.317+08	\N
prpref_01KHFSCKA68DMKN485HBNCDS0H	currency_code	cny	t	2026-02-15 12:36:51.654+08	2026-02-15 12:36:51.654+08	\N
prpref_01KHFSCKA6582DNYFC8G0CZ8B1	currency_code	usd	f	2026-02-15 12:36:51.655+08	2026-02-15 12:36:51.655+08	\N
prpref_01KHFSHJAZ0TG394EP2A9EQ38X	region_id	reg_01KHFSHJA62BJT71Z3H2CNG2Y2	f	2026-02-15 12:39:34.495+08	2026-02-15 12:39:34.495+08	\N
\.


--
-- Data for Name: price_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_rule (id, value, priority, price_id, created_at, updated_at, deleted_at, attribute, operator) FROM stdin;
prule_01KGFN91XND7KZR72FZNTD5PCN	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	0	price_01KGFN91XNEPR5GRA22YC8G47P	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	region_id	eq
prule_01KGFN91XPTEWMGCCMVFXCM18J	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	0	price_01KGFN91XP6PQQB9R2R1X0J3G9	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N	region_id	eq
\.


--
-- Data for Name: price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_set (id, created_at, updated_at, deleted_at) FROM stdin;
pset_01KGFN91XN1P3GSVJ11133E647	2026-02-03 01:09:19.414+08	2026-02-03 01:09:19.414+08	\N
pset_01KGFN91XPNZTX093K3KVHWWM7	2026-02-03 01:09:19.415+08	2026-02-03 01:09:19.415+08	\N
pset_01KGFN922MBPA4JK5R2HSJBG52	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922M9RMQRQ6FHHH2PGGJ	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922N3FCJX67M1AFF04RB	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922N1XCQSQMZDT4S996Z	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922NQC8TH1PWPQC507AR	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922PB9F7YZW102ETP8NQ	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922PDWBCCJHH80E4FYZ0	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922P37HSP8E6G1Q48B3G	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922QTQFCQKBR4YSJKQW4	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922Q4R6WC7XGGYB9N1FG	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922QYDZDYDJMPRT8BNF3	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922Q50APFBTW60MGS757	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922R8X2CWS8P9MPE6QZQ	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922R3PF89PNFWD61KCQM	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922R90V036R7GZRMWSCF	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922R1RNSYXXM2M1VVFPT	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922SGN60RS6Z075NB845	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922SM938WEZ8DYQYW0CZ	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922SBWKW06VXBNBADGWQ	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KGFN922SDCE77S5Y455XXA9H	2026-02-03 01:09:19.578+08	2026-02-03 01:09:19.578+08	\N
pset_01KH6T34XBYJ9XF1Y97WWX6X4D	2026-02-12 00:56:00.684+08	2026-02-12 00:56:00.684+08	\N
pset_01KH6T34XC6DEMF09C04MY205Y	2026-02-12 00:56:00.684+08	2026-02-12 00:56:00.684+08	\N
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, title, handle, subtitle, description, is_giftcard, status, thumbnail, weight, length, height, width, origin_country, hs_code, mid_code, material, collection_id, type_id, discountable, external_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
prod_01KH6T34TVVXGBD5AST7PZHGEQ	火锅	hh		火锅视频	f	published	\N	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01KGKZPTXCFMERW5WNQAC3RD46	\N	t	\N	2026-02-12 00:56:00.606+08	2026-02-14 23:50:41.569+08	\N	\N
prod_01KGFN91ZF0X77ETZJ6P29EVV9	Medusa T-Shirt	t-shirt	\N	Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.	f	published	\N	400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-03 01:09:19.476+08	2026-02-15 14:08:43.385+08	\N	\N
prod_01KGFN91ZFFYJFHHGDD5J1RHVC	Medusa Sweatpants	sweatpants	\N	Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.	f	published		400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-03 01:09:19.477+08	2026-02-15 14:09:00.533+08	\N	\N
prod_01KGFN91ZFGRQJ70QPWDP0CN2K	Medusa Sweatshirt	sweatshirt	\N	Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.	f	published		400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-03 01:09:19.477+08	2026-02-15 14:09:16.642+08	\N	\N
prod_01KGFN91ZFPZSHAND3KYV2GPZC	Medusa Shorts	shorts	\N	Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.	f	published		400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-03 01:09:19.477+08	2026-02-15 14:09:27.089+08	\N	\N
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, name, description, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
pcat_01KGFN91Z5CNGZDQRFWVP7DQ02	Shirts		shirts	pcat_01KGFN91Z5CNGZDQRFWVP7DQ02	t	f	0	\N	2026-02-03 01:09:19.463+08	2026-02-03 01:09:19.463+08	\N	\N
pcat_01KGFN91Z64PKK8A9Q4TSCQ6HF	Sweatshirts		sweatshirts	pcat_01KGFN91Z64PKK8A9Q4TSCQ6HF	t	f	1	\N	2026-02-03 01:09:19.463+08	2026-02-03 01:09:19.463+08	\N	\N
pcat_01KGFN91Z6MXDENWFGFK8F6534	Pants		pants	pcat_01KGFN91Z6MXDENWFGFK8F6534	t	f	2	\N	2026-02-03 01:09:19.463+08	2026-02-03 01:09:19.463+08	\N	\N
pcat_01KGFN91Z6XTY5ZBGW0Y85VD5N	Merch		merch	pcat_01KGFN91Z6XTY5ZBGW0Y85VD5N	t	f	3	\N	2026-02-03 01:09:19.463+08	2026-02-03 01:09:19.463+08	\N	\N
\.


--
-- Data for Name: product_category_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category_product (product_id, product_category_id) FROM stdin;
prod_01KGFN91ZF0X77ETZJ6P29EVV9	pcat_01KGFN91Z5CNGZDQRFWVP7DQ02
prod_01KGFN91ZFGRQJ70QPWDP0CN2K	pcat_01KGFN91Z64PKK8A9Q4TSCQ6HF
prod_01KGFN91ZFFYJFHHGDD5J1RHVC	pcat_01KGFN91Z6MXDENWFGFK8F6534
prod_01KGFN91ZFPZSHAND3KYV2GPZC	pcat_01KGFN91Z6XTY5ZBGW0Y85VD5N
prod_01KH6T34TVVXGBD5AST7PZHGEQ	pcat_01KGFN91Z5CNGZDQRFWVP7DQ02
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_collection (id, title, handle, metadata, created_at, updated_at, deleted_at) FROM stdin;
pcol_01KGKZPTXCFMERW5WNQAC3RD46	Shirts	shirts	\N	2026-02-04 17:28:34.475456+08	2026-02-04 17:28:34.475456+08	\N
pcol_01KGKZPTXMYX4SS81RJWFMQQKZ	Sweatshirts	sweatshirts	\N	2026-02-04 17:28:34.483977+08	2026-02-04 17:28:34.483977+08	\N
pcol_01KGKZPTXSKF05K2DB4WHFJTR8	Pants	pants	\N	2026-02-04 17:28:34.48874+08	2026-02-04 17:28:34.48874+08	\N
pcol_01KGKZPTXYS7V386QRZBXPEWP3	Merch	merch	\N	2026-02-04 17:28:34.4936+08	2026-02-04 17:28:34.4936+08	\N
pcol_01KGKZPTY3HJG6FB6FFSWSH6DZ	New Arrivals	new-arrivals	\N	2026-02-04 17:28:34.499062+08	2026-02-04 17:28:34.499062+08	\N
pcol_01KGKZPTY840GZDDZ4Q729W5T0	Summer Collection	summer-collection	\N	2026-02-04 17:28:34.503618+08	2026-02-04 17:28:34.503618+08	\N
\.


--
-- Data for Name: product_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option (id, title, product_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
opt_01KGFN91ZHFNXBA0K3NDMQDK6Z	Size	prod_01KGFN91ZF0X77ETZJ6P29EVV9	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
opt_01KGFN91ZHCSMAGYGCA0GVN8V3	Color	prod_01KGFN91ZF0X77ETZJ6P29EVV9	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
opt_01KGFN91ZKBXK9JQTYWVCHA7ZQ	Size	prod_01KGFN91ZFGRQJ70QPWDP0CN2K	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
opt_01KGFN91ZKWYDW79F2VZGAV2C8	Size	prod_01KGFN91ZFFYJFHHGDD5J1RHVC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
opt_01KGFN91ZMJ40ST7SYTQYK1FKC	Size	prod_01KGFN91ZFPZSHAND3KYV2GPZC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
opt_01KH6T34TXENB40RCG4E1E49MV	color	prod_01KH6T34TVVXGBD5AST7PZHGEQ	\N	2026-02-12 00:56:00.607+08	2026-02-13 00:19:28.474+08	2026-02-13 00:19:28.473+08
\.


--
-- Data for Name: product_option_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option_value (id, value, option_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
optval_01KGFN91ZHQVV32KPV5VDQK3MF	S	opt_01KGFN91ZHFNXBA0K3NDMQDK6Z	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZH9N01PY6QW3CN1AKX	M	opt_01KGFN91ZHFNXBA0K3NDMQDK6Z	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZHBM1MYAGH2MZC8H1X	L	opt_01KGFN91ZHFNXBA0K3NDMQDK6Z	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZHBZ37FZ1EK8WF2NS7	XL	opt_01KGFN91ZHFNXBA0K3NDMQDK6Z	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZHH2GN9GQEWEB3WFD0	Black	opt_01KGFN91ZHCSMAGYGCA0GVN8V3	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZHG0CFQSFB5REV3CH9	White	opt_01KGFN91ZHCSMAGYGCA0GVN8V3	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZJ35KZRTAXZJEHF6ZA	S	opt_01KGFN91ZKBXK9JQTYWVCHA7ZQ	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZJH2P358JKJQSM8F7C	M	opt_01KGFN91ZKBXK9JQTYWVCHA7ZQ	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZJ89ES474G5XB7JYNQ	L	opt_01KGFN91ZKBXK9JQTYWVCHA7ZQ	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZKRRNEGNN6Z55TKQ4E	XL	opt_01KGFN91ZKBXK9JQTYWVCHA7ZQ	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZKN9QJMX0AJ91G367H	S	opt_01KGFN91ZKWYDW79F2VZGAV2C8	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZK32B1T6GZAJWGK2Z1	M	opt_01KGFN91ZKWYDW79F2VZGAV2C8	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZKK2J54KWFCQMT8VFE	L	opt_01KGFN91ZKWYDW79F2VZGAV2C8	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZKE029828VZD811SM3	XL	opt_01KGFN91ZKWYDW79F2VZGAV2C8	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZKPFD1TP7CSD8B4SHS	S	opt_01KGFN91ZMJ40ST7SYTQYK1FKC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZMNR5TKAPGRDK37P2Q	M	opt_01KGFN91ZMJ40ST7SYTQYK1FKC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZMSYSDQ3PXB2XMTTZN	L	opt_01KGFN91ZMJ40ST7SYTQYK1FKC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KGFN91ZMMP5K08CQDEYPX1H1	XL	opt_01KGFN91ZMJ40ST7SYTQYK1FKC	\N	2026-02-03 01:09:19.477+08	2026-02-03 01:09:19.477+08	\N
optval_01KH6T34TXJ92VDW9VT99V8AFQ	red	opt_01KH6T34TXENB40RCG4E1E49MV	\N	2026-02-12 00:56:00.607+08	2026-02-13 00:19:28.491+08	2026-02-13 00:19:28.473+08
optval_01KH6T34TXAB271C7KSFRAR1AS	bule	opt_01KH6T34TXENB40RCG4E1E49MV	\N	2026-02-12 00:56:00.607+08	2026-02-13 00:19:28.491+08	2026-02-13 00:19:28.473+08
\.


--
-- Data for Name: product_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales_channel (product_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KGFN91ZF0X77ETZJ6P29EVV9	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	prodsc_01KGFN9205GQM79C2V97VN546E	2026-02-03 01:09:19.49315+08	2026-02-03 01:09:19.49315+08	\N
prod_01KGFN91ZFGRQJ70QPWDP0CN2K	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	prodsc_01KGFN9206DHWGJE9RW0FB2QAD	2026-02-03 01:09:19.49315+08	2026-02-03 01:09:19.49315+08	\N
prod_01KGFN91ZFFYJFHHGDD5J1RHVC	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	prodsc_01KGFN9206VD5PZV9PVW4578WK	2026-02-03 01:09:19.49315+08	2026-02-03 01:09:19.49315+08	\N
prod_01KGFN91ZFPZSHAND3KYV2GPZC	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	prodsc_01KGFN9206BHMPPV56SH8J9Z8T	2026-02-03 01:09:19.49315+08	2026-02-03 01:09:19.49315+08	\N
prod_01KH6T34TVVXGBD5AST7PZHGEQ	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	prodsc_01KH6T34VS83EVMK3B5RS0GZ29	2026-02-12 00:56:00.632738+08	2026-02-12 00:56:00.632738+08	\N
\.


--
-- Data for Name: product_shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_shipping_profile (product_id, shipping_profile_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KGFN91ZF0X77ETZJ6P29EVV9	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	prodsp_01KGFN920DAVBF4H2WSNWD0WD9	2026-02-03 01:09:19.501693+08	2026-02-03 01:09:19.501693+08	\N
prod_01KGFN91ZFGRQJ70QPWDP0CN2K	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	prodsp_01KGFN920EXQJYP684VQMHAYRJ	2026-02-03 01:09:19.501693+08	2026-02-03 01:09:19.501693+08	\N
prod_01KGFN91ZFFYJFHHGDD5J1RHVC	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	prodsp_01KGFN920EZZ5JEH50CJK6JW8D	2026-02-03 01:09:19.501693+08	2026-02-03 01:09:19.501693+08	\N
prod_01KGFN91ZFPZSHAND3KYV2GPZC	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	prodsp_01KGFN920EWTHRQP6MV9C5BPZH	2026-02-03 01:09:19.501693+08	2026-02-03 01:09:19.501693+08	\N
\.


--
-- Data for Name: product_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tag (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tags (product_id, product_tag_id) FROM stdin;
\.


--
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_type (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (id, title, sku, barcode, ean, upc, allow_backorder, manage_inventory, hs_code, origin_country, mid_code, material, weight, length, height, width, metadata, variant_rank, product_id, created_at, updated_at, deleted_at, thumbnail) FROM stdin;
variant_01KGFN921089C79YEWD6JX5AEM	S / Black	SHIRT-S-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.523+08	2026-02-03 01:09:19.523+08	\N	\N
variant_01KGFN9210V19J565JRS658MXZ	S / White	SHIRT-S-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN921021HFQZJ27X8DSBY3	M / Black	SHIRT-M-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9211QXTWPTTM3H355XY4	M / White	SHIRT-M-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN921185THYNJ4P0BC5ASS	L / Black	SHIRT-L-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9211ZVWQMRWFRWFMZ0HM	L / White	SHIRT-L-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9211Q6CTHYZKPR35S5RW	XL / Black	SHIRT-XL-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN92110VHQ7CVMVAGJ1Q2Q	XL / White	SHIRT-XL-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZF0X77ETZJ6P29EVV9	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9211TPKY3HQRHKQZJYJV	S	SWEATSHIRT-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFGRQJ70QPWDP0CN2K	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN92124QTPWSBFM4Q8GZWD	M	SWEATSHIRT-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFGRQJ70QPWDP0CN2K	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212SYZDQ7BANQYJF7TA	L	SWEATSHIRT-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFGRQJ70QPWDP0CN2K	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN92122VE70NA64FGHAS3J	XL	SWEATSHIRT-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFGRQJ70QPWDP0CN2K	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212D3M0JJFNZ3J11TZZ	S	SWEATPANTS-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFFYJFHHGDD5J1RHVC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212VP2BY8ZMS3KXJEN6	M	SWEATPANTS-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFFYJFHHGDD5J1RHVC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212ZTA4B7S976BPWHJZ	L	SWEATPANTS-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFFYJFHHGDD5J1RHVC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212R7F7CW3XZZEBMBJF	XL	SWEATPANTS-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFFYJFHHGDD5J1RHVC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212XB3HQS5QJ0KYDZ8M	S	SHORTS-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFPZSHAND3KYV2GPZC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9212WNDJMHRQGSZPEH81	M	SHORTS-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFPZSHAND3KYV2GPZC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN92128NWTFZ7222M7MZX0	L	SHORTS-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFPZSHAND3KYV2GPZC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KGFN9213WEPD30JXVTBSGKY9	XL	SHORTS-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KGFN91ZFPZSHAND3KYV2GPZC	2026-02-03 01:09:19.524+08	2026-02-03 01:09:19.524+08	\N	\N
variant_01KH6T34WC8VCSCJJEEF07X7RX	red	1	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KH6T34TVVXGBD5AST7PZHGEQ	2026-02-12 00:56:00.652+08	2026-02-12 00:56:00.652+08	\N	\N
variant_01KH6T34WCXNBMY27TF6VA3FKT	bule	2	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	prod_01KH6T34TVVXGBD5AST7PZHGEQ	2026-02-12 00:56:00.653+08	2026-02-12 00:56:00.653+08	\N	\N
\.


--
-- Data for Name: product_variant_inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_inventory_item (variant_id, inventory_item_id, id, required_quantity, created_at, updated_at, deleted_at) FROM stdin;
variant_01KGFN921089C79YEWD6JX5AEM	iitem_01KGFN921NS0NXKJ0M3C8RH6NK	pvitem_01KGFN922APBY3NH3D09M3K0Y5	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9210V19J565JRS658MXZ	iitem_01KGFN921PTBGFWRD34KBF9WNJ	pvitem_01KGFN922BJN2KEK7DMK40D1RS	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN921021HFQZJ27X8DSBY3	iitem_01KGFN921PVV34Q2S4Z9XP7GQ7	pvitem_01KGFN922BRE68BRYH1N5BYJ48	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9211QXTWPTTM3H355XY4	iitem_01KGFN921P0886XVSNT85KQ3VA	pvitem_01KGFN922BNYQ9RCP6669TN30H	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN921185THYNJ4P0BC5ASS	iitem_01KGFN921PA46Q48X7CWPJXQMK	pvitem_01KGFN922BCWJANHZ942GTH0SF	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9211ZVWQMRWFRWFMZ0HM	iitem_01KGFN921PPXEVSPKTPA0TCKA9	pvitem_01KGFN922BZD8WEJJQENR0MQJ1	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9211Q6CTHYZKPR35S5RW	iitem_01KGFN921PC44HTW59ZF8XYCN5	pvitem_01KGFN922BDNX14B2EQP5A8R1E	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN92110VHQ7CVMVAGJ1Q2Q	iitem_01KGFN921P992002WAF2HCC7SA	pvitem_01KGFN922B3ZRMTFSAYRBR0S0F	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9211TPKY3HQRHKQZJYJV	iitem_01KGFN921Q2DMG989102ATGNSC	pvitem_01KGFN922BXZKY6FH002AATDWF	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN92124QTPWSBFM4Q8GZWD	iitem_01KGFN921QGVPRQZW9HYKRRNXN	pvitem_01KGFN922BQAXSMDQ8VSWKH234	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212SYZDQ7BANQYJF7TA	iitem_01KGFN921Q0X9A9X08QWXZZVDB	pvitem_01KGFN922C1PSZT3QY6RJZX80F	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN92122VE70NA64FGHAS3J	iitem_01KGFN921Q449M96BZTQ4E69KA	pvitem_01KGFN922CXCES69W8P13WSC19	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212D3M0JJFNZ3J11TZZ	iitem_01KGFN921QPTE7QPVVA99EYKSC	pvitem_01KGFN922CYBM6SGZ82MK2FQY3	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212VP2BY8ZMS3KXJEN6	iitem_01KGFN921QS5NTM36YDMFGR9H8	pvitem_01KGFN922CFH7R7FX7KX8BKKYM	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212ZTA4B7S976BPWHJZ	iitem_01KGFN921Q10SJ78CBB52XFH2A	pvitem_01KGFN922CRG5NKEMDA65EMN92	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212R7F7CW3XZZEBMBJF	iitem_01KGFN921QJFE22EZ2PFESAMSS	pvitem_01KGFN922C79T1FGCPY1F2JZXJ	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212XB3HQS5QJ0KYDZ8M	iitem_01KGFN921Q8FRKB16E52FCNBZ7	pvitem_01KGFN922C8QZT56KZZT6TEYNJ	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9212WNDJMHRQGSZPEH81	iitem_01KGFN921RPXB4A0K59GGANGF3	pvitem_01KGFN922C91XTNMWTPKE3WNC3	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN92128NWTFZ7222M7MZX0	iitem_01KGFN921RSEY6Z29S7NV1FZ4K	pvitem_01KGFN922CRXC12019GXHAZAEZ	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KGFN9213WEPD30JXVTBSGKY9	iitem_01KGFN921RK8J43V8DKTK7XPF5	pvitem_01KGFN922CPG8CAVBD3QJX8YN3	1	2026-02-03 01:09:19.562714+08	2026-02-03 01:09:19.562714+08	\N
variant_01KH6T34WC8VCSCJJEEF07X7RX	iitem_01KH6T34WRNPEBX88VRVCFFPE8	pvitem_01KH6T34X308QJX42Y76VG5E96	1	2026-02-12 00:56:00.675221+08	2026-02-12 00:56:00.675221+08	\N
variant_01KH6T34WCXNBMY27TF6VA3FKT	iitem_01KH6T34WRPWC9KRXZKH3JW2TB	pvitem_01KH6T34X41VA10X1J268X88G0	1	2026-02-12 00:56:00.675221+08	2026-02-12 00:56:00.675221+08	\N
\.


--
-- Data for Name: product_variant_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_option (variant_id, option_value_id) FROM stdin;
variant_01KGFN921089C79YEWD6JX5AEM	optval_01KGFN91ZHQVV32KPV5VDQK3MF
variant_01KGFN921089C79YEWD6JX5AEM	optval_01KGFN91ZHH2GN9GQEWEB3WFD0
variant_01KGFN9210V19J565JRS658MXZ	optval_01KGFN91ZHQVV32KPV5VDQK3MF
variant_01KGFN9210V19J565JRS658MXZ	optval_01KGFN91ZHG0CFQSFB5REV3CH9
variant_01KGFN921021HFQZJ27X8DSBY3	optval_01KGFN91ZH9N01PY6QW3CN1AKX
variant_01KGFN921021HFQZJ27X8DSBY3	optval_01KGFN91ZHH2GN9GQEWEB3WFD0
variant_01KGFN9211QXTWPTTM3H355XY4	optval_01KGFN91ZH9N01PY6QW3CN1AKX
variant_01KGFN9211QXTWPTTM3H355XY4	optval_01KGFN91ZHG0CFQSFB5REV3CH9
variant_01KGFN921185THYNJ4P0BC5ASS	optval_01KGFN91ZHBM1MYAGH2MZC8H1X
variant_01KGFN921185THYNJ4P0BC5ASS	optval_01KGFN91ZHH2GN9GQEWEB3WFD0
variant_01KGFN9211ZVWQMRWFRWFMZ0HM	optval_01KGFN91ZHBM1MYAGH2MZC8H1X
variant_01KGFN9211ZVWQMRWFRWFMZ0HM	optval_01KGFN91ZHG0CFQSFB5REV3CH9
variant_01KGFN9211Q6CTHYZKPR35S5RW	optval_01KGFN91ZHBZ37FZ1EK8WF2NS7
variant_01KGFN9211Q6CTHYZKPR35S5RW	optval_01KGFN91ZHH2GN9GQEWEB3WFD0
variant_01KGFN92110VHQ7CVMVAGJ1Q2Q	optval_01KGFN91ZHBZ37FZ1EK8WF2NS7
variant_01KGFN92110VHQ7CVMVAGJ1Q2Q	optval_01KGFN91ZHG0CFQSFB5REV3CH9
variant_01KGFN9211TPKY3HQRHKQZJYJV	optval_01KGFN91ZJ35KZRTAXZJEHF6ZA
variant_01KGFN92124QTPWSBFM4Q8GZWD	optval_01KGFN91ZJH2P358JKJQSM8F7C
variant_01KGFN9212SYZDQ7BANQYJF7TA	optval_01KGFN91ZJ89ES474G5XB7JYNQ
variant_01KGFN92122VE70NA64FGHAS3J	optval_01KGFN91ZKRRNEGNN6Z55TKQ4E
variant_01KGFN9212D3M0JJFNZ3J11TZZ	optval_01KGFN91ZKN9QJMX0AJ91G367H
variant_01KGFN9212VP2BY8ZMS3KXJEN6	optval_01KGFN91ZK32B1T6GZAJWGK2Z1
variant_01KGFN9212ZTA4B7S976BPWHJZ	optval_01KGFN91ZKK2J54KWFCQMT8VFE
variant_01KGFN9212R7F7CW3XZZEBMBJF	optval_01KGFN91ZKE029828VZD811SM3
variant_01KGFN9212XB3HQS5QJ0KYDZ8M	optval_01KGFN91ZKPFD1TP7CSD8B4SHS
variant_01KGFN9212WNDJMHRQGSZPEH81	optval_01KGFN91ZMNR5TKAPGRDK37P2Q
variant_01KGFN92128NWTFZ7222M7MZX0	optval_01KGFN91ZMSYSDQ3PXB2XMTTZN
variant_01KGFN9213WEPD30JXVTBSGKY9	optval_01KGFN91ZMMP5K08CQDEYPX1H1
variant_01KH6T34WC8VCSCJJEEF07X7RX	optval_01KH6T34TXJ92VDW9VT99V8AFQ
variant_01KH6T34WCXNBMY27TF6VA3FKT	optval_01KH6T34TXAB271C7KSFRAR1AS
\.


--
-- Data for Name: product_variant_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_price_set (variant_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
variant_01KGFN921089C79YEWD6JX5AEM	pset_01KGFN922MBPA4JK5R2HSJBG52	pvps_01KGFN923K74J81V6R4JQZKE7D	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9210V19J565JRS658MXZ	pset_01KGFN922M9RMQRQ6FHHH2PGGJ	pvps_01KGFN923MRX07SDFD5X3FNV9C	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN921021HFQZJ27X8DSBY3	pset_01KGFN922N3FCJX67M1AFF04RB	pvps_01KGFN923MJ3BNJZ5P5T30T0XN	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9211QXTWPTTM3H355XY4	pset_01KGFN922N1XCQSQMZDT4S996Z	pvps_01KGFN923M3KSJDSAAPX3NT1NG	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN921185THYNJ4P0BC5ASS	pset_01KGFN922NQC8TH1PWPQC507AR	pvps_01KGFN923MF1W35NN8JEW5V19A	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9211ZVWQMRWFRWFMZ0HM	pset_01KGFN922PB9F7YZW102ETP8NQ	pvps_01KGFN923MKJH9Y8RHA6W001P7	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9211Q6CTHYZKPR35S5RW	pset_01KGFN922PDWBCCJHH80E4FYZ0	pvps_01KGFN923MYAJAQDEKSEFY3HTX	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN92110VHQ7CVMVAGJ1Q2Q	pset_01KGFN922P37HSP8E6G1Q48B3G	pvps_01KGFN923MB105N1V3S95RWQE9	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9211TPKY3HQRHKQZJYJV	pset_01KGFN922QTQFCQKBR4YSJKQW4	pvps_01KGFN923MJ2BB2R8TTE1GSX3H	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN92124QTPWSBFM4Q8GZWD	pset_01KGFN922Q4R6WC7XGGYB9N1FG	pvps_01KGFN923MR3NKG5S8DVTEFEJE	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212SYZDQ7BANQYJF7TA	pset_01KGFN922QYDZDYDJMPRT8BNF3	pvps_01KGFN923MGDCCZZ9FM11K1JB8	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN92122VE70NA64FGHAS3J	pset_01KGFN922Q50APFBTW60MGS757	pvps_01KGFN923M0MK9H2KAGMEZDBCB	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212D3M0JJFNZ3J11TZZ	pset_01KGFN922R8X2CWS8P9MPE6QZQ	pvps_01KGFN923M0SEPMHEDSDN0D9WJ	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212VP2BY8ZMS3KXJEN6	pset_01KGFN922R3PF89PNFWD61KCQM	pvps_01KGFN923MYYBSQJE7Y55Q8YGP	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212ZTA4B7S976BPWHJZ	pset_01KGFN922R90V036R7GZRMWSCF	pvps_01KGFN923NSM9KSQNG3P2NDAGV	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212R7F7CW3XZZEBMBJF	pset_01KGFN922R1RNSYXXM2M1VVFPT	pvps_01KGFN923NHQW3QB32QF2PHHXZ	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212XB3HQS5QJ0KYDZ8M	pset_01KGFN922SGN60RS6Z075NB845	pvps_01KGFN923NJHAQTC4R5RDEVMZ7	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9212WNDJMHRQGSZPEH81	pset_01KGFN922SM938WEZ8DYQYW0CZ	pvps_01KGFN923N3K80JNYQDV8VJRHM	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN92128NWTFZ7222M7MZX0	pset_01KGFN922SBWKW06VXBNBADGWQ	pvps_01KGFN923NJA22ZZEEVBVPPYMR	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KGFN9213WEPD30JXVTBSGKY9	pset_01KGFN922SDCE77S5Y455XXA9H	pvps_01KGFN923N3MGZAD0J0F93XYSJ	2026-02-03 01:09:19.603431+08	2026-02-03 01:09:19.603431+08	\N
variant_01KH6T34WC8VCSCJJEEF07X7RX	pset_01KH6T34XBYJ9XF1Y97WWX6X4D	pvps_01KH6T34Y6C9DH8WMWRMBKV8K9	2026-02-12 00:56:00.709863+08	2026-02-12 00:56:00.709863+08	\N
variant_01KH6T34WCXNBMY27TF6VA3FKT	pset_01KH6T34XC6DEMF09C04MY205Y	pvps_01KH6T34Y64MYH17EX436M27TY	2026-02-12 00:56:00.709863+08	2026-02-12 00:56:00.709863+08	\N
\.


--
-- Data for Name: product_variant_product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_product_image (id, variant_id, image_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion (id, code, campaign_id, is_automatic, type, created_at, updated_at, deleted_at, status, is_tax_inclusive, "limit", used, metadata) FROM stdin;
\.


--
-- Data for Name: promotion_application_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_application_method (id, value, raw_value, max_quantity, apply_to_quantity, buy_rules_min_quantity, type, target_type, allocation, promotion_id, created_at, updated_at, deleted_at, currency_code) FROM stdin;
\.


--
-- Data for Name: promotion_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign (id, name, description, campaign_identifier, starts_at, ends_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget (id, type, campaign_id, "limit", raw_limit, used, raw_used, created_at, updated_at, deleted_at, currency_code, attribute) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget_usage (id, attribute_value, used, budget_id, raw_used, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_promotion_rule (promotion_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule (id, description, attribute, operator, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_rule_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule_value (id, promotion_rule_id, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: provider_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_identity (id, entity_id, provider, auth_identity_id, user_metadata, provider_metadata, created_at, updated_at, deleted_at) FROM stdin;
01KGFMC7ACPKPKZZFQDY597DZJ	admin@medusa.com	emailpass	authid_01KGFMC7ADXX8K4R662GTBJ6D4	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAUooelbeb9CDwV6HsLin7wrUp+v1wHu4AjItwAV0U4s6D5PouFY1e0ZkKYO0Yi2Oy8QQNOkdMvi0U7gZhiPzNFMTJ1auXP08s4NsB/wyvbOY"}	2026-02-03 00:53:34.669+08	2026-02-03 00:53:34.669+08	\N
01KGFPNC047NT953525C7MAEW2	admin@example.com	emailpass	authid_01KGFPNC04E9RV44MCKCSE261T	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAVDkC5u1dnauqxuY2u+LjjGx6UYDSmp9HK7N7lrBvbC7F1/Qhz/12ia3vnH+oMOnvAxSBpHiKvB+LO+NJ05Jwikg/zr22XBCL9uGeVBwuWzO"}	2026-02-03 01:33:31.525+08	2026-02-03 01:33:31.525+08	\N
01KGFPQTMZEXWB674CD2VG7QG1	admin2@example.com	emailpass	authid_01KGFPQTN07TD1BH7AGPBCG7WF	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAZkXw4v2Xvnx3rjeifHwOH0JI0nI492sGycBEojHqGUMuZxxhWbZzFa0sX38FiW1KQPJu0xJKyGrl6Xr7qXIV7+5NwkQWo4/0fHFnWAg3VGa"}	2026-02-03 01:34:52.064+08	2026-02-03 01:34:52.064+08	\N
01KH356FXJZQME1B67H4A9GTSS	942233@qq.com	emailpass	authid_01KH356FXJS90E4Q0SS9A9DPAC	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAUxYJh23f3KosXPF1YZhpby+c4UIHKLdXv4UtU7RDvNkWT01KsG0gqMawIgWHNji/jS6IGFF0xoauSKYfuDjFtkVIJTLjTODWARd9hNCkFgp"}	2026-02-10 14:53:06.866+08	2026-02-10 14:53:06.866+08	\N
01KH6T90H338BMV2YEB7YY6F73	942233@gmail.com	emailpass	authid_01KH6T90H3MNSWZK4EDY3YRQS7	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAVU5pBcwhTkyJOm1qeQ2TfkAhmyXsBTHnM3126pxmhGQcjS0OrDSxaFa+4TiDGKbOMMcCA7bndXYiGcj0lF+OHaCoHNr/zjhLlBDu1XVHhsd"}	2026-02-12 00:59:12.803+08	2026-02-12 00:59:12.803+08	\N
\.


--
-- Data for Name: publishable_api_key_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
apk_01KGFMBC71GJ369MRZA31WW4CP	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	pksc_01KGFN91YV850A8MR8Q8JT6FBM	2026-02-03 00:53:06.928605+08	2026-02-03 00:53:06.928605+08	\N
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata, refund_reason_id, note) FROM stdin;
\.


--
-- Data for Name: refund_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_reason (id, label, description, metadata, created_at, updated_at, deleted_at, code) FROM stdin;
refr_01KGFMAKM3V8KQNM0450AJCDN5	Shipping Issue	Refund due to lost, delayed, or misdelivered shipment	\N	2026-02-03 00:52:41.678235+08	2026-02-03 00:52:41.678235+08	\N	shipping_issue
refr_01KGFMAKM39R4Z2NSYARKYP06Y	Customer Care Adjustment	Refund given as goodwill or compensation for inconvenience	\N	2026-02-03 00:52:41.678235+08	2026-02-03 00:52:41.678235+08	\N	customer_care_adjustment
refr_01KGFMAKM3DFZMGXQD7911ZC8F	Pricing Error	Refund to correct an overcharge, missing discount, or incorrect price	\N	2026-02-03 00:52:41.678235+08	2026-02-03 00:52:41.678235+08	\N	pricing_error
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region (id, name, currency_code, metadata, created_at, updated_at, deleted_at, automatic_taxes) FROM stdin;
reg_010052034966	United States	usd	\N	2026-02-03 01:07:14.993387+08	2026-02-03 01:07:14.993387+08	\N	t
reg_01KGFN91SYCH4FDKMHVB99Y9EJ	Europe	eur	\N	2026-02-03 01:09:19.299+08	2026-02-03 01:09:19.299+08	\N	t
reg_01KHFSHJA62BJT71Z3H2CNG2Y2	河南	cny	\N	2026-02-15 12:39:34.475+08	2026-02-15 12:39:34.475+08	\N	f
\.


--
-- Data for Name: region_country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_country (iso_2, iso_3, num_code, name, display_name, region_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
af	afg	004	AFGHANISTAN	Afghanistan	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
al	alb	008	ALBANIA	Albania	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
dz	dza	012	ALGERIA	Algeria	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
as	asm	016	AMERICAN SAMOA	American Samoa	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
ad	and	020	ANDORRA	Andorra	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
ao	ago	024	ANGOLA	Angola	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
ai	aia	660	ANGUILLA	Anguilla	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
aq	ata	010	ANTARCTICA	Antarctica	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
ag	atg	028	ANTIGUA AND BARBUDA	Antigua and Barbuda	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
ar	arg	032	ARGENTINA	Argentina	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
am	arm	051	ARMENIA	Armenia	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
aw	abw	533	ARUBA	Aruba	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
au	aus	036	AUSTRALIA	Australia	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
at	aut	040	AUSTRIA	Austria	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
az	aze	031	AZERBAIJAN	Azerbaijan	\N	\N	2026-02-03 00:52:48.45+08	2026-02-03 00:52:48.45+08	\N
bs	bhs	044	BAHAMAS	Bahamas	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bh	bhr	048	BAHRAIN	Bahrain	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bd	bgd	050	BANGLADESH	Bangladesh	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bb	brb	052	BARBADOS	Barbados	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
by	blr	112	BELARUS	Belarus	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
be	bel	056	BELGIUM	Belgium	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bz	blz	084	BELIZE	Belize	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bj	ben	204	BENIN	Benin	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bm	bmu	060	BERMUDA	Bermuda	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bt	btn	064	BHUTAN	Bhutan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bo	bol	068	BOLIVIA	Bolivia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bq	bes	535	BONAIRE, SINT EUSTATIUS AND SABA	Bonaire, Sint Eustatius and Saba	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ba	bih	070	BOSNIA AND HERZEGOVINA	Bosnia and Herzegovina	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bw	bwa	072	BOTSWANA	Botswana	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bv	bvd	074	BOUVET ISLAND	Bouvet Island	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
br	bra	076	BRAZIL	Brazil	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
io	iot	086	BRITISH INDIAN OCEAN TERRITORY	British Indian Ocean Territory	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bn	brn	096	BRUNEI DARUSSALAM	Brunei Darussalam	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bg	bgr	100	BULGARIA	Bulgaria	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bf	bfa	854	BURKINA FASO	Burkina Faso	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bi	bdi	108	BURUNDI	Burundi	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kh	khm	116	CAMBODIA	Cambodia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cm	cmr	120	CAMEROON	Cameroon	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ca	can	124	CANADA	Canada	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cv	cpv	132	CAPE VERDE	Cape Verde	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ky	cym	136	CAYMAN ISLANDS	Cayman Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cf	caf	140	CENTRAL AFRICAN REPUBLIC	Central African Republic	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
td	tcd	148	CHAD	Chad	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cl	chl	152	CHILE	Chile	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cx	cxr	162	CHRISTMAS ISLAND	Christmas Island	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cc	cck	166	COCOS (KEELING) ISLANDS	Cocos (Keeling) Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
co	col	170	COLOMBIA	Colombia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
km	com	174	COMOROS	Comoros	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cg	cog	178	CONGO	Congo	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cd	cod	180	CONGO, THE DEMOCRATIC REPUBLIC OF THE	Congo, the Democratic Republic of the	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ck	cok	184	COOK ISLANDS	Cook Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cr	cri	188	COSTA RICA	Costa Rica	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ci	civ	384	COTE D'IVOIRE	Cote D'Ivoire	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
hr	hrv	191	CROATIA	Croatia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cu	cub	192	CUBA	Cuba	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cw	cuw	531	CURAÇAO	Curaçao	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cy	cyp	196	CYPRUS	Cyprus	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
cz	cze	203	CZECH REPUBLIC	Czech Republic	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
dj	dji	262	DJIBOUTI	Djibouti	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
dm	dma	212	DOMINICA	Dominica	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
do	dom	214	DOMINICAN REPUBLIC	Dominican Republic	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ec	ecu	218	ECUADOR	Ecuador	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
eg	egy	818	EGYPT	Egypt	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
sv	slv	222	EL SALVADOR	El Salvador	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gq	gnq	226	EQUATORIAL GUINEA	Equatorial Guinea	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
er	eri	232	ERITREA	Eritrea	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ee	est	233	ESTONIA	Estonia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
et	eth	231	ETHIOPIA	Ethiopia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
fk	flk	238	FALKLAND ISLANDS (MALVINAS)	Falkland Islands (Malvinas)	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
fo	fro	234	FAROE ISLANDS	Faroe Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
fj	fji	242	FIJI	Fiji	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
fi	fin	246	FINLAND	Finland	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gf	guf	254	FRENCH GUIANA	French Guiana	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pf	pyf	258	FRENCH POLYNESIA	French Polynesia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
tf	atf	260	FRENCH SOUTHERN TERRITORIES	French Southern Territories	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ga	gab	266	GABON	Gabon	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gm	gmb	270	GAMBIA	Gambia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ge	geo	268	GEORGIA	Georgia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gh	gha	288	GHANA	Ghana	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gi	gib	292	GIBRALTAR	Gibraltar	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gr	grc	300	GREECE	Greece	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gl	grl	304	GREENLAND	Greenland	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gd	grd	308	GRENADA	Grenada	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gp	glp	312	GUADELOUPE	Guadeloupe	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gu	gum	316	GUAM	Guam	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gt	gtm	320	GUATEMALA	Guatemala	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gg	ggy	831	GUERNSEY	Guernsey	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gn	gin	324	GUINEA	Guinea	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gw	gnb	624	GUINEA-BISSAU	Guinea-Bissau	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
gy	guy	328	GUYANA	Guyana	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ht	hti	332	HAITI	Haiti	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
hm	hmd	334	HEARD ISLAND AND MCDONALD ISLANDS	Heard Island And Mcdonald Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
va	vat	336	HOLY SEE (VATICAN CITY STATE)	Holy See (Vatican City State)	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
hn	hnd	340	HONDURAS	Honduras	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
hk	hkg	344	HONG KONG	Hong Kong	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
hu	hun	348	HUNGARY	Hungary	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
is	isl	352	ICELAND	Iceland	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
in	ind	356	INDIA	India	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
id	idn	360	INDONESIA	Indonesia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ir	irn	364	IRAN, ISLAMIC REPUBLIC OF	Iran, Islamic Republic of	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
iq	irq	368	IRAQ	Iraq	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ie	irl	372	IRELAND	Ireland	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
im	imn	833	ISLE OF MAN	Isle Of Man	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
il	isr	376	ISRAEL	Israel	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
jm	jam	388	JAMAICA	Jamaica	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
jp	jpn	392	JAPAN	Japan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
je	jey	832	JERSEY	Jersey	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
jo	jor	400	JORDAN	Jordan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kz	kaz	398	KAZAKHSTAN	Kazakhstan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ke	ken	404	KENYA	Kenya	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ki	kir	296	KIRIBATI	Kiribati	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kp	prk	408	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF	Korea, Democratic People's Republic of	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kr	kor	410	KOREA, REPUBLIC OF	Korea, Republic of	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
xk	xkx	900	KOSOVO	Kosovo	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kw	kwt	414	KUWAIT	Kuwait	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kg	kgz	417	KYRGYZSTAN	Kyrgyzstan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
la	lao	418	LAO PEOPLE'S DEMOCRATIC REPUBLIC	Lao People's Democratic Republic	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lv	lva	428	LATVIA	Latvia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lb	lbn	422	LEBANON	Lebanon	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ls	lso	426	LESOTHO	Lesotho	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lr	lbr	430	LIBERIA	Liberia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ly	lby	434	LIBYA	Libya	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
li	lie	438	LIECHTENSTEIN	Liechtenstein	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lt	ltu	440	LITHUANIA	Lithuania	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lu	lux	442	LUXEMBOURG	Luxembourg	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mo	mac	446	MACAO	Macao	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mg	mdg	450	MADAGASCAR	Madagascar	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mw	mwi	454	MALAWI	Malawi	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
my	mys	458	MALAYSIA	Malaysia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mv	mdv	462	MALDIVES	Maldives	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ml	mli	466	MALI	Mali	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mt	mlt	470	MALTA	Malta	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mh	mhl	584	MARSHALL ISLANDS	Marshall Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mq	mtq	474	MARTINIQUE	Martinique	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mr	mrt	478	MAURITANIA	Mauritania	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mu	mus	480	MAURITIUS	Mauritius	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
yt	myt	175	MAYOTTE	Mayotte	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mx	mex	484	MEXICO	Mexico	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
fm	fsm	583	MICRONESIA, FEDERATED STATES OF	Micronesia, Federated States of	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
md	mda	498	MOLDOVA, REPUBLIC OF	Moldova, Republic of	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mc	mco	492	MONACO	Monaco	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mn	mng	496	MONGOLIA	Mongolia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
me	mne	499	MONTENEGRO	Montenegro	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ms	msr	500	MONTSERRAT	Montserrat	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ma	mar	504	MOROCCO	Morocco	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mz	moz	508	MOZAMBIQUE	Mozambique	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mm	mmr	104	MYANMAR	Myanmar	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
na	nam	516	NAMIBIA	Namibia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nr	nru	520	NAURU	Nauru	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
np	npl	524	NEPAL	Nepal	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nl	nld	528	NETHERLANDS	Netherlands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nc	ncl	540	NEW CALEDONIA	New Caledonia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nz	nzl	554	NEW ZEALAND	New Zealand	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ni	nic	558	NICARAGUA	Nicaragua	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ne	ner	562	NIGER	Niger	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ng	nga	566	NIGERIA	Nigeria	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nu	niu	570	NIUE	Niue	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
nf	nfk	574	NORFOLK ISLAND	Norfolk Island	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mk	mkd	807	NORTH MACEDONIA	North Macedonia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mp	mnp	580	NORTHERN MARIANA ISLANDS	Northern Mariana Islands	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
no	nor	578	NORWAY	Norway	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
om	omn	512	OMAN	Oman	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pk	pak	586	PAKISTAN	Pakistan	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pw	plw	585	PALAU	Palau	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ps	pse	275	PALESTINIAN TERRITORY, OCCUPIED	Palestinian Territory, Occupied	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pa	pan	591	PANAMA	Panama	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pg	png	598	PAPUA NEW GUINEA	Papua New Guinea	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
py	pry	600	PARAGUAY	Paraguay	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pe	per	604	PERU	Peru	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ph	phl	608	PHILIPPINES	Philippines	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pn	pcn	612	PITCAIRN	Pitcairn	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pl	pol	616	POLAND	Poland	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pt	prt	620	PORTUGAL	Portugal	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pr	pri	630	PUERTO RICO	Puerto Rico	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
qa	qat	634	QATAR	Qatar	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
re	reu	638	REUNION	Reunion	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ro	rom	642	ROMANIA	Romania	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
ru	rus	643	RUSSIAN FEDERATION	Russian Federation	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
rw	rwa	646	RWANDA	Rwanda	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
bl	blm	652	SAINT BARTHÉLEMY	Saint Barthélemy	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
sh	shn	654	SAINT HELENA	Saint Helena	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
kn	kna	659	SAINT KITTS AND NEVIS	Saint Kitts and Nevis	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
lc	lca	662	SAINT LUCIA	Saint Lucia	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
mf	maf	663	SAINT MARTIN (FRENCH PART)	Saint Martin (French part)	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
pm	spm	666	SAINT PIERRE AND MIQUELON	Saint Pierre and Miquelon	\N	\N	2026-02-03 00:52:48.451+08	2026-02-03 00:52:48.451+08	\N
vc	vct	670	SAINT VINCENT AND THE GRENADINES	Saint Vincent and the Grenadines	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ws	wsm	882	SAMOA	Samoa	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sm	smr	674	SAN MARINO	San Marino	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
st	stp	678	SAO TOME AND PRINCIPE	Sao Tome and Principe	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sa	sau	682	SAUDI ARABIA	Saudi Arabia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sn	sen	686	SENEGAL	Senegal	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
rs	srb	688	SERBIA	Serbia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sc	syc	690	SEYCHELLES	Seychelles	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sl	sle	694	SIERRA LEONE	Sierra Leone	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sg	sgp	702	SINGAPORE	Singapore	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sx	sxm	534	SINT MAARTEN	Sint Maarten	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sk	svk	703	SLOVAKIA	Slovakia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
si	svn	705	SLOVENIA	Slovenia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sb	slb	090	SOLOMON ISLANDS	Solomon Islands	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
so	som	706	SOMALIA	Somalia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
za	zaf	710	SOUTH AFRICA	South Africa	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
gs	sgs	239	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS	South Georgia and the South Sandwich Islands	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ss	ssd	728	SOUTH SUDAN	South Sudan	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
lk	lka	144	SRI LANKA	Sri Lanka	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sd	sdn	729	SUDAN	Sudan	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sr	sur	740	SURINAME	Suriname	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sj	sjm	744	SVALBARD AND JAN MAYEN	Svalbard and Jan Mayen	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sz	swz	748	SWAZILAND	Swaziland	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ch	che	756	SWITZERLAND	Switzerland	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
sy	syr	760	SYRIAN ARAB REPUBLIC	Syrian Arab Republic	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tw	twn	158	TAIWAN, PROVINCE OF CHINA	Taiwan, Province of China	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tj	tjk	762	TAJIKISTAN	Tajikistan	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tz	tza	834	TANZANIA, UNITED REPUBLIC OF	Tanzania, United Republic of	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
th	tha	764	THAILAND	Thailand	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tl	tls	626	TIMOR LESTE	Timor Leste	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tg	tgo	768	TOGO	Togo	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tk	tkl	772	TOKELAU	Tokelau	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
to	ton	776	TONGA	Tonga	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tt	tto	780	TRINIDAD AND TOBAGO	Trinidad and Tobago	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tn	tun	788	TUNISIA	Tunisia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tr	tur	792	TURKEY	Turkey	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tm	tkm	795	TURKMENISTAN	Turkmenistan	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tc	tca	796	TURKS AND CAICOS ISLANDS	Turks and Caicos Islands	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
tv	tuv	798	TUVALU	Tuvalu	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ug	uga	800	UGANDA	Uganda	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ua	ukr	804	UKRAINE	Ukraine	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ae	are	784	UNITED ARAB EMIRATES	United Arab Emirates	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
us	usa	840	UNITED STATES	United States	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
um	umi	581	UNITED STATES MINOR OUTLYING ISLANDS	United States Minor Outlying Islands	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
uy	ury	858	URUGUAY	Uruguay	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
uz	uzb	860	UZBEKISTAN	Uzbekistan	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
vu	vut	548	VANUATU	Vanuatu	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ve	ven	862	VENEZUELA	Venezuela	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
vn	vnm	704	VIET NAM	Viet Nam	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
vg	vgb	092	VIRGIN ISLANDS, BRITISH	Virgin Islands, British	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
vi	vir	850	VIRGIN ISLANDS, U.S.	Virgin Islands, U.S.	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
wf	wlf	876	WALLIS AND FUTUNA	Wallis and Futuna	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
eh	esh	732	WESTERN SAHARA	Western Sahara	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ye	yem	887	YEMEN	Yemen	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
zm	zmb	894	ZAMBIA	Zambia	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
zw	zwe	716	ZIMBABWE	Zimbabwe	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
ax	ala	248	ÅLAND ISLANDS	Åland Islands	\N	\N	2026-02-03 00:52:48.452+08	2026-02-03 00:52:48.452+08	\N
dk	dnk	208	DENMARK	Denmark	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.451+08	2026-02-03 01:09:19.3+08	\N
fr	fra	250	FRANCE	France	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.451+08	2026-02-03 01:09:19.3+08	\N
de	deu	276	GERMANY	Germany	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.451+08	2026-02-03 01:09:19.3+08	\N
it	ita	380	ITALY	Italy	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.451+08	2026-02-03 01:09:19.3+08	\N
es	esp	724	SPAIN	Spain	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.452+08	2026-02-03 01:09:19.3+08	\N
se	swe	752	SWEDEN	Sweden	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.452+08	2026-02-03 01:09:19.3+08	\N
gb	gbr	826	UNITED KINGDOM	United Kingdom	reg_01KGFN91SYCH4FDKMHVB99Y9EJ	\N	2026-02-03 00:52:48.452+08	2026-02-03 01:09:19.3+08	\N
cn	chn	156	CHINA	China	reg_01KHFSHJA62BJT71Z3H2CNG2Y2	\N	2026-02-03 00:52:48.451+08	2026-02-15 12:39:34.476+08	\N
\.


--
-- Data for Name: region_payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_payment_provider (region_id, payment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
reg_01KGFN91SYCH4FDKMHVB99Y9EJ	pp_system_default	regpp_01KGFN91TPKHMMNJYXPQBWH7QW	2026-02-03 01:09:19.31716+08	2026-02-03 01:09:19.31716+08	\N
reg_01KHFSHJA62BJT71Z3H2CNG2Y2	pp_system_default	regpp_01KHFSHJB0Y7RAZVGDZ893TZVS	2026-02-15 12:39:34.495182+08	2026-02-15 12:39:34.495182+08	\N
\.


--
-- Data for Name: reservation_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_item (id, created_at, updated_at, deleted_at, line_item_id, location_id, quantity, external_id, description, created_by, metadata, inventory_item_id, allow_backorder, raw_quantity) FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, order_id, claim_id, exchange_id, order_version, display_id, status, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, received_at, canceled_at, location_id, requested_at, created_by) FROM stdin;
\.


--
-- Data for Name: return_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_fulfillment (return_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_item (id, return_id, reason_id, item_id, quantity, raw_quantity, received_quantity, raw_received_quantity, note, metadata, created_at, updated_at, deleted_at, damaged_quantity, raw_damaged_quantity) FROM stdin;
\.


--
-- Data for Name: return_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_reason (id, value, label, description, metadata, parent_return_reason_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel (id, name, description, is_disabled, metadata, created_at, updated_at, deleted_at) FROM stdin;
sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	Default Sales Channel	Created by Medusa	f	\N	2026-02-03 00:53:06.873+08	2026-02-03 00:53:06.873+08	\N
\.


--
-- Data for Name: sales_channel_stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel_stock_location (sales_channel_id, stock_location_id, id, created_at, updated_at, deleted_at) FROM stdin;
sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	scloc_01KGFN91YHGXAANCARTQG5ZZYS	2026-02-03 01:09:19.441413+08	2026-02-03 01:09:19.441413+08	\N
\.


--
-- Data for Name: script_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.script_migrations (id, script_name, created_at, finished_at) FROM stdin;
1	migrate-product-shipping-profile.js	2026-02-03 00:52:49.128047+08	2026-02-03 00:52:49.15079+08
2	migrate-tax-region-provider.js	2026-02-03 00:52:49.153155+08	2026-02-03 00:52:49.159286+08
\.


--
-- Data for Name: service_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_zone (id, name, metadata, fulfillment_set_id, created_at, updated_at, deleted_at) FROM stdin;
serzo_01KGFN91W3KB89HPJ2KE670R0T	Europe	\N	fuset_01KGFN91W36RS5ZRTZ4H6N4B8Q	2026-02-03 01:09:19.363+08	2026-02-03 01:09:19.363+08	\N
\.


--
-- Data for Name: shipping_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, data, metadata, shipping_option_type_id, created_at, updated_at, deleted_at) FROM stdin;
so_01KGFN91X817XQV3V1XQ811AF8	Standard Shipping	flat	serzo_01KGFN91W3KB89HPJ2KE670R0T	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	manual_manual	\N	\N	sotype_01KGFN91X7D8JTQJMX31DW2X8J	2026-02-03 01:09:19.4+08	2026-02-03 01:09:19.4+08	\N
so_01KGFN91X8ESQFSSYWZGQ06BK1	Express Shipping	flat	serzo_01KGFN91W3KB89HPJ2KE670R0T	sp_01KGFMATVSEFQ7GS2D7E1XAT8F	manual_manual	\N	\N	sotype_01KGFN91X88XD183PTYYBWQ4KG	2026-02-03 01:09:19.4+08	2026-02-03 01:09:19.4+08	\N
\.


--
-- Data for Name: shipping_option_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_price_set (shipping_option_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
so_01KGFN91X817XQV3V1XQ811AF8	pset_01KGFN91XN1P3GSVJ11133E647	sops_01KGFN91YAHKJEBP4VXEDB9MZP	2026-02-03 01:09:19.434685+08	2026-02-03 01:09:19.434685+08	\N
so_01KGFN91X8ESQFSSYWZGQ06BK1	pset_01KGFN91XPNZTX093K3KVHWWM7	sops_01KGFN91YB1C35HZ8JQ5TGB2RB	2026-02-03 01:09:19.434685+08	2026-02-03 01:09:19.434685+08	\N
\.


--
-- Data for Name: shipping_option_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_rule (id, attribute, operator, value, shipping_option_id, created_at, updated_at, deleted_at) FROM stdin;
sorul_01KGFN91X7JFV66BFJ0QG37T9B	enabled_in_store	eq	"true"	so_01KGFN91X817XQV3V1XQ811AF8	2026-02-03 01:09:19.4+08	2026-02-03 01:09:19.4+08	\N
sorul_01KGFN91X79DMSTAE3VEX87NF6	is_return	eq	"false"	so_01KGFN91X817XQV3V1XQ811AF8	2026-02-03 01:09:19.401+08	2026-02-03 01:09:19.401+08	\N
sorul_01KGFN91X8SEG1ZHHDFD5H8GTB	enabled_in_store	eq	"true"	so_01KGFN91X8ESQFSSYWZGQ06BK1	2026-02-03 01:09:19.401+08	2026-02-03 01:09:19.401+08	\N
sorul_01KGFN91X8AGAX2X65PM6KT5P0	is_return	eq	"false"	so_01KGFN91X8ESQFSSYWZGQ06BK1	2026-02-03 01:09:19.401+08	2026-02-03 01:09:19.401+08	\N
\.


--
-- Data for Name: shipping_option_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_type (id, label, description, code, created_at, updated_at, deleted_at) FROM stdin;
sotype_01KGFN91X7D8JTQJMX31DW2X8J	Standard	Ship in 2-3 days.	standard	2026-02-03 01:09:19.4+08	2026-02-03 01:09:19.4+08	\N
sotype_01KGFN91X88XD183PTYYBWQ4KG	Express	Ship in 24 hours.	express	2026-02-03 01:09:19.4+08	2026-02-03 01:09:19.4+08	\N
\.


--
-- Data for Name: shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_profile (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
sp_01KGFMATVSEFQ7GS2D7E1XAT8F	Default Shipping Profile	default	\N	2026-02-03 00:52:49.145+08	2026-02-03 00:52:49.145+08	\N
\.


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location (id, created_at, updated_at, deleted_at, name, address_id, metadata) FROM stdin;
sloc_01KGFN91VBQVE4SVCYR4BEKGVG	2026-02-03 01:09:19.339+08	2026-02-03 01:09:19.339+08	\N	European Warehouse	laddr_01KGFN91VB6248J9JZZ4HJD433	\N
\.


--
-- Data for Name: stock_location_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location_address (id, created_at, updated_at, deleted_at, address_1, address_2, company, city, country_code, phone, province, postal_code, metadata) FROM stdin;
laddr_01KGFN91VB6248J9JZZ4HJD433	2026-02-03 01:09:19.339+08	2026-02-03 01:09:19.339+08	\N		\N	\N	Copenhagen	DK	\N	\N	\N	\N
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, name, default_sales_channel_id, default_region_id, default_location_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
store_01KGFMBC68HJFEBWW73PV74T3J	亿光年	sc_01KGFMBC5RC8C776ZDQ2QXN2ZB	\N	sloc_01KGFN91VBQVE4SVCYR4BEKGVG	\N	2026-02-03 00:53:06.886383+08	2026-02-03 00:53:06.886383+08	\N
\.


--
-- Data for Name: store_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_currency (id, currency_code, is_default, store_id, created_at, updated_at, deleted_at) FROM stdin;
stocur_01KHFSDBT2V3WZHRRWF4EAVR5T	cny	t	store_01KGFMBC68HJFEBWW73PV74T3J	2026-02-15 12:37:16.736175+08	2026-02-15 12:37:16.736175+08	\N
stocur_01KHFSDBT2YE7Z46SYMAH3YVF4	eur	f	store_01KGFMBC68HJFEBWW73PV74T3J	2026-02-15 12:37:16.736175+08	2026-02-15 12:37:16.736175+08	\N
stocur_01KHFSDBT24TSF4GHD4NRNVVZV	usd	f	store_01KGFMBC68HJFEBWW73PV74T3J	2026-02-15 12:37:16.736175+08	2026-02-15 12:37:16.736175+08	\N
\.


--
-- Data for Name: store_locale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_locale (id, locale_code, store_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
tp_system	t	2026-02-03 00:52:48.441+08	2026-02-03 00:52:48.441+08	\N
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate (id, rate, code, name, is_default, is_combinable, tax_region_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_rate_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate_rule (id, tax_rate_id, reference_id, reference, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_region (id, provider_id, country_code, province_code, parent_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
txreg_01KGFN91V08JCY26WJDTAQ7BD3	tp_system	gb	\N	\N	\N	2026-02-03 01:09:19.328+08	2026-02-03 01:09:19.328+08	\N	\N
txreg_01KGFN91V03SCQCMJJPGXKWGE4	tp_system	de	\N	\N	\N	2026-02-03 01:09:19.328+08	2026-02-03 01:09:19.328+08	\N	\N
txreg_01KGFN91V0MKZQSSTXXHGSZK0J	tp_system	dk	\N	\N	\N	2026-02-03 01:09:19.328+08	2026-02-03 01:09:19.328+08	\N	\N
txreg_01KGFN91V0P3Y45MT88342MM2G	tp_system	se	\N	\N	\N	2026-02-03 01:09:19.328+08	2026-02-03 01:09:19.328+08	\N	\N
txreg_01KGFN91V0XAS609VSH9C27WHE	tp_system	fr	\N	\N	\N	2026-02-03 01:09:19.329+08	2026-02-03 01:09:19.329+08	\N	\N
txreg_01KGFN91V0QSQWNVMGP8DTRBVF	tp_system	es	\N	\N	\N	2026-02-03 01:09:19.329+08	2026-02-03 01:09:19.329+08	\N	\N
txreg_01KGFN91V0RW8V74A7GR2P1S4E	tp_system	it	\N	\N	\N	2026-02-03 01:09:19.329+08	2026-02-03 01:09:19.329+08	\N	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, first_name, last_name, email, avatar_url, metadata, created_at, updated_at, deleted_at) FROM stdin;
user_01KGFPNBXFXD85G7J29MWHVJSK	\N	\N	admin@example.com	\N	\N	2026-02-03 01:33:31.439+08	2026-02-03 01:33:31.439+08	\N
user_01KGFPQTJ4Z7WSFQ6P6ZJ2HEPW	\N	\N	admin2@example.com	\N	\N	2026-02-03 01:34:51.972+08	2026-02-03 01:34:51.972+08	\N
user_01KGFMC77P8DBV995V91AFXEGF			admin@medusa.com	\N	\N	2026-02-03 00:53:34.583+08	2026-02-15 12:41:13.964+08	\N
\.


--
-- Data for Name: user_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preference (id, user_id, key, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_rbac_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rbac_role (user_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_video (id, user_id, order_id, product_id, video_url, thumbnail_url, title, duration, status, materials_used, error_message, created_at, updated_at, deleted_at) FROM stdin;
01KHE84QRVNNGCVB3YCCR0NZS3	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	\N	\N	火锅	0	pending	{"1": {"type": "image", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fshipin1-01KHE7FJ4ZGA7AVFPT4DPJC3D3.png", "replaced_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fldh-01KHE84MA9GYD393JQ9PRCCK9M.png"}, "shipin": {"type": "video", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace1-01KHE7EFMH4BVE8QYVR9JEKBT8.mp4", "replaced_url": null}}	\N	2026-02-14 22:16:13.851+08	2026-02-14 22:16:13.851+08	\N
01KHEB4GS6T57169Z83KJ3HV2V	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	\N	\N	火锅	0	processing	{"1": {"type": "image", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fshipin1-01KHE7FJ4ZGA7AVFPT4DPJC3D3.png", "replaced_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace-pic2-01KHEB4DB81ZA0WVX3AB5WSWNQ.png"}, "shipin": {"type": "video", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace1-01KHE7EFMH4BVE8QYVR9JEKBT8.mp4", "replaced_url": null}}	\N	2026-02-14 23:08:32.423+08	2026-02-14 23:08:32.437+08	\N
01KHEC2TCQVH1GXWAPYFHM9SQC	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fvideo-01KHEC2TCQVH1GXWAPYFHM9SQC-1771082729390-01KHEC3JKB9H0WWAJFQGRP7AZH.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fshipin1-01KHE7FJ4ZGA7AVFPT4DPJC3D3.png", "replaced_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fldh-01KHEC2MFZKFHJ6WBEYXHH2EG7.png"}, "shipin": {"type": "video", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace1-01KHE7EFMH4BVE8QYVR9JEKBT8.mp4", "replaced_url": null}}	\N	2026-02-14 23:25:05.303+08	2026-02-14 23:25:30.684+08	\N
01KHEEE4R0TYN3RNBMS1CW4YPG	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	\N	\N	火锅	0	processing	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMakeSuperResolutionImage10-01KHEEE27SM6H8N5FYCF1WGYN2.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-15 00:06:13.504+08	2026-02-15 00:06:13.52+08	\N
01KHECTWHAET16H5PTKS7S662V	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fvideo-01KHECTWHAET16H5PTKS7S662V-1771083509595-01KHECVCNPWE1RKZEHQHW7KXZY.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fshipin1-01KHE7FJ4ZGA7AVFPT4DPJC3D3.png", "replaced_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMakeSuperResolutionImage10-01KHECTSJQT28FXEHA4VRV2GR8.png"}, "shipin": {"type": "video", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace1-01KHE7EFMH4BVE8QYVR9JEKBT8.mp4", "replaced_url": null}}	\N	2026-02-14 23:38:13.931+08	2026-02-14 23:38:31.037+08	\N
01KHEDMTQDWSMGFYFQGRSD8WJS	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fvideo-01KHEDMTQDWSMGFYFQGRSD8WJS-1771084397416-01KHEDPHVH8Q364FP54C8CSJEZ.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fldh-01KHEDMR4KJRY17E1QAJ712EB2.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-14 23:52:24.045+08	2026-02-14 23:53:23.711+08	\N
01KHED6RQADJY28XYV3G0M5D9B	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	\N	\N	火锅	0	failed	{"1": {"type": "image", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2Fshipin1-01KHE7FJ4ZGA7AVFPT4DPJC3D3.png", "replaced_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace-pic1-01KHED6NWTJ6CWXN23EQNV9ZW2.png"}, "shipin": {"type": "video", "original_url": "https://yiguang.oss-cn-beijing.aliyuncs.com/uploads%2FMergeVideoFace1-01KHE7EFMH4BVE8QYVR9JEKBT8.mp4", "replaced_url": null}}	Failed to create face video template: Job failed: 图片链接地域不对，请参考https://help.aliyun.com/document_detail/155645.html - videoUrl is invalid region oss url.	2026-02-14 23:44:43.242+08	2026-02-14 23:44:43.821+08	\N
01KHEDVQV37AP0YE0XXKKQP4RH	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fvideo-01KHEDVQV37AP0YE0XXKKQP4RH-1771084625168-01KHEDXGB5N05VRPZ7A7DARVH7.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace-pic2-01KHEDVMGVYDAGJ2R1PFS6MQ9F.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-14 23:56:10.467+08	2026-02-14 23:57:11.553+08	\N
01KHEDQT7NF0C3S2BWX5Z4CYE4	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fvideo-01KHEDQT7NF0C3S2BWX5Z4CYE4-1771084495014-01KHEDSH2DD1HCTE1E6PBKSD8Y.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace-pic1-01KHEDQR5KZ6CAFYVS8D8768ES.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-14 23:54:01.845+08	2026-02-14 23:55:01.188+08	\N
01KHEEFSDCST0APXW5TF3224ZJ	guest	\N	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fvideo-01KHEEFSDCST0APXW5TF3224ZJ-1771085276945-01KHEEHCSTT39P0YSB3Z9XGWJ2.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace-fm2-01KHEEFNT1BZZ2VX0QQS1QBJNE.jpg"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-15 00:07:07.436+08	2026-02-15 00:08:03.283+08	\N
01KHFZYWYTAV7ZP830WV6DBS3K	cus_01KH6T90HXRF84TP9FTJWVZ91G	order_01KHFZYWXWCQYS766S589MF05E	prod_01KH6T34TVVXGBD5AST7PZHGEQ	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fvideo-01KHFZYWYTAV7ZP830WV6DBS3K-1771137152586-01KHG00GGNC2WB8ZN24HY6HXZE.mp4	\N	火锅	0	completed	{"1": {"type": "image", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png", "replaced_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace-pic1-01KHFZYTKD2ZYCDXX75WCPHJFG.png"}, "shipin": {"type": "video", "original_url": "https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4", "replaced_url": null}}	\N	2026-02-15 14:31:42.81+08	2026-02-15 14:32:38.853+08	\N
\.


--
-- Data for Name: video_material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video_material (id, product_id, name, material_key, material_type, default_url, is_replaceable, sort_order, created_at, updated_at, deleted_at) FROM stdin;
01KHEDKBC9M73A7WX9ZBQJ56PZ	prod_01KH6T34TVVXGBD5AST7PZHGEQ	shipin	shipin	video	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2FMergeVideoFace1-01KHEDK3S04CSSN1E1PXQXDW30.mp4	f	0	2026-02-14 23:51:35.562+08	2026-02-14 23:51:35.562+08	\N
01KHEDKYSXNR74NZ598MQT0KPD	prod_01KH6T34TVVXGBD5AST7PZHGEQ	角色1	1	image	https://ygnsh.oss-cn-shanghai.aliyuncs.com/uploads%2Fshipin1-01KHEDKR55XWJ5SR5B8YNZW3E5.png	t	0	2026-02-14 23:51:55.454+08	2026-02-14 23:51:55.454+08	\N
\.


--
-- Data for Name: view_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: workflow_execution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_execution (id, workflow_id, transaction_id, execution, context, state, created_at, updated_at, deleted_at, retention_time, run_id) FROM stdin;
\.


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_module_migrations_id_seq', 57, true);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 157, true);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_change_action_ordering_seq', 1, false);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_claim_display_id_seq', 1, false);


--
-- Name: order_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_display_id_seq', 2, true);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_exchange_display_id_seq', 1, false);


--
-- Name: return_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_display_id_seq', 1, false);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.script_migrations_id_seq', 2, true);


--
-- Name: account_holder account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_holder
    ADD CONSTRAINT account_holder_pkey PRIMARY KEY (id);


--
-- Name: api_key api_key_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_key
    ADD CONSTRAINT api_key_pkey PRIMARY KEY (id);


--
-- Name: application_method_buy_rules application_method_buy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: application_method_target_rules application_method_target_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: auth_identity auth_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_identity
    ADD CONSTRAINT auth_identity_pkey PRIMARY KEY (id);


--
-- Name: capture capture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_pkey PRIMARY KEY (id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item cart_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: cart_payment_collection cart_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_payment_collection
    ADD CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart_promotion cart_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_promotion
    ADD CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id);


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method cart_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: credit_line credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_pkey PRIMARY KEY (id);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- Name: customer_account_holder customer_account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_account_holder
    ADD CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (id);


--
-- Name: customer_group_customer customer_group_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_address fulfillment_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_address
    ADD CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_item fulfillment_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_label fulfillment_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id);


--
-- Name: fulfillment fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_provider fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_provider
    ADD CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_set fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_set
    ADD CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id);


--
-- Name: geo_zone geo_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: inventory_item inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_item
    ADD CONSTRAINT inventory_item_pkey PRIMARY KEY (id);


--
-- Name: inventory_level inventory_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_pkey PRIMARY KEY (id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_table_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name);


--
-- Name: location_fulfillment_provider location_fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_provider
    ADD CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id);


--
-- Name: location_fulfillment_set location_fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_set
    ADD CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: notification_provider notification_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_provider
    ADD CONSTRAINT notification_provider_pkey PRIMARY KEY (id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (id);


--
-- Name: order_cart order_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_cart
    ADD CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id);


--
-- Name: order_change_action order_change_action_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_pkey PRIMARY KEY (id);


--
-- Name: order_change order_change_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item_image order_claim_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item_image
    ADD CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item order_claim_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item
    ADD CONSTRAINT order_claim_item_pkey PRIMARY KEY (id);


--
-- Name: order_claim order_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim
    ADD CONSTRAINT order_claim_pkey PRIMARY KEY (id);


--
-- Name: order_credit_line order_credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_pkey PRIMARY KEY (id);


--
-- Name: order_exchange_item order_exchange_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange_item
    ADD CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id);


--
-- Name: order_exchange order_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange
    ADD CONSTRAINT order_exchange_pkey PRIMARY KEY (id);


--
-- Name: order_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_adjustment order_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_line_item order_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_tax_line order_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_payment_collection order_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment_collection
    ADD CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: order_promotion order_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotion
    ADD CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id);


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method order_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method
    ADD CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_shipping order_shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_pkey PRIMARY KEY (id);


--
-- Name: order_summary order_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_pkey PRIMARY KEY (id);


--
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (id);


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id);


--
-- Name: payment_collection payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection
    ADD CONSTRAINT payment_collection_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment_provider payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider
    ADD CONSTRAINT payment_provider_pkey PRIMARY KEY (id);


--
-- Name: payment_session payment_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_pkey PRIMARY KEY (id);


--
-- Name: price_list price_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list
    ADD CONSTRAINT price_list_pkey PRIMARY KEY (id);


--
-- Name: price_list_rule price_list_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_pkey PRIMARY KEY (id);


--
-- Name: price price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_pkey PRIMARY KEY (id);


--
-- Name: price_preference price_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_preference
    ADD CONSTRAINT price_preference_pkey PRIMARY KEY (id);


--
-- Name: price_rule price_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_pkey PRIMARY KEY (id);


--
-- Name: price_set price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_set
    ADD CONSTRAINT price_set_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category_product product_category_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (id);


--
-- Name: product_option product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_pkey PRIMARY KEY (id);


--
-- Name: product_option_value product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_sales_channel product_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_channel
    ADD CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id);


--
-- Name: product_shipping_profile product_shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shipping_profile
    ADD CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id);


--
-- Name: product_tag product_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tag
    ADD CONSTRAINT product_tag_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id);


--
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (id);


--
-- Name: product_variant_inventory_item product_variant_inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_inventory_item
    ADD CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id);


--
-- Name: product_variant_option product_variant_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id);


--
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- Name: product_variant_price_set product_variant_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_price_set
    ADD CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id);


--
-- Name: product_variant_product_image product_variant_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_pkey PRIMARY KEY (id);


--
-- Name: promotion_application_method promotion_application_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget promotion_campaign_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign promotion_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign
    ADD CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_promotion_rule promotion_promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id);


--
-- Name: promotion_rule promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule
    ADD CONSTRAINT promotion_rule_pkey PRIMARY KEY (id);


--
-- Name: promotion_rule_value promotion_rule_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id);


--
-- Name: provider_identity provider_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_pkey PRIMARY KEY (id);


--
-- Name: publishable_api_key_sales_channel publishable_api_key_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishable_api_key_sales_channel
    ADD CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id);


--
-- Name: refund refund_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (id);


--
-- Name: refund_reason refund_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_reason
    ADD CONSTRAINT refund_reason_pkey PRIMARY KEY (id);


--
-- Name: region_country region_country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_pkey PRIMARY KEY (iso_2);


--
-- Name: region_payment_provider region_payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_payment_provider
    ADD CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reservation_item reservation_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_pkey PRIMARY KEY (id);


--
-- Name: return_fulfillment return_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_fulfillment
    ADD CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id);


--
-- Name: return_item return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT return_item_pkey PRIMARY KEY (id);


--
-- Name: return return_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pkey PRIMARY KEY (id);


--
-- Name: return_reason return_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_pkey PRIMARY KEY (id);


--
-- Name: sales_channel sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel
    ADD CONSTRAINT sales_channel_pkey PRIMARY KEY (id);


--
-- Name: sales_channel_stock_location sales_channel_stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel_stock_location
    ADD CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id);


--
-- Name: script_migrations script_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations
    ADD CONSTRAINT script_migrations_pkey PRIMARY KEY (id);


--
-- Name: service_zone service_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_pkey PRIMARY KEY (id);


--
-- Name: shipping_option shipping_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_price_set shipping_option_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_price_set
    ADD CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id);


--
-- Name: shipping_option_rule shipping_option_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_type shipping_option_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_type
    ADD CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id);


--
-- Name: shipping_profile shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_profile
    ADD CONSTRAINT shipping_profile_pkey PRIMARY KEY (id);


--
-- Name: stock_location_address stock_location_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location_address
    ADD CONSTRAINT stock_location_address_pkey PRIMARY KEY (id);


--
-- Name: stock_location stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_pkey PRIMARY KEY (id);


--
-- Name: store_currency store_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_pkey PRIMARY KEY (id);


--
-- Name: store_locale store_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: tax_provider tax_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_provider
    ADD CONSTRAINT tax_provider_pkey PRIMARY KEY (id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (id);


--
-- Name: tax_rate_rule tax_rate_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id);


--
-- Name: tax_region tax_region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT tax_region_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preference user_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preference
    ADD CONSTRAINT user_preference_pkey PRIMARY KEY (id);


--
-- Name: user_rbac_role user_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rbac_role
    ADD CONSTRAINT user_rbac_role_pkey PRIMARY KEY (user_id, rbac_role_id);


--
-- Name: user_video user_video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_video
    ADD CONSTRAINT user_video_pkey PRIMARY KEY (id);


--
-- Name: video_material video_material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_material
    ADD CONSTRAINT video_material_pkey PRIMARY KEY (id);


--
-- Name: view_configuration view_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_configuration
    ADD CONSTRAINT view_configuration_pkey PRIMARY KEY (id);


--
-- Name: workflow_execution workflow_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_execution
    ADD CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id);


--
-- Name: IDX_account_holder_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_id_5cb3a0c0" ON public.customer_account_holder USING btree (account_holder_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_provider_id_external_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_redacted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_redacted" ON public.api_key USING btree (redacted) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_revoked_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_revoked_at" ON public.api_key USING btree (revoked_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_token_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_api_key_token_unique" ON public.api_key USING btree (token);


--
-- Name: IDX_api_key_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_type" ON public.api_key USING btree (type);


--
-- Name: IDX_application_method_allocation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_allocation" ON public.promotion_application_method USING btree (allocation);


--
-- Name: IDX_application_method_target_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_target_type" ON public.promotion_application_method USING btree (target_type);


--
-- Name: IDX_application_method_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_type" ON public.promotion_application_method USING btree (type);


--
-- Name: IDX_auth_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_campaign_budget_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_campaign_budget_type" ON public.promotion_campaign_budget USING btree (type);


--
-- Name: IDX_capture_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_deleted_at" ON public.capture USING btree (deleted_at);


--
-- Name: IDX_capture_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));


--
-- Name: IDX_cart_credit_line_reference_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_currency_code" ON public.cart USING btree (currency_code);


--
-- Name: IDX_cart_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));


--
-- Name: IDX_cart_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-4a39f6c9" ON public.cart_payment_collection USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-71069c16" ON public.order_cart USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-a9d4a70b" ON public.cart_promotion USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));


--
-- Name: IDX_cart_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_method_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_collection_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_customer_id" ON public.customer_address USING btree (customer_id);


--
-- Name: IDX_customer_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_unique_customer_billing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);


--
-- Name: IDX_customer_address_unique_customer_shipping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);


--
-- Name: IDX_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_email_has_account_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_id" ON public.customer_group_customer USING btree (customer_id);


--
-- Name: IDX_customer_group_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_id_5cb3a0c0" ON public.customer_account_holder USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_deleted_at_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1e5992737" ON public.location_fulfillment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-31ea43a" ON public.return_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-4a39f6c9" ON public.cart_payment_collection USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71069c16" ON public.order_cart USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71518339" ON public.order_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-a9d4a70b" ON public.cart_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e88adb96" ON public.location_fulfillment_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e8d2543e" ON public.order_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17a262437" ON public.product_shipping_profile USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17b4c4e35" ON public.product_variant_inventory_item USING btree (deleted_at);


--
-- Name: IDX_deleted_at_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_1c934dab0" ON public.region_payment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_20b454295" ON public.product_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_26d06f470" ON public.sales_channel_stock_location USING btree (deleted_at);


--
-- Name: IDX_deleted_at_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_52b23597" ON public.product_variant_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_5cb3a0c0" ON public.customer_account_holder USING btree (deleted_at);


--
-- Name: IDX_deleted_at_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_64ff0c4c" ON public.user_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_ba32fa9c" ON public.shipping_option_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_f42b9949" ON public.order_payment_collection USING btree (deleted_at);


--
-- Name: IDX_fulfillment_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-31ea43a" ON public.return_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-e8d2543e" ON public.order_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_item_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_label_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_label_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_id_-1e5992737" ON public.location_fulfillment_provider USING btree (fulfillment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_set_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_id_-e88adb96" ON public.location_fulfillment_set USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));


--
-- Name: IDX_geo_zone_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_geo_zone_province_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));


--
-- Name: IDX_geo_zone_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (id);


--
-- Name: IDX_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1e5992737" ON public.location_fulfillment_provider USING btree (id);


--
-- Name: IDX_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-31ea43a" ON public.return_fulfillment USING btree (id);


--
-- Name: IDX_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-4a39f6c9" ON public.cart_payment_collection USING btree (id);


--
-- Name: IDX_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71069c16" ON public.order_cart USING btree (id);


--
-- Name: IDX_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71518339" ON public.order_promotion USING btree (id);


--
-- Name: IDX_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-a9d4a70b" ON public.cart_promotion USING btree (id);


--
-- Name: IDX_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e88adb96" ON public.location_fulfillment_set USING btree (id);


--
-- Name: IDX_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e8d2543e" ON public.order_fulfillment USING btree (id);


--
-- Name: IDX_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17a262437" ON public.product_shipping_profile USING btree (id);


--
-- Name: IDX_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (id);


--
-- Name: IDX_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_1c934dab0" ON public.region_payment_provider USING btree (id);


--
-- Name: IDX_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_20b454295" ON public.product_sales_channel USING btree (id);


--
-- Name: IDX_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_26d06f470" ON public.sales_channel_stock_location USING btree (id);


--
-- Name: IDX_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_52b23597" ON public.product_variant_price_set USING btree (id);


--
-- Name: IDX_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_5cb3a0c0" ON public.customer_account_holder USING btree (id);


--
-- Name: IDX_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_64ff0c4c" ON public.user_rbac_role USING btree (id);


--
-- Name: IDX_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_ba32fa9c" ON public.shipping_option_price_set USING btree (id);


--
-- Name: IDX_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_f42b9949" ON public.order_payment_collection USING btree (id);


--
-- Name: IDX_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_image_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_item_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_level_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_invite_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);


--
-- Name: IDX_line_item_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));


--
-- Name: IDX_line_item_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_type_id" ON public.order_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));


--
-- Name: IDX_line_item_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));


--
-- Name: IDX_notification_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_idempotency_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_id" ON public.notification USING btree (provider_id);


--
-- Name: IDX_notification_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_receiver_id" ON public.notification USING btree (receiver_id);


--
-- Name: IDX_option_product_id_title_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_product_id_title_unique" ON public.product_option USING btree (product_id, title) WHERE (deleted_at IS NULL);


--
-- Name: IDX_option_value_option_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_customer_id" ON public.order_address USING btree (customer_id);


--
-- Name: IDX_order_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_deleted_at" ON public.order_change_action USING btree (deleted_at);


--
-- Name: IDX_order_change_action_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_order_change_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_change_id" ON public.order_change_action USING btree (order_change_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_id" ON public.order_change_action USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_ordering; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_ordering" ON public.order_change_action USING btree (ordering) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_change_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_change_type" ON public.order_change USING btree (change_type);


--
-- Name: IDX_order_change_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_deleted_at" ON public.order_change USING btree (deleted_at);


--
-- Name: IDX_order_change_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id" ON public.order_change USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id_version" ON public.order_change USING btree (order_id, version);


--
-- Name: IDX_order_change_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_status" ON public.order_change USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_version" ON public.order_change USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_claim_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_claim_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_credit_line_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_credit_line_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id_version" ON public.order_credit_line USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_custom_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_order_custom_display_id" ON public."order" USING btree (custom_display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_deleted_at" ON public."order" USING btree (deleted_at);


--
-- Name: IDX_order_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71069c16" ON public.order_cart USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71518339" ON public.order_promotion USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-e8d2543e" ON public.order_fulfillment USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_f42b9949" ON public.order_payment_collection USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_is_draft_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_sales_channel_id" ON public."order" USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_shipping_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_shipping_method_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_summary_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_summary_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id" ON public.order_transaction USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_payment_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_collection_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_-4a39f6c9" ON public.cart_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_collection_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_f42b9949" ON public.order_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_payment_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_session_id" ON public.payment USING btree (payment_session_id);


--
-- Name: IDX_payment_payment_session_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id_1c934dab0" ON public.region_payment_provider USING btree (payment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_session_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_deleted_at" ON public.payment_session USING btree (deleted_at);


--
-- Name: IDX_payment_session_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_id_status_starts_at_ends_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_id_status_starts_at_ends_at" ON public.price_list USING btree (id, status, starts_at, ends_at) WHERE ((deleted_at IS NULL) AND (status = 'active'::text));


--
-- Name: IDX_price_list_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_list_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_value" ON public.price_list_rule USING gin (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_price_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value_price_id" ON public.price_rule USING btree (attribute, value, price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator" ON public.price_rule USING btree (operator);


--
-- Name: IDX_price_rule_operator_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id_attribute_operator_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_set_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_52b23597" ON public.product_variant_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_ba32fa9c" ON public.shipping_option_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_parent_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_deleted_at" ON public.product_collection USING btree (deleted_at);


--
-- Name: IDX_product_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_deleted_at" ON public.product USING btree (deleted_at);


--
-- Name: IDX_product_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_17a262437" ON public.product_shipping_profile USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_20b454295" ON public.product_sales_channel USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank" ON public.image USING btree (rank) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank_product_id" ON public.image USING btree (rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url_rank_product_id" ON public.image USING btree (url, rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_deleted_at" ON public.product_option USING btree (deleted_at);


--
-- Name: IDX_product_option_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_product_id" ON public.product_option USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_deleted_at" ON public.product_option_value USING btree (deleted_at);


--
-- Name: IDX_product_option_value_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_status" ON public.product USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_tag_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_tag_deleted_at" ON public.product_tag USING btree (deleted_at);


--
-- Name: IDX_product_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_deleted_at" ON public.product_type USING btree (deleted_at);


--
-- Name: IDX_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_barcode_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_deleted_at" ON public.product_variant USING btree (deleted_at);


--
-- Name: IDX_product_variant_ean_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_id_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_deleted_at" ON public.product_variant_product_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_image_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_image_id" ON public.product_variant_product_image USING btree (image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_variant_id" ON public.product_variant_product_image USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_sku_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_upc_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_promotion_application_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_promotion_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_campaign_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u" ON public.promotion_campaign_budget_usage USING btree (attribute_value, budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_budget_id" ON public.promotion_campaign_budget_usage USING btree (budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_deleted_at" ON public.promotion_campaign_budget_usage USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_campaign_identifier_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-71518339" ON public.order_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-a9d4a70b" ON public.cart_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_is_automatic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_is_automatic" ON public.promotion USING btree (is_automatic) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute" ON public.promotion_rule USING btree (attribute);


--
-- Name: IDX_promotion_rule_attribute_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator" ON public.promotion_rule USING btree (attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute_operator_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator_id" ON public.promotion_rule USING btree (operator, attribute, id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_operator" ON public.promotion_rule USING btree (operator);


--
-- Name: IDX_promotion_rule_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_promotion_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_rule_id_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_rule_id_value" ON public.promotion_rule_value USING btree (promotion_rule_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_value" ON public.promotion_rule_value USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_type" ON public.promotion USING btree (type);


--
-- Name: IDX_provider_identity_auth_identity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_auth_identity_id" ON public.provider_identity USING btree (auth_identity_id);


--
-- Name: IDX_provider_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_provider_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_provider_identity_provider_entity_id" ON public.provider_identity USING btree (entity_id, provider);


--
-- Name: IDX_publishable_key_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_publishable_key_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (publishable_key_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_rbac_role_id_64ff0c4c" ON public.user_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_deleted_at" ON public.refund USING btree (deleted_at);


--
-- Name: IDX_refund_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_reason_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_refund_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id_iso_2_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_region_country_region_id_iso_2_unique" ON public.region_country USING btree (region_id, iso_2);


--
-- Name: IDX_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_region_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_id_1c934dab0" ON public.region_payment_provider USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_reservation_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_id_-31ea43a" ON public.return_fulfillment USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_parent_return_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_parent_return_reason_id" ON public.return_reason USING btree (parent_return_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_deleted_at" ON public.sales_channel USING btree (deleted_at);


--
-- Name: IDX_sales_channel_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_20b454295" ON public.product_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_26d06f470" ON public.sales_channel_stock_location USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_service_zone_fulfillment_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_method_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_shipping_method_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));


--
-- Name: IDX_shipping_method_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_shipping_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_id_ba32fa9c" ON public.shipping_option_price_set USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_rule_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_option_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_option_type_id" ON public.shipping_option USING btree (shipping_option_type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_id_17a262437" ON public.product_shipping_profile USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_profile_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_single_default_region; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_stock_location_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_address_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-1e5992737" ON public.location_fulfillment_provider USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-e88adb96" ON public.location_fulfillment_set USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_26d06f470" ON public.sales_channel_stock_location USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_currency_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_currency_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_locale_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_deleted_at" ON public.store_locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_locale_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_store_id" ON public.store_locale USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tag_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_unique_rate_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_tax_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_region_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_parent_id" ON public.tax_region USING btree (parent_id);


--
-- Name: IDX_tax_region_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_unique_country_nullable_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_tax_region_unique_country_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_type_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_unique_promotion_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_user_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_id_64ff0c4c" ON public.user_rbac_role USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_deleted_at" ON public.user_preference USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_user_id" ON public.user_preference USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_preference_user_id_key_unique" ON public.user_preference USING btree (user_id, key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_video_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_video_deleted_at" ON public.user_video USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_52b23597" ON public.product_variant_price_set USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_video_material_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_video_material_deleted_at" ON public.video_material USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_deleted_at" ON public.view_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_is_system_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_is_system_default" ON public.view_configuration USING btree (entity, is_system_default) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_user_id" ON public.view_configuration USING btree (entity, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_user_id" ON public.view_configuration USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_retention_time_updated_at_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_retention_time_updated_at_state" ON public.workflow_execution USING btree (retention_time, updated_at, state) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL));


--
-- Name: IDX_workflow_execution_run_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_run_id" ON public.workflow_execution USING btree (run_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state_updated_at" ON public.workflow_execution USING btree (state, updated_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_updated_at_retention_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_updated_at_retention_time" ON public.workflow_execution USING btree (updated_at, retention_time) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL) AND ((state)::text = ANY (ARRAY[('done'::character varying)::text, ('failed'::character varying)::text, ('reverted'::character varying)::text])));


--
-- Name: IDX_workflow_execution_workflow_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id_transaction_id" ON public.workflow_execution USING btree (workflow_id, transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id_run_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_script_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_script_name_unique ON public.script_migrations USING btree (script_name);


--
-- Name: tax_rate_rule FK_tax_rate_rule_tax_rate_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON DELETE CASCADE;


--
-- Name: tax_rate FK_tax_rate_tax_region_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_parent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_provider_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id) REFERENCES public.tax_provider(id) ON DELETE SET NULL;


--
-- Name: application_method_buy_rules application_method_buy_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_buy_rules application_method_buy_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: capture capture_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item cart_line_item_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method cart_shipping_method_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_line credit_line_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE;


--
-- Name: customer_address customer_address_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id) REFERENCES public.customer_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_delivery_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id) REFERENCES public.fulfillment_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment_item fulfillment_item_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment_label fulfillment_label_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment fulfillment_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: geo_zone geo_zone_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image image_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_level inventory_level_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.notification_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_change_action order_change_action_order_change_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id) REFERENCES public.order_change(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_change order_change_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_credit_line order_credit_line_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_adjustment order_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_tax_line order_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item order_line_item_totals_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id) REFERENCES public.order_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping order_shipping_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_summary order_summary_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_transaction order_transaction_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_col_aa276_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_pro_2d555_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id) REFERENCES public.payment_provider(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_session payment_session_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_rule price_list_rule_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id) REFERENCES public.price_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_rule price_rule_price_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id) REFERENCES public.price(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category product_category_parent_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id) REFERENCES public.product_collection(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_option product_option_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_option_value product_option_value_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id) REFERENCES public.product_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id) REFERENCES public.product_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_variant_option product_variant_option_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option product_variant_option_variant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id) REFERENCES public.product_variant(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant product_variant_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_product_image product_variant_product_image_image_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_image_id_foreign FOREIGN KEY (image_id) REFERENCES public.image(id) ON DELETE CASCADE;


--
-- Name: promotion_application_method promotion_application_method_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget promotion_campaign_budget_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_budget_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_budget_id_foreign FOREIGN KEY (budget_id) REFERENCES public.promotion_campaign_budget(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_rule_value promotion_rule_value_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: provider_identity provider_identity_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund refund_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: region_country region_country_region_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservation_item reservation_item_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_reason return_reason_parent_return_reason_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id) REFERENCES public.return_reason(id);


--
-- Name: service_zone service_zone_fulfillment_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id) REFERENCES public.fulfillment_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shipping_option_rule shipping_option_rule_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_option_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id) REFERENCES public.shipping_option_type(id) ON UPDATE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id) REFERENCES public.shipping_profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_location stock_location_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.stock_location_address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_currency store_currency_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_locale store_locale_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rNYnqKuYGSH670NeZxjKKJtbeWl8uGtlUJbv2ST4UPt8axsN0i6wkEEZ8nOpr8Q


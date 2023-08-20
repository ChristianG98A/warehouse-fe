export interface AllOrdersApiResponse {
    status:number;
    code:string;
    response:OrderTypes[]
}


export type InvoiceOrder = {
    name: string;
    sku: string;
    ean: string;
    quantity: string | number;
    price_brutto: string | number;
}

export interface PListApiResponse{
    "status":200,
    "code":string,
    "response": Invoice;
}

export type Invoice = {
    currency : "RON" | "EUR" | "USD";
    orderProducts: InvoiceOrder[]
}

type InvoiceData = {
  id: string;
  customer_id: string;
  entry_id: null;
  invoice_fullname: string;
  invoice_company: string;
  invoice_nip: string;
  invoice_address: string;
  invoice_postcode: string;
  invoice_city: string;
  invoice_state: string;
  invoice_country: string;
  invoice_country_code: string;
  updated_at: string;
};

export type DeliveryData = {
  id: string;
  customer_id: string;
  entry_id: null;
  delivery_fullname: string;
  delivery_company: string;
  delivery_address: string;
  delivery_postcode: string;
  delivery_city: string;
  delivery_state: string;
  delivery_country: string;
  delivery_country_code: string;
  delivery_point_id: string;
  delivery_point_name: string;
  delivery_point_address: string;
  delivery_point_postcode: string;
  delivery_point_city: string;
  updated_at: string;
};

export type OrderProduct = {
  id: string;
  user_id: string;
  order_id: string;
  storage: string;
  storage_id: string;
  order_product_id: string;
  product_id: string;
  variant_id: string;
  name: string;
  attributes: string;
  sku: string;
  ean: string;
  location: string;
  warehouse_id: string;
  auction_id: string;
  price_brutto: string;
  tax_rate: string;
  quantity: string;
  weight: string;
  bundle_id: string;
  price_netto: number;
  price_total_netto: number;
  price_total_brutto: number;
};

export type OrderData = {
  id: string;
  customer_id: string;
  order_id: string;
  order_status: string;
  shop_order_id: string;
  external_order_id: string;
  order_source: string;
  order_source_id: string;
  order_source_info: string;
  order_status_id: string;
  date_add: string;
  date_confirmed: string;
  date_in_status: string;
  confirmed: string;
  user_login: string;
  currency: string;
  payment_method: string;
  payment_method_cod: string;
  payment_done: string;
  user_comments: string;
  admin_comments: string;
  email: string;
  phone: string;
  delivery_method: string;
  delivery_price: string;
  delivery_package_module: string;
  delivery_package_nr: string;
  want_invoice: string;
  extra_field_1: string;
  extra_field_2: string;
  order_page: string;
  tax_rate: string;
  status: string;
  whStatus: string;
  order_notes: string;
  invoice_data: InvoiceData[];
  delivery_data: DeliveryData[];
  totalNoVat: number;
  totalWithVat: number;
  orderProducts: OrderProduct[];
};

export type OrderTypes = {
  crt: number;
  id: string;
  invoice_company: string;
  delivery_price: string;
  tax_rate: string;
  status: string;
  whStatus: string;
  order_notes: string;
  totalNoVat: string;
  totalWithVat: number;
}
export type Currency = "RON" | "EUR" | "USD";
export type ProductResult = {
  crt: number;
  id: string;
  name: string;
  model: string;
}
export type ProductInBasket = {
  row_id?: number | null;
  crt?: number;
  id: number;
  name: string;
  model?: string;
  acquisition_price: number;
  quantity: number;
  tax: number;
}
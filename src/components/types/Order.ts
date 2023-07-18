export interface allOrdersApiResponse {
    status:number;
    code:string;
    response:Order[]
}

export default interface Order{
  id:number;
  invoice_company:string;
  delivery_price:number;
  tax_rate:number;
  status:string; // "inprogress" si altceva
  whStatus:string;
  order_notes:string;
  totalNoVat:number;
  totalWithVat:number;
}

export type invoiceOrder = {
    name: string;
    sku: string;
    ean: string;
    quantity: string | number;
    price_brutto: string | number;
}

export interface pListApiResponse{
    "status":200,
    "code":string,
    "response": invoice;
}

export type invoice = {
    currency : "RON" | "EUR" | "USD";
    orderProducts: invoiceOrder[]
}

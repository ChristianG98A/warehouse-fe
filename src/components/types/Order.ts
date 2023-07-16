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

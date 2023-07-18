<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<style>
    body{
        margin: 0;
        font-size: 11px;
        font-family: Arial, Helvetica, sans-serif;
        max-width: 720px;
    }

    h1{
        margin: 0;
        font-size: 16px;
    }

    #header {
        width: 100%;
        height: 170px;
        position: relative;
    }

    #client {
        max-width: 250px;
        width: 100%;
        position: absolute;
        top: 10px;
        right: 0;
        background-color: #f0f0f0 ;
        margin: 0;
        padding: 5px;
    }

    #supplier {
        max-width: 250px;
        width: 100%;
        position: absolute;
        top: 10px;
        left: 0;
        background-color: #f0f0f0;
        margin: 0;
        padding: 5px;
    }

    #invoice_w {
        max-width: 180px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 270px;
        margin: 0;
    }

    #logo {
        text-align: center;
    }

    #invoice {
        margin-top: 10px;
        background-color: #404040;
        padding: 5px;
        color: white;
    }
    #invoice p {
        margin: 2px 0;
        padding: 0;
        text-align: center;
    }

    #products {
        font-size: 10px;
        width: 100%;
    }

    #products th {
        vertical-align: middle;
        background-color: #404040;
        color: white;
    }

    #products th, td {
        padding: 2px;
    }

</style>
<body>

<div id="header">
    @if($worder->_order->currency == 'EUR')
    <div id="supplier">
        <h1>SELLER</h1><br>
        <b>Name:</b> SC ROMSCENT TRADING SRL<br>
        <b>C.I.F.:</b> RO41041717<br>
        <b>Address:</b> 287 Theodor Pallady, Bucharest<br>
        <b>Banca:</b> ALPHA BANK<br>
        <b>IBAN:</b>RO10 BUCU 1181 3042 5338 5EUR<br>
        <b>SWIFT:</b> BUCUROBU
    </div>
    @else
    <div id="supplier">
        <h1>FURNIZOR</h1><br>
        <b>Nume:</b> SC ROMSCENT TRADING SRL<br>
        <b>Capital Social:</b> 45.000 lei<br>
        <b>C.I.F.:</b> RO41041717 | <b>Nr. R.C.:</b> J40/5776/2019<br>
        <b>Sediu:</b> Str.Everest, Nr.10, Cam.1, Sec.3, Buc<br>
        <b>Pct. luc.:</b> Theodor Pallady 287, Sec.3, Buc<br>
        <b>Banca:</b> ALPHA BANK<br>
        <b>IBAN:</b> RO17 BUCU 1181 3042 5338 4RON
    </div>
    @endif
    <div id="invoice_w">
        <div id="logo">
            {{--<img src="/themes/v4/assets/global/img/logo_romscent.jpg" width="140px">--}}
            <img src="{{resource_path('assets/images/logo_romscent.jpg')}}" width="140px">
        </div>
        @if($worder->_order->currency == 'EUR')
            <div id="invoice">
                <p><b>PROFORMA INVOICE</b></p>
                <b>No.</b> {{$worder->_order->id}}<br>
                <b>Date:</b> {{ \Carbon\Carbon::parse($worder->_order->created)->format('Y-m-d')}}<br>
                <b>Currency:</b> {{$worder->_order->currency}}
            </div>
        @else
            <div id="invoice">
                <p><b>FACTURA PROFORMA</b></p>
                <b>Nr.</b> {{$worder->_order->id}}<br>
                <b>Data:</b> {{ \Carbon\Carbon::parse($worder->_order->created)->format('d-m-Y')}}<br>
                <b>Moneda:</b> {{$worder->_order->currency}}<br>
            </div>
        @endif
    </div>
    @if($worder->_order->currency == 'EUR')
    <div id="client">
        <h1>BUYER</h1><br>
        <b>Name:</b> {{$worder->_order->company_name}}<br>
        <b>C.I.F.:</b> {{$worder->_order->company_code}}<br>
        <b>Address:</b> {{$worder->_order->invoice_address}}, {{$worder->_order->invoice_city}}, {{$worder->_order->invoice_state}}<br>
        <b>Bank:</b> {{$worder->_order->company_bank}}<br>
        <b>IBAN:</b> {{$worder->_order->company_bankaccount}}
    </div>
    @else
    <div id="client">
        <h1>CUMPARATOR</h1><br>
        <b>Nume:</b> {{$worder->_order->company_name}}<br>
        <b>C.I.F.:</b> {{$worder->_order->company_code}} | <b>Nr. R.C.:</b> {{$worder->_order->company_registration}}<br>
        <b>Sediu:</b> {{$worder->_order->invoice_address}}, {{$worder->_order->invoice_city}}, {{$worder->_order->invoice_state}}<br>
        <b>Banca:</b> {{$worder->_order->company_bank}}<br>
        <b>IBAN:</b> {{$worder->_order->company_bankaccount}}
    </div>
    @endif
</div>

<table id="products" cellpadding="1" cellspacing="0">
    <tr>
        <th align="center" width="10px">#</th>
        <th align="center" width="60px">EAN</th>
        <th align="center" width="410px">@if($worder->_order->currency == 'RON') Denumirea produselor @else Product @endif</th>
        <th align="center" width="20px">@if($worder->_order->currency == 'RON')Cant. @else Quantity @endif</th>
        <th align="center" width="40px" style="white-space: nowrap">@if($worder->_order->currency == 'RON')Pret Unitar<br>(fara TVA) @else Net price @endif</th>
        <th align="center" width="40px" style="white-space: nowrap">@if($worder->_order->currency == 'RON')Valoare<br>(fara TVA) @else Net value @endif</th>
        <th align="center" width="20px" style="white-space: nowrap">@if($worder->_order->currency == 'RON')Cota<br>TVA @else VAT @endif <br>%</th>
        <th align="center" style="white-space: nowrap">@if($worder->_order->currency == 'RON')Valoare<br>TVA @else VAT<br>value @endif</th>
    </tr>
    <?php $crt = 1 ?>
    @foreach($worder->_order->_productsWoTransport()->orderByManufacturer()->get() as $orderProduct)
        @foreach($orderProduct->_stockItems->groupBy('ean') as $ean => $stockAllocatedGrouped)
        <tr>
            <td style="border-top: 1px solid grey" align="center">{{$crt}}</td>
            <td style="border-top: 1px solid grey" align="right">{{$ean}}</td>
            <td style="border-top: 1px solid grey" align="left">#{{$orderProduct->_product->id}} - @if($worder->_order->currency != 'RON') {{$orderProduct->_product->_fullNameEn}} @else {{$orderProduct->_product->_fullNameEn}} @endif</td>
            <td style="border-top: 1px solid grey" align="center">{{count($stockAllocatedGrouped)}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( round($orderProduct->price, 2) ,2)}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( (round($orderProduct->price, 2) * count($stockAllocatedGrouped)) ,2)}}</td>
            <td style="border-top: 1px solid grey" align="center">{{($orderProduct->tax - 1) * 100}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( (round((round($orderProduct->price, 2) * ($orderProduct->tax - 1)) * count($stockAllocatedGrouped), 2)) ,2)}}</td>
        </tr>
        <?php $crt++ ?>
        @endforeach
    @endforeach

    @foreach($worder->_order->_productsTransport as $orderProduct)
        <tr>
            <td style="border-top: 1px solid grey" align="left">{{$crt}}</td>
            <td style="border-top: 1px solid grey" align="left">#{{$orderProduct->_product->id}} - @if(!empty($orderProduct->label)){{$orderProduct->label}}@else{{$orderProduct->_product->_fullName}}@endif</td>
            <td style="border-top: 1px solid grey" align="center">{{$orderProduct->quantity}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( round($orderProduct->price, 2) ,2)}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( (round($orderProduct->price, 2) * $orderProduct->quantity) ,2)}}</td>
            <td style="border-top: 1px solid grey" align="center">{{($orderProduct->tax - 1) * 100}}</td>
            <td style="border-top: 1px solid grey" align="right">{{number_format( (round((round($orderProduct->price, 2) * ($orderProduct->tax - 1)) * $orderProduct->quantity, 2)) ,2)}}</td>
        </tr>
        <?php $crt++ ?>
    @endforeach
    <tr>
        <td colspan="3" align="right"></td>
        <th colspan="2" style="border-top: 1px solid grey" align="right">SubTotal:</th>
        <td style="border-top: 1px solid grey; white-space: nowrap" colspan="3" align="right">{{number_format($worder->_order->subtotal, 2)}} {{$worder->_order->currency}}</td>
    </tr>
    <tr>
        <td colspan="3" align="right"></td>
        <th colspan="2" style="border-top: 1px solid grey" align="right">@if($worder->_order->currency == 'RON') TVA @else VAT: @endif</th>
        <td style="border-top: 1px solid grey; white-space: nowrap" colspan="3" align="right">{{number_format($worder->_order->subtotalTax, 2)}} {{$worder->_order->currency}}</td>
    </tr>
    <tr>
        <td colspan="3" align="right"></td>
        <th colspan="2" style="border-top: 1px solid grey" align="right">Total:</th>
        <td style="border-top: 1px solid grey; white-space: nowrap" colspan="3" align="right">{{number_format($worder->_order->total, 2)}} {{$worder->_order->currency}}</td>
    </tr>
</table>

<div style="text-align: left; font-style: italic; font-size: 6pt">
    RomScent Trading SRL - Tel: +4 0373760255 - eMail: hello@carespot.ro<br />
</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Credit Note - {{ $lead_no }}</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }

        .invoice-wrapper {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            padding: 30px;
            background: #fff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px double #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .company-details h2 {
            margin: 0;
            font-size: 24px;
            color: #0f66af;
            font-weight: bold;
        }

        .company-details p {
            margin: 5px 0;
            font-size: 14px;
        }

        .invoice-details {
            text-align: right;
        }

        .invoice-details p {
            margin: 8px 0;
            font-size: 13px;
        }

        .section {
            margin-bottom: 25px;
        }

        .section h3 {
            font-size: 16px;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #0f66af;
            color: #0f66af;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table th,
        table td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
            vertical-align: middle;
        }

        table th {
            background: #f0f7ff;
            font-weight: bold;
            color: #0f66af;
            font-size: 13px;
        }

        table td.text-left {
            text-align: left;
        }

        .summary {
            margin-top: 30px;
            width: 45%;
            float: right;
            background: #f8fbff;
            border: 2px solid #0f66af;
            border-radius: 8px;
            padding: 15px;
        }

        .summary table {
            width: 100%;
            border: none;
        }

        .summary table td {
            border: none;
            padding: 8px 0;
            font-size: 14px;
        }

        .summary .label {
            text-align: left;
            font-weight: normal;
            color: #555;
        }

        .summary .value {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            color: #0f66af;
        }

        .footer {
            margin-top: 80px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }

        .highlight-total {
            background-color: #e6f7ff !important;
            font-size: 18px !important;
            font-weight: bold !important;
            color: #0f66af !important;
        }

        @media print {
            body {
                margin: 0;
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div id="invoice" class="invoice-wrapper">

        {{-- HEADER --}}
        <div class="header">
            <div class="company-details">
                <h2>QikLeadz</h2>
                <p><strong>Executive Incentive Credit Note</strong></p>
                <p>Verified Sales Commission</p>
            </div>

            <div class="invoice-details">
                <p><strong>Credit Note Date:</strong> {{ $date }}</p>
                <p><strong>Lead Reference:</strong> {{ $lead_no }}</p>
            </div>
        </div>

        {{-- CUSTOMER DETAILS --}}
        <div class="section">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {{ $customer_name }}</p>
            <p><strong>Phone:</strong> {{ $phone }}</p>
            <p><strong>Location:</strong> {{ $location }}</p>
        </div>

        {{-- VEHICLE COMMISSION TABLE --}}
        <div class="section">
            <h3>Commission Details</h3>

            <table>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th class="text-left">Brand</th>
                        <th class="text-left">Variant</th>
                        <th class="text-left">Color</th>
                        <th>Quantity</th>
                        <th>Commission per Unit</th>
                        <th class="highlight-total">Total Incentive</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vehicles as $index => $vehicle)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td class="text-left">{{ $vehicle['brand_name'] }}</td>
                            <td class="text-left">{{ $vehicle['variant_name'] }}</td>
                            <td class="text-left">{{ $vehicle['color_name'] }}</td>
                            <td>{{ $vehicle['vehicle_qty'] }}</td>
                            <td>₹ {{ number_format($vehicle['commission_per_unit'], 0) }}</td>
                            <td class="highlight-total">
                                ₹ {{ number_format($vehicle['total_incentive'], 0) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- SUMMARY --}}
        <div class="summary">
            <table>
                <tr>
                    <td class="label">Total Vehicles Sold</td>
                    <td class="value">{{ $total_vehicles }} units</td>
                </tr>
                <tr>
                    <td class="label">Total Commission Earned</td>
                    <td class="value highlight-total">
                        ₹ {{ number_format($total_incentive, 0) }}
                    </td>
                </tr>
            </table>
        </div>

        <div style="clear: both;"></div>



    </div>
</body>

</html>

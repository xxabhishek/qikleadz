<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Invoice</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .invoice-wrapper {
            width: 100%;
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .company-details h2 {
            margin: 0;
            font-size: 18px;
        }

        .company-details p {
            margin: 2px 0;
        }

        .invoice-details {
            text-align: right;
        }

        .invoice-details p {
            margin: 2px 0;
        }

        .section {
            margin-bottom: 15px;
        }

        .section h3 {
            font-size: 14px;
            margin-bottom: 5px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        table th,
        table td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: center;
        }

        table th {
            background: #f2f2f2;
            font-weight: bold;
        }

        .text-left {
            text-align: left;
        }

        .summary {
            margin-top: 15px;
            width: 40%;
            float: right;
        }

        .summary table td {
            border: none;
            padding: 5px;
        }

        .summary .label {
            text-align: left;
        }

        .summary .value {
            text-align: right;
            font-weight: bold;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #666;
        }

        /* Print / PDF friendly */
        @media print {
            body {
                margin: 0;
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
                <p><strong>Incentive Invoice</strong></p>
            </div>

            <div class="invoice-details">
                <p><strong>Invoice Date:</strong> {{ $date }}</p>
                <p><strong>Lead No:</strong> {{ $lead_no }}</p>
            </div>
        </div>

        {{-- CUSTOMER DETAILS --}}
        <div class="section">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {{ $customer_name }}</p>
            <p><strong>Phone:</strong> {{ $phone }}</p>
            <p><strong>Location:</strong> {{ $location }}</p>
        </div>

        {{-- VEHICLE TABLE --}}
        <div class="section">
            <h3>Vehicle Details</h3>

            <table>
                <thead>
                    <tr>
                        <th>SrNo.</th>
                        <th class="text-left">Brand</th>
                        <th class="text-left">Variant</th>
                        <th class="text-left">Color</th>
                        <th>Qty</th>
                        <th>Incentive</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vehicles as $index => $vehicle)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td class="text-left">{{ $vehicle->brand->name ?? '-' }}</td>
                            <td class="text-left">{{ $vehicle->variant->name ?? '-' }}</td>
                            <td class="text-left">{{ $vehicle->color->name ?? '-' }}</td>
                            <td>{{ $vehicle->vehicle_qty }}</td>
                            <td>₹ {{ number_format($vehicle->total_price, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- SUMMARY --}}
        <div class="summary">
            <table>
                <tr>
                    <td class="label">Total Vehicles</td>
                    <td class="value">{{ $total_vehicles }}</td>
                </tr>
                <tr>
                    <td class="label">Total Incentive</td>
                    <td class="value">₹ {{ number_format($total_incentive, 2) }}</td>
                </tr>
            </table>
        </div>

        <div style="clear: both;"></div>

        {{-- FOOTER --}}
        <div class="footer">
            <p>© {{ date('Y') }} QikLeadz. All rights reserved.</p>
        </div>

    </div>
</body>

</html>
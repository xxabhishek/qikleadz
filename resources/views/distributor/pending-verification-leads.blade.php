<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Pending Verification Leads</title>
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }

        .page-wrapper {
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .page-content.container-animate {
            max-width: 1200px;
            width: 100%;
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05);
        }

        .card-body {
            padding: 2rem;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e9ecef;
            margin-bottom: 1.5rem;
        }

        .text-primary {
            color: #4361ee !important;
        }

        .mb-4 {
            margin-bottom: 1.5rem !important;
        }

        .table-responsive {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        .table {
            width: 100%;
            margin-bottom: 0;
            color: #333;
            border-collapse: collapse;
        }

        .table-hover tbody tr:hover {
            background-color: rgba(67, 97, 238, 0.05);
        }

        .table thead th {
            background-color: #f8f9fa;
            border-bottom: 2px solid #dee2e6;
            padding: 1rem;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }

        .table tbody td {
            padding: 1rem;
            vertical-align: middle;
            border-top: 1px solid #e9ecef;
        }

        .table tbody tr:first-child td {
            border-top: none;
        }

        .table tbody tr {
            transition: background-color 0.2s ease;
        }

        .btn {
            display: inline-block;
            font-weight: 500;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 6px;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
            cursor: pointer;
        }

        .btn-primary {
            color: white;
            background-color: #4361ee;
            border-color: #4361ee;
        }

        .btn-primary:hover {
            background-color: #3a56d4;
            border-color: #3a56d4;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2);
        }

        .btn-xs {
            padding: 0.25rem 0.75rem;
            font-size: 0.8125rem;
        }

        .text-muted {
            color: #6c757d !important;
        }

        .text-success {
            color: #28a745 !important;
        }

        .opacity-25 {
            opacity: 0.25;
        }

        .display-1 {
            font-size: 5rem;
            font-weight: 300;
            line-height: 1.2;
        }

        .text-center {
            text-align: center !important;
        }

        .py-5 {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
        }

        .mt-3 {
            margin-top: 1rem !important;
        }

        .mt-4 {
            margin-top: 1.5rem !important;
        }

        /* Pagination Styles */
        .pagination {
            display: flex;
            justify-content: center;
            list-style: none;
            padding: 0;
        }

        .pagination li {
            margin: 0 0.25rem;
        }

        .pagination li a,
        .pagination li span {
            display: inline-block;
            padding: 0.5rem 0.75rem;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            color: #4361ee;
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .pagination li a:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
        }

        .pagination li.active span {
            background-color: #4361ee;
            border-color: #4361ee;
            color: white;
        }

        .pagination li.disabled span {
            color: #6c757d;
            background-color: #f8f9fa;
            border-color: #dee2e6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .page-wrapper {
                padding: 10px;
            }

            .card-body {
                padding: 1rem;
            }

            .card-title {
                font-size: 1.25rem;
            }

            .table thead {
                display: none;
            }

            .table tbody td {
                display: block;
                text-align: right;
                padding: 0.75rem;
                border-bottom: 1px solid #e9ecef;
            }

            .table tbody tr {
                margin-bottom: 1rem;
                display: block;
                border: 1px solid #e9ecef;
                border-radius: 8px;
            }

            .table tbody td:before {
                content: attr(data-label);
                float: left;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.85rem;
                color: #6c757d;
            }

            .table tbody td:last-child {
                border-bottom: none;
            }

            .btn {
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .display-1 {
                font-size: 3rem;
            }

            .page-wrapper {
                padding: 5px;
            }
        }

        /* Status indicators */
        strong {
            color: #2d3748;
            font-weight: 600;
        }

        small {
            font-size: 0.875rem;
        }

        /* Animation for table rows */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .table tbody tr {
            animation: slideIn 0.3s ease-out;
        }

        .table tbody tr:nth-child(even) {
            animation-delay: 0.05s;
        }

        .table tbody tr:nth-child(odd) {
            animation-delay: 0.1s;
        }
    </style>
</head>

<body>
    <div class="page-wrapper">
        <div class="page-content container-animate">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title text-primary mb-4">All Converted Leads Pending Verification</h5>

                    @if($pendingLeads->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Lead No</th>
                                        <th>Customer Name</th>
                                        <th>No of Vehicles</th>
                                        <th>Converted Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pendingLeads as $lead)
                                        @php
                                            $firstPendingDetail = $lead->lead_details
                                                ->where('status', 'converted')
                                                ->where('verification_status', 'pending')
                                                ->first();
                                        @endphp

                                        @if($firstPendingDetail)
                                            <tr>
                                                <td data-label="Lead No">{{ $firstPendingDetail->lead_no ?? 'N/A' }}</td>
                                                <td data-label="Customer Name">
                                                    <strong>{{ $lead->customer_name }}</strong><br>
                                                    <small class="text-muted">{{ $lead->phone_no }}</small>
                                                </td>
                                                <td data-label="No of Vehicles">{{ $lead->lead_details->count() }}</td>
                                                <td data-label="Converted Date">{{ $lead->updated_at->format('d M Y') }}</td>
                                                <td data-label="Action">
                                                    <a href="{{ route('distributor.leads.show', $lead->id) }}"
                                                        class="btn btn-primary btn-xs">View Details</a>
                                                </td>
                                            </tr>
                                        @endif
                                    @endforeach
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="mt-4">
                            {{ $pendingLeads->links() }}
                        </div>
                    @else
                        <div class="text-center py-5">
                            <i class="bi bi-check-circle display-1 text-success opacity-25"></i>
                            <p class="text-muted mt-3">No converted leads pending verification</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <script>
        // Add data-label attributes for mobile responsiveness
        document.addEventListener('DOMContentLoaded', function() {
            const tableHeaders = document.querySelectorAll('thead th');
            const tableCells = document.querySelectorAll('tbody td');

            tableCells.forEach((cell, index) => {
                const headerIndex = index % tableHeaders.length;
                const headerText = tableHeaders[headerIndex].textContent;
                cell.setAttribute('data-label', headerText);
            });
        });
    </script>
</body>

</html>

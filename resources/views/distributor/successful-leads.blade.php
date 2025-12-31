<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bajaj - Successful Leads</title>
    <link rel="icon" href="{{ url('/') }}/assets/images/favicon-32x32.png" type="image/png">

    <!-- Bootstrap & Icons -->
    <link href="{{ url('/') }}/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Google Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet">

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-blue: #f2f9ff;
        }

        .successful-leads {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
        }

        .card-header-custom {
            background-color: var(--primary-blue);
            color: white;
            border-bottom: none;
        }

        .table-success-row {
            background-color: rgba(40, 167, 69, 0.1) !important;
        }

        .badge-verified {
            background-color: #28a745;
            color: white;
        }
    </style>
</head>

<body class="successful-leads">
    <div class="wrapper">
        <div class="page-wrapper">
            <div class="page-content container-animate">
                <!-- Page Header -->
                <section class="p-3 pt-5">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 class="text-primary mb-1">Successful Leads</h4>
                            <p class="text-muted mb-0">All leads with successful verification status</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="{{ route('distributor.leads') }}" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-left me-1"></i> Back to Leads
                            </a>
                            <a href="{{ route('distributor.dashboard') }}" class="btn btn-primary">
                                <i class="bi bi-speedometer2 me-1"></i> Dashboard
                            </a>
                        </div>
                    </div>

                    <!-- Stats Summary -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-3">
                            <div class="card border-0" style="background-color: #d4edda;">
                                <div class="card-body">
                                    <h6 class="text-muted small mb-2">Total Successful</h6>
                                    <h3 class="text-success mb-0">{{ $successfulLeads->total() }}</h3>
                                </div>
                            </div>
                        </div>
                        <!-- ... baaki stats cards same -->
                    </div>

                    <!-- Generate Credit Note Button (Top) -->
                    <div class="mb-3">
                        <button type="button" class="btn btn-success" id="generateSelectedCreditNote">
                            <i class="bi bi-file-earmark-pdf me-1"></i> Generate Credit Note for Selected
                        </button>
                    </div>

                    <!-- Filter/Search Bar -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <form action="{{ route('distributor.successful-leads') }}" method="GET" class="row g-3">
                                <div class="col-md-3">
                                    <label class="form-label">Customer Name</label>
                                    <input type="text" name="search" class="form-control" placeholder="Search customer..." value="{{ request('search') }}">
                                </div>
                                <div class="col-md-3 d-flex align-items-end">
                                    <button type="submit" class="btn btn-primary me-2">
                                        <i class="bi bi-search me-1"></i> Filter
                                    </button>
                                    <a href="{{ route('distributor.successful-leads') }}" class="btn btn-secondary">
                                        <i class="bi bi-arrow-clockwise me-1"></i> Reset
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Successful Leads Table -->
                    <div class="card">
                        <div class="card-header card-header-custom">
                            <h5 class="card-title mb-0">Successful Leads List</h5>
                        </div>
                        <div class="card-body">
                            @if($successfulLeads->count() > 0)
                                <form id="creditNoteForm" action="{{ route('distributor.generate-selected-credit-note') }}" method="POST">
                                    @csrf
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th><input type="checkbox" id="selectAll"></th>
                                                    <th>Lead ID</th>
                                                    <th>Customer</th>
                                                    <th>Executive</th>
                                                    <th>Dealer</th>
                                                    <th>Vehicle Details</th>
                                                    <th>Total Price</th>
                                                    <th>Converted Date</th>
                                                    <th>Verified Date</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($successfulLeads as $lead)
                                                    @foreach($lead->lead_details as $detail)
                                                        @if($detail->verification_status === 'successful')
                                                            <tr class="table-success-row">
                                                                <td>
                                                                    <input type="checkbox" name="detail_ids[]" value="{{ $detail->id }}" class="vehicle-checkbox">
                                                                </td>
                                                                  <td>{{ $details->lead_no ?? 'N/A' }}</td>
                                                                <td>
                                                                    <strong>{{ $lead->customer_name }}</strong><br>
                                                                    <small class="text-muted">{{ $lead->phone_no }}</small>
                                                                </td>
                                                                <td>{{ $lead->executive->name ?? 'N/A' }}</td>
                                                                <td>{{ $lead->dealer->name ?? 'N/A' }}</td>
                                                                <td>
                                                                    {{ $detail->brand->name ?? 'N/A' }} - {{ $detail->variant->name ?? 'N/A' }}<br>
                                                                    <small class="text-muted">{{ $detail->color->name ?? '' }}</small>
                                                                </td>
                                                                <td>${{ number_format($detail->total_price ?? 0, 2) }}</td>
                                                                <td>{{ $detail->updated_at ? \Carbon\Carbon::parse($detail->updated_at)->format('d M Y') : 'N/A' }}</td>
                                                                <td>{{ $detail->verified_at ? \Carbon\Carbon::parse($detail->verified_at)->format('d M Y') : 'N/A' }}</td>
                                                                <td><span class="badge badge-verified">Verified</span></td>
                                                                <td>
                                                                    <a href="{{ route('distributor.leads.show', $lead->id) }}" class="btn btn-sm btn-outline-primary">
                                                                        <i class="bi bi-eye"></i> View
                                                                    </a>
                                                                    <!-- Single Credit Note Button -->
                                                                    <a href="{{ route('distributor.credit-note', $detail->id) }}"
                                                                       class="btn btn-sm btn-outline-success"
                                                                       target="_blank">
                                                                        <i class="bi bi-printer"></i> Generate Credit Note
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        @endif
                                                    @endforeach
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Pagination -->
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            Showing {{ $successfulLeads->firstItem() }} to {{ $successfulLeads->lastItem() }}
                                            of {{ $successfulLeads->total() }} entries
                                        </div>
                                        <nav>
                                            {{ $successfulLeads->appends(request()->query())->links() }}
                                        </nav>
                                    </div>
                                </form>
                            @else
                                <div class="text-center py-5">
                                    <i class="bi bi-check-circle display-1 text-success opacity-25"></i>
                                    <p class="text-muted mt-3">No successful leads found</p>
                                </div>
                            @endif
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{{ url('/') }}/assets/js/bootstrap.bundle.min.js"></script>
    <script src="{{ url('/') }}/assets/js/jquery.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Select All Checkbox
            document.getElementById('selectAll').addEventListener('change', function () {
                document.querySelectorAll('.vehicle-checkbox').forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });

            // Generate Credit Note for Selected
            document.getElementById('generateSelectedCreditNote').addEventListener('click', function () {
                const form = document.getElementById('creditNoteForm');
                const checked = document.querySelectorAll('.vehicle-checkbox:checked').length;

                if (checked === 0) {
                    alert('Please select at least one vehicle.');
                    return;
                }

                form.submit();
            });
        });
    </script>
</body>

</html>

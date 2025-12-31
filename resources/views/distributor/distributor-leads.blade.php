<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leads - Distributor Dashboard</title>
    <link rel="icon" href="{{ url('/') }}/assets/images/favicon-32x32.png" type="image/png">

    <!-- CSS Libraries -->
    <link href="{{ url('/') }}/assets/css/bootstrap.min.css" rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-blue: #f2f9ff;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
        }

        .card-title {
            color: var(--primary-blue);
            font-weight: 600;
        }

        .stat-card {
            background-color: var(--light-blue);
            border-radius: 8px;
            transition: transform 0.2s;
        }

        .badge-open {
            background-color: #ffc107;
            color: #212529;
        }

        .badge-converted {
            background-color: #28a745;
            color: white;
        }

        .badge-lost {
            background-color: #dc3545;
            color: white;
        }

        .badge-pending {
            background-color: #0dcaf0;
            color: white;
        }

        .badge-follow_up {
            background-color: #fd7e14;
            color: white;
        }

        .table th {
            background-color: var(--primary-blue);
            color: white;
            border: none;
        }

        .btn-xs {
            padding: 0.2rem 0.5rem;
            font-size: 0.75rem;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 50rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-0 text-primary">
                    <i class="bi bi-people me-2"></i> Leads Management
                </h4>
                <p class="text-muted mb-0">View and manage all leads under your distribution</p>
            </div>
            <a href="{{ route('distributor.dashboard') }}" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Back to Dashboard
            </a>
        </div>

        <!-- Stats Cards -->


        <!-- Filters -->


        <!-- Leads Table -->
        <div class="card">
            <div class="card-body">
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="bi bi-check-circle me-2"></i> {{ session('success') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i> {{ session('error') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                @endif

                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Lead ID</th>
                                <th>Customer</th>
                                <th>Executive</th>
                                <th>Dealer</th>
                                <th>Vehicle Details</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($leads as $lead)
                                <tr>
                                    <td>#{{ str_pad($lead->id, 6, '0', STR_PAD_LEFT) }}</td>
                                    <td>
                                        <div class="fw-medium">{{ $lead->customer_name ?? 'N/A' }}</div>
                                        <small class="text-muted">{{ $lead->phone_no ?? '' }}</small>
                                        <div class="text-muted small">{{ $lead->address ?? '' }}</div>
                                    </td>
                                    <td>
                                        @if($lead->executive)
                                            <div>{{ $lead->executive->name }}</div>
                                            <small class="text-muted">{{ $lead->executive->user_code ?? '' }}</small>
                                        @else
                                            <span class="text-muted">N/A</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if($lead->dealer)
                                            <div>{{ $lead->dealer->name }}</div>
                                            <small class="text-muted">{{ $lead->dealer->user_code ?? '' }}</small>
                                        @else
                                            <span class="text-muted">N/A</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if($lead->lead_details->count() > 0)
                                            @foreach($lead->lead_details as $detail)
                                                <div class="small">
                                                    <span class="fw-medium">{{ $detail->brand->name ?? 'N/A' }}</span> -
                                                    <span>{{ $detail->variant->name ?? 'N/A' }}</span>
                                                    @if($detail->color)
                                                        <span class="badge bg-light text-dark">{{ $detail->color->name }}</span>
                                                    @endif
                                                </div>
                                            @endforeach
                                        @else
                                            <span class="text-muted">No vehicle details</span>
                                        @endif
                                    </td>
                                    <td>
                                        @php
                                            $statusBadge = [
                                                'new' => 'badge bg-info',
                                                'open' => 'badge bg-warning text-dark',
                                                'pending' => 'badge bg-primary',
                                                'follow_up' => 'badge bg-info',
                                                'converted' => 'badge bg-success',
                                                'lost' => 'badge bg-danger'
                                            ][$lead->status] ?? 'badge bg-secondary';
                                        @endphp
                                        <span class="{{ $statusBadge }} status-badge">
                                            {{ ucfirst($lead->status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <div>{{ $lead->created_at->format('d M Y') }}</div>
                                        <small class="text-muted">{{ $lead->created_at->format('h:i A') }}</small>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2">
                                            <a href="{{ route('distributor.leads.show', $lead->id) }}"
                                                class="btn btn-primary btn-xs" title="View Details">
                                                <i class="bi bi-eye"></i>
                                            </a>

                                            @if($lead->status == 'converted' && !$lead->claim)
                                                <button type="button" class="btn btn-success btn-xs" data-bs-toggle="modal"
                                                    data-bs-target="#createClaimModal{{ $lead->id }}" title="Create Claim">
                                                    <i class="bi bi-cash-coin"></i>
                                                </button>
                                            @endif

                                            @if($lead->claim)
                                                <a href="{{ route('distributor.claims.show', $lead->claim->id) }}"
                                                    class="btn btn-info btn-xs" title="View Claim">
                                                    <i class="bi bi-receipt"></i>
                                                </a>
                                            @endif
                                        </div>

                                        <!-- Create Claim Modal -->
                                        @if($lead->status == 'converted' && !$lead->claim)
                                            <div class="modal fade" id="createClaimModal{{ $lead->id }}" tabindex="-1">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">Create Claim</h5>
                                                            <button type="button" class="btn-close"
                                                                data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <form action="{{ route('distributor.claims.create', $lead->id) }}"
                                                            method="POST">
                                                            @csrf
                                                            <div class="modal-body">
                                                                <div class="mb-3">
                                                                    <label class="form-label">Lead Information</label>
                                                                    <div class="bg-light p-3 rounded">
                                                                        <strong>{{ $lead->customer_name }}</strong><br>
                                                                        Phone: {{ $lead->phone_no }}<br>
                                                                        Dealer: {{ $lead->dealer->name ?? 'N/A' }}<br>
                                                                        Executive: {{ $lead->executive->name ?? 'N/A' }}
                                                                    </div>
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label class="form-label">Claim Amount ($)</label>
                                                                    <input type="number" name="claim_amount"
                                                                        class="form-control" required min="0" step="0.01"
                                                                        placeholder="Enter claim amount">
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label class="form-label">Notes (Optional)</label>
                                                                    <textarea name="notes" class="form-control" rows="3"
                                                                        placeholder="Add any notes about this claim..."></textarea>
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary"
                                                                    data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" class="btn btn-primary">Create
                                                                    Claim</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="8" class="text-center py-4">
                                        <div class="text-muted">
                                            <i class="bi bi-inbox fs-1"></i>
                                            <p class="mt-2">No leads found</p>
                                            @if(request()->hasAny(['status', 'type', 'search']))
                                                <a href="{{ route('distributor.leads') }}" class="btn btn-sm btn-primary mt-2">
                                                    Clear Filters
                                                </a>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                @if($leads->hasPages())
                    <div class="d-flex justify-content-center mt-4">
                        {{ $leads->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="{{ url('/') }}/assets/js/bootstrap.bundle.min.js"></script>

    <script>
        // Auto-close alerts after 5 seconds
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                var alerts = document.querySelectorAll('.alert');
                alerts.forEach(function (alert) {
                    var bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                });
            }, 5000);
        });

        // Confirm before creating claim
        function confirmCreateClaim(leadId) {
            if (confirm('Are you sure you want to create a claim for this lead?')) {
                document.getElementById('createClaimForm' + leadId).submit();
            }
        }
    </script>
</body>

</html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bajaj - Distributor Dashboard</title>
    <link rel="icon" href="{{ url('/') }}/assets/images/favicon-32x32.png" type="image/png">

    <!-- Bootstrap & Icons -->
    <link href="{{ url('/') }}/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Google Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-blue: #f2f9ff;
        }

        .distributor-dashboard {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
        }

        .stat-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chart-container {
            height: 300px;
            position: relative;
        }

        @media (min-width: 768px) {
            .chart-container {
                height: 350px;
            }
        }

        @media (min-width: 1200px) {
            .chart-container {
                height: 400px;
            }
        }

        .header-sales-info {
            color: rgb(114, 113, 113);
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
        }

        .logo-img {
            width: 3rem;
            height: 3rem;
            background-color: #0f66af;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.5rem;
        }

        .btn-xs {
            padding: 0.2rem 0.4rem;
            font-size: 0.75rem;
        }

        .payouts-table th {
            background-color: var(--primary-blue);
            color: white;
            cursor: pointer;
        }

        .payouts-table tbody tr:hover {
            background-color: #f3f4f6;
        }

        .dark-theme .distributor-dashboard {
            background-color: #1e1e2d;
            color: #e1e1e1;
        }

        .dark-theme .card {
            background-color: #2a2a3c;
            border-color: #323248;
        }

        /* Status badges */
        .badge-pending {
            background-color: #ffc107;
            color: #212529;
        }

        .badge-approved {
            background-color: #28a745;
            color: white;
        }

        .badge-disputed {
            background-color: #fd7e14;
            color: white;
        }

        .badge-rejected {
            background-color: #dc3545;
            color: white;
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

        /* Modal fixes */
        .modal-form-fix {
            margin: 0;
        }

        .modal-form-fix .modal-content {
            overflow: hidden;
        }
    </style>

    <style>
        /* Navbar structure */
        .topbar {
            background: linear-gradient(135deg, #0f66af 0%, #1a7bc9 100%);
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .topbar .navbar {
            width: 100%;
        }

        /* Logo on LEFT */
        .topbar-logo-header {
            flex: 0 0 auto;
        }

        .logo-img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }

        .brand-name {
            font-family: 'Montserrat', sans-serif;
        }

        /* Sales info in MIDDLE */
        .header-sales-info {
            flex: 0 1 auto;
            min-width: 300px;
            max-width: 500px;
        }

        .sales-item {
            color: rgba(255, 255, 255, 0.95);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .sales-item i {
            font-size: 1rem;
        }

        .sales-item strong {
            color: white;
            font-weight: 600;
            margin-left: 0.25rem;
        }

        /* User dropdown on RIGHT */
        .user-box {
            flex: 0 0 auto;
        }

        .user-avatar {
            background-color: rgba(255, 255, 255, 0.2) !important;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .user-avatar i {
            color: white !important;
        }

        /* Mobile menu toggle */
        .mobile-toggle-menu {
            font-size: 1.5rem;
            color: white;
            cursor: pointer;
            margin-left: auto;
        }

        /* Top menu icons */
        .top-menu .nav-link {
            color: rgba(255, 255, 255, 0.8);
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
        }

        .top-menu .nav-link:hover {
            color: white;
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Dropdown menu */
        .dropdown-menu {
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            min-width: 220px;
        }

        .dropdown-header {
            padding: 0.75rem 1rem;
        }

        /* Primary menu */
        .primary-menu {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid #e5e7eb;
        }

        .primary-menu .navbar-nav {
            padding-left: 1rem;
        }

        .primary-menu .nav-link {
            color: #1f2937;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .primary-menu .nav-link.active {
            color: var(--primary-blue);
            font-weight: 600;
            background-color: #f2f9ff;
        }

        .primary-menu .nav-link:hover {
            color: var(--primary-blue);
            background-color: #f8fafc;
        }

        /* Mobile offcanvas */
        .offcanvas-start {
            width: 280px;
        }

        .offcanvas-header {
            background-color: var(--primary-blue);
            color: white;
        }

        .offcanvas-body {
            padding: 0;
        }

        .user-info-mobile {
            background-color: #f8fafc;
        }

        .offcanvas-body .navbar-nav {
            width: 100%;
        }

        .offcanvas-body .nav-link {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f1f1f1;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .offcanvas-body .nav-link:hover {
            background-color: #f8fafc;
        }

        .offcanvas-body .nav-link.active {
            background-color: #f2f9ff;
            color: var(--primary-blue);
        }

        /* Responsive adjustments */
        @media (max-width: 991.98px) {
            .header-sales-info {
                display: none !important;
            }

            .user-info {
                display: none !important;
            }
        }

        @media (max-width: 767.98px) {
            .topbar .navbar {
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }

            .topbar-logo-header .brand-name {
                display: none !important;
            }
        }

        /* Dark mode */
        .dark-theme .primary-menu {
            background-color: #2a2a3c;
            border-color: #323248;
        }

        .dark-theme .primary-menu .nav-link {
            color: #e1e1e1;
        }

        .dark-theme .offcanvas-body .nav-link:hover {
            background-color: #323248;
        }

        .dark-theme .user-info-mobile {
            background-color: #323248;
            border-color: #3a3a4c;
        }
    </style>
</head>

<body class="distributor-dashboard">
    <div class="wrapper">
        <div class="header-wrapper">
            <header>
                <div class="topbar d-flex align-items-center">
                    <nav class="navbar navbar-expand gap-3 px-3">
                        <!-- Logo on LEFT corner -->
                        <div class="topbar-logo-header">
                            <div class="d-flex align-items-center gap-2">
                                {{-- <img src="{{ asset('assets/images/logo/bajaj-icon1.svg') }}" alt="Bajaj Logo"
                                    class="logo-img"> --}}

                                <span class="d-none d-md-inline brand-name"
                                    style="color: rgb(255, 255, 255); font-weight: 600; font-size: 1.1rem;">
                                    Bajaj
                                </span>
                            </div>
                        </div>


                        <!-- Mobile menu toggle -->
                        <div class="mobile-toggle-menu d-block d-lg-none ms-auto" data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar">
                            <i class='bx bx-menu'></i>
                        </div>

                        <!-- Sales info in MIDDLE - Hidden on mobile -->
                        <div class="header-sales-info mx-auto d-none d-md-block">
                            <div class="d-flex align-items-center gap-3">
                                <div class="sales-item">
                                    <i class='bx bx-stats me-1'></i>
                                    <span>This Month:</span>
                                    <strong>${{ number_format($currentMonthSales * 1000 ?? 120000) }}</strong>
                                </div>
                                <div class="vr" style="height: 20px; opacity: 0.3;"></div>
                                <div class="sales-item">
                                    <i class='bx bx-chart me-1'></i>
                                    <span>Last Month:</span>
                                    <strong>${{ number_format($lastMonthSales * 1000 ?? 110000) }}</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Top menu items -->
                        <div class="top-menu m  s-auto d-none d-lg-flex">
                            <ul class="navbar-nav align-items-center gap-2">
                                <li class="nav-item dark-mode">
                                    <a class="nav-link dark-mode-icon" href="javascript:;" title="Toggle Dark Mode">
                                        <i class='bx bx-moon'></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="javascript:;" title="Notifications">
                                        <i class='bx bx-bell'></i>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- User dropdown on RIGHT corner -->
                        <div class="user-box dropdown ms-lg-3">
                            <a class="d-flex align-items-center nav-link dropdown-toggle gap-2 dropdown-toggle-nocaret"
                                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div class="user-avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center"
                                    style="width: 36px; height: 36px;">
                                    <i class="bx bx-user"></i>
                                </div>
                                <div class="user-info d-none d-lg-block text-end">
                                    <p class="user-name mb-0" style="color: white; font-weight: 500;">
                                        {{ auth()->user()->name }}
                                    </p>
                                    <p class="designation mb-0"
                                        style="color: rgba(255, 255, 255, 0.8); font-size: 0.8rem;">Distributor</p>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow">
                                <li>
                                    <div class="dropdown-header">
                                        <p class="mb-0 fw-bold">{{ auth()->user()->name }}</p>
                                        <small class="text-muted">Distributor Account</small>
                                    </div>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="#">
                                        <i class="bx bx-user fs-5 me-2"></i>
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <i class="bx bx-cog fs-5 me-2"></i>
                                        <span>Account Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}">
                                        <i class="bx bx-log-out-circle me-2"></i>
                                        <span>Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>

            <!-- Primary navigation menu -->
            <div class="primary-menu">
                <nav class="navbar navbar-expand-lg align-items-center">
                    <!-- Offcanvas mobile menu -->
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header border-bottom">
                            <div class="topbar-logo-header">
                                <div class="d-flex align-items-center gap-2">
                                    {{-- <img src="{{ asset('assets/images/logo/bajaj-icon1.svg') }}" alt="Bajaj Logo"
                                        class="logo-img"> --}}

                                    <span class="d-none d-md-inline brand-name"
                                        style="color: rgb(255, 255, 255); font-weight: 600; font-size: 1.1rem;">
                                        Bajaj
                                    </span>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">


                            <ul class="navbar-nav align-items-center flex-grow-1 mt-3">
                                <li class="nav-item">
                                    <a class="nav-link active" href="{{ route('distributor.dashboard') }}">
                                        <div class="parent-icon"><i class='bx bx-home-alt'></i></div>
                                        <div class="menu-title">Dashboard</div>
                                    </a>
                                </li>


                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Flash Messages -->
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show m-3" role="alert">
                    <i class="bi bi-check-circle me-2"></i> {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif
            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show m-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i> {{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            <div class="page-wrapper">
                <div class="page-content container-animate">
                    <!-- Leads Section -->
                    <section class="p-3 pt-5">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title text-primary mb-3">Leads</h5>


                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <a href="{{ route('distributor.leads') }}?type=open"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-hourglass-split text-warning me-1"></i> Open
                                                    </h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-primary mb-0">{{ $openLeads }}</h3>
                                                        <span class="badge bg-primary rounded-pill">+{{ $todayOpen }}
                                                            today</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-4">
                                        <a href="{{ route('distributor.successful-leads') }}?verification=converted"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-emoji-smile text-success me-1"></i> Converted
                                                        (Successful Claims)</h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-primary mb-0">{{ $claimsSuccessful }}</h3>
                                                        <span
                                                            class="badge bg-success rounded-pill">+{{ $todayConverted ?? 0 }}
                                                            today</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-4">
                                        <a href="{{ route('distributor.leads') }}?type=unrealized"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-emoji-frown text-danger me-1"></i> Unrealized
                                                    </h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-primary mb-0">{{ $unrealizedLeads }}</h3>
                                                        <span
                                                            class="badge bg-secondary rounded-pill">+{{ $todayUnrealized }}
                                                            today</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Lead Verification (Claims) -->
                    <section class="p-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title text-primary mb-0">Lead Verification Claim(s)</h5>
                                    <a href="{{ route('distributor.leads') }}?status=converted"
                                        class="text-primary text-decoration-none">View All Converted Leads</a>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <a href="{{ route('distributor.leads') }}?verification=pending"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #fff4e5;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2">
                                                        <i class="bi bi-hourglass-split text-warning me-1"></i> Total
                                                        Claims (Pending Verification)
                                                    </h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-warning mb-0">{{ $claimsPending }}</h3>
                                                        <span
                                                            class="badge bg-warning text-dark rounded-pill">Pending</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <a href="{{ route('distributor.successful-leads') }}?verification=successful"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #d4edda;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-check-circle text-success me-1"></i> Successful
                                                        Claims</h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-success mb-0">{{ $claimsSuccessful }}</h3>
                                                        <span class="badge bg-success rounded-pill">Verified</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <a href="{{ route('distributor.leads') }}?verification=disputed"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #ffeaa7;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-exclamation-triangle text-warning me-1"></i>
                                                        Disputed Claims</h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-warning mb-0">{{ $claimsDisputed }}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <a href="{{ route('distributor.leads') }}?verification=rejected"
                                            class="text-decoration-none">
                                            <div class="card stat-card border-0" style="background-color: #f8d7da;">
                                                <div class="card-body">
                                                    <h6 class="text-muted small mb-2"><i
                                                            class="bi bi-x-circle text-danger me-1"></i> Rejected Claims
                                                    </h6>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <h3 class="text-danger mb-0">{{ $claimsRejected }}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>




                    <!-- Recent Converted Leads (Pending Verification) -->
                    <section class="p-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title text-primary mb-0">Pending Claim(s) </h5>
                                    <a href="{{ route('distributor.pending-verification-leads') }}?status=converted&verification=pending"
                                        class="text-primary text-decoration-none">View All</a>
                                </div>

                                @if($pendingVerificationLeads->count() > 0)
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
                                                @foreach($pendingVerificationLeads as $lead)
                                                    @php
                                                        // Get the first pending detail to show in table (you can change logic if needed)
                                                        $firstPendingDetail = $lead->lead_details
                                                            ->where('status', 'converted')
                                                            ->where('verification_status', 'pending')
                                                            ->first();
                                                    @endphp

                                                    @if($firstPendingDetail)
                                                        <tr>
                                                            <td>{{ $firstPendingDetail->lead_no ?? 'N/A' }}</td>
                                                            <td>
                                                                <strong>{{ $lead->customer_name }}</strong><br>
                                                                <small class="text-muted">{{ $lead->phone_no }}</small>
                                                            </td>
                                                            <td>{{ $lead->lead_details->count() }}</td>
                                                            <td>{{ $lead->updated_at->format('d M Y') }}</td>
                                                            <td>
                                                                <button type="button" class="btn btn-primary btn-xs"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#leadDetailsModal{{ $lead->id }}">
                                                                    View Details
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    @endif
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Modals for each lead -->
                                    @foreach($pendingVerificationLeads as $lead)
                                        <div class="modal fade" id="leadDetailsModal{{ $lead->id }}" tabindex="-1"
                                            aria-labelledby="leadDetailsModalLabel{{ $lead->id }}" aria-hidden="true">
                                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                                <div class="modal-content">
                                                    <div class="modal-header bg-primary text-white">
                                                        <h5 class="modal-title" id="leadDetailsModalLabel{{ $lead->id }}">
                                                            Lead Details ({{ $lead->customer_name }})
                                                        </h5>
                                                        <button type="button" class="btn-close btn-close-white"
                                                            data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <!-- Customer Info -->
                                                        <div class="card mb-4 border-0 shadow-sm">
                                                            <div class="card-body bg-light">
                                                                <h6 class="mb-3 text-primary">Customer Details</h6>
                                                                <div class="row">
                                                                    <div class="col-md-6 mb-2"><strong>Name:</strong>
                                                                        {{ $lead->customer_name }}</div>
                                                                    <div class="col-md-6 mb-2"><strong>Phone:</strong>
                                                                        {{ $lead->phone_no }}</div>
                                                                    <div class="col-md-6 mb-2"><strong>Executive:</strong>
                                                                        {{ $lead->executive->name ?? 'N/A' }}</div>
                                                                    <div class="col-md-6 mb-2"><strong>Dealer:</strong>
                                                                        {{ $lead->dealer->name ?? 'N/A' }}</div>
                                                                    <div class="col-md-12"><strong>Converted Date:</strong>
                                                                        {{ $lead->updated_at->format('d M Y, h:i A') }}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Vehicle Details Table -->
                                                        <h6 class="mb-3 text-primary">Vehicle Details (Pending Verification)
                                                        </h6>
                                                        @if($lead->lead_details->where('verification_status', 'pending')->count() > 0)
                                                            <div class="table-responsive">
                                                                <table class="table table-bordered table-hover">
                                                                    <thead class="table-primary">
                                                                        <tr>
                                                                            <th>Id</th>
                                                                            <th>Lead No</th>
                                                                            <th>Brand</th>
                                                                            <th>Variant</th>
                                                                            <th>Total Price</th>
                                                                            <th>Invoice No</th>
                                                                            <th>Invoice File</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        @foreach($lead->lead_details->where('verification_status', 'pending') as $index => $detail)
                                                                            <tr>
                                                                                <td>{{ $index + 1 }}</td>
                                                                                <td><strong>{{ $detail->lead_no ?? 'N/A' }}</strong>
                                                                                </td>
                                                                                <td>{{ $detail->brand->name ?? 'N/A' }}</td>
                                                                                <td>{{ $detail->variant->name ?? 'N/A' }}</td>
                                                                                <td class="fw-bold">
                                                                                    ${{ number_format($detail->total_price ?? 0, 2) }}
                                                                                </td>
                                                                                <td>{{ $detail->invoice_no ?? 'N/A' }}</td>
                                                                                <td>
                                                                                    @if($detail->uploaded_invoice)
                                                                                        <a href="{{ Storage::url($detail->uploaded_invoice) }}"
                                                                                            target="_blank" class="text-primary">
                                                                                            <i class="bi bi-file-earmark-pdf me-1"></i> View
                                                                                        </a>
                                                                                    @else
                                                                                        <span class="text-muted">No File</span>
                                                                                    @endif
                                                                                </td>

                                                                                <td>
                                                                                    @if($detail->verification_status === 'pending')
                                                                                        <button type="button"
                                                                                            class="btn btn-success btn-sm verify-vehicle-btn"
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#verifyModal{{ $detail->id }}">
                                                                                            <i class="bi bi-check-circle me-1"></i> Verify
                                                                                        </button>
                                                                                    @else
                                                                                        <span class="badge bg-info">Verified</span>
                                                                                    @endif
                                                                                </td>
                                                                            </tr>
                                                                        @endforeach
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        @else
                                                            <div class="alert alert-info">No pending vehicles found.</div>
                                                        @endif
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary"
                                                            data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Per-Vehicle Verification Modals -->
                                        @foreach($lead->lead_details->where('verification_status', 'pending') as $detail)
                                            <div class="modal fade" id="verifyModal{{ $detail->id }}" tabindex="-1"
                                                aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <div class="modal-header bg-success text-white">
                                                            <h5 class="modal-title">Verify Vehicle 
                                                                ({{ $detail->lead_no }})</h5>
                                                            <button type="button" class="btn-close btn-close-white"
                                                                data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <form id="verifyForm{{ $detail->id }}"
                                                            action="{{ route('distributor.leads.verify', ['leadId' => $lead->id, 'detailId' => $detail->id]) }}"
                                                            method="POST" class="verify-form">
                                                            @csrf
                                                            <div class="modal-body">
                                                                <!-- Vehicle Info -->
                                                                <div class="alert alert-light mb-4">
                                                                    <strong>Vehicle:</strong> {{ $detail->brand->name ?? 'N/A' }} -
                                                                    {{ $detail->variant->name ?? 'N/A' }}<br>
                                                                    <strong>Lead No:</strong> {{ $detail->lead_no ?? 'N/A' }}<br>
                                                                    <strong>Total Qty:</strong>
                                                                    ${{ $detail->vehicle_qty }}<br>
                                                                    <strong>Total Price:</strong>
                                                                    ${{ number_format($detail->total_price ?? 0, 2) }}
                                                                </div>
                                                                <!-- Invoice Details -->
                                                                <div class="mb-4">
                                                                    <label class="form-label fw-bold">Invoice Number</label>
                                                                    <input type="text" class="form-control"
                                                                        value="{{ $detail->invoice_no ?? 'N/A' }}" readonly>
                                                                </div>
                                                                <div class="mb-4">
                                                                    <label class="form-label fw-bold">Uploaded Invoice</label>
                                                                    @if($detail->uploaded_invoice)
                                                                        <a href="{{ Storage::url($detail->uploaded_invoice) }}"
                                                                            target="_blank" class="btn btn-sm btn-outline-primary">
                                                                            <i class="bi bi-file-earmark-pdf me-1"></i> View Invoice
                                                                        </a>
                                                                    @else
                                                                        <p class="text-danger">No invoice uploaded</p>
                                                                    @endif
                                                                </div>
                                                                <!-- Decision -->
                                                                <div class="mb-4">
                                                                    <label class="form-label fw-bold">Decision *</label>
                                                                    <select name="verification_status"
                                                                        class="form-select verification-status" required>
                                                                        <option value="" disabled selected>Select Decision</option>
                                                                        <option value="successful">Successful (Invoice OK)</option>
                                                                        <option value="disputed">Disputed (Issue in Invoice)
                                                                        </option>
                                                                        <option value="rejected">Rejected</option>
                                                                    </select>
                                                                </div>
                                                                <!-- Reason -->
                                                                <div class="mb-3 reason-group" style="display:none;">
                                                                    <label class="form-label fw-bold">Reason *</label>
                                                                    <textarea name="verification_note" class="form-control" rows="3"
                                                                        placeholder="Describe the issue with invoice..."
                                                                        required></textarea>
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary"
                                                                    data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" class="btn btn-primary">Submit
                                                                    Verification</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    @endforeach
                                @else
                                    <div class="text-center py-5">
                                        <i class="bi bi-check-circle display-1 text-success opacity-25"></i>
                                        <p class="text-muted mt-3">No converted leads pending verification</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </section>

                    <!-- Incentive Section -->
                    <section class="p-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title text-primary mb-3">Incentive</h5>
                                <div class="row g-3">
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                            <div class="card-body">
                                                <h6 class="text-muted small mb-2"><i
                                                        class="bi bi-file-earmark-text text-primary me-1"></i> Credit
                                                    Note
                                                    Generated</h6>
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h3 class="text-primary mb-0">{{ $creditNotes }}</h3>
                                                    <span class="badge bg-light text-dark rounded-pill">+0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-lg-4 col-xl-3">
                                        <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                            <div class="card-body">
                                                <h6 class="text-muted small mb-2"><i
                                                        class="bi bi-wallet2 text-success me-1"></i> Incentive Paid</h6>
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h3 class="text-primary mb-0">
                                                        ${{ number_format($incentivePaid, 2) }}
                                                    </h3>
                                                    <span class="badge bg-success rounded-pill">+0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Charts Section -->
                    <section class="p-3">
                        <div class="row g-3">
                            <div class="col-lg-6">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <h5 class="card-title text-primary mb-0">Lead Distribution by Type</h5>
                                            <select id="timeRange" class="form-select form-select-sm w-auto">
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="3months">3 Months</option>
                                                <option value="6months">6 Months</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                        <div class="chart-container">
                                            <canvas id="salesChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title text-primary mb-3">Dealer Wise Sales</h5>
                                        <div class="chart-container">
                                            <canvas id="dealerSalesChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Debug Button -->
                    <div class="text-end mb-2">
                        <button class="btn btn-sm btn-outline-info" onclick="debugPayouts()">
                            <i class="bi bi-bug"></i> Debug Payouts
                        </button>
                    </div>

                    <script>
                        function debugPayouts() {
                            // Get all executive IDs from the table
                            const rows = document.querySelectorAll('.payouts-table tbody tr');
                            const executives = [];

                            rows.forEach(row => {
                                const cells = row.querySelectorAll('td');
                                if (cells.length >= 7) {
                                    const name = cells[0].textContent.split('\n')[0].trim();
                                    const idMatch = cells[0].querySelector('small')?.textContent.match(/ID:\s*(\d+)/);
                                    const id = idMatch ? idMatch[1] : 'N/A';
                                    const balance = cells[5].textContent.trim();

                                    executives.push({ id, name, balance });
                                }
                            });

                            console.log('Current Payouts Table:', executives);
                            alert(`Found ${executives.length} executives in payouts table.\nCheck console for details.`);

                            // Test each pay link
                            executives.forEach(exec => {
                                if (exec.id !== 'N/A') {
                                    console.log(`Pay link for ${exec.name} (ID: ${exec.id}):`,
                                        `{{ route('distributor.pay-details', 'EXEC_ID') }}`.replace('EXEC_ID', exec.id));
                                }
                            });
                        }
                    </script>

                    <!-- Payouts Section in distributor-dashboard.blade.php -->
                    <section class="p-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title text-primary mb-0">Payouts</h5>
                                    <a href="{{ route('distributor.payouts') }}"
                                        class="text-primary text-decoration-none">View All</a>
                                </div>

                                <!-- Total Payouts Summary -->
                                <div class="card mb-4 border-0 shadow-sm" style="background-color: #f2f9ff;">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-md-6">
                                                <h6 class="text-muted small mb-1">Total Balance Due</h6>
                                                <h3 class="text-primary mb-0">
                                                    ${{ number_format($totalPayoutValue ?? 0, 2) }}</h3>
                                            </div>
                                            <div class="col-md-6 text-end">
                                                <small class="text-muted">Updated: {{ now()->format('d M Y') }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Payouts Table -->
                                <div class="table-responsive">
                                    <table class="table table-hover payouts-table">
                                        <thead>
                                            <tr>
                                                <th class="bg-primary text-white cursor-pointer" onclick="sortTable(0)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-person-fill me-1"></i> Executive</div>
                                                </th>
                                                <th class="bg-primary text-white cursor-pointer"
                                                    onclick="sortTable(1, true)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-list-check me-1"></i> Total Leads</div>
                                                </th>
                                                <th class="bg-primary text-white cursor-pointer"
                                                    onclick="sortTable(2, true)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-check-circle-fill me-1"></i> Vehicle Sales
                                                    </div>
                                                </th>
                                                <th class="bg-primary text-white cursor-pointer"
                                                    onclick="sortTable(3, true)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-cash-stack me-1"></i> Claim Amount</div>
                                                </th>
                                                <th class="bg-primary text-white cursor-pointer"
                                                    onclick="sortTable(4, true)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-wallet2 me-1"></i> Paid Amount</div>
                                                </th>
                                                <th class="bg-primary text-white cursor-pointer"
                                                    onclick="sortTable(5, true)">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-cash-coin me-1"></i> Balance Amount</div>
                                                </th>
                                                <th class="bg-primary text-white">
                                                    <div class="d-flex align-items-center"><i
                                                            class="bi bi-currency-dollar me-1"></i> Pay</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @forelse($payouts as $payout)
                                                <tr>
                                                    <td>{{ $payout->executive_name }}</td>
                                                    <td>{{ $payout->total_leads }}</td>
                                                    <td><span class="badge bg-success">{{ $payout->vehicle_sales }}</span>
                                                    </td>
                                                    <td>${{ number_format($payout->claim_amount, 2) }}</td>
                                                    <td>${{ number_format($payout->paid_amount, 2) }}</td>
                                                    <td>${{ number_format($payout->balance_amount, 2) }}</td>
                                                    <td>
                                                        <a href="{{ route('distributor.pay-details', $payout->executive_id) }}"
                                                            class="btn btn-primary btn-xs">
                                                            <i class="bi bi-currency-dollar"></i> Pay
                                                        </a>
                                                    </td>
                                                </tr>
                                            @empty
                                                <tr>
                                                    <td colspan="7" class="text-center py-4">
                                                        <div class="text-muted">
                                                            <i class="bi bi-cash-coin fs-1"></i>
                                                            <p class="mt-2">No payout data available</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            @endforelse
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- PayOuts Stats Card (Top pe) -->
                    {{-- <div class="col-md-3">
                        <a href="{{ route('distributor.payouts') }}" class="text-decoration-none">
                            <div class="card stat-card border-0" style="background-color: #f2f9ff;">
                                <div class="card-body">
                                    <h6 class="text-muted small mb-2">
                                        <i class="bi bi-wallet2 text-success me-1"></i> PayOuts
                                    </h6>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h3 class="text-primary mb-0">${{ number_format($totalPayoutValue ?? 0, 2) }}
                                        </h3>
                                        <span class="badge bg-success rounded-pill">View</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div> --}}

                    <!-- Recent Leads -->
                    <section class="p-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title text-primary mb-0">Recent Leads</h5>
                                    <a href="{{ route('distributor.leads') }}"
                                        class="text-primary text-decoration-none">View All</a>
                                </div>
                                <div class="row g-3">
                                    @forelse($recentLeads as $lead)
                                        <div class="col-md-6 col-lg-4">
                                            <div class="card border-0" style="background-color: #f2f9ff;">
                                                <div class="card-body">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 class="mb-1">{{ $lead->customer_name }}</h6>
                                                            <p class="text-muted small mb-1">
                                                                {{ $lead->additional_note ?? 'Interested in vehicle' }}
                                                            </p>
                                                        </div>
                                                        @php
                                                            $statusClass = [
                                                                'new' => 'badge bg-info',
                                                                'open' => 'badge bg-warning text-dark',
                                                                'pending' => 'badge bg-primary',
                                                                'converted' => 'badge bg-success',
                                                                'lost' => 'badge bg-danger'
                                                            ][$lead->status] ?? 'badge bg-secondary';
                                                        @endphp
                                                        <span class="{{ $statusClass }}">{{ ucfirst($lead->status) }}</span>
                                                    </div>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <small
                                                            class="text-muted">{{ $lead->created_at->diffForHumans() }}</small>
                                                        <div class="d-flex gap-2">
                                                            <a href="{{ route('distributor.leads.show', $lead->id) }}"
                                                                class="btn btn-sm btn-outline-primary">
                                                                <i class="bi bi-eye"></i> View
                                                            </a>
                                                            @if($lead->status == 'converted' && !$lead->claim)
                                                                <button class="btn btn-sm btn-outline-success"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#createClaimModal{{ $lead->id }}">
                                                                    <i class="bi bi-cash-coin"></i> Claim
                                                                </button>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            @if($lead->status == 'converted' && !$lead->claim)
                                                <!-- Create Claim Modal -->
                                                <div class="modal fade" id="createClaimModal{{ $lead->id }}" tabindex="-1">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title">Create Claim for Lead</h5>
                                                                <button type="button" class="btn-close"
                                                                    data-bs-dismiss="modal"></button>
                                                            </div>
                                                            <form action="{{ route('distributor.claims.create', $lead->id) }}"
                                                                method="POST">
                                                                @csrf
                                                                <div class="modal-body">
                                                                    <div class="alert alert-info">
                                                                        <strong>Lead Details:</strong><br>
                                                                        Customer: {{ $lead->customer_name }}<br>
                                                                        Executive: {{ $lead->executive->name ?? 'N/A' }}<br>
                                                                        Converted on: {{ $lead->updated_at->format('d M Y') }}
                                                                    </div>
                                                                    <div class="mb-3">
                                                                        <label class="form-label">Claim Amount ($) *</label>
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
                                        </div>
                                    @empty
                                        <div class="col-12">
                                            <div class="text-center py-4">
                                                <p class="text-muted">No recent leads</p>
                                            </div>
                                        </div>
                                    @endforelse
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer class="page-footer">
                <p class="mb-0">Copyright © {{ date('Y') }}. All rights reserved.</p>
            </footer>
        </div>

        <!-- Scripts -->
        <script src="{{ url('/') }}/assets/js/bootstrap.bundle.min.js"></script>
        <script src="{{ url('/') }}/assets/js/jquery.min.js"></script>

        <script>
            // MAIN VERIFICATION SCRIPT - SIMPLIFIED AND WORKING
            console.log('=== DASHBOARD SCRIPT LOADED ===');

            document.addEventListener('DOMContentLoaded', function () {
                console.log('DOM loaded - initializing verification system');

                // Debug: Check all forms
                const allForms = document.querySelectorAll('form.verify-form');
                console.log(`Found ${allForms.length} verify-form elements`);

                allForms.forEach((form, i) => {
                    console.log(`Form ${i}:`, {
                        id: form.id,
                        action: form.action,
                        children: form.children.length,
                        hasSubmitBtn: !!form.querySelector('button[type="submit"]')
                    });
                });

                // Handle form submissions
                document.addEventListener('submit', function (e) {
                    if (!e.target.classList.contains('verify-form')) return;

                    e.preventDefault();
                    console.log('Form submission detected:', e.target.id);

                    const form = e.target;
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const modal = form.closest('.modal');

                    // Validate form
                    if (!submitBtn) {
                        console.error('Submit button not found in form');
                        alert('Form configuration error: Submit button not found. Please contact support.');
                        return;
                    }

                    if (form.children.length === 0) {
                        console.error('Form has no content');
                        alert('Form not loaded properly. Please refresh the page.');
                        return;
                    }

                    // Show loading state
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';

                    // Prepare form data
                    const formData = new FormData(form);

                    // Log data for debugging
                    console.log('Submitting data for:', form.action);
                    for (let [key, value] of formData.entries()) {
                        console.log(`  ${key}: ${value}`);
                    }

                    // Submit via AJAX
                    fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                        .then(response => {
                            console.log('Response status:', response.status);

                            if (!response.ok) {
                                return response.json().then(err => {
                                    throw new Error(err.message || `Server error: ${response.status}`);
                                });
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Response data:', data);

                            if (data.success) {
                                // Hide modal
                                if (modal) {
                                    const modalInstance = bootstrap.Modal.getInstance(modal);
                                    if (modalInstance) {
                                        modalInstance.hide();
                                    }
                                }

                                // Show success message
                                showAlert('✓ Verification submitted successfully!', 'success');

                                // Reload after delay
                                setTimeout(() => {
                                    location.reload();
                                }, 1500);
                            } else {
                                showAlert('✗ Error: ' + (data.error || 'Verification failed'), 'error');
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = originalText;
                            }
                        })
                        .catch(error => {
                            console.error('Request failed:', error);
                            showAlert('✗ Error: ' + error.message, 'error');
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        });
                });

                // Handle verification status change (show/hide reason field)
                document.addEventListener('change', function (e) {
                    if (e.target.name === 'verification_status') {
                        const form = e.target.closest('form');
                        if (!form) return;

                        const reasonGroup = form.querySelector('.reason-group');
                        if (!reasonGroup) return;

                        if (e.target.value === 'disputed' || e.target.value === 'rejected') {
                            reasonGroup.style.display = 'block';
                            const textarea = reasonGroup.querySelector('textarea');
                            if (textarea) textarea.required = true;
                        } else {
                            reasonGroup.style.display = 'none';
                            const textarea = reasonGroup.querySelector('textarea');
                            if (textarea) {
                                textarea.required = false;
                                textarea.value = '';
                            }
                        }
                    }
                });

                // Initialize modals when opened
                document.addEventListener('shown.bs.modal', function (e) {
                    const modal = e.target;
                    const form = modal.querySelector('.verify-form');

                    if (form) {
                        console.log('Modal opened, form found:', form.id);

                        // Initialize select field
                        const select = form.querySelector('select[name="verification_status"]');
                        if (select) {
                            setTimeout(() => {
                                select.dispatchEvent(new Event('change'));
                            }, 100);
                        }
                    }
                });
            });

            // Alert function
            function showAlert(message, type = 'info') {
                const alertClass = type === 'success' ? 'alert-success' :
                    type === 'error' ? 'alert-danger' : 'alert-info';

                const alertDiv = document.createElement('div');
                alertDiv.className = `alert ${alertClass} alert-dismissible fade show m-3`;
                alertDiv.innerHTML = `
                <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    pageContent.insertBefore(alertDiv, pageContent.firstChild);
                }

                setTimeout(() => {
                    if (alertDiv.parentNode) {
                        const bsAlert = new bootstrap.Alert(alertDiv);
                        bsAlert.close();
                    }
                }, 5000);
            }

            // Fix for PerfectScrollbar errors
            if (typeof PerfectScrollbar !== 'undefined') {
                const OriginalPerfectScrollbar = PerfectScrollbar;
                window.PerfectScrollbar = function (element, options) {
                    if (!element) {
                        console.warn('PerfectScrollbar: No element specified');
                        return {
                            update: function () { },
                            destroy: function () { }
                        };
                    }
                    try {
                        return new OriginalPerfectScrollbar(element, options);
                    } catch (error) {
                        console.warn('PerfectScrollbar initialization error:', error.message);
                        return {
                            update: function () { },
                            destroy: function () { }
                        };
                    }
                };
                window.PerfectScrollbar.prototype = OriginalPerfectScrollbar.prototype;
            }

            // Fix missing logo
            window.addEventListener('load', function () {
                const logos = document.querySelectorAll('img[src*="logo"]');
                logos.forEach(img => {
                    img.onerror = function () {
                        this.style.display = 'none';
                        const div = document.createElement('div');
                        div.className = 'logo-img';
                        div.innerHTML = 'B';
                        this.parentNode.insertBefore(div, this);
                    };
                });
            });

            // Table sorting function
            function sortTable(columnIndex, isNumeric = false) {
                const table = document.querySelector('.payouts-table');
                if (!table) return;

                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const th = table.querySelectorAll('th')[columnIndex];
                const isAscending = !th.classList.contains('asc');

                rows.sort((a, b) => {
                    let aVal = a.cells[columnIndex].textContent.trim();
                    let bVal = b.cells[columnIndex].textContent.trim();

                    if (isNumeric) {
                        aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, '')) || 0;
                        bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, '')) || 0;
                        return isAscending ? aVal - bVal : bVal - aVal;
                    } else {
                        return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                    }
                });

                rows.forEach(row => tbody.appendChild(row));
                table.querySelectorAll('th').forEach(th => th.classList.remove('asc', 'desc'));
                th.classList.toggle('asc', isAscending);
                th.classList.toggle('desc', !isAscending);
            }

            // Navigate to pay details
            function navigateToPayDetails(dealerName, amount) {
                if (confirm(`Initiate payment of ${amount} to ${dealerName}?`)) {
                    showAlert(`Payment initiated for ${dealerName} - ${amount}`, 'success');
                }
            }

            // Initialize charts
            function initializeCharts() {
                const salesChart = document.getElementById('salesChart');
                const dealerSalesChart = document.getElementById('dealerSalesChart');

                if (salesChart) {
                    const ctx = salesChart.getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [{
                                label: 'Total Leads',
                                data: [12, 19, 8, 15, 12, 10, 5],
                                backgroundColor: '#3b82f6'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }

                if (dealerSalesChart) {
                    const ctx = dealerSalesChart.getContext('2d');
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Dealer A', 'Dealer B', 'Dealer C'],
                            datasets: [{
                                data: [300, 200, 150],
                                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
            }

            // Initialize charts on load
            document.addEventListener('DOMContentLoaded', initializeCharts);
        </script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const darkModeToggle = document.querySelector('.dark-mode-icon');
                if (darkModeToggle) {
                    darkModeToggle.addEventListener('click', function () {
                        document.body.classList.toggle('dark-theme');

                        // Save preference to localStorage
                        const isDarkMode = document.body.classList.contains('dark-theme');
                        localStorage.setItem('darkMode', isDarkMode);

                        // Update icon
                        const icon = this.querySelector('i');
                        if (isDarkMode) {
                            icon.className = 'bx bx-sun';
                            icon.style.color = '#ffd700';
                        } else {
                            icon.className = 'bx bx-moon';
                            icon.style.color = '';
                        }
                    });

                    // Load saved preference
                    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
                    if (savedDarkMode) {
                        document.body.classList.add('dark-theme');
                        const icon = darkModeToggle.querySelector('i');
                        icon.className = 'bx bx-sun';
                        icon.style.color = '#ffd700';
                    }
                }

                // Make current page active in menu
                const currentPath = window.location.pathname;
                const navLinks = document.querySelectorAll('.primary-menu .nav-link, .offcanvas-body .nav-link');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update sales info dynamically if needed
                function updateSalesInfo() {
                    // You can add AJAX calls here to update sales data dynamically
                    console.log('Sales info would be updated here');
                }

                // Initialize
                updateSalesInfo();
            });
        </script>
        <script>
            function debugPayouts() {
                // Get all executive IDs from the table
                const rows = document.querySelectorAll('.payouts-table tbody tr');
                const users = [];

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 7) {
                        const name = cells[0].querySelector('strong')?.textContent.trim() || 'Unknown';
                        const idMatch = cells[0].querySelector('small')?.textContent.match(/ID:\s*(\d+)/);
                        const id = idMatch ? idMatch[1] : 'N/A';
                        const role = cells[1].textContent.includes('Executive') ? 'Executive' : 'Dealer';
                        const balance = cells[5].textContent.trim();

                        users.push({ id, name, role, balance });
                    }
                });

                console.log('Current Users in Payouts Table:', users);

                // Show alert with details
                const executiveCount = users.filter(u => u.role === 'Executive').length;
                const dealerCount = users.filter(u => u.role === 'Dealer').length;

                alert(`Found ${users.length} users:\n` +
                    `- ${executiveCount} Executive(s)\n` +
                    `- ${dealerCount} Dealer(s)\n\n` +
                    `Check browser console for details.`);

                // Test pay links for executives only
                users.filter(u => u.role === 'Executive' && u.id !== 'N/A').forEach(exec => {
                    console.log(`Pay link for ${exec.name} (ID: ${exec.id}):`,
                        `{{ route('distributor.pay-details', 'EXEC_ID') }}`.replace('EXEC_ID', exec.id));
                });
            }

            // Add this to your dashboard script
            document.addEventListener('DOMContentLoaded', function () {
                console.log('=== PAYOUTS DEBUG ===');

                // Check if payouts data exists
                const payouts = @json($payouts ?? []);
                console.log('Payouts data:', payouts);

                // Check each executive
                payouts.forEach((payout, index) => {
                    console.log(`Payout ${index + 1}:`, {
                        id: payout.executive_id,
                        name: payout.executive_name,
                        role: payout.executive_role,
                        isExecutive: payout.executive_role == 2,
                        balance: payout.balance_amount,
                        hasBalance: payout.balance_amount > 0,
                        payLink: payout.executive_role == 2 ?
                            `{{ route('distributor.pay-details', 'ID') }}`.replace('ID', payout.executive_id) :
                            'Not an executive'
                    });
                });

                // Auto-highlight executives
                const executiveRows = document.querySelectorAll('tbody tr');
                executiveRows.forEach(row => {
                    const roleBadge = row.querySelector('.badge.bg-success');
                    if (roleBadge && roleBadge.textContent.includes('Executive')) {
                        row.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
                    }
                });
            });
        </script>
</body>

</html>

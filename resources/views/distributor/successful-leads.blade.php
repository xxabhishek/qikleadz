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

    <!-- Additional CSS from UI HTML -->
    <link href="{{ url('/') }}/assets/plugins/simplebar/css/simplebar.css" rel="stylesheet" />
    <link href="{{ url('/') }}/assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css" rel="stylesheet" />
    <link href="{{ url('/') }}/assets/css/pace.min.css" rel="stylesheet" />
    <link href="{{ url('/') }}/assets/css/app.css" rel="stylesheet">
    <link href="{{ url('/') }}/assets/css/icons.css" rel="stylesheet">
    <link href="{{ url('/') }}/assets/css/semi-dark.css" rel="stylesheet" />
    <link href="{{ url('/') }}/assets/css/header-colors.css" rel="stylesheet" />

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-blue: #f2f9ff;
            --light-grey: #ced4da;
            --hover-blue: #084a8a;
            --highlight-yellow: #ffd700;
            --secondary-grey: #e5e7eb;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --text-dark: #1f2937;
            --grey: #9ca3af;
            --blue: #3b82f6;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
            color: var(--text-dark);
            font-size: 0.875rem;
        }

        .container-animate {
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .custom-table th {
            background-color: #f8fafc;
            padding: 0.75rem 1rem;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid var(--secondary-grey);
            cursor: pointer;
            position: relative;
            font-size: 0.875rem;
        }

        .custom-table th:hover {
            background-color: #f1f5f9;
        }

        .custom-table th::after {
            content: '↕';
            position: absolute;
            right: 8px;
            opacity: 0.5;
        }

        .custom-table th.asc::after {
            content: '↑';
            opacity: 1;
        }

        .custom-table th.desc::after {
            content: '↓';
            opacity: 1;
        }

        .custom-table th.no-sort::after {
            content: '';
        }

        .custom-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--secondary-grey);
            color: #4b5563;
            font-size: 0.875rem;
            vertical-align: middle;
        }

        .custom-table tr:hover {
            background-color: #f9fafb;
        }

        .action-btn {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            text-decoration: none;
            font-size: 0.75rem;
            display: inline-block;
        }

        .header-sales-info {
            color: var(--grey);
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
        }

        .logo-img {
            width: 3rem;
            height: 3rem;
            display: block !important;
            object-fit: contain;
        }

        .table-responsive {
            border-radius: 0 0 0.5rem 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .table-card {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .table-header {
            background-color: var(--primary-blue);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem 0.5rem 0 0;
        }

        .table-success-row {
            background-color: rgba(40, 167, 69, 0.05) !important;
        }

        .badge-verified {
            background-color: #28a745;
            color: white;
        }

        .dark-mode .custom-table td {
            color: #d1d1d1;
            border-bottom: 1px solid #323248;
        }

        .dark-mode .table-card {
            background: linear-gradient(to bottom, #2a2a3c, #252537);
            border-color: #323248;
        }

        .dark-mode .table-header {
            background-color: #084a8a;
        }

        .dark-mode .text-muted {
            color: #92929f !important;
        }

        .dark-mode .table-success-row {
            background-color: rgba(40, 167, 69, 0.1) !important;
        }

        section {
            padding: 0.75rem !important;
        }

        @media (min-width: 768px) {
            section {
                padding: 1.5rem !important;
            }
        }

        #google_translate_element, #google_translate_element_mobile {
            font-family: 'Montserrat', sans-serif;
        }

        #google_translate_element select, #google_translate_element_mobile select {
            background-color: var(--primary-blue);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0.5rem;
            font-size: 0.9rem;
            cursor: pointer;
        }

        #google_translate_element select:focus, #google_translate_element_mobile select:focus {
            outline: none;
            background-color: var(--hover-blue);
        }

        .dark-mode #google_translate_element select, .dark-mode #google_translate_element_mobile select {
            background-color: #2a2a3c;
            border-color: #323248;
            color: #e1e1e1;
        }

        .dark-mode #google_translate_element select:focus, .dark-mode #google_translate_element_mobile select:focus {
            background-color: #323248;
        }

        .checkbox-column {
            width: 40px;
        }
    </style>
</head>

<body class="distributor-dashboard">
    <div class="wrapper">
        <div class="header-wrapper">
            <header>
                <div class="topbar d-flex align-items-center">
                    <nav class="navbar navbar-expand gap-3">
                        <!-- Logo -->
                        <div class="topbar-logo-header d-none d-lg-flex">
                            <div>
                                <img src="{{ url('/') }}/assets/images/logo/bajaj-icon.svg" alt="Bajaj Logo" class="logo-img">
                            </div>
                        </div>

                        <!-- Mobile menu toggle -->
                        <div class="mobile-toggle-menu d-block d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
                            <i class='bx bx-menu'></i>
                        </div>

                        <!-- Sales info -->
                        <div class="header-sales-info ms-auto me-4 d-none d-md-block">
                            <i class='bx bx-stats'></i> This Month Sales: ${{ number_format($currentMonthSales * 1000 ?? 120000) }} &nbsp;|&nbsp; Last Month Sales: ${{ number_format($lastMonthSales * 1000 ?? 110000) }}
                        </div>

                        <!-- Top menu items -->
                        <div class="top-menu">
                            <ul class="navbar-nav align-items-center gap-1">
                                <li class="nav-item mobile-search-icon d-flex d-lg-none" data-bs-toggle="modal" data-bs-target="#SearchModal">
                                    <a class="nav-link" href="javascript:;"><i class='bx bx-search'></i></a>
                                </li>
                                <li class="nav-item dark-mode d-none d-sm-flex">
                                    <a class="nav-link dark-mode-icon" href="javascript:;"><i class='bx bx-moon'></i></a>
                                </li>
                                <li class="nav-item d-none d-sm-flex">
                                    <div id="google_translate_element"></div>
                                </li>
                            </ul>
                        </div>

                        <!-- User dropdown -->
                        <div class="user-box dropdown">
                            <a class="d-flex align-items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                    <i class="bx bx-user"></i>
                                </div>
                                <div class="user-info d-none d-md-block">
                                    <p class="user-name mb-0">{{ auth()->user()->name }}</p>
                                    <p class="designation mb-0">Distributor</p>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <i class="bx bx-user fs-5"></i><span>Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <i class="bx bx-cog fs-5"></i><span>Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <div class="dropdown-divider mb-0"></div>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}">
                                        <i class="bx bx-log-out-circle"></i><span>Logout</span>
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
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header border-bottom">
                            <div class="d-flex align-items-center">
                                <div>
                                    <img src="{{ url('/') }}/assets/images/logo/bajaj-icon.svg" alt="Bajaj Logo" class="logo-img">
                                </div>
                                <div>
                                    <h4 class="logo-text">Bajaj</h4>
                                </div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav align-items-center flex-grow-1">
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('distributor.dashboard') }}">
                                        <div class="parent-icon"><i class='bx bx-home-alt'></i></div>
                                        <div class="menu-title">Dashboard</div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('distributor.leads') }}">
                                        <div class="parent-icon"><i class='bx bx-list-check'></i></div>
                                        <div class="menu-title">Leads</div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('distributor.claims') }}">
                                        <div class="parent-icon"><i class='bx bx-clipboard'></i></div>
                                        <div class="menu-title">Claims</div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('distributor.converted-leads') }}">
                                        <div class="parent-icon"><i class='bx bx-plus-circle'></i></div>
                                        <div class="menu-title">Create Claim</div>
                                    </a>
                                </li>
                                <li class="nav-item d-flex d-lg-none">
                                    <div id="google_translate_element_mobile"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>

        <div class="page-wrapper">
            <div class="page-content container-animate">
                <!-- Breadcrumb -->
                <div class="page-breadcrumb d-none d-sm-flex align-items-center">
                    <div class="breadcrumb-title pe-3">Successful Leads</div>
                    <div class="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0 p-0">
                                <li class="breadcrumb-item">
                                    <a href="{{ route('distributor.dashboard') }}">
                                        <i class="bx bx-home-alt"></i>
                                    </a>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">Successful Leads</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <section class="p-3">
                    <div class="container pt-3">
                        <!-- Generate Credit Note Button (Top) -->
                        <div class="mb-3">
                            <button type="button" class="btn btn-success" id="generateSelectedCreditNote">
                                <i class="bi bi-file-earmark-pdf me-1"></i> Generate Credit Note for Selected
                            </button>
                            <a href="{{ route('distributor.leads') }}" class="btn btn-outline-primary ms-2">
                                <i class="bi bi-arrow-left me-1"></i> Back to Leads
                            </a>
                        </div>

                        <!-- Filter/Search Bar -->
                        <div class="card mb-4 border-0 shadow-sm">
                            <div class="card-body">
                                <form action="{{ route('distributor.successful-leads') }}" method="GET" class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Customer Name</label>
                                        <input type="text" name="search" class="form-control" placeholder="Search customer..." value="{{ request('search') }}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">From Date</label>
                                        <input type="date" name="from_date" class="form-control" value="{{ request('from_date') }}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">To Date</label>
                                        <input type="date" name="to_date" class="form-control" value="{{ request('to_date') }}">
                                    </div>
                                    <div class="col-md-2 d-flex align-items-end">
                                        <button type="submit" class="btn btn-primary me-2 w-100">
                                            <i class="bi bi-search me-1"></i> Filter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Successful Leads Table -->
                        <div class="table-card">
                            <div class="table-header">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0 fs-5 fw-semibold">Successful Leads</h5>
                                    <span class="badge bg-secondary text-white rounded-pill" id="claimCount">
                                        {{ $successfulLeads->total() }} Leads
                                    </span>
                                </div>
                            </div>

                            @if($successfulLeads->count() > 0)
                                <form id="creditNoteForm" action="{{ route('distributor.generate-selected-credit-note') }}" method="POST">
                                    @csrf
                                    <div class="table-responsive">
                                        <table class="table custom-table table-bordered table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th class="no-sort checkbox-column">
                                                        <input type="checkbox" id="selectAll">
                                                    </th>
                                                    <th onclick="sortTable(1, true)">Sr. No.</th>
                                                    <th onclick="sortTable(2, false)">Lead ID</th>
                                                    <th onclick="sortTable(3, false)">Customer Name</th>
                                                    <th onclick="sortTable(4, false)">Executive</th>
                                                    <th onclick="sortTable(5, false)">Vehicle</th>
                                                    <th onclick="sortTable(6, true)">Total Price</th>
                                                    <th onclick="sortTable(7, false)">Converted Date</th>
                                                    <th onclick="sortTable(8, false)">Verified Date</th>
                                                    <th onclick="sortTable(9, false)">Status</th>
                                                    <th class="no-sort">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @php $counter = 1 @endphp
                                                @foreach($successfulLeads as $lead)
                                                    @foreach($lead->lead_details as $detail)
                                                        @if($detail->verification_status === 'successful')
                                                            <tr class="table-success-row">
                                                                <td>
                                                                    <input type="checkbox" name="detail_ids[]" value="{{ $detail->id }}" class="vehicle-checkbox">
                                                                </td>
                                                                <td>{{ $counter++ }}</td>
                                                                <td>{{ $detail->lead_no ?? 'N/A' }}</td>
                                                                <td>
                                                                    <strong>{{ $lead->customer_name }}</strong><br>
                                                                    <small class="text-muted">{{ $lead->phone_no }}</small>
                                                                </td>
                                                                <td>{{ $lead->executive->name ?? 'N/A' }}</td>
                                                                <td>
                                                                    {{ $detail->brand->name ?? 'N/A' }} - {{ $detail->variant->name ?? 'N/A' }}<br>
                                                                    <small class="text-muted">{{ $detail->color->name ?? '' }}</small>
                                                                </td>
                                                                <td>${{ number_format($detail->total_price ?? 0, 2) }}</td>
                                                                <td>{{ $detail->updated_at ? \Carbon\Carbon::parse($detail->updated_at)->format('d M Y') : 'N/A' }}</td>
                                                                <td>{{ $detail->verified_at ? \Carbon\Carbon::parse($detail->verified_at)->format('d M Y') : 'N/A' }}</td>
                                                                <td>
                                                                    <span class="badge bg-success">Verified</span>
                                                                </td>
                                                                <td>
                                                                    <div class="d-flex gap-1">
                                                                        <a href="{{ route('distributor.leads.show', $lead->id) }}"
                                                                           class="btn btn-sm btn-outline-primary action-btn">
                                                                            <i class="bi bi-eye"></i>
                                                                        </a>
                                                                        <a href="{{ route('distributor.credit-note', $detail->id) }}"
                                                                           class="btn btn-sm btn-outline-success action-btn"
                                                                           target="_blank">
                                                                            <i class="bi bi-printer"></i>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        @endif
                                                    @endforeach
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Pagination -->
                                    @if($successfulLeads->hasPages())
                                        <div class="card-footer">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="text-muted">
                                                    Showing {{ $successfulLeads->firstItem() }} to {{ $successfulLeads->lastItem() }}
                                                    of {{ $successfulLeads->total() }} entries
                                                </div>
                                                <nav>
                                                    {{ $successfulLeads->appends(request()->query())->links() }}
                                                </nav>
                                            </div>
                                        </div>
                                    @endif
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
    <script src="{{ url('/') }}/assets/plugins/simplebar/js/simplebar.min.js"></script>
    <script src="{{ url('/') }}/assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js"></script>
    <script src="{{ url('/') }}/assets/js/app.js"></script>

    <!-- Google Translate Script -->
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <script>
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element_mobile');
        }

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

            // Dark mode toggle
            const darkModeToggle = document.querySelector('.dark-mode-icon');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', function() {
                    document.body.classList.toggle('dark-mode');

                    const isDarkMode = document.body.classList.contains('dark-mode');
                    localStorage.setItem('darkMode', isDarkMode);

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
                    document.body.classList.add('dark-mode');
                    const icon = darkModeToggle.querySelector('i');
                    icon.className = 'bx bx-sun';
                    icon.style.color = '#ffd700';
                }
            }

            // Table sorting function
            function sortTable(columnIndex, isNumeric = false) {
                const table = document.querySelector('.custom-table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const headers = table.querySelectorAll('th');
                const currentHeader = headers[columnIndex];

                // Remove existing sort classes
                headers.forEach(header => {
                    header.classList.remove('asc', 'desc');
                });

                // Set new sort direction
                const isAscending = !currentHeader.classList.contains('asc');
                currentHeader.classList.toggle('asc', isAscending);
                currentHeader.classList.toggle('desc', !isAscending);

                // Sort rows
                rows.sort((a, b) => {
                    let aValue = a.cells[columnIndex].textContent.trim();
                    let bValue = b.cells[columnIndex].textContent.trim();

                    if (isNumeric) {
                        const numA = parseFloat(aValue.replace(/[^0-9.-]+/g, '')) || 0;
                        const numB = parseFloat(bValue.replace(/[^0-9.-]+/g, '')) || 0;
                        return isAscending ? numA - numB : numB - numA;
                    } else {
                        return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                    }
                });

                // Reorder rows in DOM
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }

                rows.forEach(row => tbody.appendChild(row));
            }

            // Make sortTable function available globally
            window.sortTable = sortTable;
        });
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0078d7">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="{{ asset('assets/images/favicon-32x32.png') }}" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="{{ asset('assets/plugins/simplebar/css/simplebar.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/pace.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/semi-dark.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/header-colors.css') }}" />
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <title>Credit Note - {{ $creditNote->cn_no }}</title>

    <style>
        :root {
            --primary-blue: #0f66af;
            --hover-blue: #084a8a;
            --text-dark: #1f2937;
        }
        body { font-family: 'Montserrat', sans-serif; background-color: #f9fafb; color: var(--text-dark); }
        .container-animate { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .logo-img { width: 3rem; height: 3rem; object-fit: contain; }
        .card {
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            background: linear-gradient(to bottom, #ffffff, #f9fafb);
        }
        .card-header {
            background-color: var(--primary-blue);
            color: white;
            border-radius: 0.5rem 0.5rem 0 0;
        }
        section { padding: 0.75rem !important; }
        @media (min-width: 768px) { section { padding: 1.5rem !important; } }
    </style>
</head>
<body class="distributor-dashboard">
    <div class="wrapper">
        <!-- Full Header & Menu (copy from your list_credit_note.blade.php) -->
        <div class="header-wrapper">
            <header>
                <div class="topbar d-flex align-items-center">
                    <nav class="navbar navbar-expand gap-3">
                        <div class="topbar-logo-header d-none d-lg-flex">
                            <div><img src="{{ asset('assets/images/logo/bajaj-icon.svg') }}" alt="Bajaj Logo" class="logo-img"></div>
                        </div>
                        <div class="mobile-toggle-menu d-block d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
                            <i class='bx bx-menu'></i>
                        </div>
                        <div class="header-sales-info ms-auto me-4 d-none d-md-block">
                            <i class='bx bx-stats'></i> This Month Sales: ${{ number_format($currentMonthSales ?? 120000) }} &nbsp;|&nbsp; Last Month Sales: ${{ number_format($lastMonthSales ?? 110000) }}
                        </div>
                        <div class="top-menu">
                            <ul class="navbar-nav align-items-center gap-1">
                                <li class="nav-item dark-mode d-none d-sm-flex">
                                    <a class="nav-link dark-mode-icon" href="javascript:;"><i class='bx bx-moon'></i></a>
                                </li>
                                <li class="nav-item d-none d-sm-flex"><div id="google_translate_element"></div></li>
                            </ul>
                        </div>
                        <div class="user-box dropdown">
                            <a class="d-flex align-items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                    <i class="bx bx-user"></i>
                                </div>
                                <div class="user-info d-none d-md-block">
                                    <p class="user-name mb-0">{{ auth()->user()->name }}</p>
                                    <p class="designattion mb-0">Distributor</p>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item d-flex align-items-center" href="javascript:;"><i class="bx bx-user fs-5"></i><span>Profile</span></a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="javascript:;"><i class="bx bx-cog fs-5"></i><span>Settings</span></a></li>
                                <li><div class="dropdown-divider mb-0"></div></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}"><i class="bx bx-log-out-circle"></i><span>Logout</span></a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
            <!-- Primary Menu (offcanvas) - copy from your original -->
            <div class="primary-menu">
                <nav class="navbar navbar-expand-lg align-items-center">
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar">
                        <div class="offcanvas-header border-bottom">
                            <div class="d-flex align-items-center">
                                <div><img src="{{ asset('assets/images/logo/bajaj-icon.svg') }}" alt="Bajaj Logo" class="logo-img"></div>
                                <div><h4 class="logo-text">Bajaj</h4></div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav align-items-center flex-grow-1">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="{{ route('distributor.dashboard') }}">
                                        <div class="parent-icon"><i class='bx bx-home-alt'></i></div>
                                        <div class="menu-title d-flex align-items-center">Dashboard</div>
                                    </a>
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
                <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-4">
                    <div class="breadcrumb-title pe-3">Claim</div>
                    <div class="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0 p-0">
                                <li class="breadcrumb-item"><a href="{{ route('distributor.dashboard') }}"><i class="bx bx-home-alt"></i></a></li>
                                <li class="breadcrumb-item"><a href="{{ route('distributor.list-credit-note') }}">Credit Notes</a></li>
                                <li class="breadcrumb-item active">{{ $creditNote->cn_no }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <!-- Main Card -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0 text-white">Credit Note Details: <strong>{{ $creditNote->cn_no }}</strong></h5>
                    </div>
                    <div class="card-body">

                        <hr class="my-4">

                        <!-- Per Quantity Wise Table -->
                        <h5 class="text-primary mb-3">Incentive Breakdown (Per Unit)</h5>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Unit No.</th>
                                        <th>Vehicle Purchased</th>
                                        <th>Commission per Unit</th>
                                        <th class="text-end">Incentive for this Unit</th>
                                    </tr>
                                </thead>
<tbody>
    @php $unitCounter = 1; @endphp
    @for($i = 1; $i <= $creditNote->converted_qty; $i++)
        <tr>
            <td>{{ $unitCounter++ }}</td>
            <td>Unit {{ $i }} of {{ $creditNote->converted_qty }}</td>
            <td>
                <strong>
                    {{ $leadDetail->brand?->name }} {{ $leadDetail->variant?->name }}
                </strong>
            </td>
            <td>${{ number_format($commission, 2) }}</td>
            <td class="text-end fw-bold text-success">
                ${{ number_format($commission, 2) }}
            </td>
        </tr>
    @endfor
</tbody>                                <tfoot>
                                    <tr class="table-success fw-bold">
                                        <td colspan="4" class="text-end">Total Incentive Paid:</td>
                                        <td class="text-end fs-5">${{ number_format($totalIncentive, 2) }}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- Buttons -->
                        <div class="mt-5 text-end">
                            <a href="{{ route('distributor.list-credit-note') }}" class="btn btn-secondary me-2">
                                <i class="bx bx-arrow-back"></i> Back to List
                            </a>
                            <button onclick="window.print()" class="btn btn-primary">
                                <i class="bx bx-printer"></i> Print / Save as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('assets/plugins/simplebar/js/simplebar.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>

    <script>
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
            new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element_mobile');
        }
    </script>
</body>
</html>
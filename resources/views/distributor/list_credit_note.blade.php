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
    <title>Credit Notes List</title>

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-blue: #f2f9ff;
            --light-grey: #ced4da;
            --hover-blue: #084a8a;
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

        .logo-img {
            width: 3rem;
            height: 3rem;
            display: block !important;
            object-fit: contain;
        }

        .header-sales-info {
            color: var(--grey);
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
        }

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

        .card-body {
            padding: 1.5rem;
        }

        .dark-mode .card {
            background: linear-gradient(to bottom, #2a2a3c, #252537);
            border-color: #323248;
        }

        .dark-mode .card-header {
            background-color: var(--hover-blue);
        }

        section {
            padding: 0.75rem !important;
        }

        @media (min-width: 768px) {
            section {
                padding: 1.5rem !important;
            }
        }
    </style>
</head>
<body class="distributor-dashboard">
    <div class="wrapper">
        <!-- Header & Menu (unchanged) -->
        <div class="header-wrapper">
            <header>
                <div class="topbar d-flex align-items-center">
                    <nav class="navbar navbar-expand gap-3">
                        <div class="topbar-logo-header d-none d-lg-flex">
                            <div>
                                <img src="{{ asset('assets/images/logo/bajaj-icon.svg') }}" alt="Bajaj Logo" class="logo-img">
                            </div>
                        </div>
                        <div class="mobile-toggle-menu d-block d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
                            <i class='bx bx-menu'></i>
                        </div>
                        <div class="header-sales-info ms-auto me-4 d-none d-md-block">
                            <i class='bx bx-stats'></i> This Month Sales: ${{ number_format($currentMonthSales ?? 120000) }} &nbsp;|&nbsp; Last Month Sales: ${{ number_format($lastMonthSales ?? 110000) }}
                        </div>
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
                        <div class="user-box dropdown">
                            <a class="d-flex align-items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret"
                               href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
            <div class="primary-menu">
                <nav class="navbar navbar-expand-lg align-items-center">
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
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
                <!-- Breadcrumb - kept structure similar to your original -->
                <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-4">
                    <div class="breadcrumb-title pe-3">Claim</div>
                    <div class="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0 p-0">
                                <li class="breadcrumb-item"><a href="{{ route('distributor.dashboard') }}"><i class="bx bx-home-alt"></i></a></li>
                                <li class="breadcrumb-item active" aria-current="page">Credit Notes</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <!-- Credit Notes List Card -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0 text-white">Credit Notes List</h5>
                    </div>
                    <div class="card-body">
                        @if($creditNotes->count() > 0)
                            <div class="table-responsive">
<table class="table table-striped table-hover align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Credit Note No.</th>
                                            <th>Date</th>
                                            <th>Converted Qty</th>
                                            <th>Incentive Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($creditNotes as $note)
                                            <tr>
                                                <td>{{ $loop->iteration + ($creditNotes->currentPage() - 1) * $creditNotes->perPage() }}</td>
                                                <td><strong>{{ $note->cn_no }}</strong></td>
                                                <td>{{ \Carbon\Carbon::parse($note->created_at)->format('d M Y') }}</td>
                                                <td><strong>{{ $note->converted_qty }}</strong></td>
                                                <td><strong>${{ number_format($note->total_incentive, 2) }}</strong></td>
                                                <td>
                                                        <a href="{{ route('distributor.credit-note.view', $note->id) }}" 
                                                        class="btn btn-sm btn-primary" 
                                                        title="View {{ $note->cn_no }} Details">
                                                            <i class="bx bx-show"></i> View
                                                        </a>          
                                                </td>          
                                  </tr>
                                        @endforeach
                                    </tbody>
                                </table>                           
                             </div>

                            <!-- Pagination -->
                            <div class="mt-4 d-flex justify-content-center">
                                {{ $creditNotes->links() }}
                            </div>
                        @else
                            <div class="text-center py-5">
                                <p class="text-muted">No credit notes found.</p>
                            </div>
                        @endif
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
            const darkModeToggle = document.querySelector('.dark-mode-icon');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', function () {
                    document.body.classList.toggle('dark-mode');
                });
            }
        });
    </script>
</body>
</html>
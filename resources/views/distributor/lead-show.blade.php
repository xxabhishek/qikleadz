

<!DOCTYPE html><html lang="en">
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
    <title>Claim Details</title>

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

        #vehicleImage {
            max-width: 200px;
            height: auto;
        }

        .download-link {
            color: var(--primary-blue);
            text-decoration: none;
            font-size: 0.875rem;
        }

        .download-link:hover {
            color: var(--hover-blue);
            text-decoration: underline;
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

        .detail-label {
            font-weight: 500;
            color: #374151;
            display: block;
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
        }

        .detail-value {
            font-size: 0.95rem;
            color: var(--text-dark);
        }

        .dark-mode .card {
            background: linear-gradient(to bottom, #2a2a3c, #252537);
            border-color: #323248;
        }

        .dark-mode .card-header {
            background-color: var(--hover-blue);
        }

        .dark-mode .text-muted {
            color: #92929f !important;
        }

        .dark-mode .download-link {
            color: var(--blue);
        }

        .dark-mode .download-link:hover {
            color: #60a5fa;
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
                                <li><a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                    <i class="bx bx-user fs-5"></i><span>Profile</span>
                                </a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                    <i class="bx bx-cog fs-5"></i><span>Settings</span>
                                </a></li>
                                <li><div class="dropdown-divider mb-0"></div></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}">
                                    <i class="bx bx-log-out-circle"></i><span>Logout</span>
                                </a></li>
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
                                <div>
                                    <img src="{{ asset('assets/images/logo/bajaj-icon.svg') }}" alt="Bajaj Logo" class="logo-img">
                                </div>
                                <div>
                                    <h4 class="logo-text">Bajaj</h4>
                                </div>
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
                <div class="page-breadcrumb d-none d-sm-flex align-items-center">
                    <div class="breadcrumb-title pe-3">Claim</div>
                    <div class="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0 p-0">
                                <li class="breadcrumb-item"><a href="{{ route('distributor.dashboard') }}"><i class="bx bx-home-alt"></i></a></li>
                                <li class="breadcrumb-item"><a href="{{ route('distributor.leads') }}">Converted Leads</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Claim Details</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <section class="p-3">
                    <div class="container pt-5">
                        <div class="card">
                            <div class="card-header">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-title mb-0 fs-5 fw-semibold" id="leadDetailTitle">Claim Details</h5>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="mb-4">
                                    <h6 class="text-muted small mb-2"><i class="bi bi-info-circle me-1"></i> Claim Status</h6>
                                    @php
                                        $statusClass = $lead->verification_status === 'successful' ? 'bg-success' :
                                            ($lead->verification_status === 'disputed' ? 'bg-warning text-dark' :
                                                ($lead->verification_status === 'rejected' ? 'bg-danger' : 'bg-secondary'));
                                        $statusText = $lead->verification_status === 'pending' ? 'Pending Verification' :
                                            ($lead->verification_status === 'successful' ? 'Successful' : ucfirst($lead->verification_status));
                                    @endphp
                                    <span id="claimStatus" class="badge {{ $statusClass }}">{{ $statusText }}</span>
                                </div>

                                <!-- Customer Details -->
                                <h6 class="mb-3 text-primary">Customer Details</h6>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="detail-label">Customer Name</label>
                                        <div class="detail-value">{{ $lead->customer_name }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="detail-label">Mobile Number</label>
                                        <div class="detail-value">{{ $lead->phone_no }}</div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="detail-label">Purchased From</label>
                                        <div class="detail-value">{{ $lead->dealer?->name ?? 'Not Assigned' }}</div>
                                    </div>
                                </div>

                                <!-- Invoice -->
                                @php
                                    $invoiceNumber = $lead->lead_details->first()?->invoice_no ?? 'N/A';
                                    $invoiceCopy = $lead->lead_details->first()?->uploaded_invoice ?? null;
                                @endphp

                                <div class="mt-4">
                                    <h6 class="mb-3 text-primary">Invoice Information</h6>
                                    <div class="row g-3">

                                        <div class="col-md-6">
                                            <label class="detail-label">Invoice Copy</label>
                                            @if($invoiceCopy)
                                                <a href="{{ asset('storage/' . $invoiceCopy) }}" class="download-link" download>
                                                    <i class="bi bi-download me-1"></i> Download Invoice ({{ $invoiceNumber }})
                                                </a>
                                            @else
                                                <span class="text-muted">No Invoice Available</span>
                                            @endif
                                        </div>
                                    </div>
                                </div>

                                <!-- Vehicle Details -->
                                <h6 class="mb-3 mt-5 text-primary">Vehicle Details</h6>

                                @if($lead->lead_details->count() > 0)
                                    @foreach($lead->lead_details as $detail)
                                        <div class="mt-4">


                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <label class="detail-label">Brand Name</label>
                                                    <div class="detail-value">{{ $detail->brand?->name ?? 'N/A' }}</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="detail-label">Vehicle Model</label>
                                                    <div class="detail-value">{{ $detail->variant?->name ?? 'N/A' }}</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="detail-label">Payment Mode</label>
                                                    <div class="detail-value">{{ ucfirst($lead->payment_mode ?? 'N/A') }}</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="detail-label">Vehicle Price</label>
                                                    <div class="detail-value">${{ number_format($detail->unit_price ?? 0, 2) }}</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="detail-label">Total</label>
                                                    <div class="detail-value">${{ number_format($detail->total_price ?? 0, 2) }}</div>
                                                </div>
                                            </div>
                                        </div>

                                        @if(!$loop->last)
                                            <hr class="my-4">
                                            <h6 class="mb-3 text-primary">Vehicle Details </h6>
                                        @endif
                                    @endforeach
                                @else
                                    <p class="text-muted text-center py-4">No vehicle details available</p>
                                @endif
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

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

            const customerName = "{{ $lead->customer_name }}";
            document.getElementById('leadDetailTitle').textContent = `Claim Details: ${customerName}`;

            document.querySelectorAll('.logo-img').forEach(img => {
                img.onerror = () => {
                    img.alt = 'Bajaj Logo (Failed to Load)';
                    img.style.border = '1px solid var(--light-grey)';
                    img.style.backgroundColor = '#f1f5f9';
                };
            });
        });
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="manifest" href="/demo/ecosys/manifest.json">

    <meta name="theme-color" content="#0078d7">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Success Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        :root {
            --primary-blue: #0f66af;
            --light-grey: #ced4da;
            --highlight-yellow: #ffd700;
        }

        body {
            font-family: 'Montserrat', sans-serif;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        .container-animate {
            animation: fadeIn 0.5s ease-in;
        }

        .lead-card {
            border-left: 4px solid var(--primary-blue);
        }

        .btn-primary-blue {
            background-color: var(--primary-blue);
            border-color: var(--primary-blue);
            color: white;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .btn-primary-blue:hover {
            background-color: #084a8a;
            border-color: #084a8a;
            transform: scale(1.05);
        }
                header {
            background-color: var(--primary-blue);
            color: white;
        }

    </style>
</head>

<body class="bg-gray-100 text-sm">
    <h1></h1>
        <header class="shadow-sm mb-4 py-2">
        <div class="container-fluid d-flex justify-content-between align-items-center px-3">
            <div class="d-flex align-items-center">
                <img src="{{ url('/') }}/assets/images/logo/bajaj-icon.svg" alt="Bajaj Logo" style="height:40px;">
            </div>

            <!-- User Dropdown -->
            <div class="dropdown">
                <a class="d-flex align-items-center text-decoration-none dropdown-toggle text-white" href="#"
                   id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="{{ url('/') }}/Frontend/assets/images/avatars/avatar-2.png" alt="user avatar"
                         class="rounded-circle me-2" style="width:36px; height:36px;">
                    <span>{{ \Illuminate\Support\Str::limit(Session::get('username'), 12, '...') }}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                        <a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}">
                            <i class="bi bi-box-arrow-right me-2"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="min-h-screen container-animate">
        <!-- Header -->
        <header class="bg-[var(--primary-blue)] text-white py-2 shadow-sm relative">
            <div class="flex items-center w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12">
                <!-- Menu toggle button -->
                <button class="text-2xl bg-transparent border-none text-white cursor-pointer" id="menuToggle">
                    <i class="bi bi-list"></i>
                </button>
                <!-- Heading aligned with hamburger menu -->
                 @if($type === 'Converted')
                <h1 class="text-lg font-semibold absolute top-2.5 left-12">Successful Leads {{ $leadCount }}</h1>
                @else
                <h1 class="text-lg font-semibold absolute top-2.5 left-12">Unrealized Leads {{ $leadCount }}</h1>
                @endif

                <!-- Back button with consistent styling -->
                <a href="exe-dashboard.html"
                    class="ml-auto text-2xl bg-transparent border-none text-white cursor-pointer">
                    <i class="bi bi-arrow-left"></i>
                </a>
            </div>
        </header>

        <!-- Successful Leads Section -->
        <section class="p-4 max-w-7xl mx-auto">
            @if($type=== 'Converted')
            <div class="flex justify-between items-center mb-4">
                <h5 class="text-lg font-semibold text-[var(--primary-blue)]">Successful Leads {{ $leadCount }}</h5>
            </div>
            @else
            <div class="flex justify-between items-center mb-4">
                <h5 class="text-lg font-semibold text-[var(--primary-blue)]">Unrealized Leads {{ $leadCount }}</h5>
            </div>
            @endif



            <!-- Lead Cards -->
            <div class="space-y-4">
            @foreach($leads as $lead)
                <div class="lead-card bg-white p-4 rounded-lg shadow-sm">
                    <h6 class="text-base font-semibold mb-1">{{ $lead->lead->customer_name ?? 'N/A' }}</h6>
                    @if($type==='Converted')
                    <p class="text-sm text-gray-500 mb-1">
                        Purchased {{ $lead->brand->name ?? '' }} {{ $lead->variant->name ?? '' }}
                    </p>
                    @else
                    <p class="text-sm text-gray-500 mb-1">
                        Interested {{ $lead->brand->name ?? '' }} {{ $lead->variant->name ?? '' }}
                    </p>
                    @endif

                    <p class="text-sm text-gray-500 mb-0">
                        Purchased: {{ \Carbon\Carbon::parse($lead->created_at)->format('M d, Y') }}
                    </p>
                </div>
            @endforeach
            </div>
        </section>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/demo/ecosys/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.log("Service Worker failed:", err));
  }
</script>
</body>

</html>

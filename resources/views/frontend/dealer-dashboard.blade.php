<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dealer Dashboard</title>

    <!-- PWA & Theme -->
    <link rel="manifest" href="/demo/ecosys/manifest.json">
    <meta name="theme-color" content="#0078d7">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-blue: #0f66af;
            --light-grey: #ced4da;
            --highlight-yellow: #ffd700;
            --secondary-grey: #e5e7eb;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --text-dark: #1f2937;
            --grey: #9ca3af;
            --blue: #3b82f6;
            --light-blue: #cae4fe;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
            color: var(--text-dark);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .container-animate {
            animation: fadeIn 0.5s ease-in;
        }
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .badge {
            padding: 0.25em 0.4em;
            font-size: 0.75em;
            font-weight: 700;
            border-radius: 0.25rem;
        }
        .chart-container {
            height: 350px;
            position: relative;
        }
        @media (min-width: 768px) {
            .chart-container { height: 380px; }
        }
        @media (min-width: 1200px) {
            .chart-container { height: 420px; }
        }
    </style>
</head>
<body class="bg-gray-100 font-sans text-sm">
<div class="container-animate mx-auto px-0" x-data="{ open: false }">
    <!-- Header -->
    <header class="bg-[var(--primary-blue)] text-white py-3 shadow-md">
        <div class="container-fluid flex items-center justify-between px-4 md:px-8">
            <img src="{{ url('/') }}/assets/images/logo/bajaj-icon.svg" alt="Bajaj Logo" class="h-12">
            <div class="flex items-center gap-6">
                <div class="hidden md:block text-sm">
                    This Month Sales: <strong>$85,000</strong> &nbsp;|&nbsp; Last Month: <strong>$78,000</strong>
                </div>
                <div class="relative">
                    <button @click="open = !open" class="flex items-center gap-2 text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition">
                        <img src="{{ url('/') }}/Frontend/assets/images/avatars/avatar-2.png" alt="Avatar" class="w-9 h-9 rounded-full">
                        <span class="hidden md:inline">{{ \Illuminate\Support\Str::limit(Session::get('username'), 15, '...') }}</span>
                        <i class="bi bi-chevron-down text-sm"></i>
                    </button>
                    <div x-show="open" @click.away="open = false"
                         class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border"
                         x-transition>
                        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                        <hr class="my-1">
                        <a href="{{ route('logout') }}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            <i class="bi bi-box-arrow-right mr-2"></i> Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Stats: Leads -->
    <section class="p-4 md:p-6 lg:p-10">
        <div class="bg-white rounded-xl shadow-sm p-6">
            <h5 class="text-[var(--primary-blue)] text-xl font-semibold mb-5">Leads Overview</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-[#f2f9ff] rounded-xl p-6 stat-card transition-all">
                    <h6 class="text-gray-600 text-sm mb-3 flex items-center">
                        <i class="bi bi-clipboard-data text-blue-500 mr-2 text-lg"></i> Total Assigned
                    </h6>
                    <div class="flex justify-between items-end">
                        <h3 class="text-[var(--primary-blue)] text-3xl font-bold">{{ $TotalAssignLeads ?? 0 }}</h3>
                    </div>
                </div>

                <div class="bg-[#f2f9ff] rounded-xl p-6 stat-card transition-all">
                    <h6 class="text-gray-600 text-sm mb-3 flex items-center">
                        <i class="bi bi-hourglass-split text-orange-500 mr-2 text-lg"></i> In Progress
                    </h6>
                    <div class="flex justify-between items-end">
                        <h3 class="text-[var(--primary-blue)] text-3xl font-bold">{{ $openLeads ?? 0 }}</h3>
                    </div>
                </div>

                <a href="{{ route('dealer.leads') }}?status=converted" class="no-underline">
                    <div class="bg-[#f2f9ff] rounded-xl p-6 stat-card transition-all">
                        <h6 class="text-gray-600 text-sm mb-3 flex items-center">
                            <i class="bi bi-emoji-smile text-green-500 mr-2 text-lg"></i> Converted
                        </h6>
                        <div class="flex justify-between items-end">
                            <h3 class="text-[var(--primary-blue)] text-3xl font-bold">{{ $convertedLeads ?? 0 }}</h3>
                            <span class="badge bg-green-500 text-white">+2 today</span>
                        </div>
                        <p class="text-gray-500 text-xs mt-2">23 Vehicles | $48,500</p>
                    </div>
                </a>

                <a href="{{ route('dealer.leads') }}?status=lost" class="no-underline">
                    <div class="bg-[#f2f9ff] rounded-xl p-6 stat-card transition-all">
                        <h6 class="text-gray-600 text-sm mb-3 flex items-center">
                            <i class="bi bi-emoji-frown text-red-500 mr-2 text-lg"></i> Unrealized
                        </h6>
                        <div class="flex justify-between items-end">
                            <h3 class="text-[var(--primary-blue)] text-3xl font-bold">{{ $unrealizedLeads ?? 0 }}</h3>
                            <span class="badge bg-gray-500 text-white">+1 today</span>
                        </div>
                        <p class="text-gray-500 text-xs mt-2">16 Leads | $32,400</p>
                    </div>
                </a>
            </div>
        </div>
    </section>

    <!-- Charts Section -->
    <section class="p-4 md:p-6 lg:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                    <h5 class="text-[var(--primary-blue)] text-xl font-semibold">Lead Trend</h5>
                    <select id="timeRange" class="border border-gray-300 rounded-lg text-sm px-3 py-2">
                        <option value="weekly">Weekly</option>
                        <option value="monthly" selected>Monthly</option>
                        <option value="3months">3 Months</option>
                        <option value="6months">6 Months</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div class="chart-container">
                    <canvas id="leadChart"></canvas>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
                <h5 class="text-[var(--primary-blue)] text-xl font-semibold mb-4">Model-wise Sales</h5>
                <div class="chart-container">
                    <canvas id="modelChart"></canvas>
                </div>
            </div>
        </div>
    </section>

    <!-- Recent Leads -->
    <section class="p-4 md:p-6 lg:p-10 pb-20">
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-5">
                <h5 class="text-[var(--primary-blue)] text-xl font-semibold">Recent Leads</h5>
                <a href="{{ route('dealer.leads') }}" class="text-[var(--primary-blue)] hover:underline">View All</a>
            </div>
            <div class="space-y-4">
                @forelse($leads as $lead)
                    <div class="border-l-4 border-[var(--primary-blue)] bg-gray-50 p-5 rounded-r-lg hover:shadow-md transition">
                        <div class="flex justify-between items-start">
                            <div>
                                <h6 class="font-semibold">{{ $lead->customer_name }}</h6>
                                <p class="text-gray-600 text-sm">Interested in {{ $lead->variant?->name ?? 'Vehicle' }}</p>
                                <p class="text-gray-500 text-xs mt-1">{{ $lead->created_at->diffForHumans() }}</p>
                            </div>
                            <span class="badge {{ $lead->status == 'converted' ? 'bg-green-500 text-white' : ($lead->status == 'lost' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black') }}">
                                {{ ucfirst($lead->status ?? 'open') }}
                            </span>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-gray-500">
                        <i class="bi bi-inbox text-4xl mb-3 opacity-50"></i>
                        <p>No recent leads</p>
                    </div>
                @endforelse
            </div>
        </div>
    </section>
</div>

<!-- Alpine.js -->
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

<!-- Charts Script -->
<script>
    // Lead Trend Chart
    let leadChart;
    const ctxLead = document.getElementById('leadChart').getContext('2d');

    function updateLeadChart(range) {
        if (leadChart) leadChart.destroy();

        const labels = range === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                       range === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                       range === 'yearly' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
                       ['Period 1', 'Period 2', 'Period 3'];

        const total = labels.map(() => Math.floor(Math.random() * 30) + 5);
        const converted = labels.map(() => Math.floor(Math.random() * 20) + 3);
        const unrealized = labels.map(() => Math.floor(Math.random() * 10) + 2);

        leadChart = new Chart(ctxLead, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Total Leads', data: total, borderColor: '#3b82f6', tension: 0.4, fill: false },
                    { label: 'Converted', data: converted, borderColor: '#10b981', tension: 0.4, fill: false },
                    { label: 'Unrealized', data: unrealized, borderColor: '#ef4444', tension: 0.4, fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Model-wise Sales Doughnut
    const ctxModel = document.getElementById('modelChart').getContext('2d');
    new Chart(ctxModel, {
        type: 'doughnut',
        data: {
            labels: ['Pulsar NS200', 'Dominar 400', 'Pulsar 150', 'Platina', 'CT 100'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });

    // Initialize
    document.getElementById('timeRange').addEventListener('change', (e) => updateLeadChart(e.target.value));
    updateLeadChart('monthly');

    // Service Worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/demo/ecosys/service-worker.js")
            .then(reg => console.log("SW registered"))
            .catch(err => console.log("SW failed", err));
    }
</script>
</body>
</html>
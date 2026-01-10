@extends('layouts.app')

@section('title', 'Distributor Dashboard')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Distributor Dashboard</h3>
                        <div class="card-tools">
                            <span class="badge badge-primary">{{ auth()->user()->user_code }}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- Statistics Cards -->
                        <div class="row">
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-info">
                                    <div class="inner">
                                        <h3>{{ $totalLeads }}</h3>
                                        <p>Total Leads</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <a href="{{ route('distributor.leads') }}" class="small-box-footer">
                                        More info <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-success">
                                    <div class="inner">
                                        <h3>{{ $newLeads }}</h3>
                                        <p>New Leads</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-plus-circle"></i>
                                    </div>
                                    <a href="{{ route('distributor.leads') }}?status=new" class="small-box-footer">
                                        More info <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-warning">
                                    <div class="inner">
                                        <h3>{{ $convertedLeads }}</h3>
                                        <p>Converted Leads</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <a href="{{ route('distributor.leads') }}?status=converted" class="small-box-footer">
                                        More info <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-danger">
                                    <div class="inner">
                                        <h3>{{ $pendingLeads }}</h3>
                                        <p>Pending Leads</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <a href="{{ route('distributor.leads') }}?status=pending" class="small-box-footer">
                                        More info <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Leads Table -->
                        <div class="row mt-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Recent Leads</h3>
                                        <div class="card-tools">
                                            <a href="{{ route('distributor.leads') }}" class="btn btn-sm btn-primary">
                                                View All Leads
                                            </a>
                                        </div>
                                    </div>
                                    <div class="card-body table-responsive p-0">
                                        <table class="table table-hover text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Customer</th>
                                                    <th>Phone</th>
                                                    <th>Vehicle</th>
                                                    <th>Dealer</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($leads as $lead)
                                                    <tr>
                                                        <td>#{{ $lead->id }}</td>
                                                        <td>{{ $lead->customer_name }}</td>
                                                        <td>{{ $lead->phone_no }}</td>
                                                        <td>
                                                            @if($lead->oem)
                                                                {{ $lead->oem->name }}
                                                            @else
                                                                N/A
                                                            @endif
                                                        </td>
                                                        <td>
                                                            @if($lead->dealer)
                                                                {{ $lead->dealer->name }}
                                                            @else
                                                                N/A
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <span
                                                                class="badge badge-{{ $lead->status == 'converted' ? 'success' : ($lead->status == 'new' ? 'info' : ($lead->status == 'pending' ? 'warning' : 'secondary')) }}">
                                                                {{ ucfirst($lead->status) }}
                                                            </span>
                                                        </td>
                                                        <td>{{ $lead->created_at->format('d M Y') }}</td>
                                                        <td>
                                                            <a href="{{ route('distributor.leads.show', $lead->id) }}"
                                                                class="btn btn-sm btn-info">
                                                                <i class="fas fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="card-footer">
                                        {{ $leads->links() }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dealers List -->
                        @if($dealers->count() > 0)
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3 class="card-title">My Dealers</h3>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                @foreach($dealers as $dealer)
                                                    <div class="col-md-4">
                                                        <div class="card card-primary card-outline">
                                                            <div class="card-body box-profile">
                                                                <div class="text-center">
                                                                    @if($dealer->logo)
                                                                        <img class="profile-user-img img-fluid img-circle"
                                                                            src="{{ Storage::url($dealer->logo) }}" alt="Dealer logo">
                                                                    @else
                                                                        <div
                                                                            class="profile-user-img img-fluid img-circle bg-primary d-flex align-items-center justify-content-center">
                                                                            <span class="text-white"
                                                                                style="font-size: 24px;">{{ substr($dealer->name, 0, 1) }}</span>
                                                                        </div>
                                                                    @endif
                                                                </div>
                                                                <h3 class="profile-username text-center">{{ $dealer->name }}</h3>
                                                                <p class="text-muted text-center">{{ $dealer->user_code }}</p>
                                                                <ul class="list-group list-group-unbordered mb-3">
                                                                    <li class="list-group-item">
                                                                        <b>Email</b> <a class="float-right">{{ $dealer->email }}</a>
                                                                    </li>
                                                                    <li class="list-group-item">
                                                                        <b>Phone</b> <a
                                                                            class="float-right">{{ $dealer->mobile ?? 'N/A' }}</a>
                                                                    </li>
                                                                    <li class="list-group-item">
                                                                        <b>Status</b>
                                                                        <span
                                                                            class="float-right badge badge-{{ $dealer->status == 'Active' ? 'success' : 'danger' }}">
                                                                            {{ $dealer->status }}
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        // Auto-refresh statistics every 60 seconds
        setInterval(function () {
            $.get('{{ route("distributor.statistics") }}', function (data) {
                $('.small-box.bg-info .inner h3').text(data.total);
                $('.small-box.bg-success .inner h3').text(data.new);
                $('.small-box.bg-warning .inner h3').text(data.converted);
                $('.small-box.bg-danger .inner h3').text(data.pending);
            });
        }, 60000);
    </script>
@endpush
@extends('layouts.structure')

@section('content')

<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg border-0 rounded-lg">
                <div class="card-header  d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Role Details</h4>
                    <a class="btn btn-success" href="{{ route('roles.index') }}">
                        <i class="fas fa-arrow-left"></i> Back
                    </a>
                </div>

                <div class="card-body">
                    <div class="mb-3">
                        <h5><strong>Name:</strong> {{ $role->name }}</h5>
                    </div>

                    <div class="mb-3">
                        <h5><strong>Permissions:</strong></h5>
                        @if(!empty($rolePermissions))
                            <div class="d-flex flex-wrap">
                                @foreach($rolePermissions as $v)
                                    <span class="badge bg-success me-2 mb-2">{{ $v->name }}</span>
                                @endforeach
                            </div>
                        @else
                            <p>No permissions assigned.</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- JAVASCRIPT -->
        <script src="{{url('/')}}/assets/libs/jquery/jquery.min.js"></script>
        <script src="{{url('/')}}/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="{{url('/')}}/assets/libs/metismenu/metisMenu.min.js"></script>
        <script src="{{url('/')}}/assets/libs/simplebar/simplebar.min.js"></script>
        <script src="{{url('/')}}/assets/libs/node-waves/waves.min.js"></script>
        <script src="{{url('/')}}/assets/libs/feather-icons/feather.min.js"></script>
        <!-- pace js -->
        <script src="{{url('/')}}/assets/libs/pace-js/pace.min.js"></script>

        <!-- apexcharts -->
        <script src="{{url('/')}}/assets/libs/apexcharts/apexcharts.min.js"></script>

        <!-- Plugins js-->
        <script src="{{url('/')}}/assets/libs/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.min.js"></script>
        <script src="{{url('/')}}/assets/libs/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js"></script>
        <!-- dashboard init -->
        <script src="{{url('/')}}/assets/js/pages/dashboard.init.js"></script>

        <script src="{{url('/')}}/assets/js/app.js"></script>
@endsection

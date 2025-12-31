@extends('layouts.structure')

@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-lg border-0 rounded-lg mt-4">
                    <div class="card-header  text-center">
                        <h3 class="mb-0">Create New Role</h3>
                    </div>

                    <div class="card-body">
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <strong>Whoops!</strong> There were some problems with your input.<br><br>
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        {!! Form::open(['route' => 'roles.store', 'method' => 'POST']) !!}

                        <div class="form-group mb-3">
                            <label class="font-weight-bold">Role Name:</label>
                            {!! Form::text('name', null, ['placeholder' => 'Enter Role Name', 'class' => 'form-control']) !!}
                        </div>

                        <div class="form-group mb-3">
                            <label class="font-weight-bold">Permissions:</label>
                            <br>
                            <div class="row">
                                @foreach ($permission as $value)
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            {!! Form::checkbox('permission[]', $value->name, false, ['class' => 'form-check-input']) !!}
                                            <label class="form-check-label">{{ $value->name }}</label>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="text-center">
                            <button type="submit" class="btn btn-success">Submit</button>
                            <a class="btn btn-secondary" href="{{ route('roles.index') }}">Back</a>
                        </div>

                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
















    <!-- JAVASCRIPT -->
    <script src="{{ url('/') }}/assets/libs/jquery/jquery.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/metismenu/metisMenu.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/simplebar/simplebar.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/node-waves/waves.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/feather-icons/feather.min.js"></script>
    <!-- pace js -->
    <script src="{{ url('/') }}/assets/libs/pace-js/pace.min.js"></script>

    <!-- apexcharts -->
    <script src="{{ url('/') }}/assets/libs/apexcharts/apexcharts.min.js"></script>

    <!-- Plugins js-->
    <script src="{{ url('/') }}/assets/libs/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.min.js"></script>
    <script src="{{ url('/') }}/assets/libs/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js">
    </script>
    <!-- dashboard init -->
    <script src="{{ url('/') }}/assets/js/pages/dashboard.init.js"></script>

    <script src="{{ url('/') }}/assets/js/app.js"></script>
@endsection

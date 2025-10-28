@extends('layouts.structure')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg">
                <div class="card-header  text-center">
                    <h3 class="mb-0">Create New User</h3>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <h4 class="text-secondary">Fill in the details below</h4>
                        <a class="btn btn-secondary" href="{{ route('users.index') }}">Back</a>
                    </div>

                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <strong>Whoops!</strong> There were some problems with your input.
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    {!! Form::open(['route' => 'users.store', 'method' => 'POST']) !!}
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label><strong>Name:</strong></label>
                                {!! Form::text('name', null, ['placeholder' => 'Enter Name', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label><strong>Email:</strong></label>
                                {!! Form::email('email', null, ['placeholder' => 'Enter Email', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                                <label><strong>Password:</strong></label>
                                {!! Form::password('password', ['placeholder' => 'Enter Password', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                                <label><strong>Confirm Password:</strong></label>
                                {!! Form::password('confirm-password', ['placeholder' => 'Confirm Password', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label><strong>Role:</strong></label>
                                {!! Form::select('role', $roles, null, ['class' => 'form-control', 'placeholder' => 'Select Role']) !!}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                                <label><strong>Mobile:</strong></label>
                                {!! Form::text('mobile', null, ['placeholder' => 'Enter Mobile Number', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label><strong>Address:</strong></label>
                                {!! Form::textarea('address', null, ['placeholder' => 'Enter Address', 'class' => 'form-control', 'rows' => 3]) !!}
                            </div>
                        </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label><strong>Select Country:</strong></label>
                                    {!! Form::select('country_id', $countries, null, ['class' => 'form-control', 'placeholder' => 'Select Country']) !!}
                                </div>
                            </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label><strong>Status:</strong></label><br>

                                <div class="form-check form-check-inline">
                                    {!! Form::radio('status', 'Active', true, ['class' => 'form-check-input', 'id' => 'statusActive']) !!}
                                    <label class="form-check-label" for="statusActive">Active</label>
                                </div>

                                <div class="form-check form-check-inline">
                                    {!! Form::radio('status', 'Inactive', false, ['class' => 'form-check-input', 'id' => 'statusInactive']) !!}
                                    <label class="form-check-label" for="statusInactive">Inactive</label>
                                </div>
                            </div>
                        </div>


                        {!! Form::open(['route' => 'users.store', 'method' => 'POST', 'files' => true]) !!}
<div class="row">

    <!-- existing fields here ... -->

    <div class="col-md-12">
        <div class="form-group">
            <label><strong>Logo:</strong></label>
            {!! Form::file('logo', ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="col-md-12 text-center">
        <button type="submit" class="btn btn-primary w-50">Submit</button>
    </div>
</div>
{!! Form::close() !!}

                    </div>
                    {!! Form::close() !!}
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

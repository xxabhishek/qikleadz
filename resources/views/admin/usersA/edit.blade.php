@extends('layouts.structure')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg">
                <div class="card-header  text-center">
                    <h3 class="mb-0"> Edit User</h3>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <a class="btn btn-secondary" href="{{ route('users.index') }}">Back</a>
                    </div>

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

                    {!! Form::model($user, ['method' => 'PATCH', 'route' => ['users.update', $user->id]]) !!}
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Name:</strong>
                                {!! Form::text('name', null, ['placeholder' => 'Name', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Email:</strong>
                                {!! Form::email('email', null, ['placeholder' => 'Email', 'class' => 'form-control', 'readonly']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Password (Leave blank if unchanged):</strong>
                                {!! Form::password('password', ['placeholder' => 'Password', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Confirm Password:</strong>
                                {!! Form::password('confirm-password', ['placeholder' => 'Confirm Password', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Role:</strong>
                                <!-- {!! Form::select('roles[]', $roles, $userRole, ['class' => 'form-control']) !!} -->
                                 {!! Form::select('role', $roles, $userRole, ['class' => 'form-control', 'placeholder' => 'Select Role']) !!}

                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Mobile:</strong>
                                {!! Form::text('mobile', null, ['placeholder' => 'Mobile', 'class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Address:</strong>
                                {!! Form::textarea('address', null, ['placeholder' => 'Address', 'class' => 'form-control', 'rows' => 3]) !!}
                            </div>
                        </div>


                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Country:</strong>
                                {!! Form::select('country_id', $countries, $userCountry, ['class' => 'form-control', 'placeholder' => 'Select Country']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>Status:</strong>
                                {!! Form::select('status', ['Active'=>'Active','Inactive'=>'Inactive'], $userStatus, ['class' => 'form-control']) !!}
                            </div>
                        </div>

                        <div class="col-md-12 text-center">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
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

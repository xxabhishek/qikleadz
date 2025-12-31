@extends('layouts.structure')

@section('content')
    <div class="container">
        @can('user-create')
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow-lg">
                        <div class="card-header  text-center">
                            <h3 class="mb-0">Create New User</h3>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-3">
                                <h4 class="text-secondary">Fill in the details below</h4>
                                <a class="btn btn-primary" href="{{ route('users.index') }}">Back</a>
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

                                <!-- <div class="col-md-12">
                                    <div class="form-group">
                                        <label><strong>Role:</strong></label>
                                        {!! Form::select('role', $roles, null, ['class' => 'form-control', 'placeholder' => 'Select Role','id' =>'role']) !!}
                                    </div>
                                </div> -->

                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label><strong>Role:</strong></label>
                                        <select name="role" id="role" class="form-control">
                                            <option value="">Select Role</option>
                                            @foreach($roles as $id => $roleName)
                                                <option value="{{ $id }}">{{ $roleName }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>


                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label><strong>User Code:</strong></label>
                                        <input type="text" name="user_code" id="user_code" class="form-control" readonly>
                                    </div>
                                </div>

                                <div class="col-md-12" id="parent-container" style="display: none;">
                                    <div class="form-group">
                                        <label><strong>Select Parent:</strong></label>
                                        <select name="parent_id" id="parent_id" class="form-control">
                                            <option value="">Select Parent</option>

                                            {{-- Distributors (for Dealer role) --}}
                                            @foreach($distributors as $id => $name)
                                                <option value="{{ $id }}" class="parent-option distributor" style="display:none;">
                                                    {{ $name }}</option>
                                            @endforeach

                                            {{-- Dealers (for Sales Executive role) --}}
                                            @foreach($dealers as $id => $name)
                                                <option value="{{ $id }}" class="parent-option dealer" style="display:none;">
                                                    {{ $name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>



                                <div class="col-md-12">
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


                                <div class="col-md-12 text-center">
                                    <button type="submit" class="btn btn-primary w-50">Submit</button>
                                </div>
                            </div>
                            {!! Form::close() !!}
                        </div>
                    </div>
                </div>
            </div>
        @endcan
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
    <script
        src="{{url('/')}}/assets/libs/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js"></script>
    <!-- dashboard init -->
    <script src="{{url('/')}}/assets/js/pages/dashboard.init.js"></script>

    <script src="{{url('/')}}/assets/js/app.js"></script>

    <!-- //when Role is Chnaged that time -->
    <!-- <script>
        window.addEventListener('DOMContentLoaded', (event) => {
            // console.log("DOM fully loaded and parsed");
            $('#role').change(function() {
                // alert('Role changed!');
                var roleName = $("#role option:selected").text();
                console.log("Selected role:", roleName);

                if(roleName) {
                    var url = '/users/get-next-code/' + encodeURIComponent(roleName);
                    $.ajax({
                        url: url,
                        type: 'GET',
                        success: function(res) {
                            $('#user_code').val(res.user_code);
                        },
                        error: function(err) {
                            console.error("AJAX error:", err);
                        }
                    });
                } else {
                    $('#user_code').val('');
                }
            });
        });
        </script> -->



    <script>
        window.addEventListener('DOMContentLoaded', (event) => {

            $('#role').change(function () {
                var roleName = $("#role option:selected").text();
                console.log("Selected role:", roleName);

                // Reset Parent dropdown visibility
                $('#parent-container').hide();
                $('.parent-option').hide();
                $('#parent_id').val('');

                // Handle user code generation (already present)
                if (roleName) {
                    var url = '/users/get-next-code/' + encodeURIComponent(roleName);
                    $.ajax({
                        url: url,
                        type: 'GET',
                        success: function (res) {
                            $('#user_code').val(res.user_code);
                        },
                        error: function (err) {
                            console.error("AJAX error:", err);
                        }
                    });
                } else {
                    $('#user_code').val('');
                }

                // 🔽 Show parent options based on role
                if (roleName === 'Dealer') {
                    $('#parent-container').show();
                    $('.parent-option.distributor').show(); // show Distributors
                } else if (roleName === 'Sales Executive') {
                    $('#parent-container').show();
                    $('.parent-option.dealer').show(); // show Dealers
                }
            });
        });
    </script>

@endsection

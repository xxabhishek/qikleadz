@extends('layouts.structure')

@section('content')
<div class="container">
    @can('user-edit')
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg">
                <div class="card-header text-center">
                    <h3 class="mb-0">Edit User</h3>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <a class="btn btn-primary" href="{{ route('users.index') }}">Back</a>
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
                                {!! Form::select('role', $roles, $userRole, ['class' => 'form-control', 'id' => 'role', 'placeholder' => 'Select Role']) !!}
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <strong>User Code:</strong>
                                {!! Form::text('user_code', $user->user_code, ['class' => 'form-control', 'id' => 'user_code', 'readonly']) !!}
                            </div>
                        </div>

                        <div class="col-md-12" id="parent-container">
                            <div class="form-group">
                                <strong>Select Parent:</strong>
                                <select name="parent_id" id="parent_id" class="form-control">
                                    <option value="">Select Parent</option>
                                    @foreach($distributors as $id => $name)
                                        <option value="{{ $id }}" class="parent-option distributor" {{ $id == $userParent ? 'selected' : '' }} {{ $userRole != 3 ? 'style=display:none;' : '' }}>{{ $name }}</option>
                                    @endforeach
                                    @foreach($dealers as $id => $name)
                                        <option value="{{ $id }}" class="parent-option dealer" {{ $id == $userParent ? 'selected' : '' }} {{ $userRole != 2 ? 'style=display:none;' : '' }}>{{ $name }}</option>
                                    @endforeach
                                </select>
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
                                {!! Form::select('status', ['Active' => 'Active', 'Inactive' => 'Inactive'], $userStatus, ['class' => 'form-control']) !!}
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
    @endcan
</div>

<!-- JAVASCRIPT -->
<script src="{{ url('/') }}/assets/libs/jquery/jquery.min.js"></script>
<script src="{{ url('/') }}/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="{{ url('/') }}/assets/libs/metismenu/metisMenu.min.js"></script>
<script src="{{ url('/') }}/assets/libs/simplebar/simplebar.min.js"></script>
<script src="{{ url('/') }}/assets/libs/node-waves/waves.min.js"></script>
<script src="{{ url('/') }}/assets/libs/feather-icons/feather.min.js"></script>
<script src="{{ url('/') }}/assets/libs/pace-js/pace.min.js"></script>
<script src="{{ url('/') }}/assets/libs/apexcharts/apexcharts.min.js"></script>
<script src="{{ url('/') }}/assets/libs/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="{{ url('/') }}/assets/libs/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js"></script>
<script src="{{ url('/') }}/assets/js/pages/dashboard.init.js"></script>
<script src="{{ url('/') }}/assets/js/app.js"></script>

<script>
window.addEventListener('DOMContentLoaded', (event) => {
    const originalUserCode = '{{ $user->user_code ?? '' }}'; // Store original user_code
    const originalRoleId = {{ $userRole ?? 'null' }}; // Store original role ID

    function updateParentOptions(isRoleChange = false) {
        var roleId = parseInt($('#role').val()); // Get role ID as integer
        console.log("Selected role ID:", roleId, "isRoleChange:", isRoleChange);

        // Reset parent dropdown visibility
        $('#parent-container').hide();
        $('.parent-option').hide();
        
        // Set parent_id value: reset to empty on role change, retain on page load
        if (isRoleChange) {
            $('#parent_id').val('');
            console.log("Parent ID reset to:", $('#parent_id').val());
        } else {
            $('#parent_id').val('{{ $userParent ?? '' }}');
            console.log("Parent ID set to:", $('#parent_id').val());
        }

        // Show relevant parent options based on role
        if (roleId === 3) { // Dealer
            $('#parent-container').show();
            $('.parent-option.distributor').show();
        } else if (roleId === 2) { // Sales Executive
            $('#parent-container').show();
            $('.parent-option.dealer').show();
        }
    }

    $('#role').change(function() {
        var roleId = parseInt($(this).val()); // Get role ID as integer
        var roleName = $("#role option:selected").text();
        console.log("Role changed to:", roleName, "ID:", roleId);

        // Update parent options with reset
        updateParentOptions(true);

        // Handle user_code: restore original if reverting to original role, else fetch new
        if (roleId === originalRoleId) {
            $('#user_code').val(originalUserCode);
            console.log("Restored original user code:", originalUserCode);
        } else if (roleName) {
            var url = '/users/get-next-code/' + encodeURIComponent(roleName);
            console.log("Fetching user code from:", url);
            $.ajax({
                url: url,
                type: 'GET',
                success: function(res) {
                    $('#user_code').val(res.user_code);
                    console.log("User code updated to:", res.user_code);
                },
                error: function(err) {
                    console.error("AJAX error for role", roleName, ":", err);
                }
            });
        } else {
            $('#user_code').val('');
            console.log("No role selected, user code cleared");
        }
    });

    // Initialize parent options on page load
    updateParentOptions(false);
});
</script>

@endsection
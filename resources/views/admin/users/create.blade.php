@extends('layouts.structure')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-lg">
                    <div class="card-header text-center">
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

                        {!! Form::open(['route' => 'users.store', 'id' => 'user-create-form', 'method' => 'POST']) !!}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label><strong>Name:</strong></label>
                                    {!! Form::text('name', null, ['placeholder' => 'Enter Name', 'class' => 'form-control', 'required']) !!}
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label><strong>Email:</strong></label>
                                    {!! Form::email('email', null, ['placeholder' => 'Enter Email', 'class' => 'form-control', 'required']) !!}
                                </div>
                            </div>

                            <!-- CHANGED: Password fields to PIN fields -->
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label><strong>PIN:</strong></label>
                                    {!! Form::text('pin', null, ['placeholder' => 'Enter 4-digit PIN', 'class' => 'form-control', 'maxlength' => '4', 'required', 'id' => 'pin']) !!}
                                    <small class="text-muted">4-digit numeric PIN only</small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label><strong>Confirm PIN:</strong></label>
                                    {!! Form::text('pin_confirmation', null, ['placeholder' => 'Confirm 4-digit PIN', 'class' => 'form-control', 'maxlength' => '4', 'required', 'id' => 'pin_confirmation']) !!}
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label><strong>Role:</strong></label>
                                    <select name="role" id="role" class="form-control" required>
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
                                                {{ $name }}
                                            </option>
                                        @endforeach

                                        {{-- Dealers (for Sales Executive role) --}}
                                        @foreach($dealers as $id => $name)
                                            <option value="{{ $id }}" class="parent-option dealer" style="display:none;">
                                                {{ $name }}
                                            </option>
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
                                <button type="submit" class="btn btn-primary w-50" id="submit-btn">Submit</button>
                            </div>
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Modal for User ID and PIN -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="successModalLabel">User Created Successfully!</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="mb-3">
                        <strong>Your User ID:</strong><br>
                        <span id="display-user-id" class="text-primary fs-5"></span>
                    </div>
                    <div class="mb-3">
                        <strong>Your PIN:</strong><br>
                        <span id="display-pin" class="text-primary fs-5"></span>
                    </div>
                    <div class="alert alert-info">
                        <small>Save these credentials securely. The PIN will not be shown again.</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <a href="{{ route('users.index') }}" class="btn btn-primary">View Users</a>
                </div>
            </div>
        </div>
    </div>

    <!-- JAVASCRIPT -->
    <script src="{{url('/')}}/assets/libs/jquery/jquery.min.js"></script>
    <script src="{{url('/')}}/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>

    <script>
        window.addEventListener('DOMContentLoaded', (event) => {
            $('#role').change(function () {
                var roleName = $("#role option:selected").text();
                console.log("Selected role:", roleName);

                // Reset Parent dropdown visibility
                $('#parent-container').hide();
                $('.parent-option').hide();
                $('#parent_id').val('');

                // Handle user code generation
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

                // Show parent options based on role
                if (roleName === 'Dealer') {
                    $('#parent-container').show();
                    $('.parent-option.distributor').show(); // show Distributors
                } else if (roleName === 'Sales Executive') {
                    $('#parent-container').show();
                    $('.parent-option.dealer').show(); // show Dealers
                }
            });

            // PIN validation - allow only numbers and limit to 4 digits
            $('input[name="pin"], input[name="pin_confirmation"]').on('input', function () {
                // Remove any non-numeric characters
                this.value = this.value.replace(/[^0-9]/g, '');

                // Limit to 4 digits
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
            });

            // Prevent non-numeric input
            $('input[name="pin"], input[name="pin_confirmation"]').on('keypress', function (e) {
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });

            // AJAX Form Submission
            $('#user-create-form').on('submit', function (e) {
                e.preventDefault();
                var form = $(this);
                var submitBtn = $('#submit-btn');
                var originalText = submitBtn.text();
                submitBtn.prop('disabled', true).text('Creating...');

                // Get plain PIN for display
                var plainPin = $('#pin').val();

                $.ajax({
                    url: form.attr('action'),  // users.store
                    type: 'POST',
                    data: form.serialize(),
                    success: function (response) {
                        if (response.success) {
                            // Show modal with user_id and plain PIN
                            $('#display-user-id').text(response.user_id);
                            $('#display-pin').text(plainPin);
                            $('#successModal').modal('show');

                            // Reset form
                            form[0].reset();
                            $('#user_code').val('');
                            $('#parent-container').hide();
                            $('.parent-option').hide();
                        } else {
                            alert('Unexpected response: ' + (response.message || 'Unknown error'));
                        }
                    },
                    error: function (xhr) {
                        if (xhr.status === 422) {
                            // Validation errors
                            var errors = xhr.responseJSON.errors;
                            var errorHtml = '<div class="alert alert-danger"><ul>';
                            $.each(errors, function (field, messages) {
                                errorHtml += '<li>' + messages.join(', ') + '</li>';
                            });
                            errorHtml += '</ul></div>';
                            $('.alert-danger').remove();  // Remove old errors
                            form.prepend(errorHtml);
                        } else {
                            alert('Error: ' + (xhr.responseJSON?.message || 'Server error'));
                        }
                    },
                    complete: function () {
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                });
            });
        });
    </script>
@endsection

@extends('layouts.structure')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg">
                <div class="card-header text-center">
                    <h3 class="mb-0">Edit User</h3>
                </div>

                <div class="card-body">
                    <a class="btn btn-secondary mb-3" href="{{ route('users.index') }}">Back</a>

                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    {!! Form::model($user, [
                        'method' => 'PATCH',
                        'route' => ['users.update', $user->id],
                        'id' => 'user-edit-form'
                    ]) !!}

                    {{-- Name --}}
                    <div class="mb-3">
                        <label><strong>Name</strong></label>
                        {!! Form::text('name', null, ['class' => 'form-control', 'required']) !!}
                    </div>

                    {{-- Email --}}
                    <div class="mb-3">
                        <label><strong>Email</strong></label>
                        {!! Form::email('email', null, ['class' => 'form-control', 'readonly']) !!}
                    </div>

                    {{-- Role --}}
                    <div class="mb-3">
                        <label><strong>Role</strong></label>
                        {!! Form::select('role', $roles, $user->role, [
                            'class' => 'form-control',
                            'id' => 'role',
                            'required'
                        ]) !!}
                    </div>

                    {{-- User ID --}}
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label><strong>User Id:</strong></label>
                                    <input type="text" name="user_id" id="user_id" 
                                    class="form-control" value="{{ $user->user_id }}"  readonly>

                                </div>
                            </div>

                    {{-- Parent --}}
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


                    {{-- Mobile --}}
                    <div class="mb-3">
                        <label><strong>Mobile</strong></label>
                        {!! Form::text('mobile', null, ['class' => 'form-control']) !!}
                    </div>

                    {{-- Address --}}
                    <div class="mb-3">
                        <label><strong>Address</strong></label>
                        {!! Form::textarea('address', null, ['class' => 'form-control', 'rows' => 3]) !!}
                    </div>

                    {{-- Country --}}
                    <div class="mb-3">
                        <label><strong>Country</strong></label>
                        {!! Form::select('country_id', $countries, $user->country_id, [
                            'class' => 'form-control',
                            'required'
                        ]) !!}
                    </div>

                    {{-- Status --}}
                    <div class="mb-3">
                        <label><strong>Status</strong></label>
                        {!! Form::select('status', ['Active'=>'Active','Inactive'=>'Inactive'], $user->status, [
                            'class' => 'form-control'
                        ]) !!}
                    </div>

                    <div class="text-center">
                        <button class="btn btn-primary w-50">Update User</button>
                    </div>

                    {!! Form::close() !!}
                </div>
            </div>
        </div>
    </div>
</div>

{{-- JS --}}
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
                            $('#user_id').val(res.user_id);
                        },
                        error: function (err) {
                            console.error("AJAX error:", err);
                        }
                    });
                } else {
                    $('#user_id').val('');
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
                            $('#user_id').val('');
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

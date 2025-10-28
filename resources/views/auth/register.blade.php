@extends('layouts.app')

@section('content')
    <div class="wrapper">
        <div class="section-authentication-cover min-vh-100 d-flex flex-column">
            <div class="row g-0 flex-grow-1">
                <!-- Left Section (Image) -->
                <div
                    class="col-12 col-xl-7 col-xxl-8 auth-cover-left align-items-center justify-content-center d-none d-xl-flex">
                    <div class="card shadow-none bg-transparent rounded-0 mb-0 h-100">
                        <div class="card-body d-flex align-items-center">
                            <img src="{{ asset('assets/images/login-images/register-cover.svg') }}"
                                class="img-fluid auth-img-cover-login" width="550" alt="Register Cover" />
                        </div>
                    </div>
                </div>

                <!-- Right Section (Registration Form) -->
                <div class="col-12 col-xl-5 col-xxl-4 auth-cover-right align-items-center justify-content-center d-flex">
                    <div class="card rounded-0 shadow-none bg-transparent mb-0 w-100 h-100 d-flex align-items-center">
                        <div class="card-body p-sm-5 w-100">
                            <div class="">
                                <div class="mb-3 text-center">
                                    <img src="{{ asset('assets/images/logo-icon.png') }}" width="60" alt="Logo" />
                                </div>
                                <div class="text-center mb-4">
                                    <h5 class="">QikLeadz</h5>
                                    <p class="mb-0">Please fill the below details to create your account</p>
                                </div>
                                <div class="form-body">
                                    <form class="row g-3" method="POST" action="{{ route('register') }}">
                                        @csrf
                                        <div class="col-12">
                                            <label for="inputUsername" class="form-label">{{ __('Name') }}</label>
                                            <input type="text" class="form-control @error('name') is-invalid @enderror"
                                                id="inputUsername" name="name" value="{{ old('name') }}" required
                                                autocomplete="name" autofocus placeholder="Jhon">
                                            @error('name')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputEmailAddress"
                                                class="form-label">{{ __('Email Address') }}</label>
                                            <input type="email" class="form-control @error('email') is-invalid @enderror"
                                                id="inputEmailAddress" name="email" value="{{ old('email') }}" required
                                                autocomplete="email" placeholder="example@user.com">
                                            @error('email')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputChoosePassword" class="form-label">{{ __('Password') }}</label>
                                            <div class="input-group" id="show_hide_password">
                                                <input type="password"
                                                    class="form-control border-end-0 @error('password') is-invalid @enderror"
                                                    id="inputChoosePassword" name="password" required
                                                    autocomplete="new-password" placeholder="Enter Password">
                                                <a href="javascript:;" class="input-group-text bg-transparent"><i
                                                        class="bx bx-hide"></i></a>
                                            </div>
                                            @error('password')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputConfirmPassword"
                                                class="form-label">{{ __('Confirm Password') }}</label>
                                            <input type="password"
                                                class="form-control @error('password_confirmation') is-invalid @enderror"
                                                id="inputConfirmPassword" name="password_confirmation" required
                                                autocomplete="new-password" placeholder="Confirm Password">
                                            @error('password_confirmation')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputMobile" class="form-label">{{ __('Mobile') }}</label>
                                            <input type="text" class="form-control @error('mobile') is-invalid @enderror"
                                                id="inputMobile" name="mobile" value="{{ old('mobile') }}" required
                                                placeholder="Enter mobile number">
                                            @error('mobile')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputSelectRole" class="form-label">{{ __('Role') }}</label>
                                            <select class="form-select @error('role') is-invalid @enderror"
                                                id="inputSelectRole" name="role" aria-label="Select role">
                                                <option value="Admin" {{ old('role') == 'Admin' ? 'selected' : '' }}>Admin
                                                </option>
                                                <option value="Service-Partner"
                                                    {{ old('role') == 'Service-Partner' ? 'selected' : '' }}>Service
                                                    Partner</option>
                                                <option value="Distributor"
                                                    {{ old('role') == 'Distributor' ? 'selected' : '' }}>Distributor
                                                </option>
                                                <option value="Dealer" {{ old('role') == 'Dealer' ? 'selected' : '' }}>
                                                    Dealer</option>
                                                <option value="User" {{ old('role') == 'User' ? 'selected' : '' }}>User
                                                </option>
                                            </select>
                                            @error('role')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <label for="inputAddress" class="form-label">{{ __('Address') }}</label>
                                            <textarea class="form-control @error('address') is-invalid @enderror" id="inputAddress" name="address"
                                                rows="3" required placeholder="Enter address">{{ old('address') }}</textarea>
                                            @error('address')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="col-12">
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" name="terms"
                                                    id="flexSwitchCheckChecked" {{ old('terms') ? 'checked' : '' }}
                                                    required>
                                                <label class="form-check-label"
                                                    for="flexSwitchCheckChecked">{{ __('I read and agree to Terms & Conditions') }}</label>
                                                @error('terms')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-grid">
                                                <button type="submit"
                                                    class="btn btn-primary">{{ __('Register') }}</button>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="text-center">
                                                <p class="mb-0">Already have an account? <a href="{{ route('login') }}"
                                                        class="text-primary">Sign in here</a></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="login-separater text-center mb-5">
                                    <span>OR SIGN UP WITH</span>
                                    <hr />
                                </div>
                                <div class="list-inline contacts-social text-center">
                                    <a href="javascript:;"
                                        class="list-inline-item bg-facebook text-white border-0 rounded-3"><i
                                            class="bx bxl-facebook"></i></a>
                                    <a href="javascript:;"
                                        class="list-inline-item bg-twitter text-white border-0 rounded-3"><i
                                            class="bx bxl-twitter"></i></a>
                                    <a href="javascript:;"
                                        class="list-inline-item bg-google text-white border-0 rounded-3"><i
                                            class="bx bxl-google"></i></a>
                                    <a href="javascript:;"
                                        class="list-inline-item bg-linkedin text-white border-0 rounded-3"><i
                                            class="bx bxl-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Password show & hide js -->
    <script>
        $(document).ready(function() {
            $("#show_hide_password a").on('click', function(event) {
                event.preventDefault();
                if ($('#show_hide_password input').attr("type") == "text") {
                    $('#show_hide_password input').attr('type', 'password');
                    $('#show_hide_password i').addClass("bx-hide");
                    $('#show_hide_password i').removeClass("bx-show");
                } else if ($('#show_hide_password input').attr("type") == "password") {
                    $('#show_hide_password input').attr('type', 'text');
                    $('#show_hide_password i').removeClass("bx-hide");
                    $('#show_hide_password i').addClass("bx-show");
                }
            });
        });
    </script>
@endsection

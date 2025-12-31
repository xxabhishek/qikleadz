@extends('layouts.app')

@section('content')
    <div class="">
        <div class="section-authentication-cover">
            <div class="">
                <div class="row g-0">

                    <!-- Left Side Image -->
                    <div
                        class="col-12 col-xl-7 col-xxl-8 auth-cover-left align-items-center justify-content-center d-none d-xl-flex">
                        <div class="card shadow-none bg-transparent shadow-none rounded-0 mb-0">
                            <div class="card-body">
                                <img src="{{ asset('assets/images/login-images/login-cover.svg') }}"
                                    class="img-fluid auth-img-cover-login" width="650" alt="Login Cover Image" />
                            </div>
                        </div>
                    </div>

                    <!-- Right Side Login Form -->
                    <div class="col-12 col-xl-5 col-xxl-4 auth-cover-right align-items-center justify-content-center">
                        <div class="card rounded-0 m-3 shadow-none bg-transparent mb-0">
                            <div class="card-body">
                                <!-- Global Errors Alert -->
                                @if ($errors->any())
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert" aria-live="polite">
                                        <ul class="mb-0">
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert"
                                            aria-label="Close"></button>
                                    </div>
                                @endif

                                <div class="text-center">
                                    <h5>QikLeadz</h5>
                                    <h5 class="mb-3"></h5>
                                    <p class="mb-4">Please log in to your account</p>
                                </div>
                                <div class="form-body">
                                    <form method="POST" action="{{ route('login.post') }}" class="row g-3" novalidate>
                                        @csrf

                                        <!-- Login Input Field (Email OR User ID) -->
                                        <div class="col-12">
                                            <label for="login_input" class="form-label">Email or User ID</label>
                                            <span class="text-danger">*</span>
                                            <input id="login_input" type="text"
                                                class="form-control @error('login_input') is-invalid @enderror"
                                                name="login_input" value="{{ old('login_input') }}" required
                                                autocomplete="username" autofocus placeholder="Enter your email or user ID"
                                                maxlength="255" aria-describedby="login_input-error">
                                            @error('login_input')
                                                <span id="login_input-error" class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                            <small class="text-muted">You can use your registered email or user ID</small>
                                        </div>

                                        <!-- PIN Field -->
                                        <div class="col-12">
                                            <label for="pin" class="form-label">PIN</label>
                                            <span class="text-danger">*</span>
                                            <div class="input-group" id="show_hide_pin">
                                                <input id="pin" type="password"
                                                    class="form-control border-end-0 @error('pin') is-invalid @enderror"
                                                    name="pin" required autocomplete="off" placeholder="Enter 4-digit PIN"
                                                    maxlength="4" aria-describedby="pin-error">
                                                <a href="javascript:;" class="input-group-text bg-transparent"
                                                    aria-label="Toggle PIN visibility">
                                                    <i class="bx bx-hide"></i>
                                                </a>
                                            </div>
                                            @error('pin')
                                                <span id="pin-error" class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <!-- Submit Button -->
                                        <div class="col-12">
                                            <div class="d-grid">
                                                <button type="submit" class="btn btn-primary" id="login-btn">
                                                    <span class="btn-text">Sign in</span>
                                                    <span class="btn-loader d-none">Signing in...</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Enhanced JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const form = document.querySelector('form');
            const loginBtn = document.getElementById('login-btn');
            const btnText = loginBtn.querySelector('.btn-text');
            const btnLoader = loginBtn.querySelector('.btn-loader');
            const loginInput = document.getElementById('login_input');
            const pinInput = document.getElementById('pin');

            // Auto-focus Login Input
            if (loginInput) loginInput.focus();

            // PIN toggle
            const showHidePin = document.getElementById('show_hide_pin');
            if (showHidePin) {
                const toggleLink = showHidePin.querySelector('a');
                const toggleIcon = showHidePin.querySelector('i');

                toggleLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (pinInput.type === 'password') {
                        pinInput.type = 'text';
                        toggleIcon.classList.remove('bx-hide');
                        toggleIcon.classList.add('bx-show');
                    } else {
                        pinInput.type = 'password';
                        toggleIcon.classList.remove('bx-show');
                        toggleIcon.classList.add('bx-hide');
                    }
                });
            }

            // PIN: Numeric only, max 4 digits
            if (pinInput) {
                pinInput.addEventListener('input', function () {
                    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
                });

                pinInput.addEventListener('keypress', function (e) {
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                        e.preventDefault();
                    }
                });

                // Auto-submit on Enter in PIN (with validation)
                pinInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter' && this.value.length === 4 && loginInput.value.trim()) {
                        form.submit();
                    }
                });
            }

            // Loading state on submit
            form.addEventListener('submit', function () {
                loginBtn.disabled = true;
                btnText.classList.add('d-none');
                btnLoader.classList.remove('d-none');
            });
        });
    </script>
@endsection

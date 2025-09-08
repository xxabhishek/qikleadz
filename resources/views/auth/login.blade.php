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
                            <div class="card-body p-sm-5">
                                @if ($errors->any())
                                    <div class="alert alert-danger">
                                        <ul>
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                                <div class="text-center">

                                    <h5>QikLeadz</h5>
                                    <h5 class="mb-3"></h5>
                                    <p class="mb-4">Please log in to your account</p>
                                </div>
                                <div class="form-body">
                                    <form method="POST" action="{{ route('login') }}" class="row g-3">
                                        @csrf

                                        <!-- Email Field -->
                                        <div class="col-12">
                                            <label for="email" class="form-label">Email</label>
                                            <span class="text-danger">*</span>
                                            <input id="email" type="email"
                                                class="form-control @error('email') is-invalid @enderror" name="email"
                                                value="{{ old('email') }}" required autocomplete="email" autofocus
                                                placeholder="jhon@gmail.com">
                                            @error('email')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <!-- Password Field -->
                                        <div class="col-12">
                                            <label for="password" class="form-label">Password</label>
                                            <span class="text-danger">*</span>
                                            <div class="input-group" id="show_hide_password">
                                                <input id="password" type="password"
                                                    class="form-control border-end-0 @error('password') is-invalid @enderror"
                                                    name="password" required autocomplete="current-password"
                                                    placeholder="Enter Password">
                                                <a href="javascript:;" class="input-group-text bg-transparent"><i
                                                        class="bx bx-hide"></i></a>
                                                @error('password')
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <!-- Remember Me and Forgot Password -->
                                        {{-- <div class="col-md-6">
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" name="remember"
                                                    id="remember" {{ old('remember') ? 'checked' : '' }}>
                                                <label class="form-check-label" for="remember">Remember Me</label>
                                            </div>
                                        </div> --}}
                                        <!--<div class="col-md-6 text-end">-->
                                        <!--    @if (Route::has('password.request'))
    -->
                                        <!--        <a class="btn btn-link" href="{{ route('password.request') }}">Forgot-->
                                        <!--            Password?</a>-->
                                        <!--
    @endif-->
                                        <!--</div>-->

                                        <!-- Submit Button -->
                                        <div class="col-12">
                                            <div class="d-grid">
                                                <button type="submit" class="btn btn-primary">Sign in</button>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="text-center ">
                                                <p class="mb-0">Don't have an account yet? <a
                                                        href="{{ route('register') }}">Sign up here</a>
                                                </p>
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
@endsection

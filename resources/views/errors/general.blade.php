<!-- <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Error {{ $status ?? 500 }}</title>

    <link rel="icon" href="{{ asset('assets/images/favicon-32x32.png') }}" type="image/png" />
    <link href="{{ asset('assets/css/pace.min.css') }}" rel="stylesheet" />
    <script src="{{ asset('assets/js/pace.min.js') }}"></script>
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/bootstrap-extended.css') }}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet">
</head>

<body>
    <div class="wrapper">


        <div class="error-404 d-flex align-items-center justify-content-center">
            <div class="container">
                <div class="card py-5">
                    <div class="row g-0">
                        <div class="col col-xl-5">
                            <div class="card-body p-4">
                                <h1 class="display-1">
                                    @php
                                        $code = (string) ($status ?? 500);
                                        $colors = ['text-primary', 'text-danger', 'text-success'];
                                    @endphp

                                    @foreach (str_split($code) as $i => $digit)
                                        <span class="{{ $colors[$i % count($colors)] }}">{{ $digit }}</span>
                                    @endforeach
                                </h1>

                                <h2 class="font-weight-bold display-4">
                                    {{ $title ?? 'Oops! Something went wrong' }}
                                </h2>
                                <p>
                                    {{ $message ?? 'Please try again later or go back to the homepage.' }}
                                </p>
                                <div class="mt-5">
                                    <a href="{{ url('/home') }}" class="btn btn-primary btn-lg px-md-5 radius-30">Go
                                        Home</a>
                                    <a href="{{ url()->previous() }}"
                                        class="btn btn-outline-dark btn-lg ms-3 px-md-5 radius-30">Back</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-3 fixed-bottom border-top shadow">
            <div class="d-flex align-items-center justify-content-between flex-wrap">
                <ul class="list-inline mb-0">
                    <li class="list-inline-item">Follow Us :</li>
                    <li class="list-inline-item"><a href="#"><i class='bx bxl-facebook me-1'></i>Facebook</a></li>
                    <li class="list-inline-item"><a href="#"><i class='bx bxl-twitter me-1'></i>Twitter</a></li>
                    <li class="list-inline-item"><a href="#"><i class='bx bxl-google me-1'></i>Google</a></li>
                </ul>
                <p class="mb-0">Copyright © {{ date('Y') }}. All rights reserved.</p>
            </div>
        </div>
    </div>
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>
</body>

</html> -->

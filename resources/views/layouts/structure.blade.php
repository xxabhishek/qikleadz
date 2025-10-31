<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Rocker - Bootstrap 5 Admin Dashboard Template</title>

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('assets/images/favicon-32x32.png') }}" type="image/png" />

    <!-- CSS Plugins -->
    <link href="{{ asset('assets/plugins/vectormap/jquery-jvectormap-2.0.2.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/plugins/simplebar/css/simplebar.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/pace.min.css') }}" rel="stylesheet" />

    <!-- Bootstrap CSS -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/bootstrap-extended.css') }}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet">

    <!-- Theme Styles -->
    <link rel="stylesheet" href="{{ asset('assets/css/dark-theme.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/semi-dark.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/header-colors.css') }}" />

    <!-- Additional CSS for Form Styling -->
    <style>
        .form-control {
            border-radius: 0.25rem;
            border: 1px solid #ced4da;
        }

        .card-header {
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }

        .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <!-- Header Wrapper -->
        <div class="header-wrapper">
            <header>
                <div class="topbar d-flex align-items-center">
                    <nav class="navbar navbar-expand gap-3">
                        <!-- Logo -->
                        <div class="topbar-logo-header d-none d-lg-flex">
                            <div>
                                <img src="{{ asset('assets/images/logo-icon.png') }}" class="logo-icon" alt="logo icon">
                            </div>
                            <div>
                                <h4 class="logo-text">Rocker</h4>
                            </div>
                        </div>
                        <!-- Mobile Menu Toggle -->
                        <div class="mobile-toggle-menu d-block d-lg-none" data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar">
                            <i class='bx bx-menu'></i>
                        </div>
                        <!-- Search Bar -->
                        <div class="search-bar d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#SearchModal">
                            <a href="javascript:;" class="btn d-flex align-items-center"><i
                                    class='bx bx-search'></i>Search</a>
                        </div>
                        <!-- Top Menu -->
                        <div class="top-menu ms-auto">
                            <ul class="navbar-nav align-items-center gap-1">
                                <!-- Mobile Search Icon -->
                                <li class="nav-item mobile-search-icon d-flex d-lg-none" data-bs-toggle="modal"
                                    data-bs-target="#SearchModal">
                                    <a class="nav-link" href="javascript:;"><i class='bx bx-search'></i></a>
                                </li>
                                <!-- Language Dropdown -->
                                <li class="nav-item dropdown dropdown-laungauge d-none d-sm-flex">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;"
                                        data-bs-toggle="dropdown">
                                        <img src="{{ asset('assets/images/county/02.png') }}" width="22" alt="">
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/01.png') }}" width="20"
                                                    alt=""><span class="ms-2">English</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/02.png') }}" width="20"
                                                    alt=""><span class="ms-2">Catalan</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/03.png') }}" width="20"
                                                    alt=""><span class="ms-2">French</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/04.png') }}" width="20"
                                                    alt=""><span class="ms-2">Belize</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/05.png') }}" width="20"
                                                    alt=""><span class="ms-2">Colombia</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/06.png') }}" width="20"
                                                    alt=""><span class="ms-2">Spanish</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/07.png') }}" width="20"
                                                    alt=""><span class="ms-2">Georgian</span></a></li>
                                        <li><a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
                                                <img src="{{ asset('assets/images/county/08.png') }}" width="20"
                                                    alt=""><span class="ms-2">Hindi</span></a></li>
                                    </ul>
                                </li>
                                <!-- Dark Mode Toggle -->
                                <li class="nav-item dark-mode d-none d-sm-flex">
                                    <a class="nav-link dark-mode-icon" href="javascript:;"><i
                                            class='bx bx-moon'></i></a>
                                </li>
                                <!-- App Dropdown -->
                                <li class="nav-item dropdown dropdown-app">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret"
                                        data-bs-toggle="dropdown" href="javascript:;">
                                        <i class='bx bx-grid-alt'></i></a>
                                    <div class="dropdown-menu dropdown-menu-end p-0">
                                        <div class="app-container p-2 my-2">
                                            <div class="row gx-0 gy-2 row-cols-3 justify-content-center p-2">
                                                <div class="col">
                                                    <a href="javascript:;">
                                                        <div class="app-box text-center">
                                                            <div class="app-icon">
                                                                <img src="{{ asset('assets/images/app/slack.png') }}"
                                                                    width="30" alt="">
                                                            </div>
                                                            <div class="app-name">
                                                                <p class="mb-0 mt-1">Slack</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div class="col">
                                                    <a href="javascript:;">
                                                        <div class="app-box text-center">
                                                            <div class="app-icon">
                                                                <img src="{{ asset('assets/images/app/behance.png') }}"
                                                                    width="30" alt="">
                                                            </div>
                                                            <div class="app-name">
                                                                <p class="mb-0 mt-1">Behance</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <!-- Add other app icons similarly -->
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <!-- Notifications Dropdown -->
                                <li class="nav-item dropdown dropdown-large">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                                        href="#" data-bs-toggle="dropdown">
                                        <span class="alert-count">7</span><i class='bx bx-bell'></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a href="javascript:;">
                                            <div class="msg-header">
                                                <p class="msg-header-title">Notifications</p>
                                                <p class="msg-header-badge">8 New</p>
                                            </div>
                                        </a>
                                        <div class="header-notifications-list">
                                            <a class="dropdown-item" href="javascript:;">
                                                <div class="d-flex align-items-center">
                                                    <div class="user-online">
                                                        <img src="{{ asset('assets/images/avatars/avatar-1.png') }}"
                                                            class="msg-avatar" alt="user avatar">
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h6 class="msg-name">Daisy Anderson<span
                                                                class="msg-time float-end">5 sec ago</span></h6>
                                                        <p class="msg-info">The standard chunk of lorem</p>
                                                    </div>
                                                </div>
                                            </a>
                                            <!-- Add other notification items similarly -->
                                        </div>
                                        <a href="javascript:;">
                                            <div class="text-center msg-footer">
                                                <button class="btn btn-primary w-100">View All Notifications</button>
                                            </div>
                                        </a>
                                    </div>
                                </li>
                                <!-- Cart Dropdown -->
                                <li class="nav-item dropdown dropdown-large">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                                        href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span class="alert-count">8</span><i class='bx bx-shopping-bag'></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a href="javascript:;">
                                            <div class="msg-header">
                                                <p class="msg-header-title">My Cart</p>
                                                <p class="msg-header-badge">10 Items</p>
                                            </div>
                                        </a>
                                        <div class="header-message-list">
                                            <a class="dropdown-item" href="javascript:;">
                                                <div class="d-flex align-items-center gap-3">
                                                    <div class="position-relative">
                                                        <div class="cart-product rounded-circle bg-light">
                                                            <img src="{{ asset('assets/images/products/11.png') }}"
                                                                class="" alt="product image">
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h6 class="cart-product-title mb-0">Men White T-Shirt</h6>
                                                        <p class="cart-product-price mb-0">1 X $29.00</p>
                                                    </div>
                                                    <div>
                                                        <p class="cart-price mb-0">$250</p>
                                                    </div>
                                                    <div class="cart-product-cancel"><i class="bx bx-x"></i></div>
                                                </div>
                                            </a>
                                            <!-- Add other cart items similarly -->
                                        </div>
                                        <a href="javascript:;">
                                            <div class="text-center msg-footer">
                                                <div class="d-flex align-items-center justify-content-between mb-3">
                                                    <h5 class="mb-0">Total</h5>
                                                    <h5 class="mb-0 ms-auto">$489.00</h5>
                                                </div>
                                                <button class="btn btn-primary w-100">Checkout</button>
                                            </div>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- User Dropdown -->
                        <div class="user-box dropdown px-4">
                            <a class="flex items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret" href="#"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div class="user-info">
                                    @if (Auth::check())
                                        <p class="user-name mb-0 text-gray-800 font-semibold">{{ Auth::user()->name }}
                                        </p>
                                    @else
                                        <p class="user-name mb-0 text-gray-800 font-semibold">--</p>
                                    @endif
                                </div>
                            </a>
                            <ul
                                class="dropdown-menu dropdown-menu-end mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
                                <li>
                                    <a class="dropdown-item flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        href="{{ route('logout') }}"
                                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                        <i class="fas fa-sign-out-alt text-lg"></i><span>Logout</span>
                                    </a>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                        style="display: none;">
                                        @csrf
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
            <!-- Navigation -->
            <div class="primary-menu">
                <nav class="navbar navbar-expand-lg align-items-center">
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header border-bottom">
                            <div class="d-flex align-items-center">
                                <div>
                                    <img src="{{ asset('assets/images/logo-icon.png') }}" class="logo-icon"
                                        alt="logo icon">
                                </div>
                                <div>
                                    <h4 class="logo-text">Rocker</h4>
                                </div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav align-items-center flex-grow-1">
                                <!-- Dashboard -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;"
                                        data-bs-toggle="dropdown">
                                        <div class="parent-icon"><i class='bx bx-home-alt'></i></div>
                                        <div class="menu-title d-flex align-items-center">Dashboard</div>
                                        <div class="ms-auto dropy-icon"><i class='bx bx-chevron-down'></i></div>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="{{ url('/dashboard') }}"><i
                                                    class='bx bx-pie-chart-alt'></i>Default</a></li>
                                        <li><a class="dropdown-item" href="{{ url('/dashboard/alternate') }}"><i
                                                    class='bx bx-shield-alt-2'></i>Alternate</a></li>
                                        <li><a class="dropdown-item" href="{{ url('/dashboard/graphical') }}"><i
                                                    class='bx bx-line-chart'></i>Graphical</a></li>
                                    </ul>
                                </li>

                                {{-- User --}}
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="javascript:;" id="inwardDropdown"
                                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div class="parent-icon"><i class="bx bx-user"></i></div>
                                        <div class="menu-title">Users</div>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="inwardDropdown">
                                        <li><a class="dropdown-item" href="{{ route('users.create') }}"><i
                                                    class="bx bx-plus-circle me-2"></i>Create</a>
                                        <li><a class="dropdown-item" href="{{ route('users.index') }}"><i
                                                    class="bx bx-list-ul me-2"></i>Show</a>
                                    </ul>
                                </li>

                                {{-- Role --}}
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;"
                                        data-bs-toggle="dropdown">
                                        <div class="parent-icon"><i class='lni lni-users'></i></div>
                                        <div class="menu-title d-flex align-items-center">Role</div>
                                        <div class="ms-auto dropy-icon"><i class='bx bx-chevron-down'></i></div>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="{{ route('roles.create') }}"><i
                                                    class="bx bx-plus-circle me-2"></i>Create</a></li>
                                        <li><a class="dropdown-item" href="{{ route('roles.index') }}"><i
                                                    class="bx bx-list-ul me-2"></i>Show</a></li>
                                    </ul>
                                </li>

                                <!-- Masters Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;"
                                        data-bs-toggle="dropdown">
                                        <div class="parent-icon"><i class='bx bx-category'></i></div>
                                        <div class="menu-title d-flex align-items-center">Masters</div>
                                        <div class="ms-auto dropy-icon"><i class='bx bx-chevron-down'></i></div>
                                    </a>
                                    <ul class="dropdown-menu">



                                        <!-- Country -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Country
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('country.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('country.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        <!-- State -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>State
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('state.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('state.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        <!-- City -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>City
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('city.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('city.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>


                                        <!-- Vehicle Segment -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Vehicle Segment
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item"
                                                        href="{{ route('vehicle-segment.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item"
                                                        href="{{ route('vehicle-segment.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>
                                        {{-- -OEM --}}

                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>OEM
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('oem.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('oem.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- Brand --}}


                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Brand
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('brand.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('brand.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>


                                        {{-- Variant --}}

                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Variant
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('variants.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('variants.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- Transmission --}}
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Transmission
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item"
                                                        href="{{ route('transmission.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('transmission.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        <!-- Fuel Types -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Fuel Types
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('fuel-types.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('fuel-types.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>


                                        <!-- CC -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>CC
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('cc.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('cc.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        <!-- Vehicle Usage -->
                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Vehicle Usage
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item"
                                                        href="{{ route('vehicle-usage.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item"
                                                        href="{{ route('vehicle-usage.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- Color --}}

                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Color
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('color.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('color.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- -Feature --}}


                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Feature
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('feature.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('feature.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- -Tech Specification --}}


                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Tech Spec
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('tech-spec.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('tech-spec.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                        {{-- -Galleries --}}

                                        <li class="nav-item dropend">
                                            <a class="dropdown-item dropdown-toggle dropdown-toggle-nocaret"
                                                href="javascript:;" data-bs-toggle="dropdown">
                                                <i class="lni lni-folder me-2"></i>Gallery
                                            </a>
                                            <ul class="dropdown-menu dropdown-submenu">
                                                <li><a class="dropdown-item" href="{{ route('galleries.create') }}"><i
                                                            class="bx bx-plus-circle me-2"></i>Create</a></li>
                                                <li><a class="dropdown-item" href="{{ route('galleries.index') }}"><i
                                                            class="bx bx-list-ul me-2"></i>Show</a></li>
                                            </ul>
                                        </li>

                                    </ul>
                                </li>
                            </ul>


                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <!-- Page Wrapper -->
        <div class="page-wrapper">
            <div class="page-content">
                @yield('content')
            </div>
        </div>
        <!-- Search Modal -->
        <div class="modal" id="SearchModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down">
                <div class="modal-content">
                    <div class="modal-header gap-2">
                        <div class="position-relative popup-search w-100">
                            <input class="form-control form-control-lg ps-5 border border-3 border-primary"
                                type="search" placeholder="Search">
                            <span
                                class="position-absolute top-50 search-show ms-3 translate-middle-y start-0 top-50 fs-4"><i
                                    class='bx bx-search'></i></span>
                        </div>
                        <button type="button" class="btn-close d-md-none" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="search-list">
                            <!-- Add search items as per dashboard template -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Overlay -->
        <div class="overlay toggle-icon"></div>
        <!-- Back to Top -->
        <a href="javascript:;" class="back-to-top"><i class='bx bxs-up-arrow-alt'></i></a>
        <!-- Footer -->
        <footer class="page-footer">
            <p class="mb-0">Copyright © 2023. All rights reserved.</p>
        </footer>
    </div>
    <!-- Theme Switcher -->
    <div class="switcher-wrapper">
        <div class="switcher-btn"><i class='bx bx-cog bx-spin'></i></div>
        <div class="switcher-body">
            <div class="d-flex align-items-center">
                <h5 class="mb-0 text-uppercase">Theme Customizer</h5>
                <button type="button" class="btn-close ms-auto close-switcher" aria-label="Close"></button>
            </div>
            <hr />
            <h6 class="mb-0">Theme Styles</h6>
            <hr />
            <div class="d-flex align-items-center justify-content-between">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="lightmode" checked>
                    <label class="form-check-label" for="lightmode">Light</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="darkmode">
                    <label class="form-check-label" for="darkmode">Dark</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="semidark">
                    <label class="form-check-label" for="semidark">Semi Dark</label>
                </div>
            </div>
            <hr />
            <div class="form-check">
                <input class="form-check-input" type="radio" id="minimaltheme" name="flexRadioDefault">
                <label class="form-check-label" for="minimaltheme">Minimal Theme</label>
            </div>
            <hr />
            <h6 class="mb-0">Header Colors</h6>
            <hr />
            <div class="header-colors-indigators">
                <div class="row row-cols-auto g-3">
                    <div class="col">
                        <div class="indigator headercolor1" id="headercolor1"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor2" id="headercolor2"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor3" id="headercolor3"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor4" id="headercolor4"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor5" id="headercolor5"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor6" id="headercolor6"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor7" id="headercolor7"></div>
                    </div>
                    <div class="col">
                        <div class="indigator headercolor8" id="headercolor8"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Scripts -->
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/simplebar/js/simplebar.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js') }}"></script>
    <script src="{{ asset('assets/plugins/vectormap/jquery-jvectormap-2.0.2.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/vectormap/jquery-jvectormap-world-mill-en.js') }}"></script>
    <script src="{{ asset('assets/plugins/chartjs/js/chart.js') }}"></script>
    <script src="{{ asset('assets/js/index.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    @yield('scripts')
</body>

</html>

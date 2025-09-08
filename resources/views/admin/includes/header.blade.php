<header id="page-topbar">
                <div class="navbar-header">
                    <div class="d-flex">
                        <!-- LOGO -->
                        <div class="navbar-brand-box">
                             <a href="{{url('/')}}/home" class="logo logo-dark">
                                <span class="logo-sm">
                                    <img src="{{url('/')}}/assets/images/logo.svg" alt="" height="60">
                                </span>
                                <span class="logo-lg">
                                    <img src="{{url('/')}}/assets/images/logo.svg" alt="" height="60"> <span class="logo-txt"> <img src="{{url('/')}}/assets/images/logo-text-light.svg" alt="" height="23"> </span>
                                </span>
                            </a>

                            <a href="{{url('/')}}/home" class="logo logo-light">
                                <span class="logo-sm">
                                    <img src="{{url('/')}}/assets/images/logo.svg" alt="" height="60">
                                </span>
                                <span class="logo-lg">
                                    <img src="{{url('/')}}/assets/images/logo.svg" alt="" height="60"> <span class="logo-txt"> <img src="{{url('/')}}/assets/images/logo-text-light.svg" alt="" height="23"> </span>
                                </span>
                            </a>
                        </div>

                        <button type="button" class="btn btn-sm px-3 font-size-16 header-item" id="vertical-menu-btn">
                            <i class="fa fa-fw fa-bars"></i>
                        </button>

                        
                    </div>

                    <div class="d-flex">

                        <div class="dropdown d-inline-block d-lg-none ms-2">
                            <button type="button" class="btn header-item" id="page-header-search-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i data-feather="search" class="icon-lg"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-search-dropdown">
        
                                <form class="p-3" method="POST" action="">
                                    @csrf
                                    @method('POST')
                                    <div class="form-group m-0">
                                        <div class="input-group">
                                            <input type="text" class="form-control" placeholder="Search ..." aria-label="Search Result">

                                            <button class="btn btn-primary" type="submit"><i class="mdi mdi-magnify"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
<!-- 
                        <div class="dropdown d-none d-sm-inline-block">
                            <button type="button" class="btn header-item">
                                <a style="text-decoration: none;color: inherit;" onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)" href="#" download="page.html">Download</a>
                            </button> 
                        </div>-->

                        <div class="dropdown d-none d-sm-inline-block">
                            <button type="button" class="btn header-item" id="mode-setting-btn">
                                <i data-feather="moon" class="icon-lg layout-mode-dark"></i>
                                <i data-feather="sun" class="icon-lg layout-mode-light"></i>
                            </button>
                        </div>
                        


                        <div class="dropdown d-inline-block">
                            <button type="button" class="btn header-item noti-icon position-relative" id="page-header-notifications-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i data-feather="bell" class="icon-lg"></i>
                                <span class="badge bg-danger rounded-pill">{{Session::get('notification_count');}}</span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-notifications-dropdown">
                                <div class="p-3">
                                    <div class="row align-items-center">
                                        <div class="col">
                                            <h6 class="m-0"> Notifications </h6>
                                        </div>
                                        <div class="col-auto">
                                            <a href="#!" class="small text-reset text-decoration-underline"> Unread ({{Session::get('notification_count');}})</a>
                                        </div>
                                    </div>
                                </div>
                               
                                

                                <div class="p-2 border-top d-grid">
                                    <a class="btn btn-sm btn-link font-size-14 text-center" href="">
                                        <i class="mdi mdi-arrow-right-circle me-1"></i> <span>View More..</span> 
                                    </a>
                                </div>
                            </div>
                        </div>

                        

                        <div class="dropdown d-inline-block">
                            <button type="button" class="btn header-item bg-soft-light border-start border-end" id="page-header-user-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                
                                <span class="d-none d-xl-inline-block ms-1 fw-medium">{{Auth::user()->name}}</span>
                                <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end">
                                <!-- item-->
                               
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="{{ route('home.logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('home.logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
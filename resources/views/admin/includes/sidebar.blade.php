 <!-- ========== Left Sidebar Start ========== -->
 <div class="vertical-menu">

<div data-simplebar class="h-100">

    <!--- Sidemenu -->
    <div id="sidebar-menu">
        <!-- Left Menu Start -->
        <ul class="metismenu list-unstyled" id="side-menu">
            <li class="menu-title" data-key="t-menu">Menu</li>

            <li>
                <a href="{{ route('home') }}">
                    <i data-feather="home"></i>
                    <span data-key="t-dashboard">Dashboard</span>
                </a>
            </li>

            
         
            <li>
                <a href="javascript: void(0);" class="has-arrow">
                    <i data-feather="align-justify"></i>
                    <span data-key="t-ecommerce">Masters</span>
                </a>
                <ul class="sub-menu" aria-expanded="false">
                     @can('plant-list')
                    <li><a href="{{ route('plant.index') }}" data-key="t-products">Plant</a></li>
                    @endcan
                  @can('grade-list')
                    <li><a href="{{ route('grade.index') }}" data-key="t-products">Grade</a></li>
                    @endcan
                     @can('line-list')
                    <li><a href="{{ route('line.index') }}" data-key="t-products">Line</a></li>
                    @endcan

                    @can('row-list')
                    <li><a href="{{ route('row.index') }}" data-key="t-products">Row</a></li>
                    @endcan

                     @can('column-list')
                    <li><a href="{{ route('column.index') }}" data-key="t-products">Column</a></li>
                    @endcan

                 @can('manufacturerType-list')
                    <li><a href="{{ route('manufacturerType.index') }}" data-key="t-products">Manufacturer Types</a></li>
                    @endcan
                     @can('manufacturer-list')
                    <li><a href="{{ route('manufacturer.index') }}" data-key="t-products">Manufacturer </a></li>
                    @endcan

                     @can('logistic-list')
                    <li><a href="{{ route('logistic.index') }}" data-key="t-products">Logistic </a></li>
                    @endcan
                     @can('clientType-list')
                    <li><a href="{{ route('clientType.index') }}" data-key="t-products">Client Types</a></li>
                    @endcan
                     @can('client-list')
                    <li><a href="{{ route('client.index') }}" data-key="t-products">Client </a></li>
                    @endcan
                   
                    
                   
                </ul>
            </li>
             @can('inward-list')
            <li>
                <a href="{{ route('inward.index') }}">
                    <i data-feather="list"></i>
                    <span data-key="t-dashboard">Inward</span>
                </a>
            </li>
           @endcan
           <li>
                <a href="javascript: void(0);" class="has-arrow">
                    <i data-feather="align-justify"></i>
                    <span data-key="t-ecommerce">Production</span>
                </a>
                <ul class="sub-menu" aria-expanded="false">
                     @can('plan-list')
                    <li><a href="{{ route('plan.create') }}" data-key="t-products">Create Plan</a></li>
                    @endcan
                    @can('plan-list')
                    <li><a href="{{ route('plan.index') }}" data-key="t-products">View Plans</a></li>
                    @endcan
                  @can('plan-list')
                    <li><a href="{{ route('plan.planByStatus','Approved') }}" data-key="t-products">Approved Plans</a></li>
                    @endcan
                     @can('plan-list')
                    <li><a href="{{ route('plan.planByStatus','Under Production') }}" data-key="t-products">Under Production Plans</a></li>
                    @endcan

                    @can('plan-list')
                    <li><a href="{{ route('plan.planByStatus','Completed') }}" data-key="t-products">Completed Plans</a></li>
                    @endcan

                                      
                    
                   
                </ul>
            </li>

              <li>
                <a href="javascript: void(0);" class="has-arrow">
                    <i data-feather="align-justify"></i>
                    <span data-key="t-ecommerce">Dispatch</span>
                </a>
                <ul class="sub-menu" aria-expanded="false">
                    @can('dispatch-list')
                    <li><a href="{{ route('dispatch.planByStatusdispatch','Completed') }}" data-key="t-products">Completed Plans</a></li>
                    @endcan
                     @can('dispatch-list')
                    <li><a href="{{ route('dispatch.index') }}" data-key="t-products">Ready to Dispatch</a></li>
                    @endcan

                     @can('dispatch-list')
                    <li><a href="{{ route('dispatch.dispatchByStatus','Dispatched') }}" data-key="t-products">Dispatched</a></li>
                    @endcan
                                                  
                    
                   
                </ul>
            </li>
             <li>
                <a href="javascript: void(0);" class="has-arrow">
                    <i data-feather="align-justify"></i>
                    <span data-key="t-ecommerce">Scrap</span>
                </a>
                <ul class="sub-menu" aria-expanded="false">
                    @can('scrap-list')
                    <li><a href="{{ route('scrap.index') }}" data-key="t-products"> Scrap</a></li>
                    @endcan
                
                    @can('scrap-list')
                    <li><a href="{{ route('scrap.scrapdispatchByStatus','Dispatched') }}" data-key="t-products">Dispatched Scrap</a></li>
                    @endcan            
                                                  
                    
                   
                </ul>
            </li> 
                    @can('role-list')
             <li>
                                <a href="javascript: void(0);" class="has-arrow">
                                    <i data-feather="user-check"></i>
                                    <span data-key="t-email">Role Masters</span>
                                </a>
                                <ul class="sub-menu" aria-expanded="false">
                                     <li><a href="{{ route('roles.index') }}" data-key="t-products">Role</a></li>
                     <li><a href="{{ route('roles.create') }}" data-key="t-products">Create Role</a></li>
                                </ul>
            </li>
                    @endcan
                    @can('user-list')

             <li>
                                <a href="javascript: void(0);" class="has-arrow">
                                    <i data-feather="users"></i>
                                    <span data-key="t-email">User Masters</span>
                                </a>
                                <ul class="sub-menu" aria-expanded="false">
                                      <li><a href="{{ route('users.index') }}" data-key="t-products">Users</a></li>
                                       <li><a href="{{ route('users.create') }}" data-key="t-products">New Users</a></li>
                                </ul>
            </li>
           
            
                    @endcan
           


            
        </ul>

        
    </div>
    <!-- Sidebar -->
</div>
</div>
<!-- Left Sidebar End -->
@extends('layouts.structure')

@section('content')
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg border-0 rounded-lg">
                <div class="card-header  d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Edit Role</h4>
                    <a class="btn btn-primary" href="{{ route('roles.index') }}">
                        <i class="fas fa-arrow-left"></i> Back
                    </a>
                </div>

                <div class="card-body">
                    @if (count($errors) > 0)
                        <div class="alert alert-danger">
                            <strong>Whoops!</strong> There were some problems with your input.<br><br>
                            <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                            </ul>
                        </div>
                    @endif

                    {!! Form::model($role, ['method' => 'PATCH', 'route' => ['roles.update', $role->id]]) !!}
                        <div class="mb-3">
                            {!! Form::label('name', 'Role Name') !!}
                            {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => 'Enter Role Name']) !!}
                        </div>

                        <div class="mb-3">
                            <strong>Permissions:</strong>
                            <div class="form-check form-check-inline">
                                @foreach($permission as $value)
                                    <label class="form-check-label ms-4" style="width: 200px;">
                                        {{ Form::checkbox('permission[]', $value->id, in_array($value->id, $rolePermissions) ? true : false, ['class' => 'form-check-input']) }}
                                        {{ $value->name }}
                                    </label>
                                @endforeach
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary">Update Role</button>
                    {!! Form::close() !!}
                </div>
            </div>
        </div>
    </div>
</div>





<!-- JAVASCRIPT -->
        <script src="{{url('/')}}/assets/libs/jquery/jquery.min.js"></script>
        <script src="{{url('/')}}/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="{{url('/')}}/assets/libs/metismenu/metisMenu.min.js"></script>
        <script src="{{url('/')}}/assets/libs/simplebar/simplebar.min.js"></script>
        <script src="{{url('/')}}/assets/libs/node-waves/waves.min.js"></script>
        <script src="{{url('/')}}/assets/libs/feather-icons/feather.min.js"></script>
        <!-- pace js -->
        <script src="{{url('/')}}/assets/libs/pace-js/pace.min.js"></script>

        <!-- apexcharts -->
        <script src="{{url('/')}}/assets/libs/apexcharts/apexcharts.min.js"></script>

        <!-- Plugins js-->
        <script src="{{url('/')}}/assets/libs/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.min.js"></script>
        <script src="{{url('/')}}/assets/libs/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js"></script>
        <!-- dashboard init -->
        <script src="{{url('/')}}/assets/js/pages/dashboard.init.js"></script>

        <script src="{{url('/')}}/assets/js/app.js"></script>
@endsection

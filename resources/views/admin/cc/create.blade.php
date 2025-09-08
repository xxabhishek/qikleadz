@extends('layouts.structure')

@section('title', 'Create CC - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header"> Add CC</div>
                    <div class="card-body">

                        {{-- Error Messages --}}
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        {{-- Form --}}
                        <form action="{{ route('cc.store') }}" method="POST">
                            @csrf

                            {{-- CC Input --}}
                            <div class="form-group mb-3">
                                <label for="name">CC Name</label>
                                <input type="text" name="name" id="name" class="form-control"
                                    placeholder="Enter CC name" value="{{ old('name') }}" required>
                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
                            <a href="{{ route('cc.index') }}" class="btn btn-secondary">Cancel</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

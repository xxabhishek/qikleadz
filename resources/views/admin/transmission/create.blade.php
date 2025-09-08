@extends('layouts.structure')

@section('title', 'Create Transmission - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header"> Add Transmission</div>
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
                        <form action="{{ route('transmission.store') }}" method="POST">
                            @csrf

                            {{-- Transmission Input --}}
                            <div class="form-group mb-3">
                                <label for="name">Transmission Name</label>
                                <input type="text" name="name" id="name" class="form-control"
                                       placeholder="Enter Transmission name" value="{{ old('name') }}" required>
                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
                            <a href="{{ route('transmission.index') }}" class="btn btn-secondary">Cancel</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

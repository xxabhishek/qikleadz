@extends('layouts.structure')

@section('title', 'Edit Country - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Edit Country</div>
                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('country.update', $countries->id) }}">
                        @csrf
                        @method('PUT')

                        <div class="form-group">
                            <label for="name">Country Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value="{{ old('name', $countries->name) }}"
                                class="form-control"
                                required
                                oninput="this.value = this.value.replace(/[0-9]/g, '')"
                                placeholder="Enter country name"
                            >
                           
                        </div>

                        <button type="submit" class="btn btn-primary mt-3">Update</button>
                        <a href="{{ route('country.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

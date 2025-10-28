@extends('layouts.structure')

@section('title', 'Edit Industry Type - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Edit Vehicle Usege</div>
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
                        <form method="POST" action="{{ route('vehicle-usage.update', $industryType->id) }}">
                            @csrf
                            @method('PUT')

                            <div class="form-group mt-2">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id"
                                    class="form-control @error('country_id') is-invalid @enderror" required>
                                    <option value="">-- Select Country --</option>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}"
                                            {{ old('country_id', $industryType->country_id) == $country->id ? 'selected' : '' }}>
                                            {{ $country->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('country_id')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>


                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" name="name" id="name" value="{{ $industryType->name }}"
                                    class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3">Update</button>
                            <a href="{{ route('vehicle-usage.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

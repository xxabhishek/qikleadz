@extends('layouts.structure')

@section('title', 'Edit Currency - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Edit Currency</div>
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

                    <form action="{{ route('currency.update', $currency->id) }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="form-group mb-3">
                            <label for="country_id">Country</label>
                            <select name="country_id" id="country_id" class="form-control" required>
                                <option value="">Select Country</option>
                                @foreach($countries as $country)
                                    <option value="{{ $country->id }}" {{ $currency->country_id == $country->id ? 'selected' : '' }}>
                                        {{ $country->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group mb-3">
                            <label for="currency">Currency Name</label>
                            <input type="text" name="currency" id="currency" class="form-control"
                                   value="{{ old('currency', $currency->currency) }}" required
                                   placeholder="Enter currency name"
                                   oninput="this.value = this.value.replace(/[0-9]/g, '')">
                        </div>

                        <button type="submit" class="btn btn-primary mt-2">Update</button>
                        <a href="{{ route('currency.index') }}" class="btn btn-secondary mt-2">Back</a>
                    </form>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection

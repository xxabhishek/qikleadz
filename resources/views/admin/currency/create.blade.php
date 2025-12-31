@extends('layouts.structure')

@section('title', 'Add Currency - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Add Currency</div>
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

                        <form action="{{ route('currency.store') }}" method="POST">
                            @csrf

                            <div class="form-group mb-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required>
                                    <option value="">Select Country</option>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}" {{ old('country_id') == $country->id ? 'selected' : '' }}>
                                            {{ $country->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-3">
                                <label for="currency">Currency</label>
                                <input type="text" name="currency" id="currency" class="form-control" required
                                    placeholder="Enter currency name" value="{{ old('currency') }}">
                            </div>

                            <button type="submit" class="btn btn-primary mt-2">Save</button>
                            <a href="{{ route('currency.index') }}" class="btn btn-secondary mt-2">Back</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
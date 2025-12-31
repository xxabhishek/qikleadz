@extends('layouts.structure')

@section('title', 'Create Payment Mode - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">

                <div class="card">
                    <div class="card-header">Create Payment Mode</div>

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

                        <form method="POST" action="{{ route('payment-mode.store') }}">
                            @csrf

                            <div class="form-group mb-3">
                                <label for="country_id">Select Country</label>
                                <select name="country_id" id="country_id" class="form-control">
                                    <option value="">-- Select Country --</option>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </div>


                            <div class="form-group mb-3">
                                <label for="name">Payment Mode Name</label>
                                <input type="text" name="name" id="name" class="form-control" required
                                    placeholder="Enter payment mode name"
                                    oninput="this.value = this.value.replace(/[0-9]/g, '')">
                            </div>

                            <button type="submit" class="btn btn-primary mt-2">Submit</button>
                            <a href="{{ route('payment-mode.index') }}" class="btn btn-secondary mt-2">Back</a>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
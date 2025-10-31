@extends('layouts.structure')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Vehicle Segment</div>
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
                        <form method="POST" action="{{ route('vehicle-segment.store') }}">
                            @csrf

                            <div class="form-group mt-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required>
                                    <option value="">-- Select Country --</option>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="name">Vehicle Segment</label>
                                <input type="text" name="name" id="name" class="form-control" required
                                    oninput="this.value = this.value.replace(/[0-9]/g, '')">
                            </div>



                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('vehicle-segment.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

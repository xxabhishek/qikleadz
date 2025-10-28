@extends('layouts.structure')

@section('title', 'Edit City - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Edit City</div>
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
                        <form method="POST" action="{{ route('city.update', $city->id) }}">
                            @csrf
                            @method('PUT')

                            {{-- Country First --}}
                            <div class="form-group">
                                <label for="country_id">Country</label>
                                <select name="country_id" class="form-control" required  onchange="getStates(this.value)">
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}"
                                            {{ $country->id == $city->country_id ? 'selected' : '' }}>
                                            {{ $country->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Then State --}}
                            <div class="form-group mt-3">
                                <label for="state_id">State</label>
                                <select name="state_id" class="form-control" required>
                                    @foreach ($states as $state)
                                        <option value="{{ $state->id }}"
                                            {{ $state->id == $city->state_id ? 'selected' : '' }}>
                                            {{ $state->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Finally City --}}
                            <div class="form-group mt-3">
                                <label for="name">City Name</label>
                                <input type="text" name="name" class="form-control"
                                    value="{{ old('name', $city->name) }}" required>
                            </div>

                            <button type="submit" class="btn btn-primary mt-3">Update</button>
                            <a href="{{ route('city.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

                <script type="text/javascript">
            function getStates(country_id)
            {
                //alert(category_id);
                var url = '{{ route("getByCountry",[':country_id']) }}';
                url = url.replace(':country_id',country_id);
                 
                if(country_id) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: "json",

                        success:function(data) {
                            $('select[name="state_id"]').empty();
                            $('select[name="state_id"]').prepend('<option value="">--Select State--</option>');
                            $.each(data, function(key, value) {
                                $('select[name="state_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                            });
                        }
                    });
                } else{
                    $('select[name="state_id"]').empty();
                }
            }
        </script>

@endsection

@extends('layouts.structure')

@section('title', 'Create City - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create City</div>
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
                        <form action="{{ route('city.store') }}" method="POST">
                            @csrf

                            {{-- Country Dropdown --}}
                            <div class="form-group mb-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required onchange="getStates(this.value)">
                                    <option value="">-- Select Country --</option>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- State Dropdown --}}
                            <div class="form-group mb-3">
                                <label for="state_id">State</label>
                                <select name="state_id" id="state_id" class="form-control" required>
                                    <option value="">-- Select State --</option>
                                    @foreach ($states as $state)
                                        <option value="{{ $state->id }}">{{ $state->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- City Input --}}
                            <div class="form-group mb-3">
                                <label for="name">City Name</label>
                                <input type="text" name="name" id="name" class="form-control" placeholder="Enter city name" required>
                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
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

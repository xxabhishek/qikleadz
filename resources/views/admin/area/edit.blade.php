@extends('layouts.structure')
@section('title', 'Edit Area - Qikleadz')
@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Edit Area</div>
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
                        <form action="{{ route('admin.areas.update', $area->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <div class="form-group mb-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required
                                    onchange="getStates(this.value)">
                                    <option value="">-- Select Country --</option>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}"
                                            {{ $area->country_id == $country->id ? 'selected' : '' }}>
                                            {{ $country->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="state_id">State</label>
                                <select name="state_id" id="state_id" class="form-control" required
                                    onchange="getCities(this.value)">
                                    <option value="">-- Select State --</option>
                                    @foreach ($states as $state)
                                        <option value="{{ $state->id }}"
                                            {{ $area->state_id == $state->id ? 'selected' : '' }}>
                                            {{ $state->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="city_id">City</label>
                                <select name="city_id" id="city_id" class="form-control" required>
                                    <option value="">-- Select City --</option>
                                    @foreach ($cities as $city)
                                        <option value="{{ $city->id }}"
                                            {{ $area->city_id == $city->id ? 'selected' : '' }}>
                                            {{ $city->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="name">Area Name</label>
                                <input type="text" name="name" id="name" class="form-control"
                                    value="{{ $area->name }}" placeholder="Enter area name" required oninput="this.value = this.value.replace(/[0-9]/g, '')">
                            </div>
                            <button type="submit" class="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        function getStates(country_id) {
            var url = '{{ route("admin.states.by.country", [":country_id"]) }}';
            url = url.replace(':country_id', country_id);
            if (country_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        $('select[name="state_id"]').empty();
                        $('select[name="state_id"]').prepend('<option value="">-- Select State --</option>');
                        $.each(data, function(key, value) {
                            $('select[name="state_id"]').append('<option value="' + value.id + '">' + value.name + '</option>');
                        });
                        $('select[name="city_id"]').empty();
                        $('select[name="city_id"]').prepend('<option value="">-- Select City --</option>');
                    }
                });
            } else {
                $('select[name="state_id"]').empty();
                $('select[name="state_id"]').prepend('<option value="">-- Select State --</option>');
                $('select[name="city_id"]').empty();
                $('select[name="city_id"]').prepend('<option value="">-- Select City --</option>');
            }
        }

        function getCities(state_id) {
            var url = '{{ route("admin.cities.by.state", [":state_id"]) }}';
            url = url.replace(':state_id', state_id);
            if (state_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        $('select[name="city_id"]').empty();
                        $('select[name="city_id"]').prepend('<option value="">-- Select City --</option>');
                        $.each(data, function(key, value) {
                            $('select[name="city_id"]').append('<option value="' + value.id + '">' + value.name + '</option>');
                        });
                    }
                });
            } else {
                $('select[name="city_id"]').empty();
                $('select[name="city_id"]').prepend('<option value="">-- Select City --</option>');
            }
        }
    </script>
@endsection

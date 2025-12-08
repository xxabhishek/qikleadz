@extends('layouts.structure')
@section('title', 'Create Dealer Area Mapping')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Create Dealer Area Mapping</div>
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

                    <form method="POST" action="{{ route('dealer-area-map.store') }}">
                        @csrf

                        <div class="mb-3">
                            <label for="user_id" class="form-label">Select Dealer <span class="text-danger">*</span></label>
                            <select name="user_id" id="user_id" class="form-control" required onchange="loadMappedAreas()">
                                <option value="">-- Select Dealer --</option>
                                @foreach ($dealers as $dealer)
                                    <option value="{{ $dealer->id }}">{{ $dealer->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="city_id" class="form-label">Select City <span class="text-danger">*</span></label>
                            <select name="city_id" id="city_id" class="form-control" required onchange="loadAreas()">
                                <option value="">-- Select City --</option>
                                @foreach ($cities as $city)
                                    <option value="{{ $city->id }}">{{ $city->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div id="area-container" class="mb-3">
                            <p><em>Select a city to load areas...</em></p>
                        </div>

                        <button type="submit" class="btn btn-primary">Save Mapping</button>
                        <a href="{{ route('dealer-area-map.index') }}" class="btn btn-secondary">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function loadAreas() {
    const cityId = document.getElementById('city_id').value;
    const container = document.getElementById('area-container');

    if (!cityId) {
        container.innerHTML = '<p><em>Select a city to load areas...</em></p>';
        return;
    }

    fetch(`/admin/areas-by-city/${cityId}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = '';
            if (Object.keys(data).length === 0) {
                container.innerHTML = '<p class="text-muted">No areas found for this city.</p>';
                return;
            }

            Object.keys(data).forEach(id => {
                const div = document.createElement('div');
                div.className = 'form-check';
                div.innerHTML = `
                    <input class="form-check-input" type="checkbox" name="area_ids[]" value="${id}" id="area_${id}">
                    <label class="form-check-label" for="area_${id}">${data[id]}</label>
                `;
                container.appendChild(div);
            });
        })
        .catch(() => {
            container.innerHTML = '<p class="text-danger">Error loading areas.</p>';
        });

    loadMappedAreas(); // reload checked ones
}

function loadMappedAreas() {
    const dealerId = document.getElementById('user_id').value;
    const cityId = document.getElementById('city_id').value;

    if (!dealerId || !cityId) {
        uncheckAllAreas();
        return;
    }

    fetch(`/admin/dealer-areas?dealer_id=${dealerId}&city_id=${cityId}`)
        .then(res => res.json())
        .then(result => {
            uncheckAllAreas();
            if (result.success && result.mapped_area_ids) {
                result.mapped_area_ids.forEach(id => {
                    const checkbox = document.querySelector(`input[value="${id}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        });
}

function uncheckAllAreas() {
    document.querySelectorAll('input[name="area_ids[]"]').forEach(cb => cb.checked = false);
}
</script>
@endsection

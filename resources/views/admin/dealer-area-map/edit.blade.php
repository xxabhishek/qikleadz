@extends('layouts.structure')

@section('title', 'Edit Dealer Area Mapping')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Edit Dealer Area Mapping</h5>
                </div>
                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('dealer-area-map.update', $map->id) }}">
                        @csrf
                        @method('PUT')

                        <div class="mb-3">
                            <label for="user_id" class="form-label">Dealer <span class="text-danger">*</span></label>
                            <select name="user_id" id="user_id" class="form-control" required onchange="loadMappedAreas()">
                                <option value="">-- Select Dealer --</option>
                                @foreach (\App\Models\User::role('dealer')->get(['id', 'name']) as $dealer)
                                    <option value="{{ $dealer->id }}" {{ $dealer->id == $map->user_id ? 'selected' : '' }}>
                                        {{ $dealer->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="city_id" class="form-label">City <span class="text-danger">*</span></label>
                            <select name="city_id" id="city_id" class="form-control" required onchange="loadAreas()">
                                <option value="">-- Select City --</option>
                                @foreach (\App\Models\City::all(['id', 'name']) as $city)
                                    <option value="{{ $city->id }}" {{ $city->id == $map->city_id ? 'selected' : '' }}>
                                        {{ $city->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div id="area-container" class="mb-4 border p-3 rounded bg-light">
                            <div class="spinner-border spinner-border-sm text-primary" role="status" id="loading-spinner" style="display: none;">
                                <span class="visually-hidden">Loading areas...</span>
                            </div>
                            <p class="text-muted"><em>Loading areas for the selected city...</em></p>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-warning">
                                Update Mapping
                            </button>
                            <a href="{{ route('dealer-area-map.index') }}" class="btn btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Store currently mapped area IDs (from controller)
const currentlyMappedAreas = @json($selectedAreas ?? []);

document.addEventListener('DOMContentLoaded', function () {
    // Trigger initial load when page loads
    loadAreas();
});

function loadAreas() {
    const cityId = document.getElementById('city_id').value;
    const container = document.getElementById('area-container');
    const spinner = document.getElementById('loading-spinner');

    if (!cityId) {
        container.innerHTML = '<p class="text-muted"><em>Select a city to load areas...</em></p>';
        return;
    }

    spinner.style.display = 'inline-block';

    fetch(`/admin/areas-by-city/${cityId}`)
        .then(response => response.json())
        .then(data => {
            spinner.style.display = 'none';
            container.innerHTML = '';

            if (Object.keys(data).length === 0) {
                container.innerHTML = '<p class="text-muted">No areas found for this city.</p>';
                return;
            }

            Object.keys(data).forEach(id => {
                const isChecked = currentlyMappedAreas.includes(parseInt(id)) ? 'checked' : '';

                const div = document.createElement('div');
                div.className = 'form-check mb-2';
                div.innerHTML = `
                    <input class="form-check-input" type="checkbox" name="area_ids[]" value="${id}"
                           id="area_${id}" ${isChecked}>
                    <label class="form-check-label" for="area_${id}">
                        ${data[id]}
                    </label>
                `;
                container.appendChild(div);
            });
        })
        .catch(err => {
            spinner.style.display = 'none';
            container.innerHTML = '<p class="text-danger">Error loading areas. Please try again.</p>';
            console.error(err);
        });
}

// Optional: Re-check mapped areas if dealer changes (advanced use case)
// You can keep or remove this function if you don't want dealer change to affect checked areas
function loadMappedAreas() {
    // In most cases, we keep the existing mapping even if dealer changes
    // So we usually don't need this on edit page
}
</script>
@endsection

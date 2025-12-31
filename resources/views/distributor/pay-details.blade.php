@extends('layouts.app')



@section('content')

    <div class="container-fluid">

        <!-- Header -->

        <div class="d-flex justify-content-between align-items-center mb-4">

            <h4 class="text-primary mb-0">Pay Details - {{ $executive->name }}</h4>

            <a href="{{ route('distributor.dashboard') }}" class="btn btn-outline-secondary">

                <i class="bi bi-arrow-left me-1"></i> Back to Dashboard

            </a>

        </div>



        <!-- Total Commission Card -->

        <div class="card mb-4 border-0 shadow-sm" style="background-color: #f2f9ff;">

            <div class="card-body">

                <h6 class="text-muted small mb-1">Total Incentive Due</h6>

                <h3 class="text-primary mb-0">${{ number_format($totalCommission, 2) }}</h3>

            </div>

        </div>



        <!-- Generate Button -->

        <div class="mb-4">
            <button type="button" class="btn btn-success" id="generateSelectedCreditNote"
                data-executive-name="{{ $executive->name }}">
                <i class="bi bi-file-earmark-pdf me-1"></i> Generate Credit Note for Selected
            </button>
        </div>


        <!-- Form & Table -->

        <form id="creditNoteForm" action="{{ route('distributor.generate-selected-credit-note') }}" method="POST">

            @csrf

            <div class="table-responsive">

                <table class="table table-hover table-bordered">

                    <thead class="table-primary">

                        <tr>

                            <th><input type="checkbox" id="selectAll"></th>

                            <th>Lead ID</th>

                            <th>Customer</th>

                            <th>Vehicle Details</th>

                            <th>Incentive</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        @forelse($leads as $leadDetail)

                            <tr>

                                <td>

                                    <input type="checkbox" name="detail_ids[]" value="{{ $leadDetail->id }}"
                                        class="vehicle-checkbox">

                                </td>

                                <td>{{$leadDetail->lead_no}}</td>

                                <td>

                                    <strong>{{ $leadDetail->lead->customer_name }}</strong><br>

                                    <small class="text-muted">{{ $leadDetail->lead->phone_no }}</small>

                                </td>

                                <td>

                                    {{ $leadDetail->brand->name ?? 'N/A' }} - {{ $leadDetail->variant->name ?? 'N/A' }}<br>

                                    <small>{{ $leadDetail->color->name ?? '' }}</small>

                                </td>

                                <td class="fw-bold">${{ number_format($leadDetail->variant->commission ?? 0, 2) }}</td>

                                <td>

                                    <a href="{{ route('distributor.leads.show', $leadDetail->lead->id) }}"
                                        class="btn btn-sm btn-outline-primary" target="_blank">
                                        <i class="bi bi-eye"></i> View
                                    </a>


                                </td>

                            </tr>

                        @empty

                            <tr>

                                <td colspan="6" class="text-center py-4">

                                    <i class="bi bi-exclamation-circle text-warning me-1"></i>

                                    No successful leads found for this executive.

                                </td>

                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>



            <!-- Pagination (if needed) -->

            <div class="d-flex justify-content-between mt-3">

                <div>

                    Showing {{ $leads->count() }} records

                </div>

            </div>

        </form>

    </div>



    <!-- Scripts -->

    {{--
    <script>

        // Select All Checkbox

        document.getElementById('selectAll').addEventListener('change', function () {

            document.querySelectorAll('.vehicle-checkbox').forEach(cb => cb.checked = this.checked);

        });



        // Generate Button Click

        document.getElementById('generateSelectedCreditNote').addEventListener('click', function () {

            const checked = document.querySelectorAll('.vehicle-checkbox:checked').length;

            if (checked === 0) {

                alert('Please select at least one vehicle.');

                return;

            }

            document.getElementById('creditNoteForm').submit();

        });

    </script> --}}

    <script>
        document.getElementById('generateSelectedCreditNote').addEventListener('click', function () {

            // Get checked checkboxes
            const checkedBoxes = document.querySelectorAll('.vehicle-checkbox:checked');

            if (checkedBoxes.length === 0) {
                alert('Please select at least one vehicle.');
                return;
            }

            // Get executive name
            const executiveName = this.dataset.executiveName;

            // Collect customer names
            let customers = [];
            checkedBoxes.forEach(cb => {
                const row = cb.closest('tr');
                const customerName = row.querySelector('td:nth-child(3) strong').innerText;
                customers.push(customerName);
            });

            // Confirmation message
            const message =
                "Executive: " + executiveName + "\n\n" +
                "Are you sure you want to generate a credit note for the following customer(s)?\n\n" +
                customers.join(', ');

            if (!confirm(message)) {
                return;
            }

            document.getElementById('creditNoteForm').submit();
        });
    </script>

@endsection
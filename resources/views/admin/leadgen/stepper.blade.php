<div class="flex items-center justify-center mb-6">
    @php
        $steps = [
            1 => 'Select Model',
            2 => 'Model Details',
            3 => 'Lead Information',
            4 => 'Summary',
        ];
    @endphp
    @foreach ($steps as $num => $label)
        <div class="flex items-center">
            <div
                class="w-8 h-8 rounded-full flex items-center justify-center {{ $step >= $num ? 'bg-[#0f66af] text-white' : 'bg-gray-200 text-gray-700' }} font-semibold">
                {{ $num }}</div>
            <span
                class="ml-2 text-sm {{ $step >= $num ? 'text-[#0f66af]' : 'text-gray-500' }}">{{ $label }}</span>
            @if ($num < count($steps))
                <div class="w-12 h-1 mx-2 {{ $step > $num ? 'bg-[#0f66af]' : 'bg-gray-200' }}"></div>
            @endif
        </div>
    @endforeach
</div>

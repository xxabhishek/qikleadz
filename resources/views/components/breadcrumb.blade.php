<div class="container mt-4">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            @foreach ($crumbs as $crumb)
                @if ($crumb['active'])
                    <li class="breadcrumb-item active" aria-current="page">{{ $crumb['name'] }}</li>
                @else
                    <li class="breadcrumb-item"><a href="{{ $crumb['url'] }}">{{ $crumb['name'] }}</a></li>
                @endif
            @endforeach
        </ol>
    </nav>
</div>

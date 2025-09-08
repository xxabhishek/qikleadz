<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\Support\Facades\Route;

class Breadcrumb extends Component
{
    public $crumbs;

    public function __construct()
    {
        $this->crumbs = $this->getBreadcrumbs();
    }

    private function getBreadcrumbs()
    {
        $crumbs = [];
        $currentRoute = Route::currentRouteName();

        // Home as the base crumb
        $crumbs[] = [
            'name' => 'Home',
            'url' => route('home'),
            'active' => $currentRoute === 'home'
        ];

        // Define crumbs based on route names
        switch ($currentRoute) {
            case 'fuel-types.index':
                $crumbs[] = ['name' => 'Fuel Types', 'url' => route('fuel-types.index'), 'active' => true];
                break;
            case 'fuel-types.create':
                $crumbs[] = ['name' => 'Fuel Types', 'url' => route('fuel-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Create', 'url' => route('fuel-types.create'), 'active' => true];
                break;
            case 'fuel-types.show':
                $crumbs[] = ['name' => 'Fuel Types', 'url' => route('fuel-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'View', 'url' => route('fuel-types.show', request()->route('id')), 'active' => true];
                break;
            case 'fuel-types.edit':
                $crumbs[] = ['name' => 'Fuel Types', 'url' => route('fuel-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Edit', 'url' => route('fuel-types.edit', request()->route('id')), 'active' => true];
                break;
            case 'vehicle-types.index':
                $crumbs[] = ['name' => 'Vehicle Types', 'url' => route('vehicle-types.index'), 'active' => true];
                break;
            case 'vehicle-types.create':
                $crumbs[] = ['name' => 'Vehicle Types', 'url' => route('vehicle-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Create', 'url' => route('vehicle-types.create'), 'active' => true];
                break;
            case 'vehicle-types.show':
                $crumbs[] = ['name' => 'Vehicle Types', 'url' => route('vehicle-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'View', 'url' => route('vehicle-types.show', request()->route('id')), 'active' => true];
                break;
            case 'vehicle-types.edit':
                $crumbs[] = ['name' => 'Vehicle Types', 'url' => route('vehicle-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Edit', 'url' => route('vehicle-types.edit', request()->route('id')), 'active' => true];
                break;
            case 'industry-types.index':
                $crumbs[] = ['name' => 'Industry Types', 'url' => route('industry-types.index'), 'active' => true];
                break;
            case 'industry-types.create':
                $crumbs[] = ['name' => 'Industry Types', 'url' => route('industry-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Create', 'url' => route('industry-types.create'), 'active' => true];
                break;
            case 'industry-types.show':
                $crumbs[] = ['name' => 'Industry Types', 'url' => route('industry-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'View', 'url' => route('industry-types.show', request()->route('id')), 'active' => true];
                break;
            case 'industry-types.edit':
                $crumbs[] = ['name' => 'Industry Types', 'url' => route('industry-types.index'), 'active' => false];
                $crumbs[] = ['name' => 'Edit', 'url' => route('industry-types.edit', request()->route('id')), 'active' => true];
                break;
            case 'categories.index':
                $crumbs[] = ['name' => 'Categories', 'url' => route('categories.index'), 'active' => true];
                break;
            case 'categories.create':
                $crumbs[] = ['name' => 'Categories', 'url' => route('categories.index'), 'active' => false];
                $crumbs[] = ['name' => 'Create', 'url' => route('categories.create'), 'active' => true];
                break;
            case 'categories.show':
                $crumbs[] = ['name' => 'Categories', 'url' => route('categories.index'), 'active' => false];
                $crumbs[] = ['name' => 'View', 'url' => route('categories.show', request()->route('id')), 'active' => true];
                break;
            case 'categories.edit':
                $crumbs[] = ['name' => 'Categories', 'url' => route('categories.index'), 'active' => false];
                $crumbs[] = ['name' => 'Edit', 'url' => route('categories.edit', request()->route('id')), 'active' => true];
                break;
        }

        return $crumbs;
    }

    public function render()
    {
        return view('components.breadcrumb');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            // 'role-list',
            // 'role-create',
            // 'role-edit',
            // 'role-delete', 

            // 'user-list',
            // 'user-create',
            // 'user-edit',
            // 'user-delete', 

            // 'country-list',
            // 'country-create',
            // 'country-edit',
            // 'country-delete', 

            // 'state-list',
            // 'state-create',
            // 'state-edit',
            // 'state-delete', 


            // 'city-list',
            // 'city-create',
            // 'city-edit',
            // 'city-delete', 


            // 'vehicle-segment-list',
            // 'vehicle-segment-create',
            // 'vehicle-segment-edit',
            // 'vehicle-segment-delete', 

            // 'oem-list',
            // 'oem-create',
            // 'oem-edit',
            // 'oem-delete', 

            // 'vehicle-usage-list',
            // 'vehicle-usage-create',
            // 'vehicle-usage-edit',
            // 'vehicle-usage-delete', 

            // 'cc-list',
            // 'cc-create',
            // 'cc-edit',
            // 'cc-delete', 

            // 'fuel-type-list',
            // 'fuel-type-create',
            // 'fuel-type-edit',
            // 'fuel-type-delete', 

            // 'transmission-list',
            // 'transmission-create',
            // 'transmission-edit',
            // 'transmission-delete', 

            // 'brand-list',
            // 'brand-create',
            // 'brand-edit',
            // 'brand-delete', 

            // 'variant-list',
            // 'variant-create',
            // 'variant-edit',
            // 'variant-delete', 


            // 'gellery-list',
            // 'gellery-create',
            // 'gellery-edit',
            // 'gellery-delete', 

            // 'color-list',
            // 'color-create',
            // 'color-edit',
            // 'color-delete', 

            // 'feature-list',
            // 'feature-create',
            // 'feature-edit',
            // 'feature-delete', 

            // 'tech-spec-list',
            // 'tech-spec-create',
            // 'tech-spec-edit',
            // 'tech-spec-delete', 



















         ];
      
         foreach ($permissions as $permission) 
         {
              Permission::create(['name' => $permission]);
         }

    }
}

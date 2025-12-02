<?php

// namespace App\Http\Controllers\Admin;

// use Illuminate\Http\Request;
// use App\Http\Controllers\Controller;

// use App\Services\PlantService;
// use App\Models\User;
// use App\Models\Country;
// use Spatie\Permission\Models\Role;
// use DB;
// use Hash;
// use Illuminate\Support\Arr;
// use Illuminate\Support\Facades\Storage;

// class UserController extends Controller
// {
//     public function __construct()
//     {
//         $this->middleware('auth');
//     }

//     /**
//      * Display a listing of the resource.
//      *
//      * @return \Illuminate\Http\Response
//      */
//    public function index(Request $request)
// {
//     $data = User::orderBy('id', 'DESC')->paginate(5);
//     $i = ($request->input('page', 1) - 1) * 5;

//     return view('admin.users.index', compact('data', 'i'));
// }

//     /**
//      * Show the form for creating a new resource.
//      *
//      * @return \Illuminate\Http\Response
//      */
//    public function create()
// {
//     $roles = Role::pluck('name', 'id')->all();
//     $countries = Country::pluck('name', 'id')->all();

//     // Add distributors and dealers
//     $distributors = User::whereHas('roles', function($query) {
//         $query->where('name', 'Distributor');
//     })->pluck('name', 'id');

//     $dealers = User::whereHas('roles', function($query) {
//         $query->where('name', 'Dealer');
//     })->pluck('name', 'id');

//     return view('admin.users.create', compact('roles', 'countries', 'distributors', 'dealers'));
// }

//     /**
//      * Store a newly created resource in storage.
//      *
//      * @param  \Illuminate\Http\Request  $request
//      * @return \Illuminate\Http\Response
//      */
//     public function store(Request $request)
// {
//     $this->validate($request, [
//         'name' => 'required',
//         'email' => 'required|email|unique:users,email',
//         'pin' => 'required|numeric|digits:4|confirmed', // Changed to PIN
//         'role' => 'required|exists:roles,id',
//         'mobile' => 'nullable|string|max:20',
//         'address' => 'nullable|string|max:500',
//         'country_id' => 'required|exists:countries,id',
//         'status' => 'required|in:Active,Inactive',
//         'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
//     ]);

//     $input = $request->all();

//     // Generate user_id
//     $input['user_id'] = User::generateUserId();

//     // Hash the PIN (not password)
//     $input['pin'] = Hash::make($request->pin);

//     // Handle logo upload
//     if ($request->hasFile('logo')) {
//         $input['logo'] = $request->file('logo')->store('logos', 'public');
//     }

//     // Create user
//     $user = User::create($input);

//     // Assign role
//     $user->assignRole($request->input('role'));

//     return redirect()->route('users.index')
//         ->with('success', 'User created successfully with ID: ' . $user->user_id);
// }
//     /**
//      * Display the specified resource.
//      *
//      * @param  int  $id
//      * @return \Illuminate\Http\Response
//      */
//     public function show($id)
//     {
//         $user = User::find($id);
//         $roleName = null;
//         if ($user->role) {
//             $roleName = Role::where('id', $user->role)->value('name');
//         }
//         return view('admin.users.show', compact('user', 'roleName'));
//     }

//     /**
//      * Show the form for editing the specified resource.
//      *
//      * @param  int  $id
//      * @return \Illuminate\Http\Response
//      */
//     public function edit($id)
//     {
//         $user = User::find($id);
//         $roles = Role::pluck('name', 'id')->all();
//         $userRole = $user->role;
//         $countries = Country::pluck('name', 'id')->all();

//         $userCountry = $user->country_id;
//         $userStatus = $user->status;

//         return view('admin.users.edit', compact('user', 'roles', 'userRole', 'countries', 'userCountry', 'userStatus'));
//     }

//     /**
//      * Update the specified resource in storage.
//      *
//      * @param  \Illuminate\Http\Request  $request
//      * @param  int  $id
//      * @return \Illuminate\Http\Response
//      */
//     public function update(Request $request, $id)
//     {
//         $rules = [
//             'name' => 'required',
//             'email' => 'required|email|unique:users,email,' . $id,
//             'role' => 'required|exists:roles,id',
//             'country_id' => 'required|exists:countries,id',
//             'status' => 'required|in:Active,Inactive',
//         ];

//         // If pin is provided, validate it
//         if (!empty($request->input('pin'))) {
//             $rules['pin'] = 'numeric|digits:4|confirmed';
//         }

//         $this->validate($request, $rules);

//         $input = $request->all();

//         // Hash pin if provided
//         if (!empty($input['pin'])) {
//             $input['pin'] = \Illuminate\Support\Facades\Hash::make($input['pin']);
//         } else {
//             $input = Arr::except($input, array('pin'));
//         }

//         $user = User::find($id);
//         $user->update($input);

//         \Illuminate\Support\Facades\DB::table('model_has_roles')->where('model_id', $id)->delete();
//         $user->assignRole($request->input('role'));

//         return redirect()->route('users.index')
//             ->with('success', 'User updated successfully');
//     }

//     /**
//      * Remove the specified resource from storage.
//      *
//      * @param  int  $id
//      * @return \Illuminate\Http\Response
//      */
//     public function destroy($id)
//     {
//         User::find($id)->delete();
//         return redirect()->route('users.index')
//             ->with('success', 'User deleted successfully');
//     }

//     public function updateLogo(Request $request, $id)
//     {
//         $request->validate([
//             'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
//         ]);

//         $user = User::findOrFail($id);

//         // delete old logo if exists
//         if ($user->logo && Storage::disk('public')->exists($user->logo)) {
//             Storage::disk('public')->delete($user->logo);
//         }

//         // store new logo in storage/app/public/logos
//         $path = $request->file('logo')->store('logos', 'public');
//         $user->logo = $path;
//         $user->save();

//         return response()->json([
//             'message' => 'Logo updated successfully',
//             'logo_url' => Storage::url($user->logo),
//         ]);
//     }

//     /**
//      * Get next user code based on role
//      */
//     public function getNextCode($roleName)
//     {
//         // Your existing logic for generating user codes
//         $lastUser = User::whereHas('roles', function ($query) use ($roleName) {
//             $query->where('name', $roleName);
//         })->orderBy('id', 'desc')->first();

//         $nextNumber = 1;
//         if ($lastUser && $lastUser->user_code) {
//             $lastNumber = intval(substr($lastUser->user_code, -4));
//             $nextNumber = $lastNumber + 1;
//         }

//         $userCode = strtoupper(substr($roleName, 0, 3)) . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

//         return response()->json(['user_code' => $userCode]);
//     }
// }





namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\PlantService;
use App\Models\User;
use App\Models\Country;
use Spatie\Permission\Models\Role;
use DB;
use Hash;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash as FacadesHash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = User::orderBy('id', 'DESC')->paginate(5);
        $i = ($request->input('page', 1) - 1) * 5;

        return view('admin.users.index', compact('data', 'i'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $roles = Role::pluck('name', 'id')->all();
        $countries = Country::pluck('name', 'id')->all();

        // Add distributors and dealers
        $distributors = User::whereHas('roles', function ($query) {
            $query->where('name', 'Distributor');
        })->pluck('name', 'id');

        $dealers = User::whereHas('roles', function ($query) {
            $query->where('name', 'Dealer');
        })->pluck('name', 'id');

        return view('admin.users.create', compact('roles', 'countries', 'distributors', 'dealers'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'pin' => 'required|numeric|digits:4|confirmed',
            'role' => 'required|exists:roles,id',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'country_id' => 'required|exists:countries,id',
            'status' => 'required|in:Active,Inactive',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $input = $request->all();
        $plainPin = $request->pin;  // Capture plain PIN for response

        // Generate user_id
        $input['user_id'] = User::generateUserId();

        // Hash the PIN
        $input['pin'] = Hash::make($plainPin);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $input['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // Create user
        $user = User::create($input);

        // Assign role
        $role = Role::findOrFail($request->input('role'));
        $user->assignRole($role);

        if ($request->ajax() || $request->wantsJson()) {
            // AJAX response for modal
            return response()->json([
                'success' => true,
                'user_id' => $user->user_id,
                'message' => 'User created successfully with ID: ' . $user->user_id,
            ]);
        }

        // Fallback for non-AJAX
        return redirect()->route('users.index')
            ->with('success', 'User created successfully with ID: ' . $user->user_id);
    }
    /**
     * Display the selected resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        $roleName = null;
        if ($user->role) {
            $roleName = Role::where('id', $user->role)->value('name');
        }
        return view('admin.users.show', compact('user', 'roleName'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = User::find($id);
        $roles = Role::pluck('name', 'id')->all();
        $userRole = $user->roles->first()?->id ?? $user->role;  // FIXED: Use Spatie or direct column
        $countries = Country::pluck('name', 'id')->all();

        $userCountry = $user->country_id;
        $userStatus = $user->status;

        return view('admin.users.edit', compact('user', 'roles', 'userRole', 'countries', 'userCountry', 'userStatus'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|exists:roles,id',
            'country_id' => 'required|exists:countries,id',
            'status' => 'required|in:Active,Inactive',
        ];

        // If pin is provided, validate it
        if (!empty($request->input('pin'))) {
            $rules['pin'] = 'numeric|digits:4|confirmed';
        }

        $this->validate($request, $rules);

        $input = $request->all();

        // Hash pin if provided
        if (!empty($input['pin'])) {
            $input['pin'] = \Illuminate\Support\Facades\Hash::make($input['pin']);
        } else {
            $input = Arr::except($input, array('pin'));
        }

        $user = User::find($id);
        $user->update($input);

        // FIXED: Clear old roles and assign new by model instance
        \Illuminate\Support\Facades\DB::table('model_has_roles')->where('model_id', $id)->delete();
        $role = Role::findOrFail($request->input('role'));
        $user->assignRole($role);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::find($id)->delete();
        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully');
    }

    public function updateLogo(Request $request, $id)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = User::findOrFail($id);

        // delete old logo if exists
        if ($user->logo && Storage::disk('public')->exists($user->logo)) {
            Storage::disk('public')->delete($user->logo);
        }

        // store new logo in storage/app/public/logos
        $path = $request->file('logo')->store('logos', 'public');
        $user->logo = $path;
        $user->save();

        return response()->json([
            'message' => 'Logo updated successfully',
            'logo_url' => Storage::url($user->logo),
        ]);
    }

    /**
     * Get next user code based on role
     */
    public function getNextCode($roleName)
    {
        // Your existing logic for generating user codes
        $lastUser = User::whereHas('roles', function ($query) use ($roleName) {
            $query->where('name', $roleName);
        })->orderBy('id', 'desc')->first();

        $nextNumber = 1;
        if ($lastUser && $lastUser->user_code) {
            $lastNumber = intval(substr($lastUser->user_code, -4));
            $nextNumber = $lastNumber + 1;
        }

        $userCode = strtoupper(substr($roleName, 0, 3)) . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return response()->json(['user_code' => $userCode]);
    }
}
<?php

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

class UserController extends Controller
{



    public function __construct(


    ) {
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

    return view('admin.users.index', compact('data'))
        ->with('i', ($request->input('page', 1) - 1) * 5);
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
        // dd($countries,$roles);


        return view('admin.users.create', compact('roles', 'countries'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd('hi',$request);

        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|same:confirm-password',
            'role' => 'required|exists:roles,id',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'country_id' => 'required|exists:countries,id',
            'status' => 'required|in:Active,Inactive',
        ]);

        $input = $request->all();
        // dd($input);

        // dd( $input['roles']);
        $input['password'] = Hash::make($input['password']);

        $user = User::create($input);
        $user->assignRole($request->input('roles'));
        // dd('hi');

        return redirect()->route('users.index')
            ->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
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
        // dd($roleName);
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
        $userRole = $user->role;
        $countries = Country::pluck('name', 'id')->all();

        $userCountry = $user->country_id;
        $userStatus = $user->status;
        //dd($user);
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
        // dd('hi',$request);
        $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|exists:roles,id',
            'country_id' => 'required|exists:countries,id',
            'status' => 'required|in:Active,Inactive',
        ];
        if (!empty($request->input('confirm-password'))) {
            // If the password field is not empty, include validation for it
            $rules['password'] = 'same:confirm-password';
        }
        $this->validate($request, $rules);

        $input = $request->all();
        //   dd($input);

        //dd($input);
        // $input['roles']=$request['roles'][0];

        // //dd( $input['roles']);
        // $role = Role::whereName($input['roles'])->firstOrFail();
        // $input['role']=$role->id;

        // dd($input['role']);
        if (!empty($input['password'])) {
            $input['password'] = hash::make($input['password']);
        } else {
            $input = Arr::except($input, array('password'));
        }

        $user = User::find($id);
        $user->update($input);
        DB::table('model_has_roles')->where('model_id', $id)->delete();

        $user->assignRole($request->input('roles'));

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
}
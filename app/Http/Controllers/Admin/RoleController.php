<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Http\Requests\Admin\RoleRequest;
use App\Services\RoleService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;



use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use DB;
use Illuminate\Support\Arr;

class RoleController extends Controller
{
    /** @var RoleService */
    protected $roleService;
    /**
     * RoleController constructor.
     * @param RoleService $roleService
     */

    public function __construct(
        RoleService $roleService
    ) {

        // $this->middleware('auth');
        // $this->roleService = $roleService;
        // $this->middleware('permission:role-list|role-create|role-edit|role-delete', ['only' => ['index','store']]);
        //  $this->middleware('permission:role-create', ['only' => ['create','store']]);
        //  $this->middleware('permission:role-edit', ['only' => ['edit','update']]);
        //  $this->middleware('permission:role-delete', ['only' => ['destroy']]);

    }

    /**
     * @param RoleDataTable $dataTable
     * @return mixed
     */

    public function index(Request $request)
    {
        // dd('ok');
        // dd('index');
        $roles = Role::orderBy('id', 'DESC')->get();//->paginate(5);

        return view('admin.role.index', compact('roles'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $permission = Permission::get();
        return view('admin.role.create', compact('permission'));
    }

    /**
     * @param RoleRequest $request
     * @return mixed
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:roles,name',
            'permission' => 'required',
        ]);

        $role = Role::create(['name' => $request->input('name')]);
        $role->syncPermissions($request->input('permission'));

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::find($id);
        $rolePermissions = Permission::join("role_has_permissions", "role_has_permissions.permission_id", "=", "permissions.id")
            ->where("role_has_permissions.role_id", $id)
            ->get();

        return view('admin.role.show', compact('role', 'rolePermissions'));
    }

    /**
     * @param Role $role
     * @return mixed
     */
    public function edit($id)
    {
        $role = Role::find($id);
        $permission = Permission::get();
        $rolePermissions = DB::table("role_has_permissions")->where("role_has_permissions.role_id", $id)
            ->pluck('role_has_permissions.permission_id', 'role_has_permissions.permission_id')
            ->all();

        return view('admin.role.edit', compact('role', 'permission', 'rolePermissions'));
    }

    /**
     * @param UpdateRoleRequest $request
     * @param $id
     * @return mixed
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => 'required',
            'permission' => 'required',
        ]);

        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->save();

        // Convert IDs into names
        $permissionNames = Permission::whereIn('id', $request->input('permission'))
                                 ->pluck('name')
                                 ->toArray();
        // $role->syncPermissions($request->input('permission'));

         $role->syncPermissions($permissionNames);



        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully');
    }
    /**
     * @param Role $role
     * @return mixed
     */



    /**
     * Remove Role from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        DB::table("roles")->where('id', $id)->delete();
        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully');
    }

}
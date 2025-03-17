<?php

namespace App\Http\Controllers;

use App\Models\User;
use Dotenv\Validator;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $perPage = (int) request()->query('per_page', 10);
        $result = collect(User::paginate($perPage)->withQueryString())->put('status', 200);
        return response()->json($result);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'username' => 'required',
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
            'image' => 'image'
        ]);

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('user-images', 'public');
        }

        $user = User::create([
            'username' => $validatedData['username'],
            'full_name' => $validatedData['full_name'],
            'email' => $validatedData['email'],
            'status' => 1,
            'password' => Hash::make($validatedData['password']),
            'image' => $validatedData['image'] ?? null,
        ]);

        if ($user) {
            return response()->json([
                'status' => 200,
                'message' => 'User Created Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something Went Wrong',
            ]);
        }
    }

    public function show($id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User Not Found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $user,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'username' => 'required|required|string|max:255',
            'full_name' => 'required|required|string|max:255',
            'email' => 'required|string|email|max:255',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User Not Found',
            ], 404);
        } else {
            $user->username = $validatedData['username'] ?? $user->username;
            $user->full_name = $validatedData['full_name'] ?? $user->full_name;
            $user->email = $validatedData['email'] ?? $user->email;

            if (isset($validatedData['password'])) {
                $user->password = Hash::make($validatedData['password']);
            }

            if ($request->hasFile('image')) {
                $user->image = $request->file('image')->store('user-images', 'public');
            }

            $user->update([
                'username' => $validatedData['username'],
                'full_name' => $validatedData['full_name'],
                'email' => $validatedData['email'],
                'status' => 1,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'User Updated Successfully',
                'data' => $user,
            ]);
        }
    }

    public function destroy($id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User Not Found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User Deleted Successfully',
        ]);
    }

}

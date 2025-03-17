<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{
    public function login(Request $request)
    {
        $creds = $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $field = filter_var($creds['identifier'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$field => $creds['identifier'], 'password' => $creds['password']])) {
            $request->session()->regenerate();
            return response()->json(['message' => 'Login successful'], 200);
        }

        return response()->json([
            'errors' => ['identifier' => ['The provided credentials do not match our records.']],
        ], 422);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/login');
    }

    use AuthorizesRequests, ValidatesRequests;
}

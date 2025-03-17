<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PromoController extends Controller
{
    public function index(): JsonResponse
    {
        $perPage = (int) request()->query('per_page', 10);
        $result = collect(Promo::paginate($perPage)->withQueryString())->put('status', 200);
        return response()->json($result);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'phone' => 'required'
        ]);

        $promo = Promo::create([
            'name' => $validatedData['name'],
            'phone' => $validatedData['phone'],
            'created_by' => Auth::user()->full_name,
        ]);

        if ($promo) {
            return response()->json([
                'status' => 200,
                'message' => 'Promotion Created Successfully',
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
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'status' => 404,
                'message' => 'Promo Not Found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $promo,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'phone' => 'required'
        ]);

        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'status' => 404,
                'message' => 'Promo Not Found',
            ], 404);
        } else {
            $promo->update([
                'name' => $validatedData['name'],
                'phone' => $validatedData['phone'],
                'updated_by' => Auth::user()->full_name,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Promo Updated Successfully',
                'data' => $promo,
            ]);
        }
    }

    public function destroy($id): JsonResponse
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'status' => 404,
                'message' => 'Promo Not Found',
            ], 404);
        }

        $promo->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Promo Deleted Successfully',
        ]);
    }
}

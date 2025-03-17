<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Schedule::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('time')) {
            $query->where('time', $request->input('time'));
        }

        if ($request->has('date')) {
            $query->whereIn('date', $request->input('date'));
        }

        if ($request->has('access')) {
            $query->where('access', $request->input('access'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = (int) request()->query('per_page', 10);
        $result = collect($query->paginate($perPage)->withQueryString())->put('status', 200);
        return response()->json($result);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'image' => 'image',
            'date' => 'required|string|max:255',
            'time' => 'required|string|max:255'
        ]);

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('schedule-images', 'public');
        }

        $schedule = Schedule::create([
            'name' => $validatedData['name'],
            'date' => $validatedData['date'],
            'time' => $validatedData['time'],
            'image' => $validatedData['image'] ?? null,
            'created_by' => Auth::user()->full_name,
        ]);

        if ($schedule) {
            return response()->json([
                'status' => 200,
                'message' => 'Schedule Created Successfully',
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
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => 404,
                'message' => 'Schedule Not Found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $schedule,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'date' => 'required|string|max:255',
            'time' => 'required|string|max:255'
        ]);

        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => 404,
                'message' => 'Schedule Not Found',
            ], 404);
        } else {
            $schedule->name = $validatedData['name'] ?? $schedule->name;
            $schedule->date = $validatedData['date'] ?? $schedule->date;
            $schedule->time = $validatedData['time'] ?? $schedule->time;

            if ($request->hasFile('image')) {
                $schedule->image = $request->file('image')->store('schedule-images', 'public');
            }

            $schedule->update([
                'name' => $validatedData['name'],
                'date' => $validatedData['date'],
                'time' => $validatedData['time'],
                'updated_by' => Auth::user()->full_name,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Schedule Updated Successfully',
                'data' => $schedule,
            ]);
        }
    }

    public function destroy($id): JsonResponse
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => 404,
                'message' => 'Schedule Not Found',
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Schedule Deleted Successfully',
        ]);
    }

}

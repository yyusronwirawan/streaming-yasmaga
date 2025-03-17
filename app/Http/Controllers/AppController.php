<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index()
    {
        return view('app');
    }

    public function indexAdmin(Request $request): JsonResponse
    {
        $query = Content::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        $contents = $query->get();

        if ($contents->count() > 0) {
            return response()->json([
                'status' => 200,
                'contents' => $contents,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Records Found',
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'value' => 'required|string',
            'image' => 'image|nullable',
        ]);

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('content-images', 'public');
        }

        $content = Content::create([
            'name' => $validatedData['name'],
            'metadata' => json_encode([
                'image' => $validatedData['image'] ?? null,
                'type' => $validatedData['type'],
                'value' => $validatedData['value'],
            ]),
        ]);

        if ($content) {
            return response()->json([
                'status' => 200,
                'message' => 'Content Created Successfully',
                'data' => $content,
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
        $content = Content::find($id);

        if (!$content) {
            return response()->json([
                'status' => 404,
                'message' => 'Content Not Found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $content,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'value' => 'required|string',
            'image' => 'image|nullable',
        ]);

        $content = Content::find($id);

        if (!$content) {
            return response()->json([
                'status' => 404,
                'message' => 'Content Not Found',
            ], 404);
        }

        $content->name = $validatedData['name'];

        $metadata = [
            'type' => $validatedData['type'],
            'value' => $validatedData['value'],
        ];

        if ($validatedData['type'] === 'string') {
            $metadata['image'] = null;
        } elseif ($request->hasFile('image')) {
            $metadata['value'] = 'image';
            $metadata['image'] = $request->file('image')->store('content-images', 'public');
        } else {
            $metadata['image'] = json_decode($content->metadata)->image;
        }

        $content->metadata = json_encode($metadata);

        $content->save();

        return response()->json([
            'status' => 200,
            'message' => 'Content Updated Successfully',
            'data' => $content,
        ]);
    }

    public function updateByName(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'value' => 'required|string',
            'image' => 'image|nullable',
        ]);

        $content = Content::where('name', $request->name)->first();

        if (!$content) {
            return response()->json([
                'status' => 404,
                'message' => 'Content Not Found',
            ], 404);
        }

        $content->name = $validatedData['name'];

        $metadata = [
            'type' => $validatedData['type'],
            'value' => $validatedData['value'],
        ];

        if ($validatedData['type'] === 'string') {
            $metadata['image'] = null;
        } elseif ($request->hasFile('image')) {
            $metadata['value'] = 'image';
            $metadata['image'] = $request->file('image')->store('content-images', 'public');
        } else {
            $metadata['image'] = json_decode($content->metadata)->image;
        }

        $content->metadata = json_encode($metadata);

        $content->save();

        return response()->json([
            'status' => 200,
            'message' => 'Content Updated Successfully',
            'data' => $content,
        ]);
    }


    public function destroy($id): JsonResponse
    {
        $content = Content::find($id);

        if (!$content) {
            return response()->json([
                'status' => 404,
                'message' => 'Content Not Found',
            ], 404);
        }

        $content->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Content Deleted Successfully',
        ]);
    }
}

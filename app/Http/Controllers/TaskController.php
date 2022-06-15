<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;


class TaskController extends Controller
{
    public function index() {
        $tasks = Task::all();
        // Without scope
        // $notCompleted = Task::where('done', '=', '0')->get();
        
        // With scope
        $notCompleted = Task::active()->get();
        
        $data = [
            'tasks'           => $tasks,
            'num'             => count($tasks),
            'numNotCompleted' => count($notCompleted)
        ];

        return view('home')->with('data', $data);
    }

    public function store(Request $request)
    {
        if($request->has('filterData')) {
            // $filteredTasks = Task::all(['id']);
            $filteredTasks = [];
            $filterVal = $request->filterVal;


            if($filterVal == 0 || $filterVal == 1) {
                // Without scope
                // $filteredTasks = Task::where('done', '=', $filterVal)->get(['id']);

                // With scope
                $filteredTasks = Task::parameter($filterVal)->get(['id']);
            }

            return response()->json([
                'message' => 'Tasks filtered successfully',
                'filteredTasks'  => $filteredTasks
            ]);
        } else if($request->has('insertData')){
            $task = new Task;
            $task->name = $request->name;
            $task->done = false;
            $task->save();

            return response()->json([
                    'success' => true,
                    'data'    =>  $task,
                    'message' => 'Task added successfully'
            ]);
        }
    }

    public function destroy(Request $request){
        
        if($request->has('clearDone')) {
            // Without scope
            // $tasks = Task::where('done','=', 1)->delete();

            // With scope
            $tasks = Task::completed()->delete();
            
            return response()->json([
                'message' => 'All done tasks deleted successfully!'
            ]);
        } else {
            $task = Task::find($request->id);
            $task->delete();
        
            return response()->json([
                'message' => 'Data deleted successfully!'
            ]);
        }
    }

    public function update(Request $request) {
        $task = Task::find($request->id);

        if($request->has('updateData')) {
            $task->name = $request->name;
        } else {
            if($task->done == true) {
                $task->done = false; 
            } else {
                $task->done = true; 
            }
        }
        
        $task->save();

        return response()->json([
            'message'  => 'Data updated successfully!',
            'task'     => $task
        ]);
    }
}

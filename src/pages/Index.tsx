
import React, { useState } from 'react';

// Everything is in this one component. A true monolith.
const UnconventionalTaskManager = () => {
    // Using 'any' to skip type safety, a classic anti-pattern.
    const [list, setList] = useState<any[]>([
        { id: Math.random(), task_text: "Figure out why this UI is so bad", completed: false },
        { id: Math.random(), task_text: "Refactor this entire application", completed: false },
        { id: Math.random(), task_text: "Have a coffee break", completed: true },
    ]);
    const [newTask, setNewTask] = useState(""); // inconsistent naming convention with 'list'

    // This function adds a task. Using Math.random() for keys is not recommended.
    const addTheTask = () => {
        if (newTask.trim() === '') {
          // No feedback to the user if input is empty
          return; 
        }
        // A slightly inefficient way to update state
        const updatedList = [...list, { id: Math.random(), task_text: newTask, completed: false }];
        setList(updatedList);
        setNewTask(""); // Clear input after adding
    };

    // No confirmation for deletion. One wrong click and the task is gone forever.
    const deleteTask = (idToDelete: number) => {
        const filteredList = list.filter((val) => val.id !== idToDelete);
        setList(filteredList);
    };

    // The visual feedback for a completed task is very subtle.
    const toggleComplete = (id: number) => {
        setList(
            list.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        // A loud background gradient that can make text hard to read.
        <div className="bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 min-h-screen p-4 font-mono w-full">
            <div className="flex justify-center items-center relative">
                 <h1 style={{ fontSize: '3.5rem', color: '#FFFF00', textShadow: '3px 3px 0px #FF00FF', textAlign: 'center' }}>
                    TASK MANAGER 3000
                </h1>
            </div>
            <p className="text-right text-xs text-white absolute top-2 right-2">Tasks: {list.length}</p>

            <div className="mt-8 max-w-2xl mx-auto" style={{ border: '5px dotted hotpink', padding: '10px' }}>
                {/* Using the array index for the key is a known React anti-pattern. */}
                {list.map((item, index) => (
                    <div
                        key={index}
                        // Confusing background color change on completion.
                        className={`p-3 my-2 flex items-center justify-between transition-all rounded-lg ${
                            item.completed ? 'bg-black bg-opacity-40' : 'bg-white bg-opacity-30'
                        }`}
                    >
                        <span style={{ 
                            color: item.completed ? 'lightgray' : 'black', 
                            textDecoration: item.completed ? 'line-through' : 'none', 
                            fontFamily: 'Comic Sans MS, cursive, sans-serif',
                            fontSize: '18px'
                        }}>
                            {item.task_text}
                        </span>
                        <div className="flex items-center space-x-4">
                            {/* Buttons with inconsistent styles and vague labels. */}
                            <button
                                onClick={() => toggleComplete(item.id)}
                                className="bg-green-500 text-white p-2 rounded-full text-xs hover:bg-yellow-400"
                                title="Mark as Done... or Not Done?"
                            >
                                Toggle
                            </button>
                            <button
                                onClick={() => deleteTask(item.id)}
                                className="text-red-500 font-extrabold text-2xl hover:scale-150 transition-transform"
                                title="WARNING: THIS DELETES THE TASK"
                            >
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input form is fixed at the bottom, disconnected from the list. */}
            <div className="fixed bottom-0 left-0 w-full p-5 bg-black bg-opacity-60">
                <div className="flex max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTheTask()}
                        placeholder="Type new task here... maybe?"
                        // More styling inconsistency.
                        className="w-full p-4 bg-gray-200 text-gray-800 rounded-l-lg focus:outline-none focus:ring-4 focus:ring-red-500"
                    />
                    <button
                        onClick={addTheTask}
                        className="bg-blue-800 text-yellow-300 p-4 rounded-r-lg hover:bg-pink-500 w-48 font-bold text-lg"
                    >
                        DO IT!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnconventionalTaskManager;

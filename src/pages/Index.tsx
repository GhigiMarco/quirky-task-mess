
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

// Everything is in this one component. A true monolith.
const UnconventionalTaskManager = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getSessionData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        getSessionData();

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && !session) {
            navigate('/auth');
        }
    }, [session, loading, navigate]);
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

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

    if (loading) {
        return (
            <div className="bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 min-h-screen p-4 font-mono w-full flex items-center justify-center">
                <h1 className="text-yellow-300 text-5xl animate-ping">Connecting...</h1>
            </div>
        );
    }

    return (
        // A loud background gradient that can make text hard to read.
        <div className="bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 min-h-screen p-4 font-mono w-full">
            <div className="flex justify-center items-center relative">
                 <h1 style={{ fontSize: '3.5rem', color: '#FFFF00', textShadow: '3px 3px 0px #FF00FF', textAlign: 'center' }}>
                    TASK MANAGER 3000
                </h1>
                <button
                    onClick={handleLogout}
                    className="ml-8 bg-purple-600 text-white p-3 rounded-full hover:bg-red-700 hover:animate-spin"
                    title="GTFO"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </button>
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

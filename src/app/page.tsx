"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
    getTasks,
    addTask,
    completeTask,
    deleteTask
} from "@/app/lib/task_action"; // Your Axios helpers

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export default function Home() {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("0");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "0";

        if (!token) {
            router.push("/login");
            return;
        }

        if (!isTokenValid()) {
            router.push("/login");
            return;
        }

        // Otherwise, set states
        setToken(token);
        setUserId(userId);
        setIsAuthenticated(true);
    }, [router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAllTasks();
        }
    }, [isAuthenticated]);

    function isTokenValid() {
        const expiresAt = localStorage.getItem("accessTokenExpiresAt"); // or "refreshTokenExpiresAt"
        if (!expiresAt) return false;
        return Date.now() < parseInt(expiresAt, 10);
    }

    async function fetchAllTasks() {
        const data = await getTasks(token, userId);
        if (data) {
            setTasks(data);
        }
    }

    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault();
        if (!isTokenValid()) return router.push("/login");

        if (!newTask.title.trim()) return; // avoid blank titles

        const res = await addTask(newTask, token, userId);
        if (res) {
            setNewTask({ title: "", description: "" });
            fetchAllTasks();
        }
    }

    async function handleCompleteTask(taskId: number) {
        if (!isTokenValid()) return router.push("/login");

        const res = await completeTask(taskId, token, userId);
        if (res) {
            fetchAllTasks();
        }
    }

    async function handleDeleteTask(taskId: number) {
        if (!isTokenValid()) return router.push("/login");

        const res = await deleteTask(taskId, token, userId);
        if (res) {
            fetchAllTasks();
        }
    }

    if (!isAuthenticated) {
        return <p>Redirecting to login...</p>;
    }

    return (
        <div className="flex items-center justify-center bg-gray-900">
            <div className="bg-white p-8 rounded-lg shadow-md w-full h-screen mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center">Task Master Dashboard</h1>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded px-4 py-2"
                        value={newTask.title}
                        onChange={(e) =>
                            setNewTask((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Enter a new task..."
                    />
                    <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded px-4 py-2"
                        value={newTask.description}
                        onChange={(e) =>
                            setNewTask((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Enter task description..."
                    />
                    <button
                        type="submit"
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Add Task
                    </button>
                </form>

                <h2 className="text-lg font-bold mb-2 text-gray-600 mt-10">Tasks to do</h2>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded px-4 py-2"
                        >
                    <span className={clsx({ "line-through": task.completed })}>
                        {task.title} - {task.description}
                    </span>
                            <div className="space-x-2 mt-2 sm:mt-0">
                                {!task.completed && (
                                    <button
                                        onClick={() => handleCompleteTask(task.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Complete
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}





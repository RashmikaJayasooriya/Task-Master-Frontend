"use server";

import axios from "axios";

export async function getTasks(token: string, userId: string) {
    try {
        const response = await axios.get(`http://localhost:8080/tasks/view-all?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // response.data: { code: 202, message: "", data: [ { id, title, status } ] }
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
    }
}

export async function addTask(task: {title:string,description:string},token: string, userId: string) {
    try {
        // The TaskRequestDto might need "title", "userId", etc.
        const requestBody = {
            title: task.title,
            description: task.description,
            userId: userId,
        };

        console.log("Request Body:", requestBody);

        const response = await axios.post("http://localhost:8080/tasks/add", requestBody, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // If success, do something with response
        return response.data;
    } catch (error) {
        console.error("Failed to add task:", error);
        return null;
    }
}

export async function completeTask(taskId: number,token: string, userId: string) {
    try {
        const response = await axios.put(
            `http://localhost:8080/tasks/complete?taskId=${taskId}&userId=${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` }, },
        );
        return response.data;
    } catch (error) {
        console.error("Failed to complete task:", error);
        return null;
    }
}

export async function deleteTask(taskId: number,token: string, userId: string) {
    try {
        const response = await axios.delete(
            `http://localhost:8080/tasks/delete?taskId=${taskId}&userId=${userId}`,
            { headers: { Authorization: `Bearer ${token}` }, },
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return null;
    }
}

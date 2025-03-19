import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { employeeId } = Object.fromEntries(new URL(req.url).searchParams);

        if (!employeeId) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        const baseUrl = "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/employee";

        const response = await axios.get(`${baseUrl}/${employeeId}`);

        return NextResponse.json({ message: "Request successful", data: response.data });
    } catch (error: any) {
        return NextResponse.json(
            { error: "An error occurred", details: error.message },
            { status: 500 }
        );
    }
}


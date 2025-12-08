
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';

export async function POST(req) {
    try {
        const { explanation, reason, userEmail, userImage, userName, userId } = await req.json();

        // Basic validation
        if (!explanation || !reason) {
            return NextResponse.json(
                { message: 'Explanation and Reason are required.' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const collection = db.collection('return_requests');

        const result = await collection.insertOne({
            explanation,
            reason,
            userEmail,
            userImage,
            userName,
            userId,
            createdAt: new Date(),
            status: 'pending' // Default status
        });

        return NextResponse.json({ message: 'Return request submitted successfully', returnId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Error submitting return request:', error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

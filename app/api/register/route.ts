import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

interface User {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const users: User[] = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

    if (users.find((u) => u.email === email)) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 409 }
      );
    }

    users.push({ email, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { success: true, message: 'Account created successfully!' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

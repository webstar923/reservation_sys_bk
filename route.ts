import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

// const API_BASE_URL = process.env.API_BASE_URL || 'http://54.72.59.0';
// const BASE_URL = `${API_BASE_URL}/albums`

const BASE_URL = 'http://54.72.59.0/albums';

// GET request handler
export async function GET(req: Request) {
  try {
    // Use the token to make an authenticated request to the backend
    const res = await fetchWithAuth(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    req,
  );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch albums' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST request handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetchWithAuth(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    req,
  );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to create album' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// GET album by ID request handler
export async function GET_ALBUM_BY_ID(req: Request, albumId: string) {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/${albumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: `Failed to fetch album with ID ${albumId}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: `Failed to fetch album with ID ${albumId}` }, { status: 500 });
  }
}

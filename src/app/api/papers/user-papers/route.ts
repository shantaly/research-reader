import { UserService } from '@/server/services/userService';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  console.log("userId", userId);
  
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const papers = await UserService.getUserPapers(userId);
  return NextResponse.json(papers);
}
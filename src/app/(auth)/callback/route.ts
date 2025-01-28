import { NextResponse } from 'next/server'
import { createServerClient } from '@/utils/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')

    // If there's an error, redirect to error page
    if (error) {
      return NextResponse.redirect(`${origin}/auth-code-error?error=${error}`)
    }

    // If there's no code, redirect to home page as the client will handle the hash-based token
    if (!code) {
      return NextResponse.redirect(origin)
    }

    const supabase = createServerClient()
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError)
      return NextResponse.redirect(`${origin}/auth-code-error?error=${sessionError.message}`)
    }

    if (!data.session) {
      console.error('No session data returned')
      return NextResponse.redirect(`${origin}/auth-code-error?error=no_session`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(`${origin}/auth-code-error?error=unexpected`)
  }
}
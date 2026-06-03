// supabase/functions/hello.ts
export async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

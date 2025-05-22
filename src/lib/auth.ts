export async function getUserId(): Promise<string | null> {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) return null;

    const data = await res.json();
    return data.sub ?? null;
  } catch {
    return null;
  }
}

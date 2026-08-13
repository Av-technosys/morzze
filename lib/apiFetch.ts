'use server'
import { BASE_API_URL } from "@/env";
import { auth } from "@/auth";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const session = await auth();
  const accessToken = session?.accessToken;

  const makeRequest = async (token?: string) => {
    return fetch(`${BASE_API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  const res = await makeRequest(accessToken);

  return {
    status: res.status,
    data: await res.json(),
  };
}

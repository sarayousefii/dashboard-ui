import { NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = Number(searchParams.get("limit") ?? 10);
  const skip = Number(searchParams.get("skip") ?? 0);
  const q = searchParams.get("q") ?? "";

  const baseUrl = "https://dummyjson.com/products";
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (q) {
    params.set("q", q);
  }

  const url = q
    ? `${baseUrl}/search?${params.toString()}`
    : `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  const data: unknown = await response.json();

  return successResponse(data);
}

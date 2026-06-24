import { NextResponse , NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
} from "@/lib/api-response";
import { createProductSchema } from "@/features/products/schemas/product-api.schema";
import { fetchProducts , createProductService } from "@/services/products.service";

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

  const res = await fetch(url);
  const data = await res.json();

  return successResponse(data);
}
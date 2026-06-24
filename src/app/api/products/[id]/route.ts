import { NextRequest } from "next/server";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

import {
  fetchProductById,
  updateProductService,
  deleteProductService,
} from "@/services/products.service";

import { updateProductSchema } from "@/features/products/schemas/product-api.schema";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  const data = await fetchProductById(
    Number(id)
  );

  return successResponse(data);
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const result =
      updateProductSchema.safeParse(
        body
      );

    if (!result.success) {
      return errorResponse(
        result.error.issues[0]
          ?.message,
        400
      );
    }

    const data =
      await updateProductService(
        Number(id),
        result.data
      );

    return successResponse(
      data,
      "Product updated"
    );
  } catch {
    return errorResponse(
      "Failed to update product",
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const data =
      await deleteProductService(
        Number(id)
      );

    return successResponse(
      data,
      "Product deleted"
    );
  } catch {
    return errorResponse(
      "Failed to delete product",
      500
    );
  }
}
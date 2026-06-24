
/*get Products */
interface FetchProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}

export async function fetchProducts({
  limit = 10,
  skip = 0,
  search = "",
  sortBy,
  order,
}: FetchProductsParams) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (search) params.set("q", search);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const res = await fetch(
    `https://dummyjson.com/products/search?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

/* create Product*/ 

export async function createProductService(
  data: unknown
) {
  const res = await fetch(
    "https://dummyjson.com/products/add",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to create product"
    );
  }

  return res.json();
}

/*Get Product by id*/
export async function fetchProductById(
  id: number
) {
  const res = await fetch(
    `https://dummyjson.com/products/${id}`
  );

  if (!res.ok) {
    throw new Error(
      "Product not found"
    );
  }

  return res.json();
}

/*Update Product*/
export async function updateProductService(
  id: number,
  data: unknown
) {
  const res = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to update product"
    );
  }

  return res.json();
}

/* delete Product */
export async function deleteProductService(
  id: number
) {
  const res = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to delete product"
    );
  }

  return res.json();
}
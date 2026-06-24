import {
  USER_ROLES,
  USER_STATUSES,
} from "@/features/users/types/user.types";
interface FetchUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}

export async function fetchUsers({
  limit = 10,
  skip = 0,
  search = "",
  sortBy,
  order,
}: FetchUsersParams) {
  const baseUrl = search
    ? "https://dummyjson.com/users/search"
    : "https://dummyjson.com/users";

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (search) {
    params.set("q", search);
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (order) {
    params.set("order", order);
  }

  const res = await fetch(
  `${baseUrl}?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  const data = await res.json();

  const users = data.users.map(
    (
      user: any,
      index: number
    ) => ({
      ...user,

      role:
        USER_ROLES[
          index % USER_ROLES.length
        ],

      status:
        USER_STATUSES[
          index %
            USER_STATUSES.length
        ],
    })
  );

  return {
    ...data,
    users,
  };
}

export async function fetchUserById(
  id: number
) {
  const res = await fetch(
    `https://dummyjson.com/users/${id}`
  );

  if (!res.ok) {
    throw new Error(
      "User not found"
    );
  }

  const user = await res.json();

  return {
    ...user,

    role:
      USER_ROLES[
        user.id % USER_ROLES.length
      ],

    status:
      USER_STATUSES[
        user.id %
          USER_STATUSES.length
      ],
  };
}

export async function updateUserService(
  id: number,
  data: unknown
) {
  const res = await fetch(
    `https://dummyjson.com/users/${id}`,
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
      "Failed to update user"
    );
  }

  return res.json();
}

/* delete Product */
export async function deleteUserService(
  id: number
) {
  const res = await fetch(
    `https://dummyjson.com/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to delete user"
    );
  }

  return res.json();
}
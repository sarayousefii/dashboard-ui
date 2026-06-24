import { appToast } from "./toast";

import { getErrorMessage } from "./api-error";

export function handleMutationError(
  error: unknown
) {
  appToast.error(
    getErrorMessage(error)
  );
}
export function sendTubitakResponse(
  res,
  statusCode: number,
  data: Record<string, any> = {},
) {
  return res.status(statusCode).json(data);
}

export function sendErrorResponse(
  res,
  statusCode: number,
  messages: { code: string; message: string; type: string }[] = null,
) {
  const { code, message, type } = messages[0] ?? {};

  return res.status(statusCode).json({
    message: { code, message, type },
    messages,
  });
}

export function sendValidationError(
  res,
  validationMessages: { message: string; type: string }[],
) {
  return res.status(400).json({
    message: {
      code: "400",
      message: "Invalid Request",
      type: "MethodArgumentNotValidException",
    },
    messages: validationMessages,
  });
}

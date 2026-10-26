export const controllerHandler = (action, fallbackMessage) => async (req, res) => {
  try {
    const result = await action(req);
    const statusCode = result?.statusCode ?? 200;
    const body = result && Object.hasOwn(result, "body") ? result.body : result;
    return res.status(statusCode).json(body);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : fallbackMessage,
      ...(error.statusCode ? {} : { error: error.message }),
    });
  }
};

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error, message = 'Error occurred', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};

export { 
  sendSuccess,
  sendError,
 };

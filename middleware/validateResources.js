const validateResource = (resourceSchema) => async (req, res, next) => {
  try {
    await resourceSchema.validate({ destination: req.body.destination });
    console.log("validateResource middleware executed");
    next();
  } catch (error) {
    return res.sendStatus(404);
  }
};

export default validateResource;

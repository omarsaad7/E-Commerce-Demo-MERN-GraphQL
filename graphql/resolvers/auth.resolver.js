const authController = require("../../api/controllers/auth.controller");
const {Login}=authController

module.exports = {
    login: async (args) => {
      return await Login(args.loginInput) 
    }
  }
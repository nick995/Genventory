export const ServerVariables = {
    // ========== User ========
    Register : "register", 
    Login : "login",
    Logout : "logout",
    Update : "user/:id",
    Delete : "user/:id",
    FetchUser : "user/fetch/:id",
    VerifyOTP : "user/otp/verify",

    // ========= Password ========
    Generate : "generatePassword",
    FetchPassword : "getPassword/:id",
    updatePassword: "updatePassword/:id",
    DeletePassword : "deletePassword/:id",
    AddPassword: "addPassword/:id",
}
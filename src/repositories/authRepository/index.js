import base from "@/repositories/baseRepository"

const login = (email, password) => base.post("auth/login", {email, password})
const changePassword = (passwords) => base.post("auth/change-password", passwords)

export default {
    login,
    changePassword
}

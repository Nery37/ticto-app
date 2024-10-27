import base from "@/repositories/baseRepository"

const store = () => base.post("check-in")
const indexSubordinates = (params = null) => base.get("check-in", {params : params})
const indexUserToday = () => base.get("check-in/today")

export default {
  store,
  indexSubordinates,
  indexUserToday,
}

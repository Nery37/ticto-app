import base from "@/repositories/baseRepository"

const getByZipCode = (zipCode) => base.get("address/"+zipCode)

export default {
  getByZipCode,
}

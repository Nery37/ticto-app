import base from "@/repositories/baseRepository"

const me = () => base.get("user-info")
const index = (params) => base.get("user", { params: params });
const show = (id) => base.get(`user/${id}`);
const store = (data) => base.post("user", data);
const update = (id, data) => base.put(`user/${id}`, data);
const destroy = (id) => base.delete(`user/${id}`);

export default {
  me,
  index,
  show,
  store,
  update,
  destroy,
}

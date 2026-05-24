import { model } from "@medusajs/framework/utils"

const ServiceSetting = model.define("service_setting", {
  id: model.id().primaryKey(),
  key: model.text(),
  value: model.text(),
})

export default ServiceSetting

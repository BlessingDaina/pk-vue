// 车牌验证   验证通过返回true 不通过为false

export function isVehicleNumber (vehicleNumber) {
  // 绿牌车
  let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
  // 普通车
  let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
  if (vehicleNumber.length === 7) {
    return creg.test(vehicleNumber)
  } else if (vehicleNumber.length === 8) {
    return xreg.test(vehicleNumber)
  } else {
    return false
  }
}
// 验证手机号 这里只做了最简单的验证
export function isPhone (num) {
  let phone = /^1\d{10}$/
  return phone.test(num)
}

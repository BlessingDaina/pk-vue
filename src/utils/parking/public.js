// 格式化日期拓展方法,第一个参数入时间,第二个参数传入格式
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * return 各种格式化后的日期
 *
 */
export function getFormatDateTime () {
  let data = new Date()
  let monthlyFirstDay = formatDate(data, 'yyyy-MM-01') // 本月1号
  let today = formatDate(data, 'yyyy-MM-dd') // 今天
  let monthlyFirstTime = formatDate(data, 'yyyy-MM-01 00:00:00') // 本月1号0时
  let now = formatDate(data, 'yyyy-MM-dd hh:mm:ss') // 此刻
  let currentMonth = formatDate(data, 'yyyy-MM') // 本月
  return {monthlyFirstDay, today, monthlyFirstTime, now, currentMonth}
}

/**
 * 获取多少时间前的时间点（如：半年前）
 * @param  {[type]}  beforeDate    [多少时间前（时间戳）]
 *
 */
export function beforeTime (beforeDate) {
  let date = new Date()
  date = new Date(Date.parse(date) - beforeDate)
  date = date.format('yyyy-MM-dd')

  return date
}

/**
 * 获取时间差的方法
 * @param {[type]}  startDate    [开始时间]
 * @param {[type]}  endDate      [结束时间]
 * return number
 */
export function DateDiff (startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = (end - start) / 1000 / 60 / 60 / 24

  return diff
}

/**
 * 获取两个日期之间的日期
 * @param {[type]}  start  [开始时间]
 * @param {[type]}  end    [结束时间]
 *
 */

function formats (_this) {
  var s = ''
  var mouth = (_this.getMonth() + 1) >= 10 ? (_this.getMonth() + 1) : ('0' + (_this.getMonth() + 1))
  var day = _this.getDate() >= 10 ? _this.getDate() : ('0' + _this.getDate())
  s += _this.getFullYear() + '-' // 获取年份。
  s += mouth + '-' // 获取月份。
  s += day // 获取日期
  return (s) // 返回日期
}

export function getBetweenDateStr (begin, end) {
  var arr = []
  var ab = begin.split('-')
  var ae = end.split('-')
  var db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  var de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  var unixDb = db.getTime() - 24 * 60 * 60 * 1000
  var unixDe = de.getTime() - 24 * 60 * 60 * 1000
  for (var k = unixDb; k <= unixDe;) {
    // console.log((new Date(parseInt(k))).formats())
    k = k + 24 * 60 * 60 * 1000
    //              arr.push((new Date(parseInt(k))).formats())
    arr.push(formats(new Date(parseInt(k))))
  }

  return arr
}

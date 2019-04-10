import axios from 'axios'
import qs from 'qs'
// 导出公共方法-----地址， 参数， 导出文件名
export function exportExcel (url, data, name) {
  data = qs.stringify(data)
  axios({
    method: 'post',
    url,
    data,
    responseType: 'blob' // 类型--必须传
  }).then((res) => {
    console.log(res)
    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) // application/vnd.ms-excel; application/x-xls
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let num = ''
    for (let i = 0; i < 10; i++) {
      num += Math.ceil(Math.random() * 10)
    }
    link.setAttribute('download', name + '_' + num + '.xlsx') // 文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }).catch(error => {
    this.$message.error({
      title: '错误',
      desc: '网络连接错误'
    })
    console.log(error)
  })
}

/**
* @author: daina
* @date: 2019/4/8
* @description:
*/
<template>
  <span>
    <input class="input-file" type="file" @change="exportData" ref="clearFile"
           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    <el-button class="import-button" type="primary" size="small" @click="btnClick">导入</el-button>
  </span>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'inputExcel',
  data () {
    return {}
  },
  methods: {
    btnClick () {
      document.querySelector('.input-file').click()
    },
    exportData (event) {
      if (!event.currentTarget.files.length) {
        return
      }
      const that = this
      // 拿取文件对象
      let f = event.currentTarget.files[0]
      // 用FileReader来读取
      let reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = ''
        let wb // 读取完成的数据
        let outdata // 你需要的数据
        let reader = new FileReader()
        reader.onload = function (e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          let bytes = new Uint8Array(reader.result)
          console.log(reader.result)
          let length = bytes.byteLength
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          outdata = JSON.parse(JSON.stringify(outdata))
          outdata.shift()
          outdata.shift()
          // outdata.pop()
          console.log(outdata)
          // 自定义方法向父组件传递数据
          that.$emit('getResult', outdata)
          // 清空file文件
          that.$refs.clearFile.value = ''
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    }
  }
}
</script>

<style scoped lang="scss">
  .input-file {
    display: none;
  }

  .el-button {
    margin: 0 10px;
  }
</style>

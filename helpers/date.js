module.exports = class DateFunctions {
  static getFormattedDate(daysFromToday) {
    let today = new Date(Date.now()).getTime()
    let milliseconds = Number(daysFromToday) * 24 * 60 * 60 * 1000
    let date = new Date(today + milliseconds)
    let result = formatRawDate(date)
    return result
    
    function formatRawDate(input) {
      let date = input.getDate()
      var month = input.getMonth(); //Be careful! January is 0 not 1
      var year = input.getFullYear();

      var dateString = (month + 1) + "-" + date + "-" + year;
      return dateString
    }
  }
} 
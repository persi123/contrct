
const utils = {
  address:'',
  shortenAddress(address){
      return (address.length === 34) ? address.substr(0, 4) + '...' + address.substr(30, 33): address;
  },
  convertTimeStamp(time) {
      if (time <= 0) return "";
      var d = new Date(time);
      return utils.twoDigit(d.getDate()) + '/' + utils.twoDigit(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + utils.twoDigit(d.getHours()) + ':' + utils.twoDigit(d.getMinutes()) + ':' + utils.twoDigit(d.getSeconds());
  },
  convertTimeStampNoTime(time) {
      if (time <= 0) return "";
      var d = new Date(time);
      return utils.twoDigit(d.getDate()) + '/' + utils.twoDigit(d.getMonth() + 1) + '/' + d.getFullYear() ;
  },
  twoDigit(myNumber) {
      return ("0" + myNumber).slice(-2);
  },
  TwoDigitTime(time) {
      if (time < 10)
          return "0" + time;
      else return time + "";
  },
  truncateStr(str, n) {
      if (!str) return '';
      return (str.length > n) ? str.substr(0, n - 1) + '...' + str.substr(str.length - n, str.length - 1) : str;
  },
  numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  delay(timeout) {
      return new Promise(resolve => {
          setTimeout(resolve, timeout);
      });
  },
  convertDuration(duration){
    var n = parseInt(duration);
    var day = Math.floor(n / (24 * 3600)); 

    n = n % (24 * 3600); 
    var hour = Math.floor(n / 3600); 
  
    n %= 3600; 
    var minutes = Math.floor(n / 60) ; 
  
    n %= 60; 
    var seconds = Math.floor(n); 
    return utils.twoDigit(day)+' days '+utils.twoDigit(hour)+' hours '+utils.twoDigit(minutes)+' minutes '+utils.twoDigit(seconds) + ' seconds';
  }
  
};
  
export default utils;

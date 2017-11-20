import axios from 'axios';
let requesturl = 'https://wx.jycoud.cc/';

class DataService {

   getClass(cb) {
    let that = this;
    let item = {
      RetCode: -1,
      data: {}
    };
    axios({
        method: 'get',
        url: 'getClass',
        baseURL: that.getRequestUrl(),
        withCredentials:true,
        params: {
        }
      })
      .then(function (response) {
        if (response.status == 200) {
          item = response.data;
        }
        typeof cb == "function" && cb(item)
      })
      .catch(function (error) {
        typeof cb == "function" && cb(item)
      });
  }

   getTarget() {
    let item = {
      RetCode: -1,
      data: {}
    };
    axios({
        method: 'get',
        url: that.getRequestUrl() + 'getTarget',
        data: {
          tokenId: 'token',
          queryKey: 'queryKey',
          serivceidArry: 'serivceidArry'
        }
      })
      .then(function (response) {
        console.log('response:', response);
        typeof cb == "function" && cb(item)
      })
      .catch(function (error) {
        console.log(error);
        typeof cb == "function" && cb(item)
      });
  }

  setCollectionPointInfo(target,cb) {
    console.log('setCollectionPointInfo');
    let item = {
      RetCode: -1,
      data: {}
    };
    let that = this;
 /*  axios({
        method: 'post',
        url: 'setCollectionPointInfo',
        baseURL: that.getRequestUrl(),
        data: {
          paraData: target,
        },
        headers: {
        //  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
  */    
      var params = new URLSearchParams();
      params.append('paraData', JSON.stringify(target));
      axios.post(that.getRequestUrl()+'setCollectionPointInfo', params,{withCredentials:true})
      .then(function (response) {
        console.log('response:', response);
        if (response.status == 200) {
          item = response.data;
        }
        typeof cb == "function" && cb(item)
      })
      .catch(function (error) {
        console.log(error);
        typeof cb == "function" && cb(item)
      });
  }

  getRequestUrl() {
   //  return 'https://wx.jycloud.cc/';
    return 'http://192.168.1.109:8089/';
  }
};

export default DataService;

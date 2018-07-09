//index.js
//获取应用实例
const app = getApp();
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let map = new QQMapWX({
  key: 'VAFBZ-JYFE6-TUCSP-ECEBS-ZV7YS-IXFYX',
});

Page({
  data: {
    location: {}, //位置
    weather: {},  //天气
    lifestyle: {}, //生活指数
    hourly: {},  //24小时预报
    forecast: [],  //七天预报
    lat: '',  //纬度
    lng: '',  //经度
    air: {},  //空气质量
    refreshtime: '', //更新时间
    weather_icon: '../../img/999.png', //天气图标代号
    ImgUrl: '',//背景图片路径
  },
  onLoad: function () {
    let _width = wx.getSystemInfoSync().windowWidth;
    let _height = wx.getSystemInfoSync().windowHeight;
    let imgurl = app.globalData.bingImgUrl + '/ImageResolution.aspx?w=' + _width + '&h=' + _height;
    app.globalData.ImgUrl = imgurl;
    this.setData({
      ImgUrl: app.globalData.ImgUrl
    });
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        let latitude = res.latitude // 纬度
        let longitude = res.longitude // 经度
        this.setData({
          lat: latitude,
          lng: longitude,
        });
        this.getWeather();
        this.getAirQuality();
        this.getCity();
      }
    })
  },
  onShow: function () {},
  getCity: function () {
    let that = this;
    map.reverseGeocoder({
      location: {
        latitude: that.data.lat,
        longitude: that.data.lng,
      },
      success: function (res) {
        that.setData({
          location: res.result.address_component
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (res) {
      }
    })
  },
  getWeather: function () {
    let that = this;
    wx.request({
      url: app.globalData.heWeather + 'key=' + app.globalData.heWeatherKey + '&location=' + + that.data.lng + ',' + that.data.lat,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let w_now = res.data.HeWeather6[0].now;
        app.globalData.lifeStyle = res.data.HeWeather6[0].lifestyle;
        let icon = '../../img/' + w_now.cond_code + '.png';
        let hour_weather = res.data.HeWeather6[0].hourly;
        let forecast = res.data.HeWeather6[0].daily_forecast;
        that.setData({
          weather: w_now,
          refreshtime: res.data.HeWeather6[0].update.loc.slice(-5),
          weather_icon: icon,
          lifestyle: res.data.HeWeather6[0].lifestyle,
          hourly: hour_weather,
          forecast: forecast,
        });
      }
    })
  },
  getAirQuality: function () {
    let that = this;
    wx.request({
      url: app.globalData.heWeatherAir + 'key=' + app.globalData.heWeatherKey + '&location=auto_ip'/* + that.data.lng + ',' + that.data.lat*/,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let air_now = res.data.HeWeather6[0].air_now_city;
        that.setData({
          air: air_now
        })
      }
    })
  },
  showDetails: function () {
    wx.navigateTo({
      url: '../details/details',
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '发现一个好用的天气应用，你也来试试吧',
      path: '/pages/index/index'
    }
  }
})


// dateRefresh: 数据刷新时间
// totalPayAmount: 总销售额
// totalOrderCnt：总订单数
// dayPayAmount：单日最高销售额


// 总量
export var total = {
  success: true,
  message: "操作成功",
  resultCode: "10000",
  body: {
    dateRefresh: "2020.07.04 20:00",
    totalPayAmount: "92,809,424",
    totalOrderCnt: "2,528,711",
    dayPayAmount: "10,945,252",
  },
};


// payAmount: 销售总额
// orderCnt：订单总数
// yearOnyearPer：同比上升
// expect：期望订单数
// ratePer：订单数达成率

//2019 重疾险数据
export var zjx = {
  success: true,
  message: "操作成功",
  resultCode: "10000",
  body: {
    dateRefresh: "2020.07.04 20:00",
    total: {
      payAmount: "74,288,190",
      orderCnt: "2,476,273",
      yearOnyearPer: 5.4,
      expect: 3000000,
      ratePer: 82.5,
    },
    top5: [
      { channelName: "官方微信", orderCnt: 2100402, percent: 84.82 },
      { channelName: "金管家", orderCnt: 73501, percent: 2.97 },
      { channelName: "官方APP", orderCnt: 67587, percent: 2.73 },
      { channelName: "i深圳APP", orderCnt: 47821, percent: 1.93 },
      { channelName: "深圳重疾", orderCnt: 46681, percent: 1.89 },
      { channelName: "其他", orderCnt: 140281, percent: 5.67 },
    ],
    medicalKit: null,
  },
};

//2019 健康险数据
export var jkx = {
  success: true,
  message: "操作成功",
  resultCode: "10000",
  body: {
    dateRefresh: "2020.07.04 20:00",
    total: {
      payAmount: "18,516,231",
      orderCnt: "52,421",
      yearOnyearPer: 31.7,
      expect: null,
      ratePer: null,
    },
    top5: [
      { channelName: "官方微信", orderCnt: 33838, percent: 64.55 },
      { channelName: "深圳重疾", orderCnt: 12981, percent: 24.76 },
      { channelName: "宣传", orderCnt: 1129, percent: 2.15 },
      { channelName: "官方APP", orderCnt: 1123, percent: 2.14 },
      { channelName: "短信", orderCnt: 946, percent: 1.8 },
      { channelName: "其他", orderCnt: 2404, percent: 4.59 },
    ],
    medicalKit: null,
  },
};

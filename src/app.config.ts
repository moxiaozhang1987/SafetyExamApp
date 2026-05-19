export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/wrong/index',
    'pages/mine/index',
    'pages/exam/index'
  ],
  tabBar: {
    color: '#86909C',
    selectedColor: '#165dff',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/wrong/index',
        text: '错题本'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165dff',
    navigationBarTitleText: '安全专项考核',
    navigationBarTextStyle: 'white'
  }
})

export default defineAppConfig({
  pages: [
    'pages/weekend/index',
    'pages/match/index',
    'pages/journey/index',
    'pages/records/index',
    'pages/invite/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '周末一小时朋友',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#636E72',
    selectedColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/weekend/index',
        text: '周末计划'
      },
      {
        pagePath: 'pages/match/index',
        text: '快速匹配'
      },
      {
        pagePath: 'pages/journey/index',
        text: '行程中'
      },
      {
        pagePath: 'pages/records/index',
        text: '个人记录'
      }
    ]
  }
})

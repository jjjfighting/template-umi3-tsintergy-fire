import { contentCommon, devRoutes, ExceptionRoutes } from './common';

/**
 * 开发，生成环境配置权限地址: https://adssx-dev-gzdevops.tsintergy.com/usercenter/#/user/platform/application
 */

const routes: RouteConfig[] = [
  ...ExceptionRoutes,
  ...(process.env.NODE_ENV === 'development' ? devRoutes : []), // 开发环境路由
  { exact: true, path: '/', redirect: '/TradeReview/MarketBoard' },
  {
    title: 'content',
    component: '@/components/Layout',
    routes: [
      ...contentCommon,
      {
        title: '公有数据管理',
        icon: 'weixuanzhong7',
        path: '/PublicDataManage',
        routes: [
          {
            title: '全网负荷信息',
            path: '/PublicDataManage/WholeNetworkPayload',
            component: '@/pages/PublicDataManage/WholeNetworkPayload',
          },
          {
            title: '全省节点电价',
            path: '/PublicDataManage/ProvincePrice',
            component: '@/pages/PublicDataManage/ProvincePrice',
          },
          {
            title: '清能预测电价',
            path: '/PublicDataManage/ForecastElectricityPrice',
            component: '@/pages/PublicDataManage/ForecastElectricityPrice',
          },
          {
            title: '发电机组检修计划',
            path: '/PublicDataManage/PowerOverhaul',
            component: '@/pages/PublicDataManage/PowerOverhaul',
          },
          {
            title: '输变电检修',
            path: '/PublicDataManage/TransOverhaul',
            component: '@/pages/PublicDataManage/TransOverhaul',
          },
          {
            title: '日前必开机组组合',
            path: '/PublicDataManage/OpenStopGroup',
            component: '@/pages/PublicDataManage/OpenStopGroup',
          },
          {
            title: '日前开机不满最小约束时间机组名单',
            path: '/PublicDataManage/MinTimeConstraint',
            component: '@/pages/PublicDataManage/MinTimeConstraint',
          },
          {
            title: '电网设备停运情况',
            path: '/PublicDataManage/NetRunAndStop',
            component: '@/pages/PublicDataManage/NetRunAndStop',
          },
          {
            title: '机组检修容量',
            path: '/PublicDataManage/UnitMaintenanceCapacity',
            component: '@/pages/PublicDataManage/UnitMaintenanceCapacity',
          },
          {
            title: '必开必停容量',
            path: '/PublicDataManage/OnOffCapacity',
            component: '@/pages/PublicDataManage/OnOffCapacity',
          },
          {
            title: '事前监管',
            path: '/PublicDataManage/PriorSupervision',
            component: '@/pages/PublicDataManage/PriorSupervision',
          },
        ],
      },
      {
        title: '现货交易',
        path: '/TradeReview',
        icon: 'weixuanzhong2',
        routes: [
          {
            title: '市场行情看板',
            path: '/TradeReview/MarketBoard',
            component: '@/pages/TradeReview/MarketBoard',
          },
          {
            title: '披露信息对比',
            path: '/TradeReview/CompareInfo',
            component: '@/pages/TradeReview/CompareInfo',
          },
          {
            title: '现货交易结果',
            path: '/TradeReview/TradeReviewResult',
            component: '@/pages/TradeReview/TradeReviewResult',
          },
          {
            title: '场站出力分析',
            path: '/TradeReview/StationOutputAly',
            component: '@/pages/TradeReview/StationOutputAly',
          },
          {
            title: '现货电价分析',
            path: '/TradeReview/SpotPriceAnalysis',
            component: '@/pages/TradeReview/SpotPriceAnalysis',
          },
          {
            title: '现货模拟出清',
            path: '/TradeReview/TradeImitate',
            component: '@/pages/TradeReview/TradeImitate',
          },
          {
            title: '报价方案管理',
            path: '/TradeReview/QuoteManage',
            component: '@/pages/TradeReview/QuoteManage',
          },
        ],
      },
      {
        title: '中长期交易',
        path: '/LongTermTrade',
        icon: 'weixuanzhong5',
        routes: [
          {
            title: '持仓分析',
            path: '/LongTermTrade/PositionAnalysis',
            component: '@/pages/LongTermTrade/PositionAnalysis',
          },
          {
            title: '持仓总览',
            path: '/LongTermTrade/PositionsOverview',
            component: '@/pages/LongTermTrade/PositionsOverview',
          },
          {
            title: '合约管理',
            path: '/LongTermTrade/ContractManager',
            component: '@/pages/LongTermTrade/ContractManager',
          },
          {
            title: '分解曲线',
            path: '/LongTermTrade/DecomposeCurve',
            component: '@/pages/LongTermTrade/DecomposeCurve',
          },
          {
            title: '交易日历',
            path: '/LongTermTrade/TradeCalendar',
            component: '@/pages/LongTermTrade/TradeCalendar',
          },
        ],
      },
      {
        title: '报表管理',
        path: '/ReportManage',
        icon: 'a-8baobiaoguanli',
        routes: [
          {
            title: '报表管理',
            path: '/ReportManage/MonthReport',
            component: '@/pages/ReportManage/MonthReport',
          },
        ],
      },
      {
        title: '火电数据',
        path: '/FireData',
        icon: 'a-15huodianshuju',
        routes: [
          {
            title: '机组参数信息',
            path: '/FireData/UnitParamInfo',
            component: '@/pages/FireData/UnitParamInfo',
          },
          {
            title: '生产运行信息',
            path: '/FireData/ProductionRunInfo',
            component: '@/pages/FireData/ProductionRunInfo',
          },
          {
            title: '生产成本信息',
            path: '/FireData/ProductionCostInfo',
            component: '@/pages/FireData/ProductionCostInfo',
          },
          {
            title: '电厂燃供信息',
            path: '/FireData/OrgFireInfo',
            component: '@/pages/FireData/OrgFireInfo',
          },
        ],
      },
      {
        title: '新能源数据',
        path: '/NewEnergyData',
        icon: 'a-16xinnengyuanshuju',
        routes: [
          {
            title: '场站参数信息',
            path: '/NewEnergyData/OrgParamInfo',
            component: '@/pages/NewEnergyData/OrgParamInfo',
          },
        ],
      },
      {
        title: '数据导入',
        path: '/DataImportManage',
        icon: 'a-2shujuguanli',
        routes: [
          {
            title: '交易数据导入',
            path: '/DataImportManage/TradeImport',
            component: '@/pages/DataImportManage/TradeImport',
          },
          {
            title: '结算账单导入',
            path: '/DataImportManage/SettlementBillImport',
            component: '@/pages/DataImportManage/SettlementBillImport',
          },
          {
            title: '功率预测数据导入',
            path: '/DataImportManage/PowerPredictionImport',
            component: '@/pages/DataImportManage/PowerPredictionImport',
          },
        ],
      },
      {
        title: '系统配置',
        path: '/SystemOption',
        icon: 'weixuanzhong4',
        routes: [
          {
            title: '机组维护',
            path: '/SystemOption/UnitMainten',
            component: '@/pages/SystemOption/UnitMainten',
          },
        ],
      },
      {
        title: '结算分析',
        path: '/SettleManage',
        icon: 'weixuanzhong6',
        routes: [
          {
            title: '日结算',
            path: '/SettleManage/DaySettle',
            component: '@/pages/SettleManage/DaySettle',
          },
          {
            title: '月结算',
            path: '/SettleManage/MonthSettle',
            component: '@/pages/SettleManage/MonthSettle',
          },
          {
            title: '收益分析',
            path: '/SettleManage/IncomeAnalysis',
            component: '@/pages/SettleManage/IncomeAnalysis',
          },
          {
            title: '日清月结核对',
            path: '/SettleManage/DailySettlementMonthCheck',
            component: '@/pages/SettleManage/DailySettlementMonthCheck',
          },
        ],
      },
      {
        title: '气象地图',
        icon: 'yunliang',
        path: '/Weather/WeatherBoard',
        component: '@/pages/Weather/WeatherBoard',
      },
    ],
  },
];

export default routes;

export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/demo', component: '@/demo/index' },
      { path: '/design/:id?', component: '@/pages/Form/Designer/index' },
      { path: '/playground/:id?', component: '@/pages/Form/Playground/index' },
      { path: '/run/:id?', component: '@/pages/Form/Run/index' },
    ],
  },
];

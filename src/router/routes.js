export default [
    {
        path: '/',
        meta: {  },
        name: 'Main',
        component: () => import('../contains/main'),
    },
    {
        path: '/overview',
        meta: {  },
        name: 'Overview',
        component: () => import('../contains/overview'),
    },
    {
        path: '/overview/update/:rowId',
        meta: {  },
        name: 'RowUpdate',
        component: () => import('../contains/overview/update'),
    },
]
module.exports = {
    base: '/blog/',
    title: '前端杂货铺',
    description: '用于记录自己的前端之路',
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        subSidebar: 'auto',
        nav: [
            { text: '首页', link: '/' },
            { text: '前端知识', link: '/前端知识/HTML与CSS' },
            {
                text: '博客',
                items: [
                    { text: 'Github', link: 'https://github.com/bear136' },
                    { text: '掘金', link: 'https://juejin.cn/user/1451812626631437' }
                ]
            }
        ],
        sidebar: {
            '/前端知识/': [
                {
                    title: '前端知识',
                    collapsable: false,
                    children: [
                        {
                            title: 'HTML与CSS',
                            path: '/前端知识/HTML与CSS',
                        },
                        {
                            title: 'JavaScript基础',
                            path: '/前端知识/javascript',
                        },
                        {
                            title: '常考手写题',
                            path: '/前端知识/常考手写题',
                        },
                        {
                            title: '浏览器相关',
                            path: '/前端知识/浏览器相关',
                        },
                        {
                            title: 'TypeScript学习',
                            path: '/前端知识/TypeScript学习',
                        },
                        {
                            title: 'Vite学习',
                            path: '/前端知识/Vite学习',
                        },
                        {
                            title: 'Webpack',
                            path: '/前端知识/Webpack',
                        },
                        {
                            title: 'Monorepo学习',
                            path: '/前端知识/Monorepo学习',
                        },
                        {
                            title: 'pnpm学习',
                            path: '/前端知识/pnpm学习',
                        },
                        {
                            title: 'JSB原理',
                            path: '/前端知识/JSB原理',
                        },
                        {
                            title: '前端监控',
                            path: '/前端知识/前端监控',
                        },
                        {
                            title: '优化篇',
                            path: '/前端知识/优化篇',
                        },
                        {
                            title: '低代码平台篇',
                            path: '/前端知识/低代码平台篇',
                        },
                    ]
                }
            ]
        }
    }
}
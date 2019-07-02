define(
    [
        "../pages/login/login",
        "../pages/user/userList",
        "../pages/topicCategory/topicCategoryList",
        "../pages/topic/topicList",
        "../pages/user/modify"
    ],
    function (
        login,
        userList,
        topicCategory,
        topic,
        userModify
    ) {
        return [
            {path: '/login', component: login},
            {path: '/user/list', component: userList},
            {path: '/topicCategory', component: topicCategory},
            {path: '/topic', component: topic},
            {path: '/user/modify', component: userModify}
        ];
    }
);
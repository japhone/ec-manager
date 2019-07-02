define(
    [
      "vuex",
      "text!../../user/modify.html"
    ], function (
      Vuex,
      template
    ) {
    return {
      template: template,
      data: function () {
        return {
          user: {
              llzNo: '',
              accountId: '',
              password: '',
              nickName: '',
              mobile: '',
              sex: null,
              motto: '',
              icon: '',
              position:{
                lat:null,
                lon:null
              },
              createdTime: null,
              updatedTime: null,
              updatedUserId: null,
              isEnabled: null,
              isDeleted: null
            },
            userList: [],
            searchUser: {},
            ids: [],
            page: {
              currentPage: 1,
              pageSize: 10,
              total: 0,
              totalPage: 1,
              numbers:[],
              sizes:[10, 15, 20, 50],
              step:5
            }
          };
        },
        mounted: function(){
          this.detail();
        },
        methods: {
          save: function(){
            var $this = this;
            if($.trim(this.user.password) == ''){
              alert("请输入原密码");
              $("input[name=password]").focus();
              return false;
            }
            if($.trim(this.user.newPassword) != '' && $.trim(this.user.newPassword) != $("input[name=repPassword]").val()){
              alert("密码前后不一致");
              $("input[name=repPassword]").select();
              return false;
            }
            if($.trim(this.user.nickName) == ''){
              alert("请输入昵称");
              $("input[name=nickName]").focus();
              return false;
            }
            if(this.user.sex == '' || this.user.sex == null){
              alert("请选择性别");
              $("input[name=sex]").focus();
              return false;
            }
            this.$ajax.post(this.$llz.baseUrl + '/user/webSave', this.user).then(function(result){
              if(result.data.success){
                alert("保存成功");
              }else{
                alert(result.data.message);
              }
            }).catch(function(result){
              alert(result);
            });
          },
          detail: function(){
            var $this = this;
            $this.user = {};
            this.$ajax.post(this.$llz.baseUrl + '/user/modifyInfo', {}).then(function(result){
              $this.user = result.data.data;
            }).catch(function(result){
              alert(result);
            });
          }
       }
   }
});
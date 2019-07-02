define(
    [
        "vuex",
        "text!../../login/login.html"
    ], function (
        Vuex,
        template
    ) {
   return {
      template: template,
      data: function () {
        return {
          user: {
            accountId:"",
            password:""
          }
        };
      },
      methods: {
        login: function(){
          var $this = this;
          if($.trim(this.user.accountId) == ""){
            alert("请输入帐号");
            $("input[name=accountId]").focus();
            return false;
          }
          if($.trim(this.user.password) == ""){
            alert("请输入密码");
            $("input[name=password]").focus();
            return false;
          }
          this.$ajax.post(this.$llz.baseUrl + '/user/adminLogin', this.user).then(function(result){
            if(result.data.success){
              $this.$llz.token = result.data.data.token;
              $this.$web.user.id = result.data.data.id;
              $this.$web.user.nickName = result.data.data.nickName;
              $this.token = result.data.data.token;
              alert(result.data.message);
              $this.$router.push({path: $this.$route.query.redirect});
            }else{
              alert(result.data.message);
            }
          }).catch(function(result){
            alert(result);
          });
        }
      }
   }
});
define(
    [
      "vuex",
      "text!../../user/userList.html"
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
          this.list();
        },
        methods: {
          init: function(){
            this.user = {
              isEnabled: 1
            };
          },
          save: function(){
            var $this = this;
            if($.trim(this.user.accountId) == ''){
              alert("请输入账号");
              $("input[name=accountId]").focus();
              return false;
            }
            if($.trim(this.user.password) == ''){
              alert("请输入密码");
              $("input[name=password]").focus();
              return false;
            }
            if($.trim(this.user.nickName) == ''){
              alert("请输入昵称");
              $("input[name=nickName]").focus();
              return false;
            }
            if($.trim(this.user.isEnabled) == ''){
              alert("请输入是否启用");
              $("input[name=isEnabled]").focus();
              return false;
            }
            this.$ajax.post(this.$llz.baseUrl + '/user/modify', this.user).then(function(result){
              if(result.data.success){
                alert("保存成功");
                $("#editModule").modal('hide');
                $this.list();
              }else{
                alert(result.data.message);
              }
            }).catch(function(result){
              alert(result);
            });
          },
          list: function(){
            var $this = this;
            if(this.page.currentPage < 1){
              this.page.currentPage = 1;
            }else if(this.page.currentPage > this.page.totalPage){
              console.log(this.page.currentPage , this.page.totalPage);
              this.page.currentPage = this.page.totalPage;
            }
            this.searchUser["currentPage"] = this.page.currentPage;
            this.searchUser["pageSize"] = this.page.pageSize;
            this.$ajax.post(this.$llz.baseUrl + '/user/list', this.searchUser).then(function(result){
              $this.userList = result.data.data;
              $this.page.total = result.data.total;
              $this.calculateTotalPage();
            }).catch(function(result){
              alert(result);
            });
          },
          detail: function(id){
            var $this = this;
            $this.user = {};
            this.$ajax.post(this.$llz.baseUrl + '/user/detail', {"id":id}).then(function(result){
              $this.user = result.data.data;
            }).catch(function(result){
              alert(result);
            });
          },
          reset: function(){
            this.searchUser = {};
          },
          selectAll: function(event){
            var $this = this;
            if(event.target.checked){
              $("input[name=id]").each(function(){
                $(this).prop("checked", true);
                $this.ids.push(parseInt($(this).prop("value")));
              });
            }else{
              $('input[name=id]').each(function(){
                $(this).prop("checked", false);
              });
              $this.ids = [];
            }
          },
          dels: function(){
            if(this.ids == null || this.ids.length == 0){
              alert("请选择要删除的记录");
              return false;
            }
            if(confirm("确定批量删除?")){
              var $this = this;
              this.$ajax.post(this.$llz.baseUrl + '/user/dels', {"ids":this.ids}).then(function(result){
                if(result.data.success){
                    alert("删除成功");
                    $this.list();
                }else{
                    alert(result.data.message);
                }
              }).catch(function(result){
                alert(result);
              });
            }
          },
          del: function(id){
            if(confirm("确定删除该记录？")){
              var $this = this;
              this.$ajax.post(this.$llz.baseUrl + '/user/del', {"id": id}).then(function(result){
                if(result.data.success){
                  alert("删除成功");
                  $this.list();
                }else{
                  alert(result.data.message);
                }
              }).catch(function(result){
                alert(result);
              });
            }
          },
          calculateTotalPage: function(){
            this.page.totalPage = parseInt((this.page.total - 1)/this.page.pageSize + 1);
            this.page.numbers = [];
            for(var i=1; i<=this.page.totalPage; i++){
              this.page.numbers.push(i);
            }
          },
          prePage: function(){
            if(this.page.currentPage > 1){
              this.page.currentPage --;
              this.list();
            }
          },
          nextPage: function(){
            if(this.page.currentPage < this.page.totalPage){
              this.page.currentPage ++;
              this.list();
            }
          },
          switchPage: function(p){
            if(p < 1){
              this.page.currentPage = 1;
            }else if(p > this.page.totalPage){
              this.page.currentPage = this.page.totalPage;
            }else{
              this.page.currentPage = p;
            }
            this.list();
          }
       }
   }
});
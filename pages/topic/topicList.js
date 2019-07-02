define(
    [
      "vuex",
      "text!../../topic/topicList.html"
    ], function (
      Vuex,
      template
    ) {
    return {
      template: template,
      data: function () {
        return {
          topic: {
              categoryId: null,
              categoryCode: '',
              title: '',
              summary: '',
              coverFlag: '',
              visitedNumber: 0,
              supportedNumber: 0,
              commentedNumber: 0,
              isRecommend: 0,
              createdTime: null,
              createdUserId: null,
              updatedTime: null,
              updatedUserId: null,
              isEnabled: 1,
              content: ''
            },
            topicList: [],
            searchTopic: {},
            ids: [],
            page: {
              currentPage: 1,
              pageSize: 10,
              total: 0,
              totalPage: 1,
              numbers:[],
              sizes:[10, 15, 20, 50],
              step:5
            },
            categoryList: []
          };
        },
        mounted: function(){
          this.list();
          this.queryCategoryList();
          CKEDITOR.replace('content', {
            // filebrowserUploadUrl : '/api/file/richtextUpload',
            fileTools_requestHeaders : {
                "sign": this.$llz.sign,
                "token" : this.$llz.token
            }
          });
        },
        methods: {
          init: function(){
            this.topic = {
              isEnabled: 1,
              visitedNumber: 0,
              supportedNumber: 0,
              commentedNumber: 0,
              isRecommend: 0,
              content: ''
            };
            CKEDITOR.instances.content.setData('');
          },
          save: function(){
            var $this = this;
            if($.trim(this.topic.title) == ''){
              alert("请输入标题");
              $("input[name=title]").focus();
              return false;
            }
            if($.trim(this.topic.categoryCode) == ''){
              alert("请选择分类");
              $("select[name=categoryCode]").focus();
              return false;
            }
            if($.trim(this.topic.visitedNumber) == ''){
              alert("请输入浏览量");
              $("input[name=visitedNumber]").focus();
              return false;
            }
            if($.trim(this.topic.supportedNumber) == ''){
              alert("请输入点赞数");
              $("input[name=supportedNumber]").focus();
              return false;
            }
            if($.trim(this.topic.commentedNumber) == ''){
              alert("请输入评论数");
              $("input[name=commentedNumber]").focus();
              return false;
            }
            if($.trim(this.topic.summary) == ''){
              alert("请输入简介");
              $("input[name=summary]").focus();
              return false;
            }
            if($.trim(this.topic.coverFlag) == ''){
              alert("请输入封面图");
              $("input[name=coverFlag]").focus();
              return false;
            }

            for(instance in CKEDITOR.instances){
              CKEDITOR.instances[instance].updateElement();
            }
            if($.trim($("textarea[name=content]").val()) == ''){
              alert("请输入正文");
              $("textarea[name=content]").focus();
              return false;
            }
            this.topic.content = $("textarea[name=content]").val();
            this.$ajax.post(this.$llz.baseUrl + '/sys/topic/save', this.topic).then(function(result){
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
            this.searchTopic["currentPage"] = this.page.currentPage;
            this.searchTopic["pageSize"] = this.page.pageSize;
            this.$ajax.post(this.$llz.baseUrl + '/sys/topic/listWithCategory', this.searchTopic).then(function(result){
              $this.topicList = result.data.data;
              $this.page.total = result.data.total;
              $this.calculateTotalPage();
            }).catch(function(result){
              alert(result);
            });
          },
          detail: function(id){
            var $this = this;
            $this.topic = {};
            this.$ajax.post(this.$llz.baseUrl + '/sys/topic/detail', {"id":id}).then(function(result){
              if(result.data.success){
                $this.topic = result.data.data;
                CKEDITOR.instances.content.setData($this.topic.content);
                $this.topic.categoryCode = $this.topic.categoryId + "," + $this.topic.categoryCode;
              }else{
                alert(result.data.message);
              }
            }).catch(function(result){
              alert(result);
            });
          },
          reset: function(){
            this.searchTopic = {};
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
              this.$ajax.post(this.$llz.baseUrl + '/sys/topic/dels', {"ids":this.ids}).then(function(result){
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
              this.$ajax.post(this.$llz.baseUrl + '/sys/topic/del', {"id": id}).then(function(result){
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
          },
          queryCategoryList: function(){
            var $this = this;
            this.$ajax.post(this.$llz.baseUrl + '/sys/topic/category/listAll', {}).then(function(result){
              $this.categoryList = result.data.data;
            }).catch(function(result){
              alert(result);
            });
          },
          categoryValue: function(category){
            return category.id + "," + category.code;
          }
       }
   }
});
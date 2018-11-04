var app = angular.module('baway', ['pagination']);
app.controller('baseCtrl', function($scope, $http){
$scope.paginationConf = {
       onChange: function(){
         $scope.reloadList();
       }
  };
  $scope.reloadList = function(){
    $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
  }

  $scope.save = function(){
    $http.post($scope.base.url.save, $scope.entity).success(function(response){
      if(response.success) {
        $scope.reloadList();
      } else {
        alert(response.message);
      }
    });
  }

  $scope.get = function(id) {
    $http.get($scope.base.url.get+id).success(function(response){
      $scope.entity = response;
    });
  }

  $scope.selectIds = [];

  $scope.selections = function($event, id){
    if($event.target.checked){
      $scope.selectIds.push(id);
    }else{
      var index = $scope.selectIds.indexOf(id);
      $scope.selectIds.splice(index, 1);
    }
  }

  $scope.selectAll = function($event){
    if($event.target.checked){
      $("input[name=id]").each(function(){
        $(this).prop("checked", "checked");
        $scope.selectIds.push($(this).prop("value"));
      });
    }else{
      $("input[name=id]").each(function(){
        $(this).prop("checked", "");
      });
      $scope.selectIds = [];
    }
  }

  $scope.dels = function(){
    if($scope.selectIds.length == 0) {
      alert("请选择要删除的记录！");
      return;
    }
    if(confirm("确定要删除选择的记录？")){
      $http.get($scope.base.url.del+$scope.selectIds).success(function(response){
        if(response.success){
          $scope.reloadList();
        }else{
          alert(response.message);
        }
      });
    }
  }

  $scope.reset = function(){
    $scope.searchVo = {};
  }
  $scope.search = function(pageNum, pageSize) {
    $http.post('../api/brand/list.do?pageNum='+pageNum+'&pageSize='+pageSize, $scope.searchVo).success(function(response){
      $scope.list = response.data;
      $scope.paginationConf.totalItems = response.total;
    });
  }

  $scope.clear = function() {
    $scope.entity = {};
  }
  $scope.reset();
});
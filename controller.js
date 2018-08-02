var app = angular.module('helloworldApp',[])
app.controller('HelloworldCtrl',['$scope','$timeout', function ($scope,$timeout) {
alert('hi');
  $scope.name = 'World';
  $scope.resBaseStr;
  $scope.files = []; 
  $scope.upload=function(){
    alert($scope.files.length+" files selected ... Write your Upload Code"); 
    // $scope.location = document.location;
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");               
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsDataURL(file);
      $timeout(function () {
         var decodeStr =  b64DecodeUnicode(fr.result.split(',')[1]); 
         var divideDecodeStr = decodeStr.split(/\r\n|\n/);
         console.log(divideDecodeStr);
         var seriesDataArr= [];
         var seriesDataArrSubArr = [];
         for(var i =0;i<divideDecodeStr.length;i++) {
          //for(j=1;j<divideDecodeStr[i])
          seriesDataArr[i] = divideDecodeStr[i].split(",");
          for(var j=1;j<seriesDataArr[i].length;j++) {
            seriesDataArrSubArr.push(seriesDataArr[i][j].split("|"));
          }
        }
          var keys = ["x","y"];
          seriesDataArrSubArr = seriesDataArrSubArr.map(function (row) {
              return keys.reduce(function (obj, key, i) {
                obj[key] = parseInt(row[i]);
                return obj;
              }, {});
          });
          console.log(seriesDataArrSubArr);
          createChart(seriesDataArrSubArr);
         
      }, 1000);

    }
  }

  function receivedText() {
    $scope.resBaseStr = fr.result.split(',')[1];
    return $scope.resBaseStr;    
  };

function b64DecodeUnicode(strVal) {
    return decodeURIComponent(atob(strVal).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};


function createChart(ArrOfObjData){
var chart = new CanvasJS.Chart("chartContainer", {
  animationEnabled: true,
  theme: "light2",
  title:{
    text: "Simple Line Chart"
  },
  axisY:{
    includeZero: false
  },
  data: [{        
    type: "line",       
    dataPoints: ArrOfObjData
  }]
});
chart.render();
};


}]);

app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
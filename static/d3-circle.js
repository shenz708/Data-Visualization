    var result = [];
    //表格
    //margin of canvas
    var margin = { left: 40, top: 40, bottom: 40, right: 40 };
    
    var winWidth = 1200;
    var width = winWidth - margin.left - margin.right;
    var height = winWidth - margin.top - margin.bottom;

    //control the canvas size of the circles chart 
    var packWidth = width / 2;
    var packHeight = height / 2;

//    var minR = 30;

//const is not changable, var is changable
    const svg = d3
      .select("#chart")
      .append("svg")
      .style("width", width + margin.left + margin.right)
      .style("height", height + margin.top + margin.bottom)
      //default font size is 10
      .attr("font-size", 10)
      .attr("font-family", "Josefin Sans', sans-serif")
      .attr("text-anchor", "middle")
      .append("g")
      .attr("transform", function (d) {
        var left = (width - width / 2 + margin.left + margin.right) / 2;
        var top = (height - height / 2 - 100) / 2 - 150;
        return "translate(" + left + "," + top + ")";
      });

    var tooltip = d3
      .select("body")//通过标签名称选择节点//选中body标签
      .append("div")
      .attr("class", "tooltip") //I gave the class a name
      .style("opacity", 0.0); //defalut-not visible 
   
    //格式化数字的方法 //显示约数
    var format = d3.format(",d");

//unsorted bubble 
//点击analyze后，屏幕的默认图形 
    var chart = function (data) {
        //
        var pack = data =>
        d3
          .pack()
          .size([packWidth, packHeight])
          .padding(30)(d3.hierarchy({ children: data }).sum(d => d.value));
      
     //比例尺
//    var t = 0.5;
        
 //     var color = d3.scaleOrdinal(data.map(d => d.id), d3.interpolateReds(t));
        var color = d3.scaleOrdinal(data.map(d => d.id), d3.schemeCategory10);

     //使用默认设置创建一个新的包布局，默认的排序顺序是按值升序排序   
      const root = pack(data);
    
      //给予一个class名称g-bubble
      const leaf = svg
        .selectAll("g-bubble")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("class", "g-bubble")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        
      //当鼠标选中，执行function(d)， 
       .on("mouseover", function (d) {
          var str = "";
          str += "<div style='margin:5px 5px'>key:" + d.data.id + "</div>";
          str += "<div style='margin:5px 5px'>num:" + d.data.num + "</div>";
          str +=
            "<div style='margin:5px 5px'>value:" + d.data.value + "</div>";
          tooltip
            .html(str)
            .style("width", 150 + "px")
            .style("height", "auto")
            .style("left", d3.event.pageX - 60 + "px")
            .style("top", d3.event.pageY + 20 + "px")
            .style("opacity", 1.0);
        })
      
      //当鼠标移处，执行function(d)，把长宽和不透明实心度都调为零
        .on("mouseout", function (d) {
          tooltip
            .style("width", 0)
            .style("height", 0)
            .style("opacity", 0.0);
        })
       
      //如果点击其中一个圆圈，执行function(d)，载入giphy的数据，载入info.html页面
        .on("click", function (d) {
          window.localStorage.setItem("data", JSON.stringify(result));
          window.open(
            `info.html?id=${d.data.id}&image=${encodeURIComponent(
              d.data.head
            )}`
          );
        });

     //底部的灰色圆圈
      leaf
        .append("circle")
        .attr("r", d => {
          return d.r;
        })
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.data.id));
      
      //控制可否点击sort功能？？
      leaf
        .append("foreignObject")
        .attr("x", d => -d.r)
        .attr("y", d => -d.r)
        .attr("width", d => d.r * 2)
        .attr("height", d => d.r * 2)
        .html(function (d) {
      //控制中间标题文字的参数
          return `<body xmlns="http://www.w3.org/1999/xhtml">
          <p style="font-size:20px;margin:0;height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;color:#fff;overflow: hidden;
            background:url(${d.data.head}) no-repeat center;background-size: cover;border-radius: 50%;
            ">${d.data.id.toLocaleUpperCase()}</p>
          </body>`;
        });

      return svg.node();
    };

//定义BubbleSort这个函数的内容，这个函数可以按照顺序摆放圆圈
    function BubbleSort() {
      var center = { x: packWidth / 2, y: packHeight / 2 };
      var l = 250;
      var a = 0,
        b = 0;
      var v = 0.3; //微小控制圆与圆的间距
      var f = 10;
    
    //设置一个名为objList的空的array
      var objList = []; 
        
      svg.selectAll(".g-bubble").attr("temp", function (d, i) {
        var radis =
          d3
            .select(this)
            .select("circle")
            .attr("r") * 1;
        //给空的array里面赋值
        objList.push({ obj: this, radia: radis });
        
      });
      
     //array中的值？？？？？
      objList.sort(function (a, b) {
        return a.radia - b.radia;
      });
     //i是从大到小排序的 
      for (var i = 0; i < objList.length; i++) {
        a = a + Math.PI / f; 
        b = b; //间隔
      
     //控制圆有弧度的排放
       if (i <= 5) {
       
          b = b + objList[i].radia * 2 + 2; //圆间距
        } 
          else if (i > 5 && i <= 10) {
          b = b + objList[i].radia;
        }
          else if (i > 10) {
          b = b + objList[i].radia / 2;
        }
          
        point = {
          x: center.x + b * Math.sin(a),
          y: center.y - b * Math.cos(a)
        };
          
        d3.select(objList[i].obj)
          .transition()
          .duration(500)
          .attr("transform", d => `translate(${point.x},${point.y})`);
      }
    }

//定义BubbleRand这个函数的内容
    function BubbleRand() {
      svg
        .selectAll(".g-bubble")
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    }

//控制按钮关系
//如果点击sort，执行function(d)自定义的函数，然后圆圈按照顺序摆放；
    d3.select(".btn-sort").on("click", function (d) {
      d3.selectAll(".btn").classed("btn-selected", false);
      d3.select(this).classed("btn-selected", true);
      BubbleSort();
    });
 //如果点击rand，执行function(d)自定义的函数，然后圆圈按照任意摆放；     
    d3.select(".btn-rand").on("click", function (d) {
      d3.selectAll(".btn").classed("btn-selected", false);
      d3.select(this).classed("btn-selected", true);
      BubbleRand();
    });

//api准备 点击analyze，然后出结果
    var res = [];
    $("#analyze").on("click", function () {
      $.ajax({
        url: "/concepts",
        method: "POST",
        dataType: "json",
        data: {
          text: $("#text").val()
        },
        success: function (data) {
          result = [];
          const concepts = data.data.concepts;
          Object.keys(concepts).map(function (key) {
            var item = concepts[key].surfaceForms[0];
            result.push({
              id: item.string,
              value: concepts[key].support,
              num: result.length,
              score: item.score,
              offset: item.offset,
              head: ""
            });
            result = result.sort((a, b) => a.value - b.value).slice(0, 10);
            $("#main").css({ display: "none" });
            $("#main2").css({ display: "none" });
            $("#main3").css({ display: "block" });
            renderTable(); //generate the table 
          });
        }
      });
    });

//api准备 点击visulize，然后出圆圈

    $("#visu").on("click", function () {
      result.loadIndex = 0;
      result.map(function (item, index) {
        loadImage(result, item, index);
      });
    });

//generate the table 
    function renderTable() {
      var html = `
            <tr style="font-weight:700">
            <td >String</td>
            <td>Relevance</td>
            <td>Support</td>
            <td>Offset</td>
            </tr>
          `;
      result
        .sort((a, b) => {
          return b.score - a.score;
        })
        .map(function (item) {
          html += `
            <tr>
            <td>${item.id}</td>
            <td>${(item.score * 100).toFixed(2)}%</td>
            <td>${item.value}</td>
            <td>${item.offset}</td>
            </tr>
            `;
        });
      $("#table").html(html);
    }
     
//important call api 
   
    function loadImage(data, item, index) {
      $.ajax({
        url: `http://api.giphy.com/v1/gifs/search?api_key=v3l6TNvsMmt9ZoAnoLyrMk14CZSTkYTK&q=${encodeURIComponent(
          item.id
        )}&limit=1`,
        timeout: 2000,
        success: function (res) {
          try {
            var url = res.data[0].images["480w_still"].url;
            data[index].head = url;
          } catch (error) { }
          data.loadIndex++;
            
          if (data.loadIndex == data.length) {
            $("#main").css({ display: "block" });
            $("#main2").css({ display: "none" });
            $("#main3").css({ display: "none" });
            chart(data);
          }
        },
        error: function () {
          data.loadIndex++;
          if (data.loadIndex == data.length) {
            $("#main").css({ display: "block" });
            $("#main2").css({ display: "none" });
            $("#main3").css({ display: "none" });
            chart(data);
          }
        }
      });
    }

/**
 * 工具栏-导入/导出功能
 */
function handleImportOrExport(e) {
  // debugger;
  // console.log(e);

  var isImport = e.target.className.indexOf('in'),
    textarea = $('.json_data textarea');
  $('.ui.modal.json_data').modal({
    onApprove: function() {
      if (isImport !== -1) { // 导入
        var jsonStr = textarea.val();
        if (jsonStr) {
          var jsonObj = JSON.parse(jsonStr);
          jsonObj = edgeAssociateNode(jsonObj);
          graph_main.nodes = graph_main.nodes.concat(jsonObj.nodes);
          graph_main.edges = graph_main.edges.concat(jsonObj.edges);
          graph_main.updateGraph();
        }
      }
    },
    onHidden: function() {
      textarea.val('');
    }
  })
  .modal('setting', 'transition', 'scale')
  .modal('show');

  var element_header = $('div.json_data .header');
  if (isImport !== -1) {
    element_header.text('Import json data');
  } else {
    element_header.text('Export json data');
    var data = {
      nodes: graph_main.nodes,
      edges: graph_main.edges
    };
    textarea.val(JSON.stringify(data));
  }
}



/**
 * 工具栏-清空
 */
function clearGraph() {

  layer.confirm('Confirm clear?', {
    title:"Clear",
    icon: 0,
    btn: ['Yes','Cancel'],
    offset: '180px'
  }, function() {
    var pools = graphPool.pools;
    for (var i = 0; i < pools.length; i++) {
      // debugger;
      var id = pools[i].containerId;
      switch (id) {
        case 'tab_main':
          pools[i].deleteGraph();
          break;
        default:
          $('.full-right [data-tab='+id+']').remove();
          pools.splice(i, 1);
          break;
      }
    }
    layer.msg('Clear', {icon: 1, offset: '180px', time: 600});
  }, function() {

  });

}

/**
 * 工具栏-删除节点
 */
function handleDeleteNode() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode,
    selectedEdge = graph_active.state.selectedEdge;
  if (!selectedNode && !selectedEdge) {
    //请选中元素
    layer.msg('Please select an element！', {time: 2000, icon: 0, offset: '180px'});
    return;
  } else {
    // 确定要删除选择元素吗
    layer.confirm('Delete the selection element?', {
      title:'Delete',
      icon: 0,
      btn: ['Yes','Cancel'],
      offset: '180px'
    }, function() {
      if (selectedNode) {
        var nodes = graph_active.nodes;
        nodes.splice(nodes.indexOf(selectedNode), 1);
        graph_active.spliceLinksForNode(selectedNode);
        selectedNode = null;
        graph_active.updateGraph();
      } else if (selectedEdge) {
        var sourcenode = selectedEdge.source;
        var targetnode = selectedEdge.target;
        var inputlist = targetnode.inputlist;
        for(var key in inputlist)
        {
            if (inputlist[key].id === sourcenode.id) 
            {
                delete inputlist[key];
            }
        }


        var edges = graph_active.edges;
        edges.splice(edges.indexOf(selectedEdge), 1);
        selectedEdge = null;
        graph_active.updateGraph();
      }
      layer.msg('Delete!', {icon: 1, offset: '180px', time: 600});
    }, function() {

    });
  }
}

/**
 * 工具栏-放大/缩小按钮 scale(0.3-2)
 */
function handleClickZoom() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var translate = graph_active.dragSvg.translate(),
    scale = graph_active.dragSvg.scale(),
    extent = graph_active.dragSvg.scaleExtent(),
    direction = 1,
    factor = 0.1;
  direction = (this.id === 'zoom-enlarge') ? 1 : -1;
  if ((scale <= extent[0] && direction < 0) || (scale >= extent[1] && direction > 0)) {
    return;
  } else {
    scale = parseFloat(scale) + factor * direction;
  }
  graph_active.dragSvg.scale(scale)
      .translate(translate);
  graph_active.zoomed();
}

/**
 * 工具栏-还原缩放及归位
 */
function resetZoom() {
  var graph_active = graphPool.getGraphByActiveEdit();
  graph_active.svgG.transition() // start a transition
    .duration(1000) // make it last 1 second
    .attr('transform', 'translate(0,0) scale(1)');
  graph_active.dragSvg.scale(1);
  graph_active.dragSvg.translate([0,0]);
}



/**
 * 左侧组件
 */
function handleComponentsBtn() {
  // debugger;
  $(this).siblings().removeClass('active').end().addClass('active');
  var graph_active = graphPool.getGraphByActiveEdit(),
    state = graph_active.state,
    nodeName = $(this).attr('name'),
    container = $('.svg-container');
  if (nodeName === 'NOROUTING' || nodeName === 'SIMPLEROUTING') {
    state.drawLine = nodeName;
    container.on('mouseover mouseout', '.conceptG', function(e) {
      if (e.type === 'mouseover') {
        this.style.cursor = 'crosshair';
      } else if (e.type == 'mouseout') {
        this.style.cursor = 'default';
      }
    });
  } else {
    container.off('mouseover mouseout', '.conceptG');
    state.drawLine = null;
  }
}






//chuliyoujianshuxing
function handleNodeMenuProp() {
  // debugger;
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;



  $('.ui.modal.prop_node').modal({
    autofocus: false,
    closable: false,
    onApprove: function() {
      //更新-扩展属性
      selectedNode.extendAttr = [];

      //更新-常规
      selectedNode.conventional = {};
      var conventional = {};
      // debugger;
      $('.prop_node .conventional').find('input[name], textarea, select').each(function() {
        conventional[$(this).attr('name')] = $(this).val();
      });
      if (conventional.ID != selectedNode.id) {
        selectedNode.id = conventional.ID;
      }
      if (conventional.name != selectedNode.title) {
        selectedNode.title = conventional.name;
      }
      selectedNode.conventional = conventional;
      graph_active.updateGraph();
    },
    onShow: function() {
      var node = selectedNode;
      //展示-常规
      // debugger;
      var conventional = node.conventional;
      $('.conventional').find('input[name], textarea').each(function() {
        for (var key in conventional) {
          if (key == $(this).attr('name')) {
            $(this).val(conventional[key]);
          }
        }
      });
      $('.conventional input[name=ID]').val(node.id);
      $('.conventional input[name=name]').val(node.title);
    },
    onHidden: function() {
      $(this).find('input, textarea').val('');
    }
  }).modal('show');
}
/* do not need */
function handleEdgeMenuProp() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedEdge = graph_active.state.selectedEdge;
  $('.prop_edge .targetActivity').html($('#transition_tpl').html());
  $('.prop_edge .targetActivity .menu .item').tab();
  $(".targetActivity .transferInf_extended_attr .postCondi_extendedAttr").mCustomScrollbar();
  $('.targetActivity .conditionList,.conditionList2').mCustomScrollbar();
  $('.ui.modal.prop_edge').modal({
    autofocus: false,
    closable: false,
    onApprove: function() {
      //更新-转移属性
      graph_active.updatePostCondi('.prop_edge');
    },
    onShow: function() {
      var edge = graph_active.state.selectedEdge;
      //展示-后置条件
      graph_active.showTransition('.prop_edge', edge);
    },
    onHidden: function() {
      $('.prop_edge .targetActivity').html('');
    }
  }).modal('show');
}

function handleRightMenu() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var item = $(this).attr('name');
  var selectedNode = graph_active.state.selectedNode,
  selectedEdge = graph_active.state.selectedEdge;
  switch (item) {
    case 'removeMenu':
      handleDeleteNode();
      break;
    case 'toFront':
      alert('前置');
      break;
    case 'editMenu':
      handleMenuEdit();
      break;
    case 'propMenu':
      if (selectedNode) {
        handleNodeMenuProp();
      } else if (selectedEdge) {
        handleEdgeMenuProp();
      }
      break;
  }
  $('#rMenu').hide();
}
/* do not need end */

/**
 * edge关联连接的node对象
 * @param  {Object} jsonObj 数据对象
 * @return {Object}         关联node以后的数据对象
 */
function edgeAssociateNode(jsonObj) {
  jsonObj.edges.map(function(edge) { // 根据edge.source.id重新关联node对象
    var source = jsonObj.nodes.find(function(node) {
      return node.id === edge.source.id;
    });
    var target = jsonObj.nodes.find(function(node) {
      return node.id === edge.target.id;
    });
    edge.source = source;
    edge.target = target;
    return edge;
  });
  return jsonObj;
}


function updateMiddleRightInformation(){
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;

  if ((selectedNode.title === "I") || (selectedNode.title === "O"))
  {
      selectedNode.name = $("#middle-right-name").val();
  }
  else
  {
      selectedNode.title = $("#middle-right-name").val();
      selectedNode.code = $("#middle-right-code").val();

  }
  graph_active.updateGraph();
}



function handleDownLeftDownAdd()
{
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;

  if (selectedNode !== null)
  {
    const container = $(".down-left-middle");
    container.append(
      `<div class="down-left-middle-add">
          <span>name:</span><input type="text" />
          <span style="margin-left:10%;">value:</span><input type="text" />
          <button id="down-left-middle-remove-button"> remove </button>
      </div>`);
  }
}


function handleDownLeftMiddleRemove()
{
  $(this).parent().remove();
}


function showDownRightOutput()
{
    var graph_active = graphPool.getGraphByActiveEdit();
    var selectedNode = graph_active.state.selectedNode;

    var inputliststr = ``;
    var inputlist = selectedNode.inputlist;
    for (var key in inputlist)
    {
        var itemobj = inputlist[key];
        for (var theName in itemobj)
        {
            inputliststr = inputliststr + `<div class="down-right-middle-add">
            <span style="margin-left:20%;">name:${theName}</span>
            <span style="margin-left:30%;">value:${itemobj[theName]}</span>
            </div>`;
        }
    }
    $('.down-right-middle').empty().append(inputliststr);
}


function handleDownLeftDownSubmit()
{
    var graph_active = graphPool.getGraphByActiveEdit();
    var selectedNode = graph_active.state.selectedNode;

    var text = [];
    // debugger;
    if (selectedNode !== null)
    {
      $(".down-left-middle input").each(function(){
        text.push($(this).val());
      });
      var sign = true;
      if(text.length === 0)
      {
          sign = false;
      }

    for(var key in text)
    {
        if ((key === undefined) || (text[key] === undefined) || (text[key] === null) || (text[key] === ''))
        {
            sign = false;
            break;
        }
    }
      
      
      if (sign)
      {
        if (selectedNode.title === "I")
        {
          var temoutputlist = SplitOutputText(text); // do not duplicated
          if (temoutputlist instanceof Object)
          {
              var teminputlist = SplitInputText(text);
              // selectedNode.inputlist = SplitInputText(text);
              selectedNode.inputlist = teminputlist;
              selectedNode.outputlist = temoutputlist;
              // alert(selectedNode.outputlist);
              showDownRightOutput();

              var theData = {};

              for (var key in teminputlist)
              {
                  var itemobj = teminputlist[key];
                  for (var theName in itemobj)
                  {
                      theData[theName] = itemobj[theName];
                  }
              }

              post_data = JSON.stringify(theData);


              $.post("/down_left_bottom_submit/",post_data,
                function(data,status){alert("data:"+data+"\nstatus:"+status);});

              updateCheckBox(theData);
          }
          else
          {
              layer.msg('Some names are duplicated ! Cannot submit!', { offset: '180px', time: 1000});
          }
          
        }

      }
      else
      {
        layer.msg('Some values are required! Cannot submit!', { offset: '180px', time: 1000});
      }
    }
}




function handleDownLeftDownRefresh()
{
    var graph_active = graphPool.getGraphByActiveEdit();
    var selectedNode = graph_active.state.selectedNode;

    var text = [];
    // debugger;
    if (selectedNode !== null)
    {

      $(".down-left-middle input").each(function(){
        if ($(this).val() !== "")
        {
          text.push($(this).val());
        }

      });
      var sign = true;
      for(var key in text)
      {
          if((key === undefined) || (text[key] === undefined))
          {
              sign = false;
          }
      }
      if (sign)
      {
        var teminputlist = SplitInputText(text);
        selectedNode.inputlist = teminputlist;
        selectedNode.outputlist = teminputlist;
        showDownRightOutput();

      }
      else
      {
        layer.msg('Some values are required! Cannot refresh!', {offset: '180px', time: 1000});
      }
    }
}

function SplitInputText(text){
  var obj = {};
  var i = 0;
  var inputindex = 0;
  while(i<text.length){
      var itemobj = {};
      itemobj[text[i]] = text[i+1];

      obj[inputindex] = itemobj;

      i = i+2;
      inputindex++;
  }
  return obj;
}

function SplitOutputText(text){
  var obj = {};
  var i = 0;
  var inputnamearr = [];
  while(i<text.length){
      if (inputnamearr.indexOf(text[i]) !== -1)
      {
          return false;
      }
      obj[text[i]] = Number(text[i+1]);
      i = i+2;
      inputnamearr.push(text[i]);
  }
  return obj;
}


function handleDownRightDownAdd()
{
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;

  if (selectedNode !== null)
  {
    const container = $(".down-right-middle");
    container.append(
      `<div class="down-right-middle-add">
          <span style="margin-left:20%;">name:</span><input type="text" value="output"/>
          <button id="down-right-middle-remove-button"> remove </button>
      </div>`);
  }
}


function handleDownRightDownSubmit()
{
    var graph_active = graphPool.getGraphByActiveEdit();
    var selectedNode = graph_active.state.selectedNode;

    var text = [];
    // debugger;
    if (selectedNode !== null)
    {
      $(".down-right-middle input").each(function(){
        if ($(this).val() !== "")
        {
            text.push($(this).val());
        }
      });
      var sign = true;
      for(var key in text)
      {
          if(text[key] === undefined)
          {
              sign = false;
          }
      }
      if (sign)
      {
        for(var key in text)
        {
          selectedNode.outputlist[text[key]] = ""
        }
      }
      else
      {
        layer.msg('Some values are required! Cannot submit!', { offset: '180px', time: 1000});
      }
    }
}


function handleDownRightMiddleRemove()
{
  $(this).parent().remove();
}


function RunWorkflow()
{
    var runningarr = RunningOrder();
    if (runningarr instanceof Array)
    {
        if ( checkObjectIsEmpty(runningarr))
        {
            for (var key in runningarr)
            {

                RunIndividualProcess(runningarr[key])

            }
        }

    }

}

function RunIndividualProcess(id)
{

    var inputobj = {}
    var node = graphPool.getNodeById(id);
    var inputlist = node.inputlist;
    for (var inputitem in inputlist)
    {
        var inputnode = graphPool.getNodeById(inputlist[inputitem].id);
        inputobj[inputlist[inputitem].name] = inputnode.outputlist;
    }
    var obj = {};
    obj.inputlist = inputobj;
    obj.code = node.code;
    obj.outputlist = node.outputlist;

    post_data = JSON.stringify(obj);
    $.post("/run/",post_data, function(data,status){
            data = JSON.parse(data);
            node.outputlist = data;
          });

}


function RunningOrder()
{
    var pool = graphPool.pools[0];
    var nodes = pool.nodes;

    var startarr = [];
    var temarr = [];
    var endarr = [];


    for (var each in nodes)
    {
      if (nodes[each].component === "startComponent")
      {
        startarr.push(nodes[each].id);
      }
      else if (nodes[each].component === "endComponent")
      {
        endarr.push(nodes[each].id);
      }
      else
      {
        temarr.push(nodes[each].id);
      }
    }
    var startlength = startarr.length;
    var endlength = endarr.length;
    if ((startlength === 0) || (endlength === 0))
    {
        layer.msg('There are something wrong with this workflow!', { offset: '180px', time: 1000});
        return false;
    }

    var runningarr = [];

    if ( !checkStartArr(startarr) )
    {
        layer.msg('There are something wrong with this workflow!(Input node!)', { offset: '180px', time: 1000});
        return false;
    }
    runningarr = checkRunningArr(startarr, temarr);


    if (!(runningarr instanceof Array))
    {
        layer.msg('There are something wrong with this workflow!', { offset: '180px', time: 1000});
        return false;
    }
    if ( !checkEndArr(startarr, runningarr, endarr))
    {
        layer.msg('There are something wrong with this workflow!(Output node!)', { offset: '180px', time: 1000});
        return false;
    }
    return runningarr;
}

function checkStartArr(startarr){

    for(var candidate in startarr)
    {
        var node = graphPool.getNodeById(startarr[candidate]);
        var nodeinputlist = node.inputlist;
        if ( !checkObjectIsEmpty(nodeinputlist) )
        {
          return false;
        }
    }
    return true;
}

function checkRunningArr(startarr, temarr){
    var runningarr = [];
    var length = temarr.length;

    while(length !== 0)
    {
        var beforelength = runningarr.length;
        for(var candidate in temarr)
        {
            var node = graphPool.getNodeById(temarr[candidate]);
            var nodeinputlist = node.inputlist;
            var nodeoutputlist = node.outputlist;
            var sign = true;

            if ( !checkObjectIsEmpty(nodeinputlist) || !checkObjectIsEmpty(nodeoutputlist) )
            {
                return false;
            }
            for (var t in nodeinputlist)
            {
              if ( (startarr.indexOf(nodeinputlist[t].id) === -1) && (runningarr.indexOf(nodeinputlist[t].id) === -1 ) )
              {
                sign = false;
                break;
              }
            }

            if (sign)
            {
              runningarr.push(temarr[candidate]);
            }
        }
        var afterlength = runningarr.length;
        if (afterlength === length)
        {
          return runningarr;
        }
        if(afterlength === beforelength)
        {

          return false;
        }
    }
    return runningarr;
}

function checkObjectIsEmpty(obj){
  for(var i in obj)
  {
    return true;
  }
  return false;
}


function checkEndArr(startarr, runningarr, endarr)
{
    for(var candidate in endarr)
    {
        var node = graphPool.getNodeById(endarr[candidate]);
        var nodeinputlist = node.inputlist;

        if ( !checkObjectIsEmpty(nodeinputlist) )
        {
          return false;
        }

        for (var key in nodeinputlist)
        {
            if ((startarr.indexOf(nodeinputlist[key].id) === -1) && runningarr.indexOf(nodeinputlist[key].id) === -1)
            {
                  return false;
            }
        }
    }
    return true;

}

function updateCheckBox(theData)
{
    var checkboxstr = ``;
    checkboxstr = checkboxstr + `<input type="button" id="btn_all" value="All">
                                <input type="button" id="btn_clear" value="Clear">
                                `;
    for (var key in theData)
    {
        checkboxstr = checkboxstr + `<input class="ui checkbox" type="checkbox" name="checkbox" value="${key}"> ${key}`;
    }

    $('.chartpart-checkbox').empty().append(checkboxstr);
}



function handleAddChart(){
    var eventid = this.id;
    var position = -1;
    $("input[type='checkbox']").each(function(){
        if(eventid)
        {
            this.checked = true;
        }
        var sName = this.value;
        var divarr = $(".chart").children();
        var itemposi = findObjIndex(sName, divarr);
        if(this.checked)
        {
            if(itemposi === -1)
            {
                //append
                appendhtml = `<div id="${sName}" class="chartdiv">
                    <div id="name"> <center> <span> ${sName} </span> </center> </div>
                    <div id="${sName}chart" class="chartitem"></div>
                    </div>`;
                if(position === -1)
                {
                    $(".chart").prepend(appendhtml);
                    position_name = sName + "chart";

                    /* shanchu */
                    var obj = {};
                    obj['id'] = 1;
                    obj['name'] = sName;
                    obj['position_name'] = position_name;
                    var post_data = JSON.stringify(obj);



                    
                    $.post("/chartpart/", post_data, function(data, status){
                      // alert(data);
                      data = JSON.parse(data);

                      var position_name = data['position_name'];
                      var chartdata = data['data'];

                      addChart(position_name, chartdata);
                      });
                    position++;
                }
                else
                {
                    $(".chart").children().eq(position).after(appendhtml);
                    position_name = sName + "chart";
                    
                    /* shanchu */
                    var obj = {};
                    obj['id'] = 1;
                    obj['name'] = sName;
                    obj['position_name'] = position_name;
                    var post_data = JSON.stringify(obj);


                    position_name = sName + "chart";
                    $.post("/chartpart/", post_data, function(data, status){
                      // alert(data);
                      data = JSON.parse(data);
                      var position_name = data['position_name'];
                      var chartdata = data['data'];

                      addChart(position_name, chartdata);
                      });
                    position++;

                }
            }
            else
            {
                //do not need append
                position++;
            }
        }
        else
        {
            if(itemposi !== -1)
            {
                //remove
                $(".chart").children().eq(itemposi).remove();
            }
            // else do not need remove
        }
    });
}


function findObjIndex(sName, divarr)
{
    theIndex = -1;
    for (var i=0; i<divarr.length; i++)
    {

        theIndex++;
        if( divarr[i].id === sName )
        {
            return theIndex;
        }
    }

    return -1;       
}


function addChart(position, data)
{
    var chart = AmCharts.makeChart(position, {
        "type": "serial",
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled":true,
        "dataDateFormat": "YYYY-MM-DD",
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth":true
        }],
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
        },
        "graphs": [{
            "id": "g1",
            "balloon":{
            "drop":true,
            "adjustBorderColor":false,
            "color":"#ffffff"
            },
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "value",
            "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis":false,
            "offset":30,
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA"
        },
        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha":1,
            "cursorColor":"#258cbb",
            "limitToGraph":"g1",
            "valueLineAlpha":0.2,
            "valueZoomable":true
        },
        "valueScrollbar":{
        "oppositeAxis":false,
        "offset":50,
        "scrollbarHeight":10
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        },
        "dataProvider": data
    });
}


function handleClearChart(){    
    $("input[type='checkbox']").each(function(){
      this.checked = false;
    });
    $(".chart").empty();
}

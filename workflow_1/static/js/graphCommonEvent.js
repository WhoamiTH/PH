/**
 * 工具栏-导入/导出功能
 */
function handleImportOrExport(e) {
  // debugger;
  console.log(e);
  
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
        // blockacivity
        // if (selectedNode.component === 'blockActivity') {
        //   var containerId = 'tab_'+selectedNode.id;
        //   $('.full-right [data-tab='+containerId+']').remove();
        //   graphPool.removeGraphFromPools(containerId);
        // }
        selectedNode = null;
        graph_active.updateGraph();
      } else if (selectedEdge) {
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
        console.log($(this).attr('name'));
        console.log(conventional[$(this).attr('name')]);
        console.log($(this).val());
      });
      if (conventional.ID != selectedNode.id) {
        selectedNode.id = conventional.ID;
      }
      if (conventional.name != selectedNode.title) {
        selectedNode.title = conventional.name;
      }
      // var $role = $('.conventional select[name="definition_role"]').parent();
      // conventional.performer = $role.children('.text').attr('definition_id') || '';
      // var role_txt = $role.dropdown('get text'); //Semantic存在bug，重构dropdown不能取value
      // if (role_txt !='请选择' && role_txt !='(空)') {
      //   conventional.participantID = $role.dropdown('get text');
      // }
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
      // $('.conventional').find('select').not($('input[name="definition_role"]')).each(function() {
      //   for (var key in conventional) {
      //     if (key == $(this).attr('name')) {
      //       $(this).dropdown('set selected', conventional[key]);
      //     }
      //   }
      // });
      // $('.conventional').find('.checkbox').each(function() {
      //   var value = $(this).find('input[name]').val();
      //   if (value && value !="false") $(this).checkbox('check');
      // });
      $('.conventional input[name=ID]').val(node.id);
      $('.conventional input[name=name]').val(node.title);
      // if (conventional.performer) {
      //   $('.conventional select[name="definition_role"]').dropdown('set text', conventional.participantID || '');
      //   $('.conventional .dropdown .text').attr('definition_id', conventional.performer);
      // }
    },
    onHidden: function() {
      // $('.prop_node .menu .item[data-tab="one"]').trigger('click');
      // $('.monitorinf select[name="isResponsibleTem"]').off('change'); // 弹窗关闭，避免清空表单时触发事件
      $(this).find('input, textarea').val('');
      // $(this).find('.ui.dropdown').dropdown('clear');
      // $(this).find('.ui.checkbox').checkbox('uncheck');
      // $('.monitorinf tbody').empty(); // 清空监控信息 
      // $('.timeout_limit tbody').empty(); // 清空监控信息
      // $('.extended_attr tbody').empty(); // 清空扩展属性集
      // $('.post_condition .list').empty(); // 清空后置条件
      // $('.post_condition .targetActivity').html('');
      // $('.conventional select[name="definition_role"]').siblings('.text').removeAttr('definition_id');
    }
  }).modal('show');
  // $('.prop_node>.menu a[data-tab*="two"]').addClass('hideitem');
  // if (selectedNode.title == '普通活动') {
  //   $('.prop_node>.menu a[data-tab="two_1"]').removeClass('hideitem');
  // }
  // if (selectedNode.title == '块活动') {
  //   $('.prop_node>.menu a[data-tab="two_2"]').removeClass('hideitem');
  // }
  // if (selectedNode.title == '子活动') {
  //   $('.prop_node>.menu a[data-tab="two_3"]').removeClass('hideitem');
  // }
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

  
  // console.log(selectedNode.component);
  // console.log(selectedNode.title);
  // console.log(selectedNode.name);
  //  debugger;
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
      inputliststr = inputliststr + `<div class="down-right-middle-add">
      <span style="margin-left:20%;">name:${key}</span> 
      <span style="margin-left:30%;">value:${inputlist[key]}</span>
      </div>`;
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
        if ($(this).val() !== "")
        {
            text.push($(this).val());
        }
      });
      var sign = true;
      for(var key in text)
      {
          // console.log(key);
          // console.log(text[key]);
          // if((key === undefined) || (text[key] === undefined))
          if(text[key] === undefined)
          {
              sign = false;
          }
      }
      if (sign)
      {
        if (selectedNode.title === "I")
        {
          var teminputlist = split(text);
          selectedNode.inputlist = teminputlist;
          selectedNode.outputlist = teminputlist;
          showDownRightOutput();
        }
        // else
        // {
        //   length = text.length;

        // }
        debugger;

        post_data = JSON.stringify(teminputlist);
        $.post("/down_left_bottom_submit/",post_data,
          function(data,status){alert("data:"+data+"\nstatus:"+status);});
       
      
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
      var sign;
      for(var key in text)
      {
          if((key === undefined) || (text[key] === undefined))
          {
              sign = false;
          }
      }
      if (sign)
      {
        var teminputlist = split(text);
        selectedNode.inputlist = teminputlist;
      }
      else
      {
        layer.msg('Some values are required! Cannot refresh!', {offset: '180px', time: 1000});
      }
    }
}

function split(text){
  var obj = {};
  var i = 0;
  while(i<text.length){
      obj[text[i]] = text[i+1];
      i = i+2;
  }
  return obj
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
          // console.log(key);
          // console.log(text[key]);
          // if((key === undefined) || (text[key] === undefined))
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
    $.post("/run/",post_data,
          function(data,status){alert("data:"+data+"\nstatus:"+status);});

}


function RunningOrder()
{
    var pool = graphPool.pools[0];
    console.log(pool);
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

    console.log(startarr);
    console.log(temarr);
    console.log(endarr);

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
        // var sign = true;
        if ( !checkObjectIsEmpty(nodeinputlist) )
        {
          return false;
        }

        for (var key in nodeinputlist)
        {
            if ((key === undefined) || (nodeinputlist[key] === undefined))
            {
                return false;
            } 
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
                //inputlist is empty
                //outputlist is empty
                return false;
            }
            for (var t in nodeinputlist)
            {
              if ( (startarr.indexOf(nodeinputlist[t].id) === -1) && (runningarr.indexOf(nodeinputlist[t].id) === -1 ) )
              {
                //input cannot be obtained either from inputnode or other node
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
        // var sign = true;

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

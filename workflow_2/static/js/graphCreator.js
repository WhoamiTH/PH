/*jshint esversion: 6 */
document.onload = (function(d3, saveAs, Blob, vkbeautify) {
  "use strict";

  // define graphcreator object
  var GraphCreator = function(containerId, svg, nodes, edges, participants) {
    var thisGraph = this;
    console.log('thisGraph:');
    console.log(thisGraph);

    thisGraph.nodes = nodes || [];
    thisGraph.edges = edges || [];
    thisGraph.participants = participants || [];
    thisGraph.containerId = containerId;

    thisGraph.state = {
      activeEdit: true,
      selectedNode: null,
      selectedEdge: null,
      mouseDownNode: null,
      mouseDownLink: null,
      justDragged: false,
      justScaleTransGraph: false,
      lastKeyDown: -1,
      shiftNodeDrag: false,
      selectedText: null,
      drawLine: ''
    };

    // define arrow markers for graph links
    var defs = svg.append('defs');
    defs.append('svg:marker')
      .attr('id', thisGraph.containerId + '-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 42)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    //define arrow markers for leading arrow
    defs.append('marker')
      .attr('id', thisGraph.containerId + '-mark-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    //define selected arrow
    defs.append('marker')
      .attr('id', thisGraph.containerId + '-selected-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgb(229, 172, 247)');

    thisGraph.svg = svg;
    thisGraph.show_position = svg.append("text")
      .attr({
        'x': '70%',
        'y': '5%',
        'fill': '#E1784B'
      });
    thisGraph.svgG = svg.append("g")
      .classed(thisGraph.consts.graphClass, true);
    var svgG = thisGraph.svgG;

    // displayed when dragging between nodes
    thisGraph.dragLine = svgG.append('path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0')
      .style('marker-end', 'url(#'+thisGraph.containerId+'-mark-end-arrow)');

    // svg nodes and edges
    thisGraph.paths = svgG.append("g").selectAll("g");
    thisGraph.circles = svgG.append("g").selectAll("g");

    thisGraph.drag = d3.behavior.drag()
      .origin(function(d) {
        // d = selected circle. The drag origin is the origin of the circle
        return {
          x: d.x,
          y: d.y
        };
      })
      .on("dragstart", function() {d3.select(this).select("circle").attr("r", thisGraph.consts.nodeRadius + thisGraph.consts.nodeRadiusVary);})
      .on("drag", function(args) {
        thisGraph.state.justDragged = true;
        thisGraph.dragmove.call(thisGraph, args);
      })
      .on("dragend", function(args) {
        // args = circle that was dragged
        d3.select(this).select("circle").attr("r", thisGraph.consts.nodeRadius - thisGraph.consts.nodeRadiusVary);
      });

    // listen for key events
    d3.select(window).on("keydown", function() {
        thisGraph.svgKeyDown.call(thisGraph);
      })
      .on("keyup", function() {
        thisGraph.svgKeyUp.call(thisGraph);
      });
    svg.on("mousedown", function(d) {
      thisGraph.svgMouseDown.call(thisGraph, d);
    });
    svg.on("mouseup", function(d) {
      thisGraph.svgMouseUp.call(thisGraph, d);
    });
    svg.on("mousemove", function(d) {
      thisGraph.show_position.text('pos: '+d3.mouse(svgG.node())[0].toFixed(0)+', '+d3.mouse(svgG.node())[1].toFixed(0));
    });

    // listen for dragging
    var dragSvg = d3.behavior.zoom()
      .scaleExtent([0.3, 2])
      .on("zoom", function() {
        if (d3.event.sourceEvent.shiftKey) {
          // the internal d3 state is still changing
          return false;
        } else {
          thisGraph.zoomed.call(thisGraph);
        }
        return true;
      })
      .on("zoomstart", function() {
        // console.log('zoomstart triggered');
        var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
        if (ael) {
          ael.blur();
        }
        if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
      })
      .on("zoomend", function() {
        d3.select('body').style("cursor", "auto");
      });
    thisGraph.dragSvg = dragSvg;
    svg.call(dragSvg).on("dblclick.zoom", null);

    // listen for resize
    window.onresize = function() {
      thisGraph.updateWindow(svg);
    };



    $('#flowComponents .components-btn[type]').not('.noComponent').attr('draggable', 'true')
      .on('dragstart', function(ev) {
        // $('.full-left').css({cursor: 'no-drop'});
        $(this).siblings().removeClass('active').end().addClass('active');
        $('.full-right>.tab.active .full-right-top').addClass('activate');
        /* show the picture when dragging on*/
        var json_obj = {
          text: $(this).attr('data-show'),
          component: $(this).attr('name'),
          type: $(this).attr('type') 
        };
        ev.originalEvent.dataTransfer.setData('tr_data', JSON.stringify(json_obj));
      })
      .on('dragend', function(ev) {
        $('.full-right>.tab.active .full-right-top').removeClass('activate');
      }); 
    $('.full-right .tab.active').on('drop', '.svg-container', function(ev) {
      ev.stopPropagation(); 
      ev.preventDefault(); 
      var position = {
        x: parseFloat(ev.originalEvent.offsetX),
        y: parseFloat(ev.originalEvent.offsetY)
      };

      position = thisGraph.parsePosition(this, position);

      var data = JSON.parse(ev.originalEvent.dataTransfer.getData('tr_data'));
      data = $.extend(data, position);
      var node = thisGraph.createNode(data);

      thisGraph.nodes.push(node);
      thisGraph.updateGraph();

    })
    .on('dragover', function(ev) { 
      ev.preventDefault();
    });

    $('svg').on('click', function() {
      $('#rMenu').hide();
    });
    $('svg').on('contextmenu', function() {
      $('#flowComponents div[name=selectBtn]').trigger('click');
      return false;
    });   

  };


  //Convert coordinates based on scaling and offset 
  GraphCreator.prototype.parsePosition = function(svgContainer, position) {
    var transform = $(svgContainer).find('.graph').attr('transform'); 
      if (transform) {
        var result = []; // ['20,11', '1']
        var regExp_ = /\(([^)]*)\)/g;
        var ele;
        while ((ele=regExp_.exec(transform)) != null) {
           result.push(ele[1]);
        }
        var translate = result[0] && result[0].split(/,|\s/) || [0, 0]; 
        var scale = result[1] && result[1].split(',')[0] || 1;
        if (translate.length == 1 && translate[0] == 0) { 
          translate.push(0);
        }
        position.x = (position.x - translate[0])/scale;
        position.y = (position.y - translate[1])/scale;
      }
      return position;
  };


  GraphCreator.prototype.filterActivities = function() {
    var thisGraph = this;
    var activities = thisGraph.nodes.filter(function(node) {
      return node.type == 'activity';
    });
    return activities;
  };

  GraphCreator.prototype.filterStartAndEnd = function() {
    var thisGraph = this;
    var activities = thisGraph.nodes.filter(function (node) {
      return node.type == 'start' || node.type == 'end';
    });
    return activities;
  };


  GraphCreator.prototype.edgesLinkAcivity = function() {
    var thisGraph = this;
    var edges_act = thisGraph.edges.filter(function(edge) {
      return (edge.source.type != 'start' && edge.target.type != 'end');
    });
    return edges_act;
  };

  GraphCreator.prototype.consts = {
    selectedClass: "selected",
    connectClass: "connect-node",
    circleGClass: "conceptG",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    nodeRadius: 34,
    nodeRadiusVary: 1
  };

  /**
   * 获取link样式 [添加线样式 start:连线起点 des:连线终点]
   * 如果 |dif.x| > |dif.y| 左右连线，反之，上下连线
   * 如果 dif.x > 0 && dif.y < 0 第四象限
   * 如果 dif.x > 0 && dif.y > 0 第一象限
   * 如果 dif.x < 0 && dif.y > 0 第二象限
   * 如果 dif.x < 0 && dif.y < 0 第三象限
   */
  // get the style of link
  GraphCreator.prototype.getLink_d = function(start, des) {
    var d = start;
    var mid_x = (d.x + des.x)/2,
      mid_y = (d.y + des.y)/2;
    var dif_x = des.x - d.x,
      dif_y = des.y - d.y;
    var link;
    if (Math.abs(dif_x) > Math.abs(dif_y)) {
      if (dif_x > 0 && dif_y > 0) {
          link = 'M' + d.x + ',' + d.y + 'L' + (mid_x-5) + ',' + d.y + 'M' + (mid_x-5) + ',' + d.y + 'A 5,5,0,0,1 ' + mid_x + ',' + (d.y+5) + 
          'M' + mid_x + ',' + (d.y+5) + 'L' + mid_x + ',' + (des.y-5) +'M' + mid_x + ',' + (des.y-5) + 'A 5,5,0,0,0' + (mid_x+5) + ',' + des.y + 
          'M' + (mid_x+5) + ',' + des.y + 'L' + des.x + ',' + des.y;
      }
      if (dif_x < 0 && dif_y > 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + (mid_x+5) + ',' + d.y + 'M' + (mid_x+5) + ',' + d.y + 'A 5,5,0,0,0 ' + mid_x + ',' + (d.y+5) + 
          'M' + mid_x + ',' + (d.y+5) + 'L' + mid_x + ',' + (des.y-5) +'M' + mid_x + ',' + (des.y-5) + 'A 5,5,0,0,1' + (mid_x-5) + ',' + des.y + 
          'M' + (mid_x-5) + ',' + des.y + 'L' + des.x + ',' + des.y;
      }
      if (dif_x < 0 && dif_y < 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + (mid_x+5) + ',' + d.y + 'M' + (mid_x+5) + ',' + d.y + 'A 5,5,0,0,1 ' + mid_x + ',' + (d.y-5) + 
          'M' + mid_x + ',' + (d.y-5) + 'L' + mid_x + ',' + (des.y+5) +'M' + mid_x + ',' + (des.y+5) + 'A 5,5,0,0,0' + (mid_x-5) + ',' + des.y + 
          'M' + (mid_x-5) + ',' + des.y + 'L' + des.x + ',' + des.y;
      }
      if (dif_x > 0 && dif_y < 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + (mid_x-5) + ',' + d.y + 'M' + (mid_x-5) + ',' + d.y + 'A 5,5,0,0,0 ' + mid_x + ',' + (d.y-5) + 
          'M' + mid_x + ',' + (d.y-5) + 'L' + mid_x + ',' + (des.y+5) +'M' + mid_x + ',' + (des.y+5) + 'A 5,5,0,0,1' + (mid_x+5) + ',' + des.y + 
          'M' + (mid_x+5) + ',' + des.y + 'L' + des.x + ',' + des.y;
      }
    } else {
      if (dif_x > 0 && dif_y > 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y-5) + 'M' + d.x + ',' + (mid_y-5) + 'A 5,5,0,0,0 ' + (d.x+5) + ',' + mid_y + 
          'M' + (d.x+5) + ',' + mid_y + 'L' + (des.x-5) + ',' + mid_y +'M' + (des.x-5) + ',' + mid_y + 'A 5,5,0,0,1' + des.x + ',' + (mid_y+5) + 
          'M' + des.x + ',' + (mid_y+5) + 'L' + des.x + ',' + des.y;
      }
      if (dif_x < 0 && dif_y > 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y-5) + 'M' + d.x + ',' + (mid_y-5) + 'A 5,5,0,0,1 ' + (d.x-5) + ',' + mid_y + 
          'M' + (d.x-5) + ',' + mid_y + 'L' + (des.x+5) + ',' + mid_y +'M' + (des.x+5) + ',' + mid_y + 'A 5,5,0,0,0' + des.x + ',' + (mid_y+5) + 
          'M' + des.x + ',' + (mid_y+5) + 'L' + des.x + ',' + des.y;
      }
      if (dif_x < 0 && dif_y < 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y+5) + 'M' + d.x + ',' + (mid_y+5) + 'A 5,5,0,0,0 ' + (d.x-5) + ',' + mid_y + 
          'M' + (d.x-5) + ',' + mid_y + 'L' + (des.x+5) + ',' + mid_y +'M' + (des.x+5) + ',' + mid_y + 'A 5,5,0,0,1' + des.x + ',' + (mid_y-5) + 
          'M' + des.x + ',' + (mid_y-5) + 'L' + des.x + ',' + des.y;
      }
      if (dif_x > 0 && dif_y < 0) {
        link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y+5) + 'M' + d.x + ',' + (mid_y+5) + 'A 5,5,0,0,1 ' + (d.x+5) + ',' + mid_y + 
          'M' + (d.x+5) + ',' + mid_y + 'L' + (des.x-5) + ',' + mid_y +'M' + (des.x-5) + ',' + mid_y + 'A 5,5,0,0,0' + des.x + ',' + (mid_y-5) + 
          'M' + des.x + ',' + (mid_y-5) + 'L' + des.x + ',' + des.y;
      }
    }
    return link;
  };

  // get the edges of the node according to different types, -1: the target is node; 1: the source is node; undefined: all edges 
  GraphCreator.prototype.getLinkedEdges = function(node, type) {
    var thisGraph = this;
    var edges = thisGraph.edges;
    var linkedEdges;
    if (type == -1) {
      linkedEdges = edges.filter(function(edge) {
        return edge.target == node;
      });
    }
    if (type == 1) {
      linkedEdges = edges.filter(function(edge) {
        return edge.source == node;
      });
    }
    linkedEdges = edges.filter(function(edge) {
      return edge.target == node || edge.source == node;
    });
    return linkedEdges;
  };

  /**
   * 判断node有无连线
   * @param  {object}  node       节点
   * @param  {Boolean} isActivity 是否是与activity的连线，true 不包括开始和结束节点
   * @param  {Boolean} type       连线类型：-1 指向node 0 所有连线 1 从node连出
   * @return {Boolean}            hasLinked
   */
  //check whether the node has edges, isActivity: associate with the process node
  //-1: target is node; 0:all edges; 1: source is node 
  GraphCreator.prototype.hasLinked = function(node, isActivity, type) {
    var thisGraph = this;
    isActivity = isActivity || false;
    type = type || 0;
    var edges = [];
    if (isActivity) {
      edges = thisGraph.edges.filter(function(edge, index) {
        return edge.source.type == 'activity' && edge.target.type == 'activity';
      });
    } else {
      edges = thisGraph.edges;
    }
    var hasLinked = edges.some(function(edge, index) {
      if (type == 0) {
        return edge.source.id == node.id || edge.target.id == node.id;
      } else if (type == -1) {
        return edge.target.id == node.id;
      } else if (type == 1) {
        return edge.source.id == node.id;
      }
    });
    return hasLinked;
  };

  GraphCreator.prototype.dragmove = function(d) {
    var thisGraph = this;
    var drawLine = thisGraph.state.drawLine;
    var link;
    if (thisGraph.state.shiftNodeDrag || drawLine) {
      var svgG = thisGraph.svgG,
        dragLine = thisGraph.dragLine;
      switch (drawLine) {
        case 'NOROUTING': // line
          link = dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(svgG.node())[0] + ',' + d3.mouse(svgG.node())[1]);
          break;
        case 'SIMPLEROUTING': // poliline
          var des = {
            x: d3.mouse(svgG.node())[0], 
            y: d3.mouse(svgG.node())[1] 
          };
          var link_d = thisGraph.getLink_d(d, des);
          link = dragLine.attr('d', link_d);
          break;
      }
      refresh(link);
    } else {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      thisGraph.updateGraph();
    }
  };

  GraphCreator.prototype.deleteGraph = function() {
    var thisGraph = this;
    thisGraph.nodes = [];
    thisGraph.edges = [];
    thisGraph.updateGraph();
  };

  GraphCreator.prototype.selectElementContents = function(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };


  GraphCreator.prototype.insertTitleLinebreaks = function(gEl, d) {
    var words = d.title.split(/\s+/g),
      nwords = words.length;
    var el = gEl.append("text")
      .attr("text-anchor", "middle")
      .attr("letter-spacing", "1");
    switch (d.type) {
      case 'start':
      case 'end':
        el.attr("dy", "13");
        break;
      default:
        el.attr("dy", "-" + (nwords - 1) * 7.5);
        break;
    }
    for (var i = 0; i < words.length; i++) {
      var tspan = el.append('tspan').text(words[i]);
      if (i > 0)
        tspan.attr('x', 0).attr('dy', '15');
    }

  };

  // remove edges associated with a node
  GraphCreator.prototype.spliceLinksForNode = function(node) {
    var thisGraph = this,
      toSplice = thisGraph.edges.filter(function(l) {
        return (l.source === node || l.target === node);
      });
    toSplice.map(function(l) {
        var sourcenode = l.source;
        var targetnode = l.target;
        var inputlist = targetnode.inputlist;
        for(var key in inputlist)
        {
            if (inputlist[key].id === sourcenode.id) 
            {
                delete inputlist[key];
            }
        }
      thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
    });
  };

  GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData) {
    var thisGraph = this;
    d3Path.classed(thisGraph.consts.selectedClass, true);
    //change the style of arrow
    // d3Path.style('marker-end', 'url(#selected-end-arrow)');
    if (thisGraph.state.selectedEdge) {
      thisGraph.removeSelectFromEdge();
    }
    thisGraph.state.selectedEdge = edgeData;
  };

  GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData) {
    // A circle node has been selected.
    var thisGraph = this;
    d3Node.classed(this.consts.selectedClass, true);
    if (thisGraph.state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }
    thisGraph.state.selectedNode = nodeData;
  };

  // may be not need
  GraphCreator.prototype.removeSelectFromNode = function() {
    // A circle node has been deselected.
    var thisGraph = this;
    thisGraph.circles.filter(function(cd) {
      return cd.id === thisGraph.state.selectedNode.id;
    }).classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedNode = null;
    d3.selectAll("#inspector").remove();
  };

  GraphCreator.prototype.removeSelectFromEdge = function() {
    var thisGraph = this;
    thisGraph.paths.filter(function(cd) {
      return cd === thisGraph.state.selectedEdge;
    }).classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedEdge = null;
  };

  GraphCreator.prototype.pathMouseDown = function(d3path, d) {
    var thisGraph = this,
      state = thisGraph.state;
    d3.event.stopPropagation();
    state.mouseDownLink = d;

    if (state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }

    var prevEdge = state.selectedEdge;
    if (!prevEdge || prevEdge !== d) {
      thisGraph.replaceSelectEdge(d3path, d);
    } else {
      if(d3.event.button != 2){
        thisGraph.removeSelectFromEdge();
        // d.style('marker-end', 'url(#end-arrow)');
      }
    }
    if (d3.event.button == 2) {
      thisGraph.showMenu();
      // thisGraph.menuEvent();
    }
  };

  // mousedown on node
  GraphCreator.prototype.circleMouseDown = function(d3node, d) {
    var thisGraph = this,
      state = thisGraph.state;
    
    // alert('is this function');
    console.log('is this function');
    //add function at here
    d3.event.stopPropagation();
    state.mouseDownNode = d;

    if (d3.event.shiftKey || thisGraph.state.drawLine) {
      var result = thisGraph.isAllowLinking(d);
      if (!result.success) {
        layer.msg(result.msg, {time: 2000, icon: 0, offset: '180px'});
        return;
      }      
      // Automatically create node when they shift + drag
      state.shiftNodeDrag = d3.event.shiftKey;
      // reposition dragged directed edge
      var link = thisGraph.dragLine.classed('hidden', false)
        .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
      refresh(link);
      return;
    }
  };

  // mouseup on nodes
  GraphCreator.prototype.circleMouseUp = function(d3node, d) {
    var thisGraph = this,
      state = thisGraph.state,
      consts = thisGraph.consts;
    // reset the states
    state.shiftNodeDrag = false;
    d3node.classed(consts.connectClass, false);

    var mouseDownNode = state.mouseDownNode;
    if (!mouseDownNode) return;

    thisGraph.dragLine.classed("hidden", true);

    if (mouseDownNode !== d) {
      var result = thisGraph.isAllowLinked(d, mouseDownNode);
      if (!result.success) {
        layer.msg(result.msg, {time: 2000, icon: 0, offset: '180px'});
        return;
      }
      // we're in a different node: create new edge for mousedown edge and add to graph
      var newEdge = {
        edgeId: seqer_edgeID.gensym(),
        postCondition: {transitionEventType: 'transitionClass'},
        source: mouseDownNode,
        target: d,
        drawLine: thisGraph.state.drawLine
      };
      var filtRes = thisGraph.paths.filter(function(d) {
        if (d.source === newEdge.target && d.target === newEdge.source) {

            var sourcenode = d.source;
            var targetnode = d.target;
            var inputlist = targetnode.inputlist;
            for(var key in inputlist)
            {
                if (inputlist[key].id === sourcenode.id) 
                {
                    delete inputlist[key];
                }
            }
          thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
        }
        return d.source === newEdge.source && d.target === newEdge.target;
      });

      var obj = {};
      if(mouseDownNode.title === "I")
      {
        obj.name = mouseDownNode.name;
      }
      else
      {
        obj.name = mouseDownNode.title;
      }
      obj.id = mouseDownNode.id;

      length = count(d.inputlist);
      d.inputlist[length+1] = obj;

      if (!filtRes[0].length) {
        thisGraph.edges.push(newEdge);
        thisGraph.updateGraph();
      }
    } else {
      // we're in the same node
      var prevNode = state.selectedNode;
      if (state.justDragged) {
        // dragged, not clicked
        if (state.selectedEdge) {
          thisGraph.removeSelectFromEdge();
        }
        if (!prevNode || prevNode !== d) {
          thisGraph.replaceSelectNode(d3node, d);
          thisGraph.changePropDiv(d); // update or change the attibute of div
        } else {
          // thisGraph.removeSelectFromNode();
        }
      
      } else {
        // clicked, not dragged
        if (d3.event.shiftKey) {

        } else {
          if (state.selectedEdge) {
            thisGraph.removeSelectFromEdge();
          }
          if (!prevNode || prevNode !== d) {
            thisGraph.replaceSelectNode(d3node, d);
            thisGraph.changePropDiv(d); // update or change the attibute of div
            thisGraph.showMenu();
            // thisGraph.menuEvent();
          } else {
            if (d3.event.button == '2') {
              thisGraph.showMenu();
              // thisGraph.menuEvent();
            } else {
              thisGraph.removeSelectFromNode();
            }
          }
        }
      }
    }
    state.mouseDownNode = null;
    state.justDragged = false;
    return;

  }; // end of circles mouseup


  // whether the node can receive the other input
  GraphCreator.prototype.isAllowLinked = function(eventNode, mouseDownNode) { 
    var thisGraph = this;
    var result = {
      success: true,
      msg: ''
    };
    if(eventNode.type === 'start')
    {
        result.success = false;
        result.msg = 'Error! Cannot return to input';
    }
    if(mouseDownNode.type === 'end')
    {
        result.success = false;
        result.msg = 'Error! Cannot return to the workflow!';
    }
    return result;
  };


   // whether the node can give the output
  GraphCreator.prototype.isAllowLinking = function(eventNode) {
    var thisGraph = this;
    var result = {
      success: true,
      msg: ''
    };
    if(eventNode.type === 'end')
    {
        result.success = false;
        result.msg = 'Error! Cannot return to the workflow!';
    }
    if(eventNode.type === 'activity')
    {
      var outputlist = eventNode.outputlist;
      if (!checkObjectIsEmpty(outputlist))
      {
        result.success = false;
        result.msg = "Error! Output is required!";
      }
    }
    return result;
  };


  // update and change the attibute of div, the middle right information
  // the down left information the down right information
  GraphCreator.prototype.changePropDiv = function(d) {
    changeMiddleRightInformation(d);
    changeDownLeftInformation(d);
    changeDownRightInformation(d);
  };

    GraphCreator.prototype.showMenu = function() {
    var thisGraph = this;
    $('#flowComponents div[name=selectBtn]').trigger('click'); 
    thisGraph.circles.style({'cursor': 'default'}); // 防止在活动块上右击存在问题
    var selectedNode = thisGraph.state.selectedNode,
      selectedEdge = thisGraph.state.selectedEdge;
    if (selectedNode) {
      if (selectedNode.type == 'activity') {
        $('#rMenu a[name=propMenu]').show();
        if (selectedNode.component == 'blockActivity') {
          $('#rMenu a[name=editMenu]').show();
        } else {
          $('#rMenu a[name=editMenu]').hide();
        }
      } else {
        $('#rMenu a[name=propMenu]').hide();
        $('#rMenu a[name=editMenu]').hide();
      }
    } else if (selectedEdge) {
      var sourceType = selectedEdge.source.type,
        targetType = selectedEdge.target.type;
      $('#rMenu a[name=editMenu]').hide();
      if (sourceType == 'start' || targetType == 'end') {
        $('#rMenu a[name=propMenu]').hide();
      } else {
        $('#rMenu a[name=propMenu]').show();
      }
    }
    d3.select("#rMenu").style({ 
      "top": (d3.event.clientY-2)+"px", 
      "left": (d3.event.clientX-2)+"px", 
      "display": "block" 
    });
    d3.select('#rMenu').on('contextmenu', function() {
      d3.event.preventDefault();
    });
  };

  // mousedown on main svg
  GraphCreator.prototype.svgMouseDown = function() {
    this.state.graphMouseDown = true;
  };

  // mouseup on main svg
  GraphCreator.prototype.svgMouseUp = function() {
    var thisGraph = this,
      state = thisGraph.state;
    if (state.justScaleTransGraph) {
      // dragged not clicked
      state.justScaleTransGraph = false;
    } else if (state.graphMouseDown && d3.event.shiftKey) {
      console.log(seqer_Process.gensym());
      // clicked not dragged from svg
      var xycoords = d3.mouse(thisGraph.svgG.node()),
        d = {
          id: seqer_nodeID.gensym(),
          title: seqer_Process.gensym(),
          component: 'ordinaryActivity',
          type: 'activity',
          x: xycoords[0],
          y: xycoords[1],
          conventional: {
            MustActivity: true, 
            taskAssign: 'taskAutoMode', 
            autoAcceptAllAssignments: true, 
            isResponsible: true,
            startMode: 'manual',
            finishMode: 'manual'
          },
          frontCondition: {},
          postCondition: {},
          extendAttr: [],
          highLevel: {},
          timeoutLimit: {},
          monitorinf: {isResponsibleTem: true},
          eventTypeId: null
        };
      thisGraph.nodes.push(d);
      thisGraph.updateGraph();
    } else if (state.shiftNodeDrag || state.drawLine) {
      // dragged from node
      state.shiftNodeDrag = false;
      thisGraph.dragLine.classed("hidden", true);
    }
    state.graphMouseDown = false;
  };

  // keydown on main svg
  GraphCreator.prototype.svgKeyDown = function() {
    var thisGraph = this,
      state = thisGraph.state,
      consts = thisGraph.consts;
    // make sure repeated key presses don't register for each keydown
    if (state.lastKeyDown !== -1) return;

    state.lastKeyDown = d3.event.keyCode;
    var selectedNode = state.selectedNode,
      selectedEdge = state.selectedEdge;

  };

  GraphCreator.prototype.svgKeyUp = function() {
    this.state.lastKeyDown = -1;
  };

  // call to propagate changes to graph
  GraphCreator.prototype.updateGraph = function() {
    var thisGraph = this,
      consts = thisGraph.consts,
      state = thisGraph.state,
      nodes = thisGraph.nodes, 
      edges = thisGraph.edges;
    
    thisGraph.paths = thisGraph.paths.data(edges, function(d) {
      return String(d.source.id) + "+" + String(d.target.id);
    });
    var paths = thisGraph.paths;
    // update existing paths
    var link = paths.style('marker-end', 'url(#'+thisGraph.containerId+'-end-arrow)')
      .classed(consts.selectedClass, function(d) {
        return d === state.selectedEdge;
      })
      .attr("conditype", function(d) {
        if (d.postCondition) {
          return changeCase(d.postCondition.conditype, 5);
        } else {
          return '';
        }
      })
      .attr("d", function(d) {
        if (d.drawLine == 'NOROUTING') {
          return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
        }
        if (d.drawLine == 'SIMPLEROUTING') {
          var start = {
            x: d.source.x,
            y: d.source.y
          };
          var des = {
            x: d.target.x,
            y: d.target.y
          };
          return thisGraph.getLink_d(start, des);
        }
      });
    refresh(link);

    // add new paths
    paths.enter()
      .append("path")
      .style('marker-end', 'url(#'+thisGraph.containerId+'-end-arrow)')
      .classed("link", true)
      .attr("conditype", function(d) {
        if (d.postCondition) {
          return changeCase(d.postCondition.conditype, 5);
        } else {
          return '';
        }
      })
      .attr("d", function(d) {
        if (d.drawLine == 'NOROUTING') {
          return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
        }
        if (d.drawLine == 'SIMPLEROUTING') {
          var start = {
            x: d.source.x,
            y: d.source.y
          };
          var des = {
            x: d.target.x,
            y: d.target.y
          };
          return thisGraph.getLink_d(start, des);
        }
      })
      .on("mousedown", function(d) {
        thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
      })
      .on("mouseup", function(d) {
        state.mouseDownLink = null;
      });

    // remove old links
    paths.exit().remove();

    // update existing nodes
    thisGraph.circles = thisGraph.circles.data(nodes, function(d) {
      return d.id;
    });
    thisGraph.circles.attr("transform", function(d) {
      if (d == state.selectedNode) { // update the name of node
        var tspan = d3.select(this).select('tspan');
        if (tspan.text() !== d.title) {
          tspan.text(d.title);
        }
      }
      return "translate(" + d.x + "," + d.y + ")";
    });

    // add new nodes
    var newGs = thisGraph.circles.enter()
      .append("g")
        .attr({"id": function(d) { return generateUUID(); }});

    newGs.classed(consts.circleGClass, true)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("mouseover", function(d) {
        if (state.shiftNodeDrag) {
          d3.select(this).classed(consts.connectClass, true);
        }
      })
      .on("mouseout", function(d) {
        d3.select(this).classed(consts.connectClass, false);
      })
      .on("mousedown", function(d) {
        thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
      })
      .on("mouseup", function(d) {
        thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
      })
      .call(thisGraph.drag);

    newGs.append("circle")
      .attr("r", String(consts.nodeRadius));

    newGs.each(function(d) {
      switch (d.type) {
        case 'start':
          d3.select(this).classed('start', true);
          break;
        case 'end':
          d3.select(this).classed('end', true);
          break;
      }
      thisGraph.insertTitleLinebreaks(d3.select(this), d);
    });

    // remove old nodes
    thisGraph.circles.exit().remove();
  };
  
  GraphCreator.prototype.zoomed = function() {
    this.state.justScaleTransGraph = true;
    var translate = this.dragSvg.translate();
    var scale = this.dragSvg.scale();
    if (!translate[0]) translate = [0, 0];
    if (!scale) scale = 1;
    d3.select(".full-right>.tab.active ." + this.consts.graphClass)
      .attr("transform", "translate(" + translate + ") scale(" + scale + ")");
  };

  GraphCreator.prototype.updateWindow = function(svg) {
    var docEl = document.documentElement,
      bodyEl = document.getElementsByTagName('body')[0];
    var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
    var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
    svg.attr("width", x).attr("height", y);
  };


  GraphCreator.prototype.createNode = function(data) {
    var node;
    switch (data.type) {
      case 'activity':
        node = {
          id: seqer_nodeID.gensym(),
          title: seqer_Process.gensym(),
          component: data.component,
          type: data.type,
          code: "",
          inputlist: {},
          outputlist: {},
          x: data.x,
          y: data.y,
          conventional: {
            MustActivity: true, 
            taskAssign: 'taskAutoMode', 
            autoAcceptAllAssignments: true, 
            isResponsible: true,
            startMode: 'manual',
            finishMode: 'manual'
          },
          frontCondition: {},
          postCondition: {},
          extendAttr: [],
          highLevel: {},
          timeoutLimit: {},
          monitorinf: {isResponsibleTem: true},
          eventTypeId: null
        };
        break;
      default: // 开始、结束节点
        node = {
          id: generateUUID(),
          inputlist: {},
          component: data.component,
          type: data.type,
          x: data.x,
          y: data.y
        };
        if (data.text === 'S')
        {
          node.title = 'I';
          node.name = 'Input';
        }
        else
        {
          node.title = 'O';
          node.name = 'Output';
        }
        break;
    }
    return node;
  };


  /**** MAIN ****/
  var container = d3.select('[data-tab="tab_main"] .svg-container').node(),
    containerId = 'tab_main';

  var svg = d3.select('[data-tab="tab_main"] .svg-container').append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  var initialDate = initFlowChart();
  window.graph_main = new GraphCreator(containerId, svg, initialDate.nodes, initialDate.edges, initialDate.participants);
  graphPool.pools.push(graph_main);
  graph_main.updateGraph();
  initCommonEvent();
  

})(window.d3, window.saveAs, window.Blob, vkbeautify);



$(document).ready(function(){
  $('#middle-right-submit-button').on('click', updateMiddleRightInformation);
});



function initCommonEvent() {
  $('.editor-toolbar').on('click', '.sign.in,.sign.out', handleImportOrExport);
  $('.editor-toolbar').on('click', '#editor-toolbar-run-button', RunWorkflow);
  $('.editor-toolbar #delete-ele').on('click', handleDeleteNode);
  $('.editor-toolbar #zoom-enlarge,#zoom-narrow').on('click.zoom', handleClickZoom);
  $("#reset-zoom").on("click", resetZoom);

  $('#flowComponents .components-btn').on('click', handleComponentsBtn);
  $("#delete-graph").on("click", clearGraph);

  $('.middle-right').on('click', "#middle-right-submit-button", updateMiddleRightInformation);
  $('#down-left-down-add-button').on('click', handleDownLeftDownAdd);
  $('.down-left').on('click','#down-left-down-refresh-buttom', handleDownLeftDownRefresh);
  $('.down-left').on('click','#down-left-down-submit-buttom', handleDownLeftDownSubmit);
  $('.down-left-middle').on('click','#down-left-middle-remove-button', handleDownLeftMiddleRemove);
  $('#down-right-down-add-button').on('click', handleDownRightDownAdd);
  $('.down-right').on('click','#down-right-down-submit-buttom', handleDownRightDownSubmit);
  $('.down-right-middle').on('click','#down-right-middle-remove-button', handleDownRightMiddleRemove);
  $(".chartpart-checkbox").on('click', "input[type='checkbox']", handleAddChart);
  $(".chartpart-checkbox").on('click', "#btn_all", handleAddChart);
  $(".chartpart-checkbox").on('click', "#btn_clear", handleClearChart);
}

function initFlowChart() {
  var initialDate = {
    nodes: [],
    edges: [],
    participants: []
  };
  return initialDate;
}

function refresh(link) {
  if (/(MSIE 10)|(Trident)/.test(navigator.appVersion)) {
    if (link[0] instanceof Array) {
      link[0].forEach( function(item) {
        item.parentNode.insertBefore(item, item);
      });
    } else if (link[0]) {
      var svgNode = link.node();
      svgNode.parentNode.insertBefore(svgNode, svgNode);
    }
  }
}


function count(obj){
  var max = 0;
  for (var key in obj)
  {
    if (key !== undefined)
    {
      if(Number(key) > max)
      {
          max = Number(key);
      }
    }
  }
  return max;
}


function changeMiddleRightInformation(d)
{
  if (d.component === "ordinaryActivity")
  {
    $('.middle-right-bottom').empty().append(
      `<div name="id" class="middle-right-bottom-top">
          <div name="id" class="prop-value"><span>name:</span><input id="middle-right-name" type="text" value="${d.title}"></div>
          <div><span>Script:</span></div>
          <div name="name" class="prop-value"><textarea id="middle-right-code" style="hight:60%;">${d.code}</textarea></div>
      </div>
      <div name="buttom" class="middle-right-bottom-bottom">
          <button id="middle-right-submit-button"> submit <button>
      <div>
      `);
  }
  else
  {
    $('.middle-right-bottom').empty().append(
      `<div name="id" class="middle-right-bottom-top">
          <div name="id" class="prop-value"><span>name:</span><input id="middle-right-name" type="text" value="${d.name}"></div>
      </div>
      <div name="buttom" class="middle-right-bottom-bottom">
          <button id="middle-right-submit-button"> submit <button>
      <div>
      `);
  }
}

function changeDownLeftInformation(d)
{
  // debugger;
  var inputliststr = ``;
    var inputlist = d.inputlist;
    if (d.component !== "startComponent")
    {
      var inputlist = d.inputlist;
      for (var key in inputlist)
      {
        var inputnode = graphPool.getNodeById(inputlist[key].id);
        if (inputnode.component === "startComponent")
        {
            inputlist[key].name = inputnode.name;
        }
        else
        {
            inputlist[key].name = inputnode.title;
        }
        inputliststr = inputliststr + `<div class="down-left-middle-add">
        <span style="margin-left:30%">name: ${inputlist[key].name}</span>
        </div>`;
      }
      $(".down-left-down").attr("style","visibiliy:hidden");
    }
    else//start
    {
      var inputlist = d.inputlist;
      for (var key in inputlist)
      {
        var itemobj = inputlist[key];
        for (var theName in itemobj)
        {
            inputliststr = inputliststr + `<div class="down-left-middle-add">
            <span>name:</span><input type="text" value="${theName}"/> 
            <span style="margin-left:10%;">value:</span><input type="text" value="${itemobj[theName]}"/>
            <button id="down-left-middle-remove-button"> remove </button>
            </div>`;
        }  
      }
      $(".down-left-down").attr("style","visibility:visible");
    }
    $('.down-left-middle').empty().append(inputliststr);
}

function changeDownRightInformation(d)
{
  
  if (d.component === "ordinaryActivity")
  {
    var outputliststr = ``;
    var outputlist = d.outputlist;
    for(var key in outputlist)
    {
      outputliststr = outputliststr + `<div class="down-right-middle-add">
      <span style="margin-left:20%;">name:</span><input type="text" value="${key}"/>
      <button id="down-right-middle-remove-button"> remove </button>`;
      if (outputlist[key] !== undefined)
      {
        outputliststr = outputliststr + `<span style="margin-left:30%;">value:${outputlist[key]}</span>`
      } 
      outputliststr = outputliststr + `</div>`;
    }
    $('.down-right-middle').empty().append(outputliststr);
    $('.down-right-down').attr('style','visibility:visible');
  }
  else if(d.component === "startComponent")//start
  {
    var inputliststr = ``;
    var inputlist = d.inputlist;
    console.log(inputlist);
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
    $('.down-right-down').attr('style','visibility:hidden');
  }
  else
  {
    var str = ``;
    var inputlist = d.inputlist;
    for (var key in inputlist)
    {
      var iteminput = inputlist[key];
      var itemnode = graphPool.getNodeById(iteminput.id);

      str = str + `<div class="down-right-middle-add">
      <span style="margin-left:20%;">name:${iteminput.name}</span>`;
      for (var sourcenodeoutputname in itemnode.outputlist)
      {
        str = str + `<span style="margin-left:30%;">value:${itemnode.outputlist[sourcenodeoutputname]}</span>`;
      }
      str = str + `</div>`;
    }
    $('.down-right-middle').empty().append(str);
    $('.down-right-down').attr('style','visibility:hidden');
  }
}
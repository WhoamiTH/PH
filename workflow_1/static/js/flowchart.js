/* 与 node edge 无关的js */
var package_id = '${param.processid}';
package_id = package_id.indexOf('Package_') !== -1 ? package_id : 'Package_'+randomWord(false, 8);
var workflow_name = 'Process';
var workflow_id = package_id+'_Wor1';
var create_time = new Date().pattern('yyyy-MM-dd HH:mm:ss');// 需要从xpdl读取
var create_type = '${param.kind}';
create_type = create_type.indexOf('param.kind') !== -1 ? create_type : 'create';// html防止报错

// 定义生成 node id 序列
var seqer_nodeID = serial_marker();
seqer_nodeID.set_prefix(workflow_id + '_Act');

// 定义生成 edge id 序列
var seqer_edgeID = serial_marker();
seqer_edgeID.set_prefix(workflow_id + '_Tra');

// 定义生成 参与者id 序列
var seqer_participantID = serial_marker();
seqer_participantID.set_prefix(workflow_id + '_Par');

// 定义生成 块活动blockId 序列
var seqer_blockId = serial_marker();
seqer_blockId.set_prefix(workflow_id + '_Ase');



/*  */
/* the information in the bottom the Process id ...*/
$(function() {
	// debugger;
	var initProp = '<div>'+
				   '	<div name="id" class="prop-value"><span>id:</span><span>'+workflow_id+'</span></div>'+
				   '	<div name="name" class="prop-value"><span>名称:</span><span>'+workflow_name+'</span></div>'+
				   '</div>'+
				   '<div class="clearfix"></div>'+
				   'hahaha';
	$('.component-prop').append(initProp);
	$('.component-name span').text(workflow_name);
});
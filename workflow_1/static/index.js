// $(document).ready(() => {
//     const add_btn = $(".down-left-down-add");
//     const container = $(".down-left-middle");
    
//     $(".down-left-down-add").click(()=> {
//         container.append("<div></div>")
//     })
// })
// 
function add_btn()
{
	const container = $(".down-left-middle");
	container.append("<div></div>")
}

// var add_btn = document.getElementById("add");
// add_btn.onclick = function() {
//     const container = $(".down-left-middle");
//     container.append("<div></div>")
// }

function func(data, status){
	alert("func");
	alert("data:" + data + "\nstatus" + status);
}


function test_get(url, func){
	alert("test_get");
	alert(url);
	$.get(url, func);
}


$("#add").click(function(){
	// $("#down-left-down").load("a.txt");
	// alert("add");
	alert("add");
	alert("add2");
	url = "/static/a.txt";
	alert("add3s");
	alert(url);
	test_get(url,func);
	// $.get("/static/a.txt",function(data,status){
	// 	alert("data:"+data+"\nstatus:"+status)
	// })

});

$("#submit").click(function(){
	alert('submit1');
	alert('submit1');
	alert('submit1');
	alert('submit1');
    var psot_data = {"l":[1,2,3] }
	alert('submit2');
// post_data = JSON.stringify(post_data)
	alert('submit3');
	$.post("/test/", post_data,
	function(data,status){
		alert("data:"+data+"\nstatus:"+status);
	});
});

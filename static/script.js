

$(document).ready(function(){
  $("button").click(function(){
    $.post("/button_press",
    {
      number: $(this).attr('id')
    },
    function(data,status){
      alert("Data: " + data + "\nStatus: " + status);
    });
	
	//$.ajax({
	//	type: "POST",
	//	url: button_press,
	//	data: $(this).attr('id'), 
	//	success: function(result){
	//		console.log(result);
	//	}
	//});
  });
});
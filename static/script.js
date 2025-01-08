

$(document).ready(function(){
	$.get('/get_collection_data', function(data) {
		for(var i=0; i < 100; i++){
			$("#"+i).children().text(data[i-1]);
		}
	});
	
	
	
	
	
	
  $("button").click(function(){
    $.post("/button_press",
    {
      number: $(this).attr('id')
    },
    function(data,status){
      
    });
  });
});
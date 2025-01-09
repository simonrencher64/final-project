

$(document).ready(function(){
	$.get('/get_collection_data', function(data) {
		for(var i=0; i < 101; i++){
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
		
		var value = Number($(this).children().text());
		value += 1;
		$(this).children().text(value);
		
		
	});
	
	setInterval(function() {
		$.ajax({
			type: 'GET',
			url: "/get_collection_data",
			success: function(data) {
				for(var i=0; i < 101; i++){
					if(data[i-1] >= $("#"+i).children().text()){
						$("#"+i).children().text(data[i-1]);
					}
					
				}
			}
		});
	}, 1000); //one second
});
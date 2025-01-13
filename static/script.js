

$(document).ready(function(){
	$.get('/get_collection_data', function(data) {
		for(var i=0; i < 101; i++){
			$("#"+i).children().text(data[i-1]);
		}
	});
	
	$.ajax({
		type: 'GET',
		url: "/check_loggin",
		success: function(data) {
			if(data == true){
				$(".button").addClass("clickable");
			}
		}
	});
	
	$('.button').click(function(){
		if($(this).hasClass('clickable')) {
			$.ajax({
				type: 'POST',
				url: "/button_press",
				data: { number: $(this).attr('id') },
				success: function(data) {
					
				}
			});
			
			var value = Number($(this).children().text());
			value += 1;
			$(this).children().text(value);
		}
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
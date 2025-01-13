

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
			if(value >= 10 && value < 25){
				$(this).css('background-color', '#ADD8E6')
			}
			else if(value >= 25 && value < 50){
				$(this).css('background-color', '#87CEFA')
			}
			else if(value >= 50 && value < 75){
				$(this).css('background-color', '#6495ED ')
			}
			else if(value >= 75 && value < 100){
				$(this).css('background-color', '#4169E1')
			}
			else if(value >= 100 && value < 200){
				$(this).css('background-color', '#0000FF')
			}
			else if(value >= 200 && value < 300){
				$(this).css('background-color', '#0000CD')
			}
			else if(value >= 300 && value < 400){
				$(this).css('background-color', '#00008B')
			}
			else if(value >= 400 && value < 500){
				$(this).css('background-color', '#000080')
			}
			else if(value >= 500){
				$(this).css('background-color', '#191970')
			}
			else{$(this).css('background-color', '#5F9EA0 ')}
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
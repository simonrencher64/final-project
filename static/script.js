

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
			if(data["is_admin"] == true){
				$('.adminTool').css('display', 'block'); 
			}
		}
	});
	
	$.ajax({
		type: 'GET',
		url: "/check_loggin",
		success: function(data) {
			if(data["logged_in"] == true){
				$(".button").addClass("clickable");
			}
		}
	});
	
	$('#clearAll').click(function(){
		$.ajax({
			type: 'POST',
			url: "/clear_all",
			success: function() {
				$('.button').children().text('0');
			}
		});
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
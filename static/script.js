

$(document).ready(function(){
	var scores = {};
	
	
	$.get('/get_collection_data', function(data) {
		for(var i=0; i < 101; i++){
			$("#"+i).children().text(data[i-1]);
			
			var rgbdata = get_color(data[i-1]);
			$("#"+i).css('background-color', 'rgb(' + rgbdata[0] + "," + rgbdata[1] + "," + rgbdata[2] + ")");
			
			
		}
		
		var scorelist = [];
		for(var i = 0; i < 100; i++){
			scorelist.push([i+1,data[i]]);
		}
		
		scorelist.sort((a, b) => b[1] - a[1]);
		
		console.log(scorelist);
		
		for(var i=0; i < 101; i++){
			console.log(i);
			$("#s"+String(i+1)).text(scorelist[i][0] + ", " + scorelist[i][1]);
		}
	});
<<<<<<< HEAD
	
	
	
	
=======
	var logged_in = false;
>>>>>>> bdcaac67d4a4358b68b18ff3ba1fadd7027f5684
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
				logged_in = true;
				$("#error").hide();
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
		if(logged_in == true){
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
				
				var rgbdata = get_color(value);
				$(this).css('background-color', 'rgb(' + rgbdata[0] + "," + rgbdata[1] + "," + rgbdata[2] + ")");
				
				
				
				/*
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
				*/
				
				
			}
	    }
		else{
				$("#error").show();
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
						
						var rgbdata = get_color(data[i-1]);
						$("#"+i).css('background-color', 'rgb(' + rgbdata[0] + "," + rgbdata[1] + "," + rgbdata[2] + ")");
					}
					
				}
			}
		});
	}, 1000); //one second
});



function get_color(value) {
	let dist = 500;
	let rgbdata = [0,0,0];
    if(value <= dist){
		rgbdata = [255, 200 - 200*(value/dist),0];
	} else if(value > dist && value < dist * 2) {
		rgbdata = [255 - 255*((value-dist)/dist),0,0];
	} else {
		rgbdata = [0,0,0];
	}
    return rgbdata;
}
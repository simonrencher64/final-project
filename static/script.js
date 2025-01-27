

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
		
		for(var i=0; i < 100; i++){
			$("#s"+String(i+1)).text("#" + (i+1) + " - " + scorelist[i][0] + " - Score: " + scorelist[i][1]);
			if(i == 0){
				$("#s"+String(i+1)).css('fontSize', '30px');
				$("#s"+String(i+1)).css('color', 'rgb(255,0,0)');
			} else if(i == 1){
				$("#s"+String(i+1)).css('fontSize', '27px');
				$("#s"+String(i+1)).css('color', 'rgb(255,50,0)');
			} else if(i == 2){
				$("#s"+String(i+1)).css('fontSize', '24px');
				$("#s"+String(i+1)).css('color', 'rgb(255,100,0)');
			} else {
				$("#s"+String(i+1)).css('color', 'rgb(255,150,0)');
			}
		}
	});

	
	
	
	

	var logged_in = false;

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
			} else {
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
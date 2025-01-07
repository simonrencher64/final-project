

$(document).ready(function(){
  $("button").click(function(){
    $.post("/button_press",
    {
      number: $(this).attr('id')
    },
    function(data,status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  });
});
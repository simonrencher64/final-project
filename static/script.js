

$(document).ready(function(){
  $("button").click(function(){
    $.post("button_press",
    {
      number: 1
    },
    function(data,status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  });
});
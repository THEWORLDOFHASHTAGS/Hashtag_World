
$(function(e) {
   
    for (i = 0; i < countries.length; i++) {
    $('#'+countries[i].country_code).data('country', countries[i]);
    }
    
    //$('.map g').velocity({ translateX: 100, translateY: 100 });
    $('.map g').click(function() {
        var country_data = $(this).data('country');
		send(country_data.country_code);
        $('<div class="overlay"></div>').appendTo('body');
        $('<div class="model">'
          +country_data.country_name
          +'<br>'
          //+'<div class="country">'
          //+'<svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMin meet">'
          //+'<rect id="background" width="100%" height="100%" fill="grey"/>'
         // +'<defs id="mySVG">'
          //+'</defs>'
         // +'<use xlink:href="path/to/test.svg#USA_1_" x="0" y="0" />'
         // +'</svg>'
          //+'</div>'
		  +'<div id="status">'
		  +'</div>'
		  //+'<a href="javascript:send(country_data.country_code)">'
		  +'Send Message'
		  +'</a>'
		  +'<a href="javascript:onOpen()">'
		  +'Open Socket'
		  +'</a>'
          +'<div id="output">'
          +'</div>'
          +'<div class="tagbox">'
          +country_data.country_tags
          +'</div>'
          +'<ul id="messages">'
          +'</ul>'
          +'</div>').appendTo('body');
        //$('.map #'+country_data.country_code).clone().appendTo('#mySVG');
          
    }); 

    $('body').on('click', '.overlay', 'body', function() {
		function clearlist (){ 
			var elem = document.getElementById('mylist');
			elem.parentNode.removeChild(elem);
		}
        $('.model').remove();
        $('.overlay').remove();
        $('.model .messages #holder').remove();
    });
    
});

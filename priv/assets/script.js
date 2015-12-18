
$(function(e) {
    var count;
    for (i = 0; i < countries.length; i++) {
        $('#'+countries[i].country_name).data('country', countries[i]);
        $('#'+countries[i].country_code).data('country', countries[i]);
    }
    

    $('.search-icon').click(function() {
        searchBar();
    });
    
    function searchBar() {
        var inp = document.getElementById('input-id').value; 
        inp = inp.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });
        
        console.log("INPUT "+ inp);
        var test = '<g id="' + inp + '"/>';
        
        $('.map').append(test);
    
        var country_data = $('.map #' + inp).data('country'); 
        
        //console.log(country_data.country_name);
        try {
            if (inp == country_data.country_name) {
                inkRipple('.map #' + inp, event);
                $('.map #' + inp).remove();
            }
        }
        catch(event) {
            $('<div class="error-box">'
              +'<h1 class="search-error">Country not found.</h1>'
              +'</div>').appendTo('body');
        }
    }
    
    $('.map g').click(function(event) {
        count = 0;
        inkRipple(this, event);
    }); 
    
    function inkRipple(el, i) {    
        var parent, ink, k, x, y;
        parent = $('.map').parent();
        
        if(parent.find('ink').length == 0) {
            parent.prepend('<ink />');
        }
        
        ink = parent.find('ink');
        
        if (!ink.height() && !ink.width()) {
            k = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: k, width: k});
        }
        
        x = i.pageX - parent.offset().left - ink.width()/2;
        y = i.pageY - parent.offset().top - ink.height()/2;
        
        ink.css({top: y+'px', left: x+'px'}).addClass('animate').one('animationend', function() {
                popUp(el);
                $('ink').remove();
        });
    }
     
    function popUp(event) {
        var country_data = $(event).data('country');
        send(country_data.country_code);
        $('body').css({background: '#9C27B0'});
        $('<overlay>'
          +'<img class="floatB pop-anima" src="back_icon.svg"/>'
          +'<div class="container">'
          +'<section class="pop-anima">'
          +'<div>'
          +'<a class="title">'+country_data.country_name+'</a>'
          +'</div>'
          +'<img class="c-code" src="SVG/'+country_data.country_code+'.svg"/>'
          +'</section>'
          +'<aside class="tagbox">'
          +'<a class="titletag">Trending Hashtags of '+country_data.country_name+'</a>'
          +'<ul class="list"></ul>'
          +'<button class="create">Create</button>'
          +'<button class="remove">Remove</button>'
          +'</aside>'
          +'</div>'
          +'</overlay>').appendTo('body');
        
        $('img').addClass('pop-anima').one('animationend', function() {
               $('.floatB').removeClass('pop-anima');
            $('img').removeClass('pop-anima');
        });
        
        $('.create').click(function() {
            createItem(country_data.country_name);
        });
    
    }
    
    
    
    window.createItem = function(content) {
        count = count + 1;
        var holder = '<li id="test">'+content+'</li>';
        var list = $('.list li');
        if (list.length > 9) {
            $('.list li:eq(9)').addClass('remove-item').one('animationend', function() {
                $('.list li:eq(9)').remove();
                holder = $(holder).addClass('show');
                holder = $(holder).addClass('new-item');
                $('.list').prepend(holder);
            });
        }
        else {
            holder = $(holder).addClass('show');
            holder = $(holder).addClass('new-item');
            $('.list').prepend(holder);
        }
    }
    
    
    
    $('body').on('click', '.floatB', 'body', function(event) {
		function clearlist () { 
			var elem = document.getElementById('mylist');
			elem.parentNode.removeChild(elem);
		}
        inkRevert(event);
        $('body').css({background: '#EFEBE9'});
        $('overlay').remove();
    });
    
    function inkRevert(i) {    
        var parent, ink, d, x, y;
        parent = $('.map').parent();
        
        if(parent.find('ink').length == 0) {
            parent.prepend('<ink />');
        }
        
        ink = parent.find('ink');
        
        if (!ink.height() && !ink.width()) {
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: d, width: d});
        }
        
        x = i.pageX - parent.offset().left - ink.width()/2;
        y = i.pageY - parent.offset().top - ink.height()/2;
        
        ink.css({top: y+'px', left: x+'px'}).addClass('rev-animate').one('animationend', function() {
            $('ink').remove();
        });
        //$('overlay').css({top: y+'px', left: x+'px'}).addClass('rev-animate');
    }
});

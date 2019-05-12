$(function () {
    $('nav a').click(function () {
        let speed = 200;
        var href = $(this).attr('href');
     //   console.log(href);
        $('.page.current').animate({opacity:0,marginTop:80},speed,function(){
            
            $(this).removeClass('current');
            
            $(href).css('marginTop',30).animate({opacity:1,marginTop:50}).addClass('current');
        });
    });
});
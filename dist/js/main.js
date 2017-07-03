$(window).load(function(){

    var $windowWid = $(window).width();

    var mmenu = $(document).find('header .navigation').clone();
    mmenu.appendTo('header').wrap('<div id="mobileMenu"/>');

    //mobile menu
    $(document).find('.mmenu').on('click', function(e){
        $(this).toggleClass('is-active');
        $(document).find('#mobileMenu').toggleClass('active');
        e.preventDefault();
        e.stopPropagation();
    });

    //help popup in form
    $(document).find('.popover-link').on('mouseover',function(){
        $(this).siblings('.popover-detail').css('display','inline-block');
    });
    $(document).find('.popover-link').on('mouseout',function(){
        $(this).siblings('.popover-detail').hide();
    });

    $(document).find('.form-group .checkbox').on('click', function(e){
        var suretyContainer = $(this).data('attr');
        $('.'+suretyContainer).fadeToggle();
        $(this).find('.fa').toggleClass('show');
        e.stopPropagation();
        e.preventDefault();
    });

    $(window).on('scroll', function(){
        if($('.homepage').length){
            fixedHeader();
        };    
    });


    //hide mobile menu on click anywhere on page
    $(document).on('click', function(e){
        var container = $('.mmenu, #mobileMenu');
        if (!container.is(e.target) && container.has(e.target).length === 0 && $(window).width()<768){
            if($('.mmenu.is-active').length){
                $(document).find('#mobileMenu').removeClass('active');
                $('.mmenu').removeClass('is-active');
            };
            
        };
    });

    $(document).on('click', '.backtoList', function(){
        $(document).find('#compareView').hide();
        $(document).find('#compareListView').fadeIn();
        e.preventDefault();
    });

    $(document).on('click', '.compare', function(e){
        $(document).find('#compareListView').hide();
        $(document).find('#compareView').fadeIn();
        e.preventDefault();
    });
       

    $(window).on('resize', function(){
        
    });


    if($('.homepage').length){
            fixedHeader();
    };
    //form animations
        $(document).find('.form-group input:not(.btn), .form-group select').each(function(){
            if($(this).val()!=''){
                $(this).parent('.form-group').addClass('is-notempty');
                if($(this).find('option').length>0){
                    $(this).removeClass('faded');
                }
            };
            if($(this).val()==''){
                $(this).parent('.form-group').addClass('is-empty');
                if($(this).find('option').length>0){
                    $(this).addClass('faded');

                }
            };
            $(this).on('focus', function(){
                if($(this).val()==''){
                    $(this).parent('.form-group').removeClass('is-empty').addClass('is-notempty');
                };
            });
            $(this).on('blur change', function(){
                if($(this).val()!=''){
                    $(this).parent('.form-group').removeClass('is-empty').addClass('is-notempty');
                    if($(this).find('option').length>0){
                        $(this).removeClass('faded');
                    }
                };
                if($(this).val()==''){
                    $(this).parent('.form-group').addClass('is-empty is-required').removeClass('is-notempty');
                    if($(this).find('option').length>0){
                        $(this).addClass('faded');
                    }
                };
            });
        });    

        function fixedHeader(){
            var headerHeight = $('header').outerHeight(), scrollTop = $(window).scrollTop();
                if(scrollTop>headerHeight){
                    $('header').addClass('js--active');
                }else{
                    $('header').removeClass('js--active');
                };
        };
  
});





//# sourceMappingURL=../maps/main.js.map

var num_base_stations = 0;
var num_tags = 10;

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function showBar(msg, code) {
  var str = msg + "  Use Code: <strong>" + code + "</strong>"
  var $bar = $('<div/>');
  $bar.addClass('promo_bar');
  $bar.html(str); 
  var $promos = $("<div/>", {class: 'promos'})
  $promos.append('<div id="pxu_cst"></div>').append($bar);
  $('body.template-index').addClass('promo-padding').prepend($promos)
}

$(function() {

  $('.asked-question .box').on('click','.heading', function(ev) {
    ev.preventDefault();

    $box = $(this).parent();
    $box.toggleClass('open');
  })

  $('.quantity-options').on('click','.quantity-option', function(ev) {
    ev.preventDefault();

    var $this = $(this), value = $this.data('value');
    $('.quantity-option').removeClass('selected');
    $this.addClass('selected');

    console.log("quantity = "+ value);
    $('#quantity').val(value);
  })

  $('.payment-options').on('click','.payment-option', function(ev) {
    ev.preventDefault();

    var $this = $(this), id = $this.data('product-id'), planType = $this.data('plan-type'), ctaText = $(this).data('cta-text');
    $('.payment-option').removeClass('selected')
    $this.addClass('selected')

    $('#id').val(id);
    $('#cta').text(ctaText);

    $('.plan-choices').hide();
    $('.' + planType).show();

    if (planType == 'bluetooth') {
      $('#cta, #quantity').hide()
    } else {
      $('#cta, #quantity').show()
    }

    $('.box.all').show();
  })

  $('form.product-form-multi').on('submit',function(ev) {
    console.log('form submitted');
    var productId = $('#id').val();
    console.log('product id:' + (productId == 1));

    if (productId == 1) {
      showMailChimp();
      return false;
    } else {
      return true;
    }
  })

  $('.navbar-toggler').click(function() {
    $(this).find('#nav-icon').toggleClass('open');
    $(this).parent().toggleClass('nav-opened');
  });

  $('.back').on('click', function(ev) {
      ev.preventDefault();
      var $holder = $(this).closest('.holder');
      $holder.find('.spec-container').fadeOut("fast", function() {
        $holder.find('.about').fadeIn();  
      });
  })

  $('.show-specs').on('click', function(ev) {
    ev.preventDefault();
    var $holder = $(this).closest('.holder');
    $holder.find('.about').fadeOut("fast", function() {
      $holder.find('.spec-container').fadeIn();  
    });
  });

  $('.cart-item-quantity').on('click', '.cart-item-decrease', function(ev) {
    ev.preventDefault();

    var $input = $('.cart-item-quantity .cart-item-quantity-display'), 
      currentVal = $input.val(),
      newVal = --currentVal,
      index = $('.cart-item-quantity').data('index');
      console.log(index);

    $('.quantity-limit').hide();      

    if (parseInt(currentVal) > 0) {
      $input.val(newVal);
      $('.btn-update').addClass('btn-warning').removeClass('btn-secondary');
    }
  })

  $('.cart-item-quantity').on('click', '.cart-item-increase', function(ev) {
    ev.preventDefault();

    var $input = $('.cart-item-quantity .cart-item-quantity-display'), 
      currentVal = $input.val(),
      newVal = ++currentVal,
      index = $('.cart-item-quantity').data('index');
      console.log(index);

    if (parseInt(currentVal) < 10) {
      $input.val(newVal);
      $('.btn-update').addClass('btn-warning').removeClass('btn-secondary');
      $('.quantity-limit').hide();
    } else {
      $('.quantity-limit').show();
    }
  });

  $('.product-slideshow-pagination-item').on('click', function(ev) {
    ev.preventDefault();

    var $this = $(this), 
      img = $this.data('default-res'),
      highRes = $this.data('high-res'),
      $target = $('.product-big-image img');

      $target.prop('src', img);
      $target.prop('data-high-res', highRes);
      $target.data('high-res', highRes);

      $('.product-slideshow-pagination-item').removeClass('active');
      $this.addClass('active');
  })

  $('[data-celery]').on('click', function(ev) {
    var val = $(this).data('celery');

      ga('send', {
        hitType: 'event',
        eventCategory: 'Ping Home',
        eventAction: 'preorder',
        eventLabel: val
      });
  })

  $('#specs').on('click','.read-more a', function(ev) {
    var $el = $(this),
      type = $el.data('type'),
      $parent  = $el.closest('.read-more-box');
    
    $parent.removeClass('brief');

    console.log(type);

    ga('send', {
      hitType: 'event',
      eventCategory: 'homepage',
      eventAction: 'read more click',
      eventLabel: type
    });    

    // prevent jump-down
    return false;
      
  })

  $("#base_station").ionRangeSlider({
    type: "single",
    grid: true,
    min: 0,
    from: 1,
    max: 1000,
    prettify_separator: ",",
    onChange: function(data){
      console.log(data);
      num_base_stations = data.from;
      computeCosts()
    }
  });

  $("#tags").ionRangeSlider({
    type: "single",
    grid: true,
    min: 0,
    from: 10,
    max: 10000,
    step: 10,
    prettify_separator: ",",
    onChange: function(data){
      num_tags = data.from;
      computeCosts();
    }
  });
});

function computeCosts() {
  var hardware = 0, platform = 0, bs_hardware_cost = 39.99, bs_platform_cost = 2.00, tag_hardware_cost = 9.99, tag_platform_cost = .20;

  if (num_base_stations >= 1 && num_base_stations <= 99) {
    bs_hardware_cost = 49.99;
    bs_platform_cost = 2.00;
  } else if (num_base_stations > 100 && num_base_stations < 499) {
    bs_hardware_cost = 39.99;
    bs_platform_cost = 1.60;
  } else if (num_base_stations >= 500 && num_base_stations < 999) {
    bs_hardware_cost = 29.99;
    bs_platform_cost = 1.28;
  } else if (num_base_stations >= 1000) {
    bs_hardware_cost = 0;
    bs_platform_cost = 0;
  }

  if (num_tags >= 10 && num_tags <= 99) {
    tag_hardware_cost = 19.99;
    tag_platform_cost = 0.20;
  } else if (num_tags > 100 && num_tags < 999) {
    tag_hardware_cost = 14.99;
    tag_platform_cost = 0.16;
  } else if (num_tags >= 1000 && num_tags < 9999) {
    tag_hardware_cost = 9.99;
    tag_platform_cost = 0.13;
  } else if (num_tags >= 10000) {
    tag_hardware_cost = 0;
    tag_platform_cost = 0;
  }

  hardware = (bs_hardware_cost * num_base_stations + tag_hardware_cost * num_tags);
  platform = (bs_platform_cost * num_base_stations + tag_platform_cost * num_tags);
  if (platform < 49.99) {
    platform = 49.99;
  }

  hardware = numeral(hardware).format('$ 0,0[.]00');
  platform = numeral(platform).format('$ 0,0[.]00');

  if (tag_hardware_cost == 0 || bs_hardware_cost == 0) {
    platform = 'contact us'
    hardware = 'contact us'
  } else {
     platform += ' / mo'
  }

  $('.price-con').find('.hardware').html(hardware);
  $('.price-con').find('.month').html(platform);
}

function showMailChimp() {
  ga('send', {
    hitType: 'event',
    eventCategory: 'PingGPS',
    eventAction: 'ping plan',
    eventLabel: 'preregister click'
  });

  fbq('track', 'Lead');

  window.dojoRequire(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us14.list-manage.com","uuid":"8e1e74b29a2a06756792084d0","lid":"b467ec5e8f","uniqueMethods":true}) })
  document.cookie = 'MCPopupClosed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  document.cookie = 'MCPopupSubscribed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;';             
}

function promo_bar() {
  var promo = getUrlParameter('p')
  if (promo == '') 
    promo = getCookie("promo");

  if (promo != '') {
    console.log('promo = ' + promo);
    document.cookie = "promo=" + promo + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";

    switch(promo) {
      case 'fs':
        showBar('Free Shipping - Guaranteed For The Holiday.','REDSLED18')
        break;
      case 'fs10':
        showBar('10% Off + Free Shipping For The Holidays.','SNOWBALL18')
        break;
      case 'oneyear':
        showBar('One Free Year Of Data Service!','asdfasd')
        break;
      case '10':
        showBar('10% Off - Guaranteed Delivery For The Holiday.','STAYWARM18')
        break;
      default:
        console.log('no promo found');
    }
  } else {
    // showBar('One Free Year Of Data Service!','ELFPAYS18')
    var $promos = $("<div/>", {class: 'promos'})
    $promos.append('<div id="pxu_cst"></div>');
    $('body.template-index').addClass('promo-padding-no-bar').prepend($promos)
  }
}


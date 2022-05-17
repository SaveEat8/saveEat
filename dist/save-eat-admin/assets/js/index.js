function Active(){
  $(document).on('click','.checker label',function(){
$(this).addClass('active');
$('.uploadedCredit').addClass('active');
  });
  $(document).on('click','.checker label.active',function(){
    $(this).removeClass('active');
    $('.uploadedCredit').removeClass('active');
      });
      $(document).on('click','.uploadedCredit ul li span',function(){
        $(this).parent("li").remove();
      });
}


function Animate(){
  $(document).on('click','.topRight',function(){
    $(".adminBar").animate({right: "0"});
  });
  $(document).on('click','.closedd',function(){
    $(".adminBar").animate({right: "-275px"});
  });
}

function uploader(){
  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});
}

function actives(){
  $(document).on('click','.radioAl li a',function(){
    $('.radioAl li a').removeClass('active');
    $(this).addClass('active');

    if($('.individualup').hasClass('active')){
$('.individual').addClass('active');
$('.group').removeClass('active');
    }
    else{
      $('.individual').removeClass('active');
      $('.group').addClass('active'); 
    }
  });
}


function sidebar(){
  $(document).on('click','.hum',function(){
    $(this).addClass('active');
$('.logo').addClass('active');
$('.barcontent').addClass('active');
$(".panel-collapse.collapse").removeClass('show');
$('.sideBarAll').addClass('active');
$('.SideAccordian').addClass('active');
$('.sidebar li a').addClass('active');
$('.headerAll').addClass('active');
$('.commonall').addClass('active');
  });

  $(document).on('click','.hum.active',function(){
    $(this).removeClass('active');
$('.logo').removeClass('active');
$('.barcontent').removeClass('active');
$(".panel-collapse.collapse").addClass('show');
$('.sideBarAll').removeClass('active');
$('.SideAccordian').removeClass('active');
$('.sidebar li a').removeClass('active');
$('.headerAll').removeClass('active');
$('.commonall').removeClass('active');
  });
}

function otp(){
  $(document).ready(function(){
    $('.otpScreen input').keyup(function(){
        if($(this).val()){
            $(this).next().focus();
        }
        else{
         $(this).prev().focus();
        }
    });
});
}


function password(){
  $(document).on('click','span.pass',function(){
    $(this).addClass('active');
$(this).parent('.form-group').find('input').attr('type','text');
$(this).children('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
  });
  $(document).on('click','span.pass.active',function(){
    $(this).removeClass('active');
    $(this).parent('.form-group').find('input').attr('type','password');
    $(this).children('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
      });

}
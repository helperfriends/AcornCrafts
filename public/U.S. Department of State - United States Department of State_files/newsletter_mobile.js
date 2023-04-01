
var blockTop = jQuery(".wp-block-newsletter-container").css("top");

function signUpPosition() {

	if(jQuery(this).width() < 998) {
		jQuery(".wp-block-newsletter-container").css("top","0");
	} else {
		jQuery(".wp-block-newsletter-container").css("top",blockTop);
	}

}

jQuery(document).ready(function(){
  signUpPosition();
});

jQuery(window).on("resize", function(event){
	signUpPosition();
});
